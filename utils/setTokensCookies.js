const setTokensCookies = (
  res,
  accessToken,
  refreshToken,
  accessExpiresIn,
  refreshExpiresIn
) => {
  // Set the access token in a cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    maxAge: (accessExpiresIn - Math.floor(Date.now() / 1000)) * 1000, // Convert seconds to milliseconds
    // sameSite: "Strict",
  });

  // Set the refresh token in a cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: (refreshExpiresIn - Math.floor(Date.now() / 1000)) * 1000, // Convert seconds to milliseconds
    // sameSite: "Strict",
  });
};

export default setTokensCookies;
