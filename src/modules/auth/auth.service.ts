import bcryptjs from "bcryptjs";
import User from "../user/user.model";
import AppError from "../../errorHelper/AppError";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";
import { createNewAccessToken } from "../../utils/userToken";

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessToken(refreshToken);
  if (!newAccessToken) {
    throw new AppError(
      "Invalid or expired refresh token",
      500,
      "AUTH_REFRESH_TOKEN_INVALID"
    );
  }

  return { accessToken: newAccessToken };
};

const changePassword = async (
  payload: ChangePasswordPayload,
  decodedToken: JwtPayload
) => {
  const { oldPassword, newPassword } = payload;

  const user = await User.findOne({ email: decodedToken.email });
  if (!user) {
    throw new AppError("User not found", 500, "AUTH_USER_NOT_FOUND");
  }

  const isPasswordValid = bcryptjs.compareSync(
    oldPassword,
    user.password as string
  );
  if (!isPasswordValid) {
    throw new AppError(
      "Invalid old password",
      500,
      "AUTH_INVALID_OLD_PASSWORD"
    );
  }

  const hashedNewPassword = bcryptjs.hashSync(
    newPassword,
    Number(envVars.BCRYPT_SALT_ROUND)
  );
  user.password = hashedNewPassword;

  try {
    await user.save();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    throw new AppError(
      "Failed to update password",
      500,
      "AUTH_PASSWORD_UPDATE_FAILED"
    );
  }
};

export const AuthServices = {
  getNewAccessToken,
  changePassword,
};
