import UserModel from "../models/User.js";
import UserRefreshToken from "../models/UserRefreshToken.js";
import generateTokens from "./generateTokens.js";
import verifyRefreshToken from "./verifyRefreshToken.js";

const refreshAccessToken = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({
        message: "Invalid refresh token",
        status: false,
        data: null,
      });
    }
    // Verify the refresh token
    const { message, status, error, decoded } = await verifyRefreshToken(
      oldRefreshToken
    );
    if (error) {
      return res.status(401).json({
        status: false,
        message: "Invalid refresh token",
        error: error.message,
        data: null,
      });
    }
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "User not found",
        status: false,
        data: null,
      });
    }
    const userRefreshToken = await UserRefreshToken.findOne({
      userId: decoded.id,
    });
    if (
      userRefreshToken.token !== oldRefreshToken ||
      userRefreshToken.blackListed
    ) {
      return res.status(401).json({
        message: "Unauthorized access",
        status: false,
        data: null,
      });
    }
    // Generate new access token and refresh token
    const { accessToken, refreshToken, accessExpiresIn, refreshExpiresIn } =
      await generateTokens(user);

    return {
      newAccessToken: accessToken,
      newRefreshToken: refreshToken,
      newAccessExpiresIn: accessExpiresIn,
      newRefreshExpiresIn: refreshExpiresIn,
    };
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: false,
      error: error.message,
      data: null,
    });
  }
};

export default refreshAccessToken;
