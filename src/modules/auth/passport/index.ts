/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import User from "../../user/user.model";
import { localStrategy } from "./local.strategy";
import { googleStrategy } from "./google.strategy";

export const configurePassport = () => {
  passport.use("local", localStrategy);
  passport.use("google", googleStrategy);
};

passport.serializeUser((user: any, done: (err: any, id?: string) => void) => {
  done(null, user._id);
});

passport.deserializeUser(
  async (
    id: string,
    done: (err: any | null, user?: Express.User | false | null) => void
  ) => {
    try {
      const user = await User.findById(id).lean();
      if (!user) return done(null, false);
      done(null, user as Express.User);
    } catch (error) {
      done(error);
    }
  }
);
