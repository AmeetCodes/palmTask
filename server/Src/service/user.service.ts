import bcrypt from "bcryptjs";
import { User } from "../models/user.model";

export const getAllUsers = async () => User.find().select("-password");

export const getUserById = async (userId: string) =>
  User.findById(userId).select("-password");

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: "user" | "admin" = "user"
) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error("USER_ALREADY_EXISTS");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role });
  return User.findById(user._id).select("-password");
};

export const updateUser = async (
  userId: string,
  data: { name?: string; email?: string; password?: string; role?: "user" | "admin" }
) => {
  const updateData = { ...data };
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }
  return User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after', runValidators: true }).select("-password");
};

export const deleteUser = async (userId: string) =>
  User.findByIdAndDelete(userId);

export const getTotalUsers = async () => User.countDocuments();