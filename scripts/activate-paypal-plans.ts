import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const SANDBOX_API = 'https://api-m.sandbox.paypal.com';
const BASE_URL = SANDBOX_API;
const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

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
  const data = await response.json() as any;
  return data.access_token;
}

async function activatePlan(accessToken: string, planId: string) {
  const response = await fetch(`${BASE_URL}/v1/billing/plans/${planId}/activate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 204) {
      return { success: true };
  }
  const data = await response.json();
  return data;
}

async function main() {
    try {
        const token = await getAccessToken();
        const silverId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_SILVER as string;
        const goldId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_GOLD as string;
        
        console.log(`Activating Silver Plan: ${silverId}`);
        const silverRes = await activatePlan(token, silverId);
        console.log(JSON.stringify(silverRes, null, 2));
        
        console.log(`\nActivating Gold Plan: ${goldId}`);
        const goldRes = await activatePlan(token, goldId);
        console.log(JSON.stringify(goldRes, null, 2));
    } catch (e) {
        console.error(e);
    }
}

main();
