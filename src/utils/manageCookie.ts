import { CookieOptions } from "express";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  path: "/",
};

export const setAuthCookies = (
  res: any,
  accessToken: string,
  refreshToken: string
): void => {
  res.cookie("accessToken", accessToken, baseCookieOptions);
  res.cookie("refreshToken", refreshToken, {
    ...baseCookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });
};

export const clearAuthCookies = (res: any): void => {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
};
