import { StatusCodes } from "http-status-codes";
import { IAuthProvider, IUser, Role } from "./user.interface";
import AppError from "../../errorHelper/AppError";
import { envVars } from "../../config/env";
import User from "./user.model";
import bcryptjs from "bcryptjs";
const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError(
      "User already exists with this email",
      StatusCodes.BAD_REQUEST
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
    return null;
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
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }

  if (user.isDeleted) {
    throw new AppError("User is deleted", StatusCodes.BAD_REQUEST);
  }

  if (payload.password) {
    user.password = bcryptjs.hashSync(
      payload.password,
      Number(envVars.BCRYPT_SALT_ROUND)
    );
    await user.save();
    delete payload.password;
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
      StatusCodes.BAD_REQUEST
    );
  }
  const userObj = updatedUser.toObject();
  delete userObj.password;

  return userObj;
};

const getProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User profile not found", StatusCodes.NOT_FOUND);
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
