import Razorpay from "razorpay";
import crypto from "crypto";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "";

let razorpayInstance: Razorpay | null = null;

function getRazorpayInstance() {
  if (!razorpayInstance && RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    razorpayInstance = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
}

export async function createRazorpayOrder(amount: number, orderId: string, customerId?: string) {
  try {
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      throw new Error("Razorpay credentials not configured");
    }

    const response: any = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt: orderId,
      notes: {
        order_id: orderId,
        customer_id: customerId || "",
      },
    });

    return {
      razorpay_order_id: response.id,
      amount: response.amount,
      currency: response.currency,
      receipt: response.receipt,
    };
  } catch (error) {
    console.error("Failed to create Razorpay order:", error);
    throw error;
  }
}

export function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  } catch (error) {
    console.error("Signature verification error:", error);
    return false;
  }
}

export async function captureRazorpayPayment(paymentId: string, amount: number) {
  try {
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      throw new Error("Razorpay not configured");
    }

    const response: any = await (razorpay.payments as any).capture(paymentId, Math.round(amount * 100));

    return response;
  } catch (error) {
    console.error("Failed to capture Razorpay payment:", error);
    throw error;
  }
}

export async function fetchPaymentDetails(paymentId: string) {
  try {
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      throw new Error("Razorpay not configured");
    }

    return await razorpay.payments.fetch(paymentId);
  } catch (error) {
    console.error("Failed to fetch payment details:", error);
    throw error;
  }
}
