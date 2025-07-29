import { Router } from "express";

const router = Router();

router.get("/", () => "auth");

export const AuthRoutes = router;
