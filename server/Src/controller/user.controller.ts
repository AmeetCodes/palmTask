import { Request, Response } from "express";
import {
  getAllUsers, getUserById, createUser, updateUser, deleteUser, getTotalUsers,
} from "../service/user.service";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ users });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await getUserById(req.params.id as string);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const createNewUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const user = await createUser(name, email, password, role || "user");
    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
      return res.status(409).json({ message: "User already exists" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateExistingUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await updateUser(req.params.id as string, { name, email, password, role });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User updated successfully", user });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const user = await deleteUser(req.params.id as string);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUsersCount = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await getTotalUsers();
    return res.status(200).json({ totalUsers });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};