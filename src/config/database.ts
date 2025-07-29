import mongoose from "mongoose";
import { envVars } from "../config/env";

export const dbConnect = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
};
