import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { DriverInfo } from "./driver.model";
import { Types } from "mongoose";

export const setAvailability = async (
  driverId: string,
  isAvailable: boolean
) => {
  const updated = await DriverInfo.findOneAndUpdate(
    {
      $or: [{ driver: driverId }, { driver: new Types.ObjectId(driverId) }],
    },
    { $set: { isAvailable } },
    { new: true }
  );

  if (!updated) {
    throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
  }

  return { isAvailable: updated.isAvailable };
};

export const isAvailable = async (driverId: string) => {
  const driver = await DriverInfo.findOne({
    driver: new Types.ObjectId(driverId),
  });

  if (!driver) {
    throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
  }

  return { isAvailable: driver.isAvailable };
};

export const DriverService = {
  setAvailability,
  isAvailable,
};
