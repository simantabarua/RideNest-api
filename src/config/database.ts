import mongoose from "mongoose";
import { envVars } from "../config/env";

export const dbConnect = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    // eslint-disable-next-line no-console
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("❌ Failed to connect to MongoDB:", error);
    throw error;
  }
};
