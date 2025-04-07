import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import UserRefreshToken from "../models/UserRefreshToken.js";
import generateTokens from "../utils/generateTokens.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import setTokensCookies from "../utils/setTokensCookies.js";
class UserController {
  // user registration
  static async register(req, res) {
    try {
      const {
        fullName,
        username,
        email,
        phone,
        address,
        city,
        zipCode,
        password,
        confirmPassword,
      } = req.body;
      if (
        !fullName ||
        !username ||
        !email ||
        !phone ||
        !address ||
        !city ||
        !zipCode ||
        !password ||
        !confirmPassword
      ) {
        return res.status(400).json({
          message: "All fields are required",
          status: false,
          data: null,
        });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({
          message: "Passwords do not match",
          status: false,
          data: null,
        });
      }
      const existingUser = await UserModel.findOne({
        $or: [{ email }, { username }],
      });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
          status: false,
          data: null,
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new UserModel({
        fullName,
        username,
        email,
        phone,
        address,
        city,
        zipCode,
        password: hashedPassword,
      });
      await newUser.save();
      // send email verification link in future
      res.status(201).json({
        message: "User registered successfully",
        status: true,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        status: false,
        error: error.message,
        data: null,
      });
    }
  }
  // user login
  static async userLogin(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          message: "All fields are required",
          status: false,
          data: null,
        });
      }
      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({
          message: "Invalid Email or password!",
          status: false,
          data: null,
        });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          message: "Invalid credentials!",
          status: false,
          data: null,
        });
      }
      // generate access token and refresh token
      const { accessToken, refreshToken, accessExpiresIn, refreshExpiresIn } =
        await generateTokens(user);
      // send tokens to client and set them in cookies
      setTokensCookies(
        res,
        accessToken,
        refreshToken,
        accessExpiresIn,
        refreshExpiresIn
      );
      res.status(200).json({
        message: "User logged in successfully",
        status: true,
        access_token: accessToken,
        refresh_token: refreshToken,
        access_expires_in: accessExpiresIn,
        refresh_expires_in: refreshExpiresIn,
        is_auth: true,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        status: false,
        error: error.message,
        data: null,
      });
    }
  }
  // get new access token refresh token
  static async refreshAccessToken(req, res) {
    try {
      const {
        newAccessToken,
        newRefreshToken,
        newAccessExpiresIn,
        newRefreshExpiresIn,
      } = await refreshAccessToken(req, res);
      setTokensCookies(
        res,
        newAccessToken,
        newRefreshToken,
        newAccessExpiresIn,
        newRefreshExpiresIn
      );
      res.status(200).json({
        message: "New access token and refresh token generated successfully",
        status: true,
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
        access_expires_in: newAccessExpiresIn,
        refresh_expires_in: newRefreshExpiresIn,
        is_auth: true,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        status: false,
        error: error.message,
        data: null,
      });
    }
  }
  // get logged in user profile
  static async getUserProfile(req, res) {
    res.send({
      message: "User profile fetched successfully",
      status: true,
      data: req.user,
      error: null,
    });
  }
  // user logout
  static async userLogout(req, res) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return res.status(400).json({
          message: "No refresh token provided",
          status: false,
          data: null,
        });
      }
      await UserRefreshToken.findOneAndUpdate(
        { token: refreshToken },
        { $set: { token: "" } }
      );
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.clearCookie("is_auth");
      res.status(200).json({
        message: "User logged out successfully",
        status: true,
        error: null,
      });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        status: false,
        error: error.message,
        data: null,
      });
    }
  }
}
export default UserController;
