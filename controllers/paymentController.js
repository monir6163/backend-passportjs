import dotenv from "dotenv";
import Stripe from "stripe";
import Payment from "../models/Payment.js";
import UserModel from "../models/User.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2022-11-15",
});
class PaymentController {
  // create a stripe payment
  static async createPaymentStripe(req, res) {
    try {
      const userId = req.user._id;
      const user = await UserModel.findById(userId);

      const { amount } = req.body;
      const params = {
        submit_type: "pay",
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: user.email,
        metadata: {
          userId: user?._id.toString(),
          address: user.address,
        },
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Donation for Palestine Muslims",
                description: `Payment for ${user.fullName}`,
              },
              unit_amount: amount * 100,
            },
            quantity: 1,
          },
        ],
        success_url: `${process.env.CORS_ORIGINS}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CORS_ORIGINS}/payment-cancel?session_id={CHECKOUT_SESSION_ID}`,
      };
      const session = await stripe.checkout.sessions.create(params);
      return res.status(200).json(session);
    } catch (error) {
      console.error("Error creating payment session:", error);
      res.status(500).json({
        message: "Internal server error",
        status: false,
        error: error.message,
        data: null,
      });
    }
  }

  // webhook for stripe payment
  static async stripeWebhook(req, res) {
    try {
      const event = req.body;
      const signature = req.headers["stripe-signature"];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          const lineItems = await stripe.checkout.sessions.listLineItems(
            session.id
          );
          const userId = session.metadata.userId;
          const orderPayload = {
            payment_id: session.payment_intent,
            userId: userId,
            amount: session.amount_total / 100,
            currency: session.currency,
            status: session.payment_status,
          };
          // Save order to database or perform any other actions needed
          const savePaymentInfo = await Payment.create(orderPayload);
          break;
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;
          console.log(
            `PaymentIntent for ${paymentIntent.amount} was successful!`
          );
          break;

        case "payment_method.attached":
          const paymentMethod = event.data.object;
          console.log("PaymentMethod", paymentMethod);
          break;

        default:
          console.log(`Unhandled event type ${event.type}`);
      }
      res.status(200).json({ received: true });
    } catch (error) {
      res.status(500).json({
        message: "Internal server error",
        status: false,
        error: error.message,
        data: null,
      });
    }
  }
  // get all payments for only admin
  static async getAllPayments(req, res) {
    try {
      const payments = await Payment.find({}).populate("userId", [
        "fullName",
        "email",
      ]);
      return res.status(200).json({
        message: "Payments retrieved successfully",
        status: true,
        data: payments,
      });
    } catch (error) {
      console.error("Error retrieving payments:", error);
      return res.status(500).json({
        message: "Internal server error",
        status: false,
        error: error.message,
        data: null,
      });
    }
  }
}
export default PaymentController;
