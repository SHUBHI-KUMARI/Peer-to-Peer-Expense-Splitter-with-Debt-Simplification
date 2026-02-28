import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../config/prisma";

export const createGroup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { groupName } = req.body;
    const userId = req.userId!;

    if (!groupName) {
      res.status(400).json({ message: "Group name is required" });
      return;
    }

    const group = await prisma.group.create({
      data: {
        groupName,
        createdBy: userId,
        group_memberships: {
          create: { userId, role: "admin", isActive: true }
        }
      },
      include: { group_memberships: true }
    });

    res.status(201).json({ group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const getMyGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const groups = await prisma.group.findMany({
      where: {
        group_memberships: { some: { userId, isActive: true } },
        isDeleted: false
      },
      include: {
        group_memberships: {
          where: { isActive: true },
          include: {
            users: { select: { userId: true, username: true, email: true, profileImg: true } }
          }
        },
        _count: { select: { group_expenses: true } }
      }
    });

    // reshape to match frontend types
    const shaped = groups.map(g => ({
      groupId: g.groupId,
      groupName: g.groupName,
      createdBy: g.createdBy,
      isDeleted: g.isDeleted,
      createdAt: g.createdAt,
      memberships: g.group_memberships.map(m => ({
        membershipId: m.membershipId,
        userId: m.userId,
        groupId: m.groupId,
        role: m.role,
        isActive: m.isActive,
        user: m.users
      })),
      _count: { expenses: g._count.group_expenses }
    }));

    res.json({ groups: shaped });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const getGroupById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const groupId = parseInt(req.params.id as string);

    const group = await prisma.group.findFirst({
      where: {
        groupId,
        isDeleted: false,
        group_memberships: { some: { userId, isActive: true } }
      },
      include: {
        group_memberships: {
          where: { isActive: true },
          include: {
            users: { select: { userId: true, username: true, email: true, profileImg: true } }
          }
        },
        group_expenses: {
          where: { isDeleted: false },
          orderBy: { createdAt: "desc" },
          take: 10,
          include: {
            users: { select: { userId: true, username: true, email: true } },
            group_expense_splits: {
              include: { users: { select: { userId: true, username: true } } }
            }
          }
        }
      }
    });

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    // reshape to match frontend types
    const shaped = {
      groupId: group.groupId,
      groupName: group.groupName,
      createdBy: group.createdBy,
      isDeleted: group.isDeleted,
      createdAt: group.createdAt,
      memberships: group.group_memberships.map(m => ({
        membershipId: m.membershipId,
        userId: m.userId,
        groupId: m.groupId,
        role: m.role,
        isActive: m.isActive,
        user: m.users
      })),
      expenses: group.group_expenses.map(e => ({
        expenseId: e.expenseId,
        groupId: e.groupId,
        paidBy: e.paidBy,
        title: e.title,
        description: e.description,
        amount: Number(e.amount),
        splitType: e.splitType,
        isDeleted: e.isDeleted,
        createdAt: e.createdAt,
        payer: e.users,
        splits: e.group_expense_splits.map(s => ({
          splitId: s.splitId,
          expenseId: s.expenseId,
          userId: s.userId,
          shareAmount: Number(s.shareAmount),
          user: s.users
        }))
      }))
    };

    res.json({ group: shaped });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const inviteMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const groupId = parseInt(req.params.id as string);
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const membership = await prisma.group_memberships.findFirst({
      where: { groupId, userId, role: "admin", isActive: true }
    });

    if (!membership) {
      res.status(403).json({ message: "Only admins can invite members" });
      return;
    }

    const userToInvite = await prisma.user.findUnique({ where: { email } });

    if (!userToInvite) {
      res.status(404).json({ message: "No user found with that email" });
      return;
    }

    const existing = await prisma.group_memberships.findFirst({
      where: { groupId, userId: userToInvite.userId, isActive: true }
    });

    if (existing) {
      res.status(409).json({ message: "User is already a member" });
      return;
    }

    const newMember = await prisma.group_memberships.create({
      data: { groupId, userId: userToInvite.userId, role: "member", isActive: true },
      include: {
        users: { select: { userId: true, username: true, email: true } }
      }
    });

    res.status(201).json({ message: "Member added successfully", member: newMember });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const getGroupBalances = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const balances = members.map(m => ({
      user: m.users,
      balance: parseFloat(balanceMap[m.userId].toFixed(2)),
      status: balanceMap[m.userId] > 0 ? "gets back" : balanceMap[m.userId] < 0 ? "owes" : "settled"
    }));

    res.json({ balances });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const getGroupMembers = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const members = await prisma.group_memberships.findMany({
      where: { groupId, isActive: true },
      include: {
        users: {
          select: {
            userId: true,
            username: true,
            email: true,
            profileImg: true,
            createdAt: true
          }
        }
      },
      orderBy: { joinedAt: "asc" }
    });

    res.json({
      members: members.map(m => ({
        membershipId: m.membershipId,
        role: m.role,
        joinedAt: m.joinedAt,
        user: m.users
      }))
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const removeMember = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const groupId = parseInt(req.params.id as string);
    const targetUserId = parseInt(req.params.userId as string);

    const adminCheck = await prisma.group_memberships.findFirst({
      where: { groupId, userId, role: "admin", isActive: true }
    });

    if (!adminCheck) {
      res.status(403).json({ message: "Only admins can remove members" });
      return;
    }

    if (userId === targetUserId) {
      res.status(400).json({ message: "Admin cannot remove themselves" });
      return;
    }

    await prisma.group_memberships.updateMany({
      where: { groupId, userId: targetUserId },
      data: { isActive: false }
    });

    res.json({ message: "Member removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};