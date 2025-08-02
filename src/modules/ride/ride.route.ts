import { Router } from "express";
import { RideController } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import validateRequest from "../../middlewares/validatedRequest";
import { cancelRideSchema, createRideSchema } from "./ride.validation";

const router = Router();

// Rider Routes
router.post(
  "/request",
  checkAuth(...Object.values(Role)),
  validateRequest(createRideSchema),
  RideController.requestRide
);

router.get("/my", checkAuth(...Object.values(Role)), RideController.getMyRides);

router.patch(
  "/:id/cancel",
  checkAuth(Role.RIDER),
  validateRequest(cancelRideSchema),
  RideController.cancelRide
);

// Driver Status Routes
router.patch(
  "/:id/accept",
  checkAuth(Role.DRIVER),

  RideController.acceptRide
);

router.patch(
  "/:id/reject",
  checkAuth(Role.DRIVER),

  RideController.rejectRide
);

router.patch(
  "/:id/pickup",
  checkAuth(Role.DRIVER),

  RideController.pickupRide
);

router.patch(
  "/:id/start",
  checkAuth(Role.DRIVER),

  RideController.startRide
);

router.patch(
  "/:id/complete",
  checkAuth(Role.DRIVER),

  RideController.completeRide
);

// Admin + Shared
router.get("/", checkAuth(Role.ADMIN), RideController.getAllRides);

router.get(
  "/:id",
  checkAuth(...Object.values(Role)),

  RideController.getRideById
);

export const RideRoute = router;
