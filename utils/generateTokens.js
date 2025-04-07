import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import UserRefreshToken from "../models/UserRefreshToken.js";
dotenv.config();
const generateTokens = async (user) => {
  try {
    const payload = {
      id: user._id,
      username: user.username,
    };
    // 10 minutes for access token and 1 day for refresh token
    const accessExpiresIn = Math.floor(Date.now() / 1000) + 30; // 10 minutes
    const refreshExpiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 1 day
    const accessToken = jwt.sign(
      { ...payload, exp: accessExpiresIn },
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    const refreshToken = jwt.sign(
      { ...payload, exp: refreshExpiresIn },
      process.env.JWT_REFRESH_TOKEN_SECRET
    );

    const userRefreshToken = await UserRefreshToken.findOne({
      userId: user._id,
    });
    if (userRefreshToken) await userRefreshToken.deleteOne();
    // // blacklist the old refresh token
    // if (userRefreshToken) {
    //   userRefreshToken.blackListed = true;
    //   await userRefreshToken.save();
    // }
    // save the new refresh token in the database
    const newUserRefreshToken = new UserRefreshToken({
      userId: user._id,
      token: refreshToken,
    });
    await newUserRefreshToken.save();
    return Promise.resolve({
      accessToken,
      refreshToken,
      accessExpiresIn,
      refreshExpiresIn,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export default generateTokens;
