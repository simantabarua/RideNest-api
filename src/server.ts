/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import { envVars } from "./config/env";
import app from "./app";
let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("Connected to MongoDB");
    server = app.listen(envVars.PORT, () => {
      console.log(`Server is running on port ${envVars.PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};
(async () => {
  try {
    await startServer();
    // await seedSuperAdmin();
  } catch (error) {
    console.error("Error during initialization:", error);
    process.exit(1);
  }
})();

const gracefulShutdown = (reason: string, code = 0) => {
  console.log(`${reason} received`);
  if (server) {
    server.close(() => {
      console.log("Server closed");
      process.exit(code);
    });
  } else {
    process.exit(code);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (err: Error) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown("Uncaught Exception", 1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
  gracefulShutdown("Unhandled Rejection", 1);
});
