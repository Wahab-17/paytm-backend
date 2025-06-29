
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URL  = process.env.MONGODB_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {});
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit if DB fails to connect
  }
};
