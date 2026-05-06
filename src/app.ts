import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { envVars } from "./config/env";
import { router } from "./routes";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { configurePassport } from "./modules/auth/passport/index";
import { connectRedis } from "./config/redis.config";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://ridenest-dev.web.app",
  "https://ridenest-two.vercel.app",
];

// Manual CORS middleware (more reliable on Vercel than the cors package).
// Handles the preflight OPTIONS request and sets headers on every response.
app.use((req: any, res: any, next: any) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      req.headers["access-control-request-headers"] ||
        "Content-Type, Authorization"
    );
  }
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

// Keep the cors package as a fallback (for any edge case)
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
configurePassport();
app.get("/", (req: any, res: any) => {
  res.status(200).send("server is running online");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
