import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../config/prisma";

// Add a new expense
export const addExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const groupId = parseInt(req.params.id as string);
    const { title, description, amount, splitType, splits } = req.body;

    if (!title || !amount || !splitType) {
      res.status(400).json({ message: "title, amount and splitType are required" });
      return;
    }

    // Check membership
    const membership = await prisma.groupMembership.findFirst({
      where: { groupId, userId, isActive: true }
    });

    if (!membership) {
      res.status(403).json({ message: "Not a member of this group" });
      return;
    }

    // Get all active members
    const members = await prisma.groupMembership.findMany({
      where: { groupId, isActive: true }
    });

    const memberIds = members.map(m => m.userId);
    const totalAmount = parseFloat(amount);

    // Calculate splits based on type
    let splitData: { userId: number; shareAmount: number }[] = [];

    if (splitType === "equal") {
      const share = parseFloat((totalAmount / memberIds.length).toFixed(2));
      splitData = memberIds.map(id => ({ userId: id, shareAmount: share }));

    } else if (splitType === "percentage") {
      // splits: [{ userId, percentage }]
      if (!splits || splits.length === 0) {
        res.status(400).json({ message: "splits array required for percentage split" });
        return;
      }
      splitData = splits.map((s: { userId: number; percentage: number }) => ({
        userId: s.userId,
        shareAmount: parseFloat(((s.percentage / 100) * totalAmount).toFixed(2))
      }));

    } else if (splitType === "exact") {
      // splits: [{ userId, amount }]
      if (!splits || splits.length === 0) {
        res.status(400).json({ message: "splits array required for exact split" });
        return;
      }
      splitData = splits.map((s: { userId: number; amount: number }) => ({
        userId: s.userId,
        shareAmount: parseFloat(s.amount.toFixed(2))
      }));

    } else if (splitType === "custom") {
      // splits: [{ userId, shareAmount }]
      if (!splits || splits.length === 0) {
        res.status(400).json({ message: "splits array required for custom split" });
        return;
      }
      splitData = splits.map((s: { userId: number; shareAmount: number }) => ({
        userId: s.userId,
        shareAmount: parseFloat(s.shareAmount.toFixed(2))
      }));

    } else {
      res.status(400).json({ message: "Invalid splitType. Use: equal, percentage, exact, custom" });
      return;
    }

    // Create expense with splits in one transaction
    const expense = await prisma.groupExpense.create({
      data: {
        groupId,
        paidBy: userId,
        title,
        description,
        amount: totalAmount,
        splits: {
          create: splitData
        }
      },
      include: { splits: true }
    });

    res.status(201).json({ expense });
  } catch (error) {
    console.error("ADD EXPENSE ERROR:", error);
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Get all expenses for a group
export const getExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const groupId = parseInt(req.params.id as string);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const membership = await prisma.groupMembership.findFirst({
      where: { groupId, userId, isActive: true }
    });

    if (!membership) {
      res.status(403).json({ message: "Not a member of this group" });
      return;
    }

    const [expenses, total] = await Promise.all([
      prisma.groupExpense.findMany({
        where: { groupId, isDeleted: false },
        include: {
          payer: { select: { userId: true, username: true, email: true } },
          splits: {
            include: { user: { select: { userId: true, username: true } } }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.groupExpense.count({ where: { groupId, isDeleted: false } })
    ]);

    res.json({ expenses, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Edit an expense
export const editExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const expenseId = parseInt(req.params.id as string);
    const { title, description, amount } = req.body;

    const expense = await prisma.groupExpense.findFirst({
      where: { expenseId, isDeleted: false }
    });

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    if (expense.paidBy !== userId) {
      res.status(403).json({ message: "Only the payer can edit this expense" });
      return;
    }

    const updated = await prisma.groupExpense.update({
      where: { expenseId },
      data: { title, description, amount }
    });

    res.json({ expense: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Delete an expense (soft delete)
export const deleteExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const expenseId = parseInt(req.params.id as string);

    const expense = await prisma.groupExpense.findFirst({
      where: { expenseId, isDeleted: false }
    });

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    if (expense.paidBy !== userId) {
      res.status(403).json({ message: "Only the payer can delete this expense" });
      return;
    }

    await prisma.groupExpense.update({
      where: { expenseId },
      data: { isDeleted: true }
    });

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};