import express, { Request, Response } from "express";
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

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser tools (Postman, curl) and same-origin requests
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS: origin ${origin} not allowed`));
    },
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
connectRedis();
app.use(passport.initialize());
app.use(passport.session());
configurePassport();
app.get("/", (req: Request, res: Response) => {
  res.status(200).send("server is running online");
});

app.use("/api/v1", router);

app.use(globalErrorHandler);
app.use(notFound);

export default app;
