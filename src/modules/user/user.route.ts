import { Router } from "express";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import validateRequest from "../../middlewares/validatedRequest";
import { createUserZodSchema, updateUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);

router.patch(
  "/update",
  checkAuth(...Object.values(Role)),
  validateRequest(updateUserZodSchema),
  UserController.updateUser
);

router.get("/me", checkAuth(...Object.values(Role)), UserController.getProfile);

export const UserRoutes = router;
