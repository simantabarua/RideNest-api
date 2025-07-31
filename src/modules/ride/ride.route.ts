import { Router } from "express";
import { requestRide, cancelRide, getRiderRides } from "./ride.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = Router();

router.post("/request", checkAuth(...Object.values(Role)), requestRide);
router.patch("/:id/cancel", checkAuth(...Object.values(Role)), cancelRide);
router.get("/me", checkAuth(...Object.values(Role)), getRiderRides);

export const RideRoute = router;
