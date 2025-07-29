import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import User from "../user/user.model";
import AppError from "../../errorHelper/AppError";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { createNewAccessToken } from "../../utils/userToken";


const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessToken(refreshToken);
  return {
    accessToken: newAccessToken,
  };
};
interface ChangePasswordPayload {
  oldPassword: string;

  newPassword: string;
}
const changePassword = async (
  payload: ChangePasswordPayload,
  decodedToken: JwtPayload
) => {
  const { oldPassword, newPassword } = payload;
  const user = await User.findOne({ email: decodedToken.email });
  if (!user) {
    throw new AppError("User not found", StatusCodes.NOT_FOUND);
  }
  const isPasswordValid = bcryptjs.compareSync(
    oldPassword,
    user.password as string
  );
  if (!isPasswordValid) {
    throw new AppError("Invalid old password", StatusCodes.UNAUTHORIZED);
  }
  const hashedNewPassword = bcryptjs.hashSync(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user.password = hashedNewPassword;
  await user.save();
};
export const AuthServices = {
  getNewAccessToken,
  changePassword,
};
