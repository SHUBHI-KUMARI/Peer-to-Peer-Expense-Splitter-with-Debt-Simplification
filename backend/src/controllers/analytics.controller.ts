import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../config/prisma";

export const getGroupAnalytics = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const groupId = parseInt(req.params.id as string);

    const membership = await prisma.group_memberships.findFirst({
      where: { groupId, userId, isActive: true }
    });

    if (!membership) {
      res.status(403).json({ message: "Not a member of this group" });
      return;
    }

    const expenses = await prisma.groupExpense.findMany({
      where: { groupId, isDeleted: false },
      include: {
        group_expense_splits: true,
        users: { select: { userId: true, username: true } }
      },
      orderBy: { createdAt: "asc" }
    });

    const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

    const spendingByPerson: Record<string, number> = {};
    expenses.forEach(e => {
      const name = e.users.username;
      spendingByPerson[name] = (spendingByPerson[name] || 0) + Number(e.amount);
    });

    const spendingByDate: Record<string, number> = {};
    expenses.forEach(e => {
      const date = e.createdAt.toISOString().split("T")[0];
      spendingByDate[date] = (spendingByDate[date] || 0) + Number(e.amount);
    });

    const members = await prisma.group_memberships.findMany({
      where: { groupId, isActive: true },
      include: { users: { select: { userId: true, username: true } } }
    });

    const perPersonPaid: Record<string, number> = {};
    const perPersonOwes: Record<string, number> = {};

    members.forEach(m => {
      perPersonPaid[m.users.username] = 0;
      perPersonOwes[m.users.username] = 0;
    });

    expenses.forEach(e => {
      perPersonPaid[e.users.username] = (perPersonPaid[e.users.username] || 0) + Number(e.amount);
      e.group_expense_splits.forEach(split => {
        const member = members.find(m => m.userId === split.userId);
        if (member) {
          perPersonOwes[member.users.username] = (perPersonOwes[member.users.username] || 0) + Number(split.shareAmount);
        }
      });
    });

    const settlements = await prisma.settlement.findMany({ where: { groupId } });
    const completedSettlements = settlements.filter(s => s.isCompleted).length;
    const pendingSettlements = settlements.filter(s => !s.isCompleted).length;

    res.json({
      summary: {
        totalExpenses: expenses.length,
        totalSpent: parseFloat(totalSpent.toFixed(2)),
        totalMembers: members.length,
        completedSettlements,
        pendingSettlements
      },
      spendingByPerson: Object.entries(spendingByPerson).map(([name, amount]) => ({
        name,
        amount: parseFloat(amount.toFixed(2))
      })),
      spendingTimeline: Object.entries(spendingByDate).map(([date, amount]) => ({
        date,
        amount: parseFloat(amount.toFixed(2))
      })),
      perPersonBreakdown: members.map(m => ({
        user: m.users,
        totalPaid: parseFloat((perPersonPaid[m.users.username] || 0).toFixed(2)),
        totalOwes: parseFloat((perPersonOwes[m.users.username] || 0).toFixed(2)),
        netBalance: parseFloat(((perPersonPaid[m.users.username] || 0) - (perPersonOwes[m.users.username] || 0)).toFixed(2))
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};