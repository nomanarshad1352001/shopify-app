import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL!;
console.log(MONGO_URL, "Mongo Url");

export async function connectDB() {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(MONGO_URL);
  console.log("MongoDB Connected!");
}