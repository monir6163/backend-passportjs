import express from "express";
import passport from "passport";
import UserController from "../controllers/userController.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import { authRole } from "../middlewares/authRole.js";
const router = express.Router();
router.post("/register", UserController.register);
router.post("/login", UserController.userLogin);
router.post("/refresh-token", UserController.refreshAccessToken);
router.get(
  "/me",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  authRole("user"),
  UserController.getUserProfile
);
router.get(
  "/logout",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  UserController.userLogout
);

export default router;
