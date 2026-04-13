import axios from "axios";

const PAYPAL_API = process.env.NEXT_PUBLIC_PAYPAL_SANDBOX === "true" 
  ? "https://api-m.sandbox.paypal.com" 
  : "https://api-m.paypal.com";

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

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

export async function getSubscriptionDetails(subscriptionId: string) {
  const token = await getAccessToken();
  const response = await axios.get(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function cancelSubscription(subscriptionId: string, reason: string = "Admin cancelled") {
  const token = await getAccessToken();
  await axios.post(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`, { reason }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { success: true };
}

export async function getSubscriptionTransactions(subscriptionId: string, startTime: string, endTime: string) {
  const token = await getAccessToken();
  const response = await axios.get(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { start_time: startTime, end_time: endTime }
  });
  return response.data.transactions;
}

export async function getPayPalPlanDetails(planId: string) {
  const token = await getAccessToken();
  const response = await axios.get(`${PAYPAL_API}/v1/billing/plans/${planId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function refundPayment(captureId: string, amount?: string, currency: string = "USD") {
  const token = await getAccessToken();
  const payload = amount ? { amount: { value: amount, currency_code: currency } } : {};
  const response = await axios.post(`${PAYPAL_API}/v2/payments/captures/${captureId}/refund`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function createPayPalProduct(name: string, description: string, type: "SERVICE" | "PHYSICAL" | "DIGITAL" = "SERVICE", category: string = "SOFTWARE") {
  const token = await getAccessToken();
  const response = await axios.post(`${PAYPAL_API}/v1/catalogs/products`, { name, description, type, category }, {
    headers: { Authorization: `Bearer ${token}`, "PayPal-Request-Id": `PROD-${Date.now()}` },
  });
  return response.data;
}

export async function createPayPalPlan(productId: string, name: string, description: string, priceMonthly: string, currency: string = "USD") {
  const token = await getAccessToken();
  const response = await axios.post(`${PAYPAL_API}/v1/billing/plans`, {
    product_id: productId, name, description, status: "ACTIVE",
    billing_cycles: [{
      frequency: { interval_unit: "MONTH", interval_count: 1 },
      tenure_type: "REGULAR", sequence: 1, total_cycles: 0,
      pricing_scheme: { fixed_price: { value: priceMonthly, currency_code: currency } },
    }],
    payment_preferences: { auto_bill_outstanding: true, setup_fee_failure_action: "CONTINUE", payment_failure_threshold: 3 },
  }, {
    headers: { Authorization: `Bearer ${token}`, "PayPal-Request-Id": `PLAN-${Date.now()}` },
  });
  return response.data;
}

export async function verifyWebhookSignature(webhookId: string, headers: Record<string, any>, body: any) {
  const token = await getAccessToken();
  try {
    const response = await axios.post(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
      auth_algo: headers["paypal-auth-algo"],
      cert_url: headers["paypal-cert-url"],
      transmission_id: headers["paypal-transmission-id"],
      transmission_sig: headers["paypal-transmission-sig"],
      transmission_time: headers["paypal-transmission-time"],
      webhook_id: webhookId,
      webhook_event: body,
    }, { headers: { Authorization: `Bearer ${token}` } });
    return response.data.verification_status === "SUCCESS";
  } catch { return false; }
}

export async function deactivatePayPalPlan(planId: string) {
  const token = await getAccessToken();
  try {
    await axios.post(`${PAYPAL_API}/v1/billing/plans/${planId}/deactivate`, {}, { headers: { Authorization: `Bearer ${token}` } });
    return { success: true };
  } catch (e: any) { return { success: false, error: e.message }; }
}

export async function createAddonOrder(amount: string, currency: string = "USD", metadata?: any) {
  const token = await getAccessToken();
  const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, {
    intent: "CAPTURE",
    purchase_units: [{ amount: { currency_code: currency, value: amount }, custom_id: JSON.stringify(metadata) }],
  }, {
    headers: { Authorization: `Bearer ${token}`, "PayPal-Request-Id": `ADDON-${Date.now()}` },
  });
  return response.data;
}

export async function captureAddonOrder(orderId: string) {
  const token = await getAccessToken();
  const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
