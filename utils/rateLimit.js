import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2, // Limit each IP to 2 requests per windowMs
  message: "Too many requests, please try again later.",
});

export default limiter;
