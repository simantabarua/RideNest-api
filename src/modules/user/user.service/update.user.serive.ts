import { JwtPayload } from "jsonwebtoken";
import { IUser, Role } from "../user.interface";
import User from "../user.model";
import AppError from "../../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../../config/env";
import { DriverInfo } from "../../driver/driver.model";
import bcryptjs from "bcryptjs";
import { updateDiverZodSchema } from "../../driver/driver.validation";

const UpdateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decodedToken: JwtPayload
): Promise<IUser | null> => {
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

  if (!isSelfUpdate && !isPrivileged) {
    throw new AppError("Unauthorized", StatusCodes.FORBIDDEN);
  }

  if (payload.role) {
    if (isSelfUpdate) {
      throw new AppError(
        "You cannot change your own role",
        StatusCodes.FORBIDDEN
      );
    }
    if ([Role.DRIVER, Role.RIDER].includes(requesterRole)) {
      throw new AppError("You cannot change roles", StatusCodes.FORBIDDEN);
    }
    if (requesterRole === Role.ADMIN && payload.role === Role.SUPER_ADMIN) {
      throw new AppError(
        "Admins cannot assign Super Admin role",
        StatusCodes.FORBIDDEN
      );
    }
    if (!isPrivileged) {
      throw new AppError("Unauthorized to change roles", StatusCodes.FORBIDDEN);
    }
  }

  if (payload.isApproved === true && !isPrivileged) {
    throw new AppError(
      "Only admins or super admins can approve users",
      StatusCodes.FORBIDDEN
    );
  }

  if (payload.password) {
    user.password = bcryptjs.hashSync(
      payload.password,
      envVars.BCRYPT_SALT_ROUND
    );
    await user.save();
    delete payload.password;
  }

  const isChangingToDriver =
    payload.role === Role.DRIVER && user.role !== Role.DRIVER;
  if (isChangingToDriver && !isPrivileged) {
    throw new AppError(
      "Only admins or super admins can assign DRIVER role",
      StatusCodes.FORBIDDEN
    );
  }

  await User.findByIdAndUpdate(userId, payload);
  if (payload.role === Role.DRIVER) {
    const parsedPayload = updateDiverZodSchema.parse(payload);
    const driverInfo = await DriverInfo.findOneAndUpdate(
      { driver: userId },
      {
        $set: {
          driver: userId,
          ...parsedPayload,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    if (driverInfo) {
      await User.findByIdAndUpdate(userId, {
        $set: { driverInfo: driverInfo._id },
      });
    }
  }

  const updatedUser = await User.findById(userId).populate("driverInfo");

  if (!updatedUser) return null;

  const userObj = updatedUser.toObject();
  delete userObj.password;

  return userObj;
};

export default UpdateUser;
