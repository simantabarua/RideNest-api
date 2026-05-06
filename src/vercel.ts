import app from "./app";
import { dbConnect } from "./config/database";
import { connectRedis } from "./config/redis.config";

let isInitialized = false;

const initialize = async () => {
  if (!isInitialized) {
    try {
      // Connect to MongoDB
      await dbConnect();
      
      // Connect to Redis (optional but recommended for session management)
      try {
        await connectRedis();
        console.log("✅ Redis connected on Vercel");
      } catch (redisError) {
        console.error("⚠️ Redis connection failed on Vercel (continuing anyway):", redisError);
      }

      isInitialized = true;
      console.log("✅ Vercel Initialization successful");
    } catch (error) {
      console.error("❌ Vercel Initialization failed:", error);
      throw error;
    }
  }
};

export default async (req: any, res: any) => {
  try {
    await initialize();
    // Hand off the request to the Express app
    return app(req, res);
  } catch (error: any) {
    console.error("🔥 Vercel Runtime Error:", error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: "Server initialization failed",
        error: error.message || error,
      });
    }
  }
};
