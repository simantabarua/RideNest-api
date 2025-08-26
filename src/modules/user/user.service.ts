import { IAuthProvider, IUser, Role } from "./user.interface";
import AppError from "../../errorHelper/AppError";
import { envVars } from "../../config/env";
import User from "./user.model";
import bcryptjs from "bcryptjs";
import { DriverInfo } from "../driver/driver.model";
import { updateDriverZodSchema } from "../driver/driver.validation";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError(
      "User already exists with this email",
      500,
      "USER_ALREADY_EXISTS"
    );
  }

  const hashedPassword = bcryptjs.hashSync(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const authProvider: IAuthProvider = {
    provider: "credentials",
    providerId: email as string,
  };

  const user = await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,
    role: Role.RIDER,
    ...rest,
  });

  if (!user) {
    throw new AppError("User creation failed", 500, "USER_CREATION_FAILED");
  }

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

const UpdateUser = async (
  payload: Partial<IUser>,
  userId: string
): Promise<IUser | null> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 500, "USER_NOT_FOUND");
  }
  if (user.isDeleted) {
    throw new AppError("User is deleted", 500, "USER_IS_DELETED");
  }
  if (payload.currentPassword) {
    const { newPassword, currentPassword } = payload;
    const isCurrentValid = bcryptjs.compareSync(
      currentPassword as string,
      user.password as string
    );
    if (!isCurrentValid) {
      throw new AppError(
        "Invalid current password",
        500,
        "AUTH_INVALID_CURRENT_PASSWORD"
      );
    }

    if (newPassword === currentPassword) {
      throw new AppError(
        "New password is same as old password",
        500,
        "NEW_PASSWORD_SAME_AS_OLD_PASSWORD"
      );
    }

    user.password = bcryptjs.hashSync(
      newPassword as string,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    await user.save();
    delete payload.password;
  }
  if (payload.role === Role.DRIVER) {
    const isDriver = await DriverInfo.findOne({ driver: userId });
    if (isDriver) {
      const checkIsApproved = user.isApproved;
      if (!checkIsApproved) {
        throw new AppError(
          "You have already submitted your driver information, please wait for approval",
          400,
          "DRIVER_ALREADY_SUBMITTED"
        );
      }
    }

    const parsedDriverData = updateDriverZodSchema.parse(payload);

    // Check for duplicate license number
    if (parsedDriverData.licenseNumber) {
      const existingLicense = await DriverInfo.findOne({
        licenseNumber: parsedDriverData.licenseNumber,
        driver: { $ne: userId },
      });
      if (existingLicense) {
        throw new AppError(
          "License number already exists",
          400,
          "DUPLICATE_LICENSE"
        );
      }
    }

    if (parsedDriverData.vehicleInfo?.registrationNumber) {
      const existingVehicle = await DriverInfo.findOne({
        "vehicleInfo.registrationNumber":
          parsedDriverData.vehicleInfo.registrationNumber,
        driver: { $ne: userId },
      });
      if (existingVehicle) {
        throw new AppError(
          "Registration number already exists",
          400,
          "DUPLICATE_REGISTRATION"
        );
      }
    }

    try {
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

      if (!driverInfo) {
        throw new Error("Failed to create/update driver information");
      }

      payload.driverInfo = driverInfo._id;
      payload.isApproved = false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new AppError("Invalid driver information: ", 500);
    }
  }

  const allowedUserFields = ["name", "phone", "address", "picture"] as const;
  allowedUserFields.forEach((field) => {
    if (payload[field] !== undefined) {
      (user as Partial<IUser>)[field] = payload[field];
    }
  });

  await user.save();

  const updatedUser = await User.findById(userId);
  if (!updatedUser) {
    throw new AppError(
      "Update failed. Something went wrong",
      500,
      "USER_UPDATE_FAILED"
    );
  }

  const userObj = updatedUser.toObject();
  delete userObj.password;
  return userObj;
};

const getProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User profile not found", 500, "USER_PROFILE_NOT_FOUND");
  }

  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const UserService = {
  createUser,
  UpdateUser,
  getProfile,
};
