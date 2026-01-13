
import axios from "axios";

const PAYPAL_API = process.env.NEXT_PUBLIC_PAYPAL_SANDBOX === "true" 
  ? "https://api-m.sandbox.paypal.com" 
  : "https://api-m.paypal.com";

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

/**
 * Get Access Token using Client Credentials Flow
 */
async function getAccessToken(): Promise<string> {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error("Missing PayPal Credentials");
  }

  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("PayPal Auth Error:", error);
    throw new Error("Failed to authenticate with PayPal");
  }
}

/**
 * Get Subscription Details
 */
export async function getSubscriptionDetails(subscriptionId: string) {
  const token = await getAccessToken();
  try {
    const response = await axios.get(
      `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Get Subscription Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch subscription details");
  }
}

/**
 * Cancel Subscription
 */
export async function cancelSubscription(subscriptionId: string, reason: string = "Admin cancelled") {
  const token = await getAccessToken();
  try {
    await axios.post(
      `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`,
      { reason },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return { success: true };
  } catch (error: any) {
    console.error("Cancel Subscription Error:", error.response?.data || error.message);
    throw new Error("Failed to cancel subscription");
  }
}

/**
 * List Transactions for Subscription
 * (To find capture IDs for refunds)
 */
export async function getSubscriptionTransactions(subscriptionId: string, startTime: string, endTime: string) {
  const token = await getAccessToken();
  try {
    const response = await axios.get(
      `${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          start_time: startTime,
          end_time: endTime
        }
      }
    );
    return response.data.transactions;
  } catch (error: any) {
    console.error("Get Transactions Error:", error.response?.data || error.message);
    throw new Error("Failed to fetch transactions");
  }
}

/**
 * Refund a Payment (Capture)
 */
export async function refundPayment(captureId: string, amount?: string, currency: string = "USD") {
  const token = await getAccessToken();
  try {
    const payload = amount ? {
      amount: {
        value: amount,
        currency_code: currency
      }
    } : {};

    const response = await axios.post(
      `${PAYPAL_API}/v2/payments/captures/${captureId}/refund`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Refund Error:", error.response?.data || error.message);
    throw new Error("Failed to refund payment");
  }
}
