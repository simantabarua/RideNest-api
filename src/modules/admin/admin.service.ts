import User from "../user/user.model";
import { Role } from "../user/user.interface";
import { Ride } from "../ride/ride.model";
import { ApiError } from "next/dist/server/api-utils";

export const AdminService = {
  getAllUsers: async () => {
    return await User.find();
  },

  updateUserRole: async (
    userId: string,
    updateData: Partial<{ role: Role; isActive: string }>
  ) => {
    if (updateData.role === Role.SUPER_ADMIN) {
      throw new ApiError(403, "You are not allowed to assign SUPER_ADMIN role");
    }
    return await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });
  },

  deleteUser: async (userId: string) => {
    return await User.findByIdAndDelete(userId);
  },

  getDashboardStats: async () => {
    const totalUsers = await User.countDocuments();
    const totalRiders = await User.countDocuments({ role: Role.RIDER });
    const totalDrivers = await User.countDocuments({ role: Role.DRIVER });
    const totalRides = await Ride.countDocuments();
    const completedRides = await Ride.countDocuments({ status: "completed" });
    const earnings = await User.aggregate([
      { $match: { role: Role.DRIVER } },
      { $group: { _id: null, total: { $sum: "$earnings" } } },
    ]);

    return {
      totalUsers,
      totalRiders,
      totalDrivers,
      totalRides,
      completedRides,
      totalEarnings: earnings[0]?.total || 0,
    };
  },
};
