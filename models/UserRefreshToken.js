import mongoose from "mongoose";
const userRefreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    blackListed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "1d", // Token will expire after 1 day
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const UserRefreshToken = mongoose.model(
  "UserRefreshToken",
  userRefreshTokenSchema
);
export default UserRefreshToken;
