import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from '../prismaClient';

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({ data: { email } });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.otpCode.create({
    data: {
      code,
      userId: user.id,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    },
  });

  console.log(`OTP for ${email}: ${code}`);

  return res.json({ message: "OTP sent" });
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: "Email and OTP required" });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  const otpRecord = await prisma.otpCode.findFirst({
    where: { userId: user.id, code, used: false },
    orderBy: { expiresAt: "desc" },
  });

  if (!otpRecord) return res.status(400).json({ error: "OTP not valid" });
  if (otpRecord.expiresAt < new Date()) return res.status(400).json({ error: "OTP expired" });

  await prisma.otpCode.update({ where: { id: otpRecord.id }, data: { used: true } });

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

  res.json({ message: "OTP verified", token, user });
};
