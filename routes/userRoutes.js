import express from "express";
import passport from "passport";
import UserController from "../controllers/userController.js";
const router = express.Router();
router.post("/register", UserController.register);
router.post("/login", UserController.userLogin);
router.post("/refresh-token", UserController.refreshAccessToken);
router.get(
  "/me",
  passport.authenticate("jwt", { session: false }),
  UserController.getUserProfile
);

export default router;
