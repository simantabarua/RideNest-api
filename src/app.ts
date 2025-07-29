import express, { Request, Response } from "express";
import cors from "cors";
import { router } from "./routes";
import expressSession from "express-session";
import { envVars } from "./config/env";
import passport from "passport";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
const app = express();
app.use(cors());
app.use(express.json());
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use("/api/v1", router);
app.use(globalErrorHandler);
app.use(notFound);
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

export default app;
