import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import UserModel from "../models/User.js";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
};
passport.use(
  new JwtStrategy(opts, async function (payload, done) {
    try {
      const user = await UserModel.findById(payload.id).select("-password");
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
