import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserRefreshToken from "../models/UserRefreshToken.js";
dotenv.config();

const verifyRefreshToken = async (refreshToken) => {
  try {
    const privateKey = process.env.JWT_REFRESH_TOKEN_SECRET;
    const userRefreshToken = await UserRefreshToken.findOne({
      token: refreshToken,
    });
    if (!userRefreshToken) {
      throw { error: true, message: "Invalid refresh token" };
    }
    const decoded = jwt.verify(refreshToken, privateKey);
    return {
      message: "Refresh token verified successfully",
      status: true,
      error: null,
      decoded,
    };
  } catch (error) {
    throw {
      message: error.message || "Invalid refresh token",
      status: false,
      error: error,
    };
  }
};

export default verifyRefreshToken;
