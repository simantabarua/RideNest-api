import { DriverInfo } from "../driver/driver.model";
import { Ride } from "../ride/ride.model";
import { IUser } from "../user/user.interface";
import { IRide } from "../ride/ride.interface";
import { IDriverInfo } from "../driver/driver.interface";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder";
import User from "../user/user.model";

const getAllUsers = async (query: Record<string, string>) => {
  const builder = new QueryBuilder<IUser>(User.find(), query)
    .filter()
    .search(["name", "email"])
    .sort()
    .fields()
    .paginate();

  const data = await builder.build();
  const meta = await builder.getMeta();

  return { meta, data };
};

const getAllDrivers = async (query: Record<string, string>) => {
  const builder = new QueryBuilder<IDriverInfo>(
    DriverInfo.find().populate("user"),
    query
  )
    .filter()
    .search(["licenseNumber", "vehicleInfo.model"])
    .sort()
    .fields()
    .paginate();

  const data = await builder.build();
  const meta = await builder.getMeta();

  return { meta, data };
};

const getAllRides = async (query: Record<string, string>) => {
  const builder = new QueryBuilder<IRide>(
    Ride.find().populate("rider").populate("driver"),
    query
  )
    .filter()
    .search(["pickupLocation", "destinationLocation", "status"])
    .sort()
    .fields()
    .paginate();

  const data = await builder.build();
  const meta = await builder.getMeta();

  return { meta, data };
};

const updateUserRole = async (userId: string, payload: Partial<IUser>) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  Object.assign(user, payload);
  await user.save();
  return user;
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
};

const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments({ role: Role.RIDER });
  const totalDrivers = await User.countDocuments({ role: Role.DRIVER });
  const totalRides = await Ride.countDocuments();

  return {
    totalUsers,
    totalDrivers,
    totalRides,
  };
};

export const AdminService = {
  getAllUsers,
  getAllDrivers,
  getAllRides,
  updateUserRole,
  deleteUser,
  getDashboardStats,
};
