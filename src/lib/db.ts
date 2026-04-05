import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URL);
}