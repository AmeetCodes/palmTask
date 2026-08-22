import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGO_URI;

  if (!mongoURI) {
    throw new Error("MONGO_URI is not defined in .env");
  }

  await mongoose.connect(mongoURI);
  console.log("MongoDB connected");
};

export default connectDB;