import express from "express";
import passport from "passport";
import UserController from "../controllers/userController.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import limiter from "../utils/rateLimit.js";
const router = express.Router();
router.post("/register", UserController.register);
router.post("/login", limiter, UserController.userLogin);
router.post("/refresh-token", UserController.refreshAccessToken);
router.get(
  "/me",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  UserController.getUserProfile
);
router.post(
  "/logout",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  UserController.userLogout
);

export default router;
