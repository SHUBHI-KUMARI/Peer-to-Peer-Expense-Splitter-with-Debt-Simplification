import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwt";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, phoneNumber } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: "username, email and password are required" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, email, passwordHash, phoneNumber, updatedAt: new Date() },
      select: { userId: true, username: true, email: true, createdAt: true }
    });

    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken(user.userId);

    await prisma.session.create({
      data: {
        userId: user.userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.status(201).json({ user, accessToken, refreshToken });
    } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken(user.userId);

    await prisma.session.create({
      data: {
        userId: user.userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    res.json({
      user: { userId: user.userId, username: user.username, email: user.email },
      accessToken,
      refreshToken
    });
    } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const user = await prisma.user.findUnique({
      where: { userId },
      select: { userId: true, username: true, email: true, phoneNumber: true, profileImg: true, createdAt: true }
    });
    res.json({ user });
    } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      res.status(400).json({ message: "Refresh token required" });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const session = await prisma.session.findFirst({
      where: { refreshToken, userId: decoded.userId }
    });

    if (!session) {
      res.status(401).json({ message: "Invalid refresh token" });
      return;
    }

    const accessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken });
    } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error", error: String(error) });
  }
};

// Removed invalid Prisma schema definitions from this file