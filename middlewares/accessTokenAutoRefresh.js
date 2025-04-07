import isTokenExpired from "../utils/isTokenExpired.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";
import setTokensCookies from "../utils/setTokensCookies.js";

const accessTokenAutoRefresh = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken || !isTokenExpired(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }
    if (!accessToken || isTokenExpired(accessToken)) {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error("Refresh token not found");
      }
      // new access token and refresh token requested
      const {
        newAccessToken,
        newRefreshToken,
        newAccessExpiresIn,
        newRefreshExpiresIn,
      } = await refreshAccessToken(req, res);
      // set new access token and refresh token in cookies
      setTokensCookies(
        res,
        newAccessToken,
        newRefreshToken,
        newAccessExpiresIn,
        newRefreshExpiresIn
      );
      // set new access token in header
      req.headers["authorization"] = `Bearer ${newAccessToken}`;
    }
    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized access",
      status: false,
      error: "Invalid token",
      data: null,
    });
  }
};

export default accessTokenAutoRefresh;
