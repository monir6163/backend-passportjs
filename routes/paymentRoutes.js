import express from "express";
import passport from "passport";
import PaymentController from "../controllers/paymentController.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.js";
import authRole from "../middlewares/authRole.js";
const router = express.Router();

router.post(
  "/donations/stripe",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  PaymentController.createPaymentStripe
);
router.post("/webhook", PaymentController.stripeWebhook);
router.get(
  "/get/all/payments",
  accessTokenAutoRefresh,
  passport.authenticate("jwt", { session: false }),
  authRole("admin"),
  PaymentController.getAllPayments
);

export default router;
