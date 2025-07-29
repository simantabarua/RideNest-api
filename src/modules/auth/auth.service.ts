import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { IUser } from "../user/user.interface";
import User from "../user/user.model";
import AppError from "../../errorHelper/AppError";

const credentialLogin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const isPasswordValid = bcryptjs.compareSync(
    password as string,
    user.password || ""
  );
  if (!isPasswordValid) {
    throw new AppError("Invalid password", StatusCodes.UNAUTHORIZED);
  }
};

export const AuthService = {
  credentialLogin,
};
