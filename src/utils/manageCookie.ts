import { Response } from "express";
import { envVars } from "../config/env";

export interface TokenInfo {
  accessToken?: string;
  refreshToken?: string;
}

const isProduction = envVars.NODE_ENV === "production";

export const setAuthCookies = (res: Response, tokens: TokenInfo): void => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "none",
    });
  }

  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "none",
    });
  }
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
  });
};
