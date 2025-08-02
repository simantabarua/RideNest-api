import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import User from "../user/user.model";
import { DriverInfo } from "./driver.model";

const setAvailability = async (driverId: string, isAvailable: boolean) => {
  const updated = await User.findOneAndUpdate(
    { _id: driverId },
    { isAvailable },
    { new: true }
  );

  if (!updated) {
    throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
  }
  return true;
};

const getEarnings = async (userId: string) => {
  const driverInfo = await DriverInfo.findOne({ driver: userId }).select(
    "earnings"
  );

  if (!driverInfo) {
    throw new AppError("Driver info not found", StatusCodes.NOT_FOUND);
  }

  return driverInfo.earnings || 0;
};

export const DriverService = {
  getEarnings,
  setAvailability,
};
