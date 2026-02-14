
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

/**
 * Create a Product in PayPal Catalog
 */
export async function createPayPalProduct(name: string, description: string, type: "SERVICE" | "PHYSICAL" | "DIGITAL" = "SERVICE", category: string = "SOFTWARE") {
  const token = await getAccessToken();
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/catalogs/products`,
      {
        name,
        description,
        type,
        category,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `PROD-${Date.now()}`, // Simple idempotency key
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Create Product Error:", error.response?.data || error.message);
    throw new Error("Failed to create PayPal product");
  }
}

/**
 * Create a Billing Plan
 */
export async function createPayPalPlan(productId: string, name: string, description: string, priceMonthly: string, currency: string = "USD") {
  const token = await getAccessToken();
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/billing/plans`,
      {
        product_id: productId,
        name,
        description,
        status: "ACTIVE", // Activate immediately
        billing_cycles: [
          {
            frequency: {
              interval_unit: "MONTH",
              interval_count: 1,
            },
            tenure_type: "REGULAR",
            sequence: 1,
            total_cycles: 0, // 0 means infinite cycles
            pricing_scheme: {
              fixed_price: {
                value: priceMonthly,
                currency_code: currency,
              },
            },
          },
        ],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: "CONTINUE",
          payment_failure_threshold: 3,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": `PLAN-${Date.now()}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Create Plan Error:", error.response?.data || error.message);
    throw new Error("Failed to create PayPal billing plan");
  }
}

/**
 * Verify PayPal Webhook Signature
 */
export async function verifyWebhookSignature(
  webhookId: string,
  headers: Record<string, string | string[] | undefined>,
  body: any
) {
  const token = await getAccessToken();

  try {
    const response = await axios.post(
      `${PAYPAL_API}/v1/notifications/verify-webhook-signature`,
      {
        auth_algo: headers["paypal-auth-algo"],
        cert_url: headers["paypal-cert-url"],
        transmission_id: headers["paypal-transmission-id"],
        transmission_sig: headers["paypal-transmission-sig"],
        transmission_time: headers["paypal-transmission-time"],
        webhook_id: webhookId,
        webhook_event: body,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.verification_status === "SUCCESS";
  } catch (error: any) {
    console.error("Webhook Verification Error:", error.response?.data || error.message);
    return false;
  }
}

/**
 * Deactivate a Billing Plan
 */
export async function deactivatePayPalPlan(planId: string) {
    const token = await getAccessToken();
    try {
        await axios.post(
            `${PAYPAL_API}/v1/billing/plans/${planId}/deactivate`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return { success: true };
    } catch (error: any) {
        console.error("Deactivate Plan Error:", error.response?.data || error.message);
        // Don't throw, just return false so we can continue deleting locally if needed
        return { success: false, error: error.message };
    }
}
