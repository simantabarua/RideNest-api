import { Router } from "express";
import { UserController } from "./user.controller";
import { Role } from "./user.interface";
import validateRequest from "../../middlewares/validatedRequest";
import { createUserZodSchema } from "./user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  UserController.createUser
);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  UserController.updateUser
);
export const UserRoutes = router;
