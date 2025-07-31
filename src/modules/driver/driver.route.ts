import { Router } from "express";
import { Role } from "../user/user.interface";
import { checkAuth } from "../../middlewares/checkAuth";
import { DriverController } from "./driver.controller";

const router = Router();

router.patch(
  "/availability",
  checkAuth(...Object.values(Role)),
  DriverController.updateAvailability
);
router.patch(
  "/ride/:id/status",
  checkAuth(...Object.values(Role)),
  DriverController.updateRideStatus
);
router.get(
  "/earnings",
  checkAuth(...Object.values(Role)),
  DriverController.getEarnings
);

export const DriverRoute = router;
