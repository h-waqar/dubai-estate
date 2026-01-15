import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SANDBOX_API = 'https://api-m.sandbox.paypal.com';
const LIVE_API = 'https://api-m.paypal.com';

// Credentials from docs/paypal.md
const CREDENTIALS = {
  sandbox: {
    clientId: "AbOyU1M4_d90tZeH3tmQ_4btTGiflXVFVMZuN630yJ5utSDroBud3T6U0fnwkWlFkV12JjMaKRiwF-fx",
    clientSecret: "ENTmdHw7_QP0xx_CG0QZgLcHbL53RdhP3YrwxEVFhHoSqjhdiN89IAPRY_oEi2rSvCHF9Y0PvU7LifrZ"
  },
  live: {
    clientId: "AaIDvBjiZ6cGsQjPol3h6sDv7aPIKGCmDRuK8mLk6DB-utsPNFX1l-K-NRu0kVqPAzQ44GLuQECMHtD7",
    clientSecret: "EI1wcccXrLXik8BQPg2sTlrArni-GL42CnodTTyPdNi-ttuNr3xjf822xS-yl1SdxR0nQaKhX7O2HwXC"
  }
};

// Toggle this to switch
const IS_SANDBOX = true; 
const BASE_URL = IS_SANDBOX ? SANDBOX_API : LIVE_API;
const CLIENT_ID = IS_SANDBOX ? CREDENTIALS.sandbox.clientId : CREDENTIALS.live.clientId;
const CLIENT_SECRET = IS_SANDBOX ? CREDENTIALS.sandbox.clientSecret : CREDENTIALS.live.clientSecret;

async function getAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  const data = await response.json();
  return data.access_token;
}

async function createProduct(accessToken: string) {
  const response = await fetch(`${BASE_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      name: 'DubaiEstateGuide Subscription',
      description: 'Monthly subscription for property listing',
      type: 'SERVICE',
      category: 'SOFTWARE',
    }),
  });
  const data = await response.json();
  if (!data.id) {
    console.error('Failed to create Product:', JSON.stringify(data, null, 2));
  } else {
    console.log('Product Created:', data.id);
  }
  return data.id;
}

async function createPlan(accessToken: string, productId: string, name: string, price: string) {
  const response = await fetch(`${BASE_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      product_id: productId,
      name: name,
      description: `Monthly subscription for ${name}`,
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // Infinite
          pricing_scheme: {
            fixed_price: {
              value: price,
              currency_code: 'USD'
            }
          }
        }
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD'
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3
      },
    }),
  });
  const data = await response.json();
  if (!data.id) {
    console.error(`Failed to create Plan (${name}):`, JSON.stringify(data, null, 2));
  } else {
    console.log(`Plan Created (${name}):`, data.id);
  }
  return data.id;
}

async function main() {
  try {
    console.log(`Initializing PayPal Plans (${IS_SANDBOX ? 'SANDBOX' : 'LIVE'})...`);
    const token = await getAccessToken();
    
    // 1. Create Product
    const productId = await createProduct(token);
    
    // 2. Create Plans
    const silverPlanId = await createPlan(token, productId, 'Silver Package', '10');
    const goldPlanId = await createPlan(token, productId, 'Gold Package', '25');

    console.log('\n--- SUCCESS! Add these to your .env file ---');
    console.log(`NEXT_PUBLIC_PAYPAL_CLIENT_ID="${CLIENT_ID}"`);
    console.log(`PAYPAL_CLIENT_SECRET="${CLIENT_SECRET}"`);
    console.log(`NEXT_PUBLIC_PAYPAL_SANDBOX="${IS_SANDBOX}"`);
    console.log(`NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER="${silverPlanId}"`);
    console.log(`NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD="${goldPlanId}"`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

main();
