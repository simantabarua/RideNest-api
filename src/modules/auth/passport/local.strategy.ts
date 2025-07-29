import { Strategy as LocalStrategy } from "passport-local";
import User from "../../user/user.model";
import bcryptjs from "bcryptjs";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email: string, password: string, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isGoogleAuth = user.auths?.some(
        (auth) => auth.provider === "google"
      );

      if (isGoogleAuth && !user.password) {
        return done(null, false, {
          message: "This user has logged in with Google. Please use Google login.",
        });
      }

      if (!user.password) {
        return done(null, false, { message: "Password not set" });
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);

      if (!isPasswordValid) {
        return done(null, false, { message: "Invalid password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);
