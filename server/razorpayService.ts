import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export interface RazorpayOrderOptions {
  amount: number; // Amount in smallest currency unit (paise for INR)
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, string>;
  created_at: number;
}

/**
 * Create a Razorpay order for payment
 * @param amount - Amount in smallest currency unit (e.g., paise for INR)
 * @param currency - Currency code (default: INR)
 * @param receipt - Unique receipt ID for tracking
 * @param notes - Optional metadata
 * @returns Razorpay order object
 */
export async function createRazorpayOrder(
  amount: number,
  currency: string = "INR",
  receipt: string,
  notes?: Record<string, string>
): Promise<RazorpayOrder> {
  try {
    const options: RazorpayOrderOptions = {
      amount,
      currency,
      receipt,
      notes,
    };

    const order = await razorpay.orders.create(options);
    return order as RazorpayOrder;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw new Error("Failed to create payment order");
  }
}

/**
 * Verify Razorpay payment signature to ensure authenticity
 * @param razorpayOrderId - Razorpay order ID
 * @param razorpayPaymentId - Razorpay payment ID
 * @param razorpaySignature - Signature received from Razorpay
 * @returns Boolean indicating if signature is valid
 */
export function verifyPaymentSignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  try {
    const secret = process.env.RAZORPAY_KEY_SECRET || "";

    // Create HMAC with SHA256
    const hmac = crypto.createHmac("sha256", secret);

    // Update HMAC with order_id|payment_id
    hmac.update(`${razorpayOrderId}|${razorpayPaymentId}`);

    // Generate digest
    const generatedSignature = hmac.digest("hex");

    // Compare signatures
    return generatedSignature === razorpaySignature;
  } catch (error) {
    console.error("Error verifying payment signature:", error);
    return false;
  }
}

/**
 * Verify webhook signature to ensure authenticity of webhook events
 * @param webhookBody - Raw webhook body as string
 * @param webhookSignature - Signature from Razorpay-Signature header
 * @returns Boolean indicating if webhook is authentic
 */
export function verifyWebhookSignature(
  webhookBody: string,
  webhookSignature: string
): boolean {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

    // Create HMAC with SHA256
    const hmac = crypto.createHmac("sha256", secret);

    // Update HMAC with webhook body
    hmac.update(webhookBody);

    // Generate digest
    const generatedSignature = hmac.digest("hex");

    // Compare signatures
    return generatedSignature === webhookSignature;
  } catch (error) {
    console.error("Error verifying webhook signature:", error);
    return false;
  }
}

/**
 * Fetch payment details from Razorpay
 * @param paymentId - Razorpay payment ID
 * @returns Payment details
 */
export async function fetchPaymentDetails(paymentId: string) {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Error fetching payment details:", error);
    throw new Error("Failed to fetch payment details");
  }
}

export default {
  createRazorpayOrder,
  verifyPaymentSignature,
  verifyWebhookSignature,
  fetchPaymentDetails,
};
