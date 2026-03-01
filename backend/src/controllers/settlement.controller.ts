import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../config/prisma";
import { minimumCashFlow, buildDebtGraph } from "../services/optimizer.service";

/**
 * GET /api/groups/:id/settle/optimize
 * 
 * Reads all unsettled expenses for the group, computes net balances,
 * runs the MCF algorithm, and returns the optimized transaction set
 * along with the before/after debt graph.
 */
export const optimizeSettlement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const groupId = parseInt(req.params.id as string);

        // Verify membership
        const membership = await prisma.group_memberships.findFirst({
            where: { groupId, userId, isActive: true },
        });
        if (!membership) {
            res.status(403).json({ message: "Not a member of this group" });
            return;
        }

        // Fetch all active members
        const members = await prisma.group_memberships.findMany({
            where: { groupId, isActive: true },
            include: { users: { select: { userId: true, username: true, email: true, profileImg: true } } },
        });

        // Fetch all non-deleted expenses with their splits
        const expenses = await prisma.groupExpense.findMany({
            where: { groupId, isDeleted: false },
            include: { group_expense_splits: true },
        });

        // Already-paid settlements for this group
        const existingSettlements = await prisma.settlement.findMany({
            where: { groupId },
        });

        // Build net balance map: userId → net amount
        // positive = others owe you, negative = you owe others
        const balanceMap = new Map<number, number>();
        members.forEach((m: any) => balanceMap.set(m.userId, 0));

        for (const expense of expenses) {
            // Payer is owed the full amount
            balanceMap.set(
                expense.paidBy,
                (balanceMap.get(expense.paidBy) || 0) + Number(expense.amount)
            );
            // Each split participant owes their share
            for (const split of expense.group_expense_splits) {
                balanceMap.set(
                    split.userId,
                    (balanceMap.get(split.userId) || 0) - Number(split.shareAmount)
                );
            }
        }

        // Subtract already-completed settlements from balances
        for (const s of existingSettlements) {
            const amt = Number(s.amount);
            balanceMap.set(s.paidBy, (balanceMap.get(s.paidBy) || 0) + amt);   // payer's debt reduced
            balanceMap.set(s.paidTo, (balanceMap.get(s.paidTo) || 0) - amt);   // payee's credit reduced
        }

        // Build the "before" debt graph (raw directed edges)
        const beforeGraph = buildDebtGraph(
            expenses.map((e) => ({
                paidBy: e.paidBy,
                splits: e.group_expense_splits.map((s: any) => ({ userId: s.userId, shareAmount: Number(s.shareAmount) })),
            }))
        );

        // Run MCF
        const mcfResult = minimumCashFlow(balanceMap);

        // Build user lookup for the response
        const userMap = new Map(members.map((m: any) => [m.userId, m.users]));

        // Annotate transactions with flat from/to ids and names
        const annotatedTransactions = mcfResult.transactions.map((t) => ({
            from: t.from,
            fromName: (userMap.get(t.from) as any)?.username || "Unknown",
            to: t.to,
            toName: (userMap.get(t.to) as any)?.username || "Unknown",
            amount: t.amount,
        }));

        // Annotate before-graph edges with flat ids and names
        const annotatedBeforeGraph = beforeGraph.map((e) => ({
            from: e.from,
            fromName: (userMap.get(e.from) as any)?.username || "Unknown",
            to: e.to,
            toName: (userMap.get(e.to) as any)?.username || "Unknown",
            amount: e.amount,
        }));

        // Balances per member (flat shape for frontend)
        const memberBalances = members.map((m: any) => ({
            userId: m.userId,
            username: m.users.username,
            balance: Math.round((balanceMap.get(m.userId) || 0) * 100) / 100,
        }));

        res.json({
            groupId,
            memberBalances,
            beforeGraph: annotatedBeforeGraph,
            afterGraph: annotatedTransactions,
            optimization: {
                before: mcfResult.naiveTransactions,
                after: mcfResult.totalTransactions,
                saved: mcfResult.transactionsSaved,
                percentSaved: mcfResult.reductionPercent,
            },
            transactions: annotatedTransactions,
        });
    } catch (error) {
        console.error("OPTIMIZE ERROR:", error);
        res.status(500).json({ message: "Server error", error: String(error) });
    }
};

/**
 * POST /api/groups/:id/settle/confirm
 * 
 * Saves the optimized settlement plan to the database.
 * Body: { transactions: [{ fromUserId, toUserId, amount }] }
 */
