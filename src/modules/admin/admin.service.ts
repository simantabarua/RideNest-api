import { DriverInfo } from "../driver/driver.model";
import { Ride } from "../ride/ride.model";
import { IUser } from "../user/user.interface";
import { IRide } from "../ride/ride.interface";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder";
import User from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { updateDriverZodSchema } from "../driver/driver.validation";

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

const getAllDrivers = async () => {
  const drivers = await User.find({ role: Role.DRIVER });
  return drivers;
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

export const updateUserInfo = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.isDeleted) {
    throw new AppError("User is deleted", StatusCodes.BAD_REQUEST);
  }

  const requesterId = decodedToken.id;
  const requesterRole = decodedToken.role;
  const isSelfUpdate = requesterId === userId;
  const isPrivileged =
    requesterRole === Role.ADMIN || requesterRole === Role.SUPER_ADMIN;

  if (payload.role) {
    if (!isPrivileged) {
      throw new AppError("Unauthorized to change roles", StatusCodes.FORBIDDEN);
    }

    if (isSelfUpdate) {
      throw new AppError(
        "You cannot change your own role",
        StatusCodes.FORBIDDEN
      );
    }

    if (requesterRole === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
      throw new AppError(
        "Admins cannot assign Super Admin role",
        StatusCodes.FORBIDDEN
      );
    }
  }

  if (payload.role === Role.DRIVER) {
    try {
      const parsedDriverData = updateDriverZodSchema.parse(payload);

      const driverInfo = await DriverInfo.findOneAndUpdate(
        { driver: userId },
        {
          $set: {
            driver: userId,
            ...parsedDriverData,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      if (driverInfo) {
        payload.driverInfo = driverInfo._id;
      }
      payload.isApproved = true;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new AppError(
        "Invalid driver information: " + error.message,
        StatusCodes.BAD_REQUEST
      );
    }
  }

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError(
      "Failed to update user",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }

  const safeUser = updatedUser.toObject();
  delete safeUser.password;

  return safeUser;
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
};

const getDashboardStats = async () => {
  const totalUsers = await User.countDocuments({});
  const totalDrivers = await User.countDocuments({ role: Role.DRIVER });
  const totalRiders = await User.countDocuments({ role: Role.RIDER });
  const totalRides = await Ride.countDocuments();

  return {
    totalUsers,
    totalDrivers,
    totalRides,
    totalRiders,
  };
};
const getDriverStats = async () => {
  const totalDrivers = await User.countDocuments({ role: Role.DRIVER });
  const onlineDrivers = await DriverInfo.countDocuments({ isAvailable: true });
  const pendingDrivers = await User.countDocuments({
    role: Role.DRIVER,
    isApproved: false,
  });
  const activeDrivers = await User.countDocuments({
    role: Role.DRIVER,
    isDeleted: false,
    isSuspend: false,
  });

  return {
    totalDrivers,
    onlineDrivers,
    pendingDrivers,
    activeDrivers,
  };
};

export const AdminService = {
  getAllUsers,
  getAllDrivers,
  getAllRides,
  updateUserInfo,
  deleteUser,
  getDashboardStats,
  getDriverStats,
};
