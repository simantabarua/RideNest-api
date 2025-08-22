import { Strategy as LocalStrategy, IVerifyOptions } from "passport-local";
import User from "../../user/user.model";
import bcryptjs from "bcryptjs";

interface ICustomVerifyOptions extends IVerifyOptions {
  code?: string;
}

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email: string, password: string, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        const info: ICustomVerifyOptions = {
          message: "User not found",
          code: "AUTH_USER_NOT_FOUND",
        };
        return done(null, false, info);
      }

      const isGoogleAuth = user.auths?.some(
        (auth) => auth.provider === "google"
      );

      if (isGoogleAuth && !user.password) {
        const info: ICustomVerifyOptions = {
          message:
            "This user has logged in with Google. Please use Google login.",
          code: "AUTH_GOOGLE_USER",
        };
        return done(null, false, info);
      }

      if (!user.password) {
        const info: ICustomVerifyOptions = {
          message: "Password not set",
          code: "AUTH_PASSWORD_NOT_SET",
        };
        return done(null, false, info);
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        const info: ICustomVerifyOptions = {
          message: "Invalid email or password",
          code: "AUTH_INVALID_CREDENTIALS",
        };
        return done(null, false, info);
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