export const confirmSettlement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const groupId = parseInt(req.params.id as string);
        const { transactions } = req.body as {
            transactions: { from: number; to: number; amount: number }[];
        };

        if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
            res.status(400).json({ message: "transactions array is required" });
            return;
        }

        // Verify membership (admin only)
        const membership = await prisma.group_memberships.findFirst({
            where: { groupId, userId, isActive: true },
        });
        if (!membership) {
            res.status(403).json({ message: "Not a member of this group" });
            return;
        }

        // Create settlement records
        const settlements = await Promise.all(
            transactions.map((t) =>
                prisma.settlement.create({
                    data: {
                        groupId,
                        paidBy: t.from,
                        paidTo: t.to,
                        amount: t.amount,
                    },
                    include: {
                        users_settlements_paidByTousers: { select: { userId: true, username: true, email: true } },
                        users_settlements_paidToTousers: { select: { userId: true, username: true, email: true } },
                    },
                })
            )
        );

        // reshape to match frontend Settlement type
        const shaped = settlements.map(s => ({
            settlementId: s.settlementId,
            groupId: s.groupId,
            paidBy: s.paidBy,
            paidTo: s.paidTo,
            amount: Number(s.amount),
            isCompleted: s.isCompleted,
            createdAt: s.createdAt,
            payer: s.users_settlements_paidByTousers,
            payee: s.users_settlements_paidToTousers,
        }));

        res.status(201).json({
            message: "Settlement plan confirmed",
            settlements: shaped,
            totalSettlements: shaped.length,
        });
    } catch (error) {
        console.error("CONFIRM SETTLEMENT ERROR:", error);
        res.status(500).json({ message: "Server error", error: String(error) });
    }
};

/**
 * PUT /api/settlements/:id/complete
 * 
 * Marks a specific settlement as completed.
 * (For future use: could update a 'status' field. Currently the existence
 *  of the settlement record itself indicates it was confirmed.)
 */
export const completeSettlement = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const settlementId = parseInt(req.params.id as string);

        const settlement = await prisma.settlement.findUnique({
            where: { settlementId },
        });

        if (!settlement) {
            res.status(404).json({ message: "Settlement not found" });
            return;
        }

        // Only the payer or payee can mark it complete
        if (settlement.paidBy !== userId && settlement.paidTo !== userId) {
            res.status(403).json({ message: "Only the payer or payee can complete this settlement" });
            return;
        }

        // Update settlement to mark as completed
        const updated = await prisma.settlement.update({
            where: { settlementId },
            data: { isCompleted: true },
            include: {
                users_settlements_paidByTousers: { select: { userId: true, username: true, email: true } },
                users_settlements_paidToTousers: { select: { userId: true, username: true, email: true } },
            },
        });

        // reshape to match frontend Settlement type
        const shaped = {
            settlementId: updated.settlementId,
            groupId: updated.groupId,
            paidBy: updated.paidBy,
            paidTo: updated.paidTo,
            amount: Number(updated.amount),
            isCompleted: updated.isCompleted,
            createdAt: updated.createdAt,
            payer: updated.users_settlements_paidByTousers,
            payee: updated.users_settlements_paidToTousers,
        };

        res.json({ message: "Settlement marked as complete", settlement: shaped });
    } catch (error) {
        console.error("COMPLETE SETTLEMENT ERROR:", error);
        res.status(500).json({ message: "Server error", error: String(error) });
    }
};

/**
 * GET /api/groups/:id/settle/history
 * 
 * Returns all past settlement records for the group with savings stats.
 */
export const getSettlementHistory = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.userId!;
        const groupId = parseInt(req.params.id as string);

        // Verify membership
        const membership = await prisma.group_memberships.findFirst({
            where: { groupId, userId, isActive: true },
        });
        if (!membership) {
            res.status(403).json({ message: "Not a member of this group" });
            return;
        }

        const settlements = await prisma.settlement.findMany({
            where: { groupId },
            include: {
                users_settlements_paidByTousers: { select: { userId: true, username: true, email: true } },
                users_settlements_paidToTousers: { select: { userId: true, username: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        const totalAmount = settlements.reduce((sum, s) => sum + Number(s.amount), 0);

        // reshape to match frontend Settlement type
        const shaped = settlements.map(s => ({
            settlementId: s.settlementId,
            groupId: s.groupId,
            paidBy: s.paidBy,
            paidTo: s.paidTo,
            amount: Number(s.amount),
            isCompleted: s.isCompleted,
            createdAt: s.createdAt,
            payer: s.users_settlements_paidByTousers,
            payee: s.users_settlements_paidToTousers,
        }));

        res.json({
            groupId,
            settlements: shaped,
            totalSettlements: shaped.length,
            totalAmount: Math.round(totalAmount * 100) / 100,
        });
    } catch (error) {
        console.error("SETTLEMENT HISTORY ERROR:", error);
        res.status(500).json({ message: "Server error", error: String(error) });
    }
};