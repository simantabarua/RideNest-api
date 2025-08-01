import { StatusCodes } from "http-status-codes";
import bcryptjs from "bcryptjs";
import { IAuthProvider, IUser, Role } from "../user.interface";
import User from "../user.model";
import AppError from "../../../errorHelper/AppError";
import { envVars } from "../../../config/env";

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
export default createUser;
