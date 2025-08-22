import { Response } from "express";

export interface TokenInfo {
  accessToken?: string;
  refreshToken?: string;
}


const baseCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none" as const,
};

const accessTokenOptions = {
  ...baseCookieOptions,
  maxAge: 1000 * 60 * 15,
};

const refreshTokenOptions = {
  ...baseCookieOptions,
  maxAge: 1000 * 60 * 60 * 24 * 7,
};

export const setAuthCookies = (res: Response, tokens: TokenInfo): void => {
  if (tokens.accessToken) {
    res.cookie("accessToken", tokens.accessToken, accessTokenOptions);
  }

  if (tokens.refreshToken) {
    res.cookie("refreshToken", tokens.refreshToken, refreshTokenOptions);
  }
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie("accessToken", baseCookieOptions);
  res.clearCookie("refreshToken", baseCookieOptions);
};
