import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import User from "../user/user.model";
import { IDriverInfo } from "./driver.interface";

export const DriverService = {
  setAvailability: async (driverId: string, isAvailable: boolean) => {
    const updated = await User.findOneAndUpdate(
      { _id: driverId },
      { isAvailable },
      { new: true }
    );

    if (!updated) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
    return true;
  },

  getDriverProfile: async (driverId: string) => {
    const driver = await User.findById(driverId).populate("driverInfo");
    if (!driver) {
      throw new AppError("Driver profile not found", StatusCodes.NOT_FOUND);
    }
    return driver;
  },

  getEarnings: async (driverId: string) => {
    const driver = (await User.findOne({ user: driverId }).select(
      "earnings"
    )) as IDriverInfo;
    if (!driver) {
      throw new AppError("Driver not found", StatusCodes.NOT_FOUND);
    }
    return driver.earnings || 0;
  },
};
