import { DriverInfo } from "../driver/driver.model";
import { Ride } from "../ride/ride.model";
import { IUser } from "../user/user.interface";
import { IRide, RideStatus } from "../ride/ride.interface";
import { Role } from "../user/user.interface";
import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { QueryBuilder } from "../../utils/QueryBuilder";
import User from "../user/user.model";
import { JwtPayload } from "jsonwebtoken";
import { updateDriverZodSchema } from "../driver/driver.validation";
import { Types } from "mongoose";

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

export const getAllDrivers = async () => {
  const drivers = await DriverInfo.find().populate("driver").lean();
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
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.role === "DRIVER" && user.driverInfo) {
    await DriverInfo.findByIdAndDelete(user.driverInfo);
  }

  await User.findByIdAndDelete(userId);
};
const getAllUsersStats = async () => {
  const totalUsers = await User.countDocuments({});
  const totalRiders = await User.countDocuments({ role: Role.RIDER });
  const totalDrivers = await User.countDocuments({ role: Role.DRIVER });
  const totalAdmins = await User.countDocuments({ role: Role.ADMIN });
  const activeUsers = await User.countDocuments({
    isDeleted: false,
    isSuspend: false,
  });

  return [
    { title: "Total Users", value: totalUsers },
    { title: "Total Riders", value: totalRiders },
    { title: "Total Drivers", value: totalDrivers },
    { title: "Total Admins", value: totalAdmins },
    { title: "Active Users", value: activeUsers },
  ];
};
const getAdminDashboardStats = async () => {
  const totalUsers = await User.countDocuments({});
  const totalDrivers = await User.countDocuments({ role: Role.DRIVER });
  const totalRiders = await User.countDocuments({ role: Role.RIDER });
  const totalRides = await Ride.countDocuments();
  const totalRevenueAgg = await Ride.aggregate([
    { $match: { status: RideStatus.COMPLETED } },
    { $group: { _id: null, total: { $sum: "$totalFare" } } },
  ]);

  const totalRevenue = totalRevenueAgg[0]?.total || 0;

  return [
    { title: "Total Users", value: totalUsers },
    { title: "Total Drivers", value: totalDrivers },
    { title: "Total Riders", value: totalRiders },
    { title: "Total Rides", value: totalRides },
    { title: "Total Revenue", value: totalRevenue },
  ];
};

const getAdminDriverStats = async () => {
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

  return [
    { title: "Total Drivers", value: totalDrivers },
    { title: "Online Drivers", value: onlineDrivers },
    { title: "Pending Drivers", value: pendingDrivers },
    { title: "Active Drivers", value: activeDrivers },
  ];
};

const getAdminRidesStats = async () => {
  const totalRides = await Ride.countDocuments({});
  const completedRides = await Ride.countDocuments({
    status: RideStatus.COMPLETED,
  });
  const cancelledRides = await Ride.countDocuments({
    status: RideStatus.CANCELLED,
  });
  const ongoingRides = await Ride.countDocuments({
    status: {
      $in: [RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT],
    },
  });
  const requestedRides = await Ride.countDocuments({
    status: RideStatus.REQUESTED,
  });

  return [
    { title: "Total Rides", value: totalRides },
    { title: "Completed Rides", value: completedRides },
    { title: "Cancelled Rides", value: cancelledRides },
    { title: "Ongoing Rides", value: ongoingRides },
    { title: "Requested Rides", value: requestedRides },
  ];
};

const getAdminRiderStats = async (riderId: string) => {
  const totalRides = await Ride.countDocuments({
    rider: new Types.ObjectId(riderId),
  });
  const completedRides = await Ride.countDocuments({
    rider: new Types.ObjectId(riderId),
    status: RideStatus.COMPLETED,
  });
  const cancelledRides = await Ride.countDocuments({
    rider: new Types.ObjectId(riderId),
    status: RideStatus.CANCELLED,
  });
  const ongoingRides = await Ride.countDocuments({
    rider: new Types.ObjectId(riderId),
    status: {
      $in: [RideStatus.ACCEPTED, RideStatus.PICKED_UP, RideStatus.IN_TRANSIT],
    },
  });

  const totalSpentAgg = await Ride.aggregate([
    {
      $match: {
        rider: new Types.ObjectId(riderId),
        status: RideStatus.COMPLETED,
      },
    },
    {
      $group: { _id: null, total: { $sum: "$totalFare" } },
    },
  ]);

  const totalSpent = totalSpentAgg[0]?.total || 0;

  return [
    { title: "Total Rides", value: totalRides },
    { title: "Completed Rides", value: completedRides },
    { title: "Cancelled Rides", value: cancelledRides },
    { title: "Ongoing Rides", value: ongoingRides },
    { title: "Total Spent", value: totalSpent },
  ];
};
export const AdminService = {
  getAllUsers,
  getAllDrivers,
  getAllRides,
  updateUserInfo,
  deleteUser,
  getAdminDashboardStats,
  getAdminDriverStats,
  getAdminRidesStats,
  getAdminRiderStats,
  getAllUsersStats,
};
