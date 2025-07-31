import { Request, Response } from "express";
import { rideRequestSchema } from "./ride.validation";
import { RideService } from "./ride.service";
import { JwtPayload } from "jsonwebtoken";

export const requestRide = async (req: Request, res: Response) => {
  const parsed = rideRequestSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);

  const decodeToken = req.user as JwtPayload;
  const riderId = decodeToken.id;
  const ride = await RideService.createRide(parsed.data, riderId);
  res.status(201).json({ message: "Ride requested", ride });
};

export const cancelRide = async (req: Request, res: Response) => {
  try {
    const decodeToken = req.user as JwtPayload;
    const riderId = decodeToken.id;
    const ride = await RideService.cancelRide(req.params.id, riderId);
    res.json({ message: "Ride cancelled", ride });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getRiderRides = async (req: Request, res: Response) => {
  const decodeToken = req.user as JwtPayload;
  const riderId = decodeToken.id;
  const rides = await RideService.getRiderRides(riderId);
  res.json(rides);
};
