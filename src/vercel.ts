import { Request, Response } from "express";
import app from "./app";
import { dbConnect } from "./config/database";

let isInitialized = false;

const initialize = async () => {
  if (!isInitialized) {
    try {
      await dbConnect();
      isInitialized = true;
      console.log("✅ Vercel Initialization successful");
    } catch (error) {
      console.error("❌ Vercel Initialization failed:", error);
      throw error;
    }
  }
};

export default async (req: Request, res: Response) => {
  try {
    await initialize();
    // Hand off the request to the Express app
    return app(req, res);
  } catch (error: any) {
    (res as any).status(500).json({
      success: false,
      message: "Server initialization failed",
      error: error.message || error,
    });
  }
};
