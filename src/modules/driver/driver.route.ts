import { Router } from "express";
import { DriverController } from "./driver.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validatedRequest";
import { setAvailabilitySchema } from "./driver.validation";

const router = Router();

router.get("/me", checkAuth(Role.DRIVER), DriverController.getProfile);
router.get("/earnings", checkAuth(Role.DRIVER), DriverController.getEarnings);

router.patch(
  "/availability",
  checkAuth(Role.DRIVER),
  validateRequest(setAvailabilitySchema),
  DriverController.setAvailability
);

export const DriverRoute = router;
