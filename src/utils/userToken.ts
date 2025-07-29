import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import { generateToken, verifyToken } from "./jwt";
import { JwtPayload } from "jsonwebtoken";

export const createUserToken = (user: Partial<IUser>) => {
  const jwtPayload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES
  );
  return {
    accessToken,
    refreshToken,
  };
};

export const createNewAccessToken = async (refreshToken: string) => {
  const verifiedToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET
  ) as JwtPayload | "";

  if (!verifiedToken) {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findOne({ email: verifiedToken.email });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isActive === "INACTIVE" || user.isActive === "BLOCKED") {
    throw new Error(`User is ${user.isActive}`);
  }

  const newAccessToken = generateToken(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES
  );
  return newAccessToken;
};
