import { Request, Response } from "express";
import mongoose from "mongoose";
import {
  getAllUsers, getUserById, createUser, updateUser, deleteUser, getTotalUsers,
} from "../service/user.service";

export const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    return res.status(200).json({ users });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await getUserById(id as string);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error in getUser:", error);
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
    console.error("Error in createNewUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateExistingUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const { name, email, password, role } = req.body;
    const user = await updateUser(id as string, { name, email, password, role });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error in updateExistingUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id as string)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await deleteUser(id as string);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in removeUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getUsersCount = async (_req: Request, res: Response) => {
  try {
    const totalUsers = await getTotalUsers();
    return res.status(200).json({ totalUsers });
  } catch (error) {
    console.error("Error in getUsersCount:", error);
    return res.status(500).json({ message: "Server error" });
  }
};