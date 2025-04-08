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
    sameSite: "None",
  });

  // Set the refresh token in a cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    maxAge: (refreshExpiresIn - Math.floor(Date.now() / 1000)) * 1000, // Convert seconds to milliseconds
    sameSite: "None",
  });
  // set the isAuthenticated cookie to true
  res.cookie("is_auth", true, {
    // httpOnly: true,
    secure: true,
    maxAge: (refreshExpiresIn - Math.floor(Date.now() / 1000)) * 1000, // Convert seconds to milliseconds
    sameSite: "None",
  });
};

export default setTokensCookies;
