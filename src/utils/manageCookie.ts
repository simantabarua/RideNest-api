import { Response } from "express";
export interface TokenInfo {
  accessToken?: string;
  refreshToken?: string;
}
export const setCookies = (res: Response, tokenInfo: TokenInfo) => {
  res.cookie("refreshToken", tokenInfo.refreshToken, {
    httpOnly: false,
    secure: false,
  });
  res.cookie("accessToken", tokenInfo.accessToken, {
    httpOnly: false,
    secure: false,
  });
};

export const clearCookies = (res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
  });
  res.clearCookie("accessToken", {
    httpOnly: false,
    secure: false,
    sameSite: "lax",
  });
};
