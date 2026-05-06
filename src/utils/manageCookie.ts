import { CookieOptions } from "express";

const baseCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true, // Always true for sameSite: "none"
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
  // Clearing cookies requires the same options used to set them
  res.clearCookie("accessToken", { ...baseCookieOptions });
  res.clearCookie("refreshToken", { ...baseCookieOptions });
  
  // Extra safety: set them to empty with an immediate expiration
  const expiredOptions = { ...baseCookieOptions, maxAge: 0, expires: new Date(0) };
  res.cookie("accessToken", "", expiredOptions);
  res.cookie("refreshToken", "", expiredOptions);
};
