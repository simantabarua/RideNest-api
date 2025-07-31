import User from "../user/user.model";

export const DriverService = {
  setAvailability: async (driverId: string, isOnline: boolean) => {
    return await User.findByIdAndUpdate(driverId, { isOnline }, { new: true });
  },

  getDriverProfile: async (driverId: string) => {
    return await User.findById(driverId);
  },

  getEarnings: async (driverId: string) => {
    const driver = await User.findById(driverId).select("earnings");
    return driver?.earnings || 0;
  },
};
