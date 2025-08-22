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
