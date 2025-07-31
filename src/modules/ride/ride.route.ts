import { Router } from "express";
import { RideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { createRideSchema } from "./ride.validation";
import validateRequest from "../../middlewares/validatedRequest";

const router = Router();

router.post(
  "/request",
  checkAuth(Role.RIDER),
  validateRequest(createRideSchema),
  RideController.requestRide
);

router.get("/me", checkAuth(...Object.values(Role)), RideController.getMyRides);

router.get("/", checkAuth(Role.ADMIN), RideController.getAllRides);

router.patch(
  "/:id",
  checkAuth(...Object.values(Role)),
  RideController.updateRideStatus
);

router.get("/:id", checkAuth(Role.ADMIN), RideController.getRideById);

export const RideRoute = router;
