import 'dotenv/config';
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);
console.log("NEXT_PUBLIC_PAYPAL_CLIENT_ID present:", !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID);
console.log("PAYPAL_CLIENT_SECRET present:", !!process.env.PAYPAL_CLIENT_SECRET);
console.log("NEXT_PUBLIC_PAYPAL_SANDBOX:", process.env.NEXT_PUBLIC_PAYPAL_SANDBOX);
