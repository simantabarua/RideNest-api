import { Router } from "express";

const router = Router();

router.get("/", () => "user");

export const UserRoutes = router;
