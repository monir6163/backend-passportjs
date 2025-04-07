import UserModel from "../models/User.js";

export const authRole = (...roles) => {
  return async (req, res, next) => {
    const user = await UserModel.findOne({ _id: req.user._id });
    if (!roles.includes(user.role)) {
      return res.status(401).json({
        message: "Unauthorized.Don't have permision for this route",
        success: false,
        error: true,
      });
    }
    next();
  };
};
