import { RideStatus } from "../ride/ride.interface";
import { Ride } from "../ride/ride.model";
import User from "../user/user.model";

export const setAvailability = async (driverId: string, isOnline: boolean) => {
  const driver = await User.findById(driverId);
  if (!driver) throw new Error("Driver not found");
  if (driver.role !== 'driver' as typeof driver.role) throw new Error("Not a driver");

  driver.isOnline = isOnline;
  await driver.save();
  return driver;
};

export const updateRideStatus = async (
  rideId: string,
  driverId: string,
  status: RideStatus
) => {
  const ride = await Ride.findOne({ _id: rideId, driver: driverId });
  if (!ride) throw new Error("Ride not found or unauthorized");

  ride.status = status;
  const now = new Date();
  if (status === "accepted") ride.timestamps.acceptedAt = now;
  if (status === "picked_up") ride.timestamps.pickedUpAt = now;
  if (status === "completed") ride.timestamps.completedAt = now;

  await ride.save();
  return ride;
};

export const getDriverEarnings = async (driverId: string) => {
  const completedRides = await Ride.find({
    driver: driverId,
    status: "completed",
  });
  const total = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);
  return { total, count: completedRides.length };
};
