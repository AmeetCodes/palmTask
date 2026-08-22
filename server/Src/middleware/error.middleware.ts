import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AppError } from "../errors/AppError";

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("ERROR:", err.message);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: "Validation error", errors });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ success: false, message: "Invalid ID" });
  }

  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern)[0];
    return res.status(409).json({ success: false, message: `${field} already exists` });
  }

  return res.status(500).json({ success: false, message: "Internal server error" });
};