import passport from "passport";
import User from "../../user/user.model";
import { localStrategy } from "./local.strategy";
import { googleStrategy } from "./google.strategy";

export const configurePassport = () => {
  passport.use(localStrategy);
  passport.use(googleStrategy);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: string) => void) => {
  const userId = user._id;
  done(null, userId);
});
passport.deserializeUser(
  async (
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    done: (err: any | null, user?: Express.User | false | null) => void
  ) => {
    try {
      const user = await User.findById(id).lean();
      if (!user) {
        return done(null, false); // No user found
      }
      done(null, user as Express.User);
    } catch (error) {
      done(error);
    }
  }
);
