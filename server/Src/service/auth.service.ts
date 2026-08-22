import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

const generateToken = (userId: string, role: string, name: string) =>
  jwt.sign({ userId, role, name }, process.env.JWT_SECRET!, { expiresIn: "7d" });

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: "user" | "admin" = "user"
) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) throw new Error("USER_ALREADY_EXISTS");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashedPassword, role });
  const token = generateToken(user._id.toString(), user.role, user.name);
  const refreshToken = generateToken(user._id.toString(), user.role, user.name);

  return {
    token,
    refreshToken,
    user: { _id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("INVALID_CREDENTIALS");

  const token = generateToken(user._id.toString(), user.role, user.name);
  const refreshToken = generateToken(user._id.toString(), user.role, user.name);

  return {
    token,
    refreshToken,
    user: { _id: user._id.toString(), name: user.name, email: user.email, role: user.role },
  };
};