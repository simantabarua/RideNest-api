import passport from "passport";
import { catchAsync } from "../../utils/catchAsync";
import AppError from "../../errorHelper/AppError";
import { StatusCodes } from "http-status-codes";
import { createUserToken } from "../../utils/userToken";
import sendResponse from "../../utils/sendResponse";
import { envVars } from "../../config/env";
import { AuthServices } from "./auth.service";
import { JwtPayload } from "jsonwebtoken";
import { clearAuthCookies, setAuthCookies } from "../../utils/manageCookie";
import { Role } from "../user/user.interface";

const credentialLogin = catchAsync(
  async (req: any, res: any, next: any) => {
    passport.authenticate(
      "local",
      { session: false },
      async (
        err: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        user: any,
        info: { message: string; code?: string }
      ) => {
        if (err) {
          return next(
            new AppError(err, StatusCodes.UNAUTHORIZED, "GENERAL_ERROR")
          );
        }

        if (!user) {
          return next(
            new AppError(
              info.message,
              StatusCodes.UNAUTHORIZED,
              info.code || "AUTH_UNKNOWN_ERROR"
            )
          );
        }
        if (!user.isVerified) {
          return next(
            new AppError(
              "User is not verified",
              StatusCodes.UNAUTHORIZED,
              "AUTH_USER_NOT_VERIFIED"
            )
          );
        }
        const userToken = createUserToken(user);
        const userObj = user.toObject();
        delete userObj.password;
        setAuthCookies(res, userToken.accessToken, userToken.refreshToken);

        sendResponse(res, {
          statusCode: StatusCodes.OK,
          success: true,
          message: "User logged in successfully",
          data: {
            accessToken: userToken.accessToken,
            refreshToken: userToken.refreshToken,
            user: userObj,
          },
        });
      }
    )(req, res, next);
  }
);

const generateNewAccessToken = catchAsync(
  async (req: any, res: any, next: any) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken || typeof refreshToken !== "string") {
      throw new AppError("No refresh token provided", StatusCodes.UNAUTHORIZED);
    }

    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

    setAuthCookies(res, tokenInfo.accessToken, refreshToken);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "New access token generated successfully",
      data: {
        accessToken: tokenInfo.accessToken,
      },
    });
  }
);

const logout = catchAsync(
  async (req: any, res: any, next: any) => {
    // 1. Clear cookies
    clearAuthCookies(res);

    // 2. Clear passport session and handle final response
    if (req.logout) {
      return req.logout((err: any) => {
        if (err) return next(err);
        
        // 3. Destroy express session if it exists
        if (req.session) {
          req.session.destroy(() => {
            sendResponse(res, {
              statusCode: StatusCodes.OK,
              success: true,
              message: "User logged out successfully",
              data: null,
            });
          });
        } else {
          sendResponse(res, {
            statusCode: StatusCodes.OK,
            success: true,
            message: "User logged out successfully",
            data: null,
          });
        }
      });
    }

    // Fallback if req.logout is not present
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User logged out successfully",
      data: null,
    });
  }
);
const changePassword = catchAsync(
  async (req: any, res: any, next: any) => {
    const decodedToken = req.user;
    const changePasswordInfo = await AuthServices.changePassword(
      req.body,
      decodedToken as JwtPayload
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully",
      data: changePasswordInfo,
    });
  }
);

const googleAuthController = catchAsync(
  async (req: any, res: any, next: any) => {
    const user = req.user;
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }
    if (!user) {
      res.status(StatusCodes.UNAUTHORIZED).send("Authentication failed");
      return;
    }
    const tokenInfo = createUserToken(user);
    setAuthCookies(res, tokenInfo.accessToken, tokenInfo.refreshToken);
    let target = redirectTo;
    if (!target) {
      if (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) {
        target = "admin/dashboard";
      } else if (user.role === Role.DRIVER) {
        target = "driver/dashboard";
      } else {
        target = "rider/dashboard";
      }
    }
    res.redirect(`${envVars.FRONTEND_URL}/${target}`);
  }
);
export const AuthController = {
  credentialLogin,
  generateNewAccessToken,
  logout,
  changePassword,
  googleAuthController,
};
