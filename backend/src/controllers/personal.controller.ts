import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import prisma from "../config/prisma";

// Add personal expense
export const addPersonalExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, description, amount, category } = req.body;

    if (!title || !amount) {
      res.status(400).json({ message: "title and amount are required" });
      return;
    }

    const expense = await prisma.personalExpense.create({
      data: { userId, title, description, amount: parseFloat(amount), category }
    });

    res.status(201).json({ expense });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Get all personal expenses for logged in user
export const getPersonalExpenses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      prisma.personalExpense.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.personalExpense.count({ where: { userId } })
    ]);

    res.json({ expenses, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Get single personal expense
export const getPersonalExpenseById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const personalExpenseId = parseInt(req.params.id as string);

    const expense = await prisma.personalExpense.findFirst({
      where: { personalExpenseId, userId }
    });

    if (!expense) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    res.json({ expense });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Update personal expense
export const updatePersonalExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const personalExpenseId = parseInt(req.params.id as string);
    const { title, description, amount, category } = req.body;

    const existing = await prisma.personalExpense.findFirst({
      where: { personalExpenseId, userId }
    });

    if (!existing) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    const updated = await prisma.personalExpense.update({
      where: { personalExpenseId },
      data: { title, description, amount: amount ? parseFloat(amount) : undefined, category }
    });

    res.json({ expense: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Delete personal expense
export const deletePersonalExpense = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const personalExpenseId = parseInt(req.params.id as string);

    const existing = await prisma.personalExpense.findFirst({
      where: { personalExpenseId, userId }
    });

    if (!existing) {
      res.status(404).json({ message: "Expense not found" });
      return;
    }

    await prisma.personalExpense.delete({ where: { personalExpenseId } });

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};