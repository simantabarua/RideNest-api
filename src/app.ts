import express, { Request, Response } from "express";
import cors from "cors";
import expressSession from "express-session";
import cookieParser from "cookie-parser";
import passport from "passport";
import { envVars } from "./config/env";
import { router } from "./routes";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import "./modules/auth/passport/index";
import { configurePassport } from "./modules/auth/passport/index";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
configurePassport();

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("Server is running");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
