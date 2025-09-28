import { Request, Response } from "express";
import  prisma from "../prismaClient";

export const createNote = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user ID found" });
    }

    const note = await prisma.note.create({
      data: { title, content, userId },
    });

    res.json(note);
  } catch (err) {
    res.status(500).json({
        message:`${err}`
    });
  }
};

export const getNotes = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const notes = await prisma.note.findMany({ where: { userId } });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notes" });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const note = await prisma.note.findFirst({
      where: { id, userId },
    });

    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Error fetching note" });
  }
};

export const updateNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user?.userId;

    const note = await prisma.note.updateMany({
      where: { id, userId },
      data: { title, content },
    });

    if (note.count === 0)
      return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating note" });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const note = await prisma.note.deleteMany({
      where: { id, userId },
    });

    if (note.count === 0)
      return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting note" });
  }
};
