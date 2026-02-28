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
        members: {
          create: { userId, role: "admin", isActive: true }
        }
      },
      include: { members: true }
    });

    res.status(201).json({ group });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const getMyGroups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;

    const groups = await prisma.group.findMany({
      where: {
        members: { some: { userId, isActive: true } },
        isDeleted: false
      },
      include: {
        members: {
          include: {
            user: { select: { userId: true, username: true, email: true, profileImg: true } }
          }
        },
        _count: { select: { expenses: true } }
      }
    });

    res.json({ groups });
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
        members: { some: { userId, isActive: true } }
      },
      include: {
        members: {
          include: {
            user: { select: { userId: true, username: true, email: true, profileImg: true } }
          }
        },
        expenses: {
          where: { isDeleted: false },
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!group) {
      res.status(404).json({ message: "Group not found" });
      return;
    }

    res.json({ group });
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

    const membership = await prisma.groupMembership.findFirst({
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

    const existing = await prisma.groupMembership.findFirst({
      where: { groupId, userId: userToInvite.userId, isActive: true }
    });

    if (existing) {
      res.status(409).json({ message: "User is already a member" });
      return;
    }

    const newMember = await prisma.groupMembership.create({
      data: { groupId, userId: userToInvite.userId, role: "member", isActive: true },
      include: {
        user: { select: { userId: true, username: true, email: true } }
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

    const membership = await prisma.groupMembership.findFirst({
      where: { groupId, userId, isActive: true }
    });

    if (!membership) {
      res.status(403).json({ message: "Not a member of this group" });
      return;
    }

    const members = await prisma.groupMembership.findMany({
      where: { groupId, isActive: true },
      include: { user: { select: { userId: true, username: true, email: true } } }
    });

    const expenses = await prisma.groupExpense.findMany({
      where: { groupId, isDeleted: false },
      include: { splits: true }
    });

    const balanceMap: Record<number, number> = {};
    members.forEach(m => { balanceMap[m.userId] = 0; });

    expenses.forEach(expense => {
      balanceMap[expense.paidBy] = (balanceMap[expense.paidBy] || 0) + Number(expense.amount);
      expense.splits.forEach(split => {
        balanceMap[split.userId] = (balanceMap[split.userId] || 0) - Number(split.shareAmount);
      });
    });

    const balances = members.map(m => ({
      user: m.user,
      balance: parseFloat(balanceMap[m.userId].toFixed(2)),
      status: balanceMap[m.userId] > 0 ? "gets back" : balanceMap[m.userId] < 0 ? "owes" : "settled"
    }));

    res.json({ balances });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};