import prisma from "../config/prisma";

export const computeBalances = async (groupId: number) => {
  const members = await prisma.group_memberships.findMany({
    where: { groupId, isActive: true },
    include: {
      users: { select: { userId: true, username: true, email: true } }
    }
  });

  const expenses = await prisma.groupExpense.findMany({
    where: { groupId, isDeleted: false },
    include: { group_expense_splits: true }
  });

  const balanceMap: Record<number, number> = {};
  members.forEach(m => { balanceMap[m.userId] = 0; });

  expenses.forEach(expense => {
    balanceMap[expense.paidBy] = (balanceMap[expense.paidBy] || 0) + Number(expense.amount);
    expense.group_expense_splits.forEach(split => {
      balanceMap[split.userId] = (balanceMap[split.userId] || 0) - Number(split.shareAmount);
    });
  });

  return members.map(m => ({
    userId: m.userId,
    user: m.users,
    amount: parseFloat(balanceMap[m.userId].toFixed(2))
  }));
};