import jwt from "jsonwebtoken";
const isTokenExpired = (token) => {
  if (!token) return true;
  const decodedToken = jwt.decode(token);
  if (!decodedToken) return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp < currentTime;
};

export default isTokenExpired;
