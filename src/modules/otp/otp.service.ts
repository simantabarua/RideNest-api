import crypto from "crypto";
import AppError from "../../errorHelper/AppError";
import User from "../user/user.model";
import { sendEmail } from "../../utils/sendEmail";
import { redisClient } from "../../config/redis.config";

const OTP_EXPIRATION = 2 * 60;

const generateOtp = (length = 6): string => {
  return crypto.randomInt(10 ** (length - 1), 10 ** length).toString();
};

const sendOTP = async (email: string, name: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 500, "AUTH_USER_NOT_FOUND");
  }

  if (user.isVerified) {
    throw new AppError(
      "You are already verified",
      500,
      "AUTH_USER_ALREADY_VERIFIED"
    );
  }

  const otp = generateOtp();
  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    EX: OTP_EXPIRATION,
  });

  await sendEmail({
    to: email,
    subject: "Your OTP Code",
    templateName: "otp",
    templateData: { name, otp },
  });
};

const verifyOTP = async (email: string, otp: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("User not found", 500, "AUTH_USER_NOT_FOUND");
  }

  if (user.isVerified) {
    throw new AppError(
      "You are already verified",
      500,
      "AUTH_USER_ALREADY_VERIFIED"
    );
  }

  const redisKey = `otp:${email}`;
  const savedOtp = await redisClient.get(redisKey);

  if (!savedOtp || savedOtp !== otp) {
    throw new AppError("Invalid OTP", 500, "AUTH_INVALID_OTP");
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del(redisKey),
  ]);
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
