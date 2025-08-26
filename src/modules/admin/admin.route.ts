// src/modules/admin/admin.route.ts

import { Router } from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validatedRequest";
import { updateUserRoleSchema } from "./admin.validation";

const router = Router();

router.get(
  "/users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllUsers
);
router.patch(
  "/users/:userId",
  validateRequest(updateUserRoleSchema),
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.updateUserRole
);
router.delete(
  "/users/:userId",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.deleteUser
);
router.get(
  "/dashboard",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getDashboardStats
);
router.get(
  "/rides",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllRides
)
router.get(
  "/drivers",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getAllDrivers
);

router.get(
  "/drivers-stats",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  AdminController.getDriverStats
);

export const AdminRoute = router;
