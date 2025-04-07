import isTokenExpired from "../utils/isTokenExpired.js";

const setAuthHeader = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken || !isTokenExpired(accessToken)) {
      req.headers["authorization"] = `Bearer ${accessToken}`;
    }
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: false,
      error: error.message,
      data: null,
    });
  }
};

export default setAuthHeader;
