import type { Handler } from "@netlify/functions";
import Stripe from "stripe";

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    console.log('=== CREATE PAYMENT INTENT ===');
    
    if (!event.body) {
      throw new Error("Request body is required");
    }

    const { email, userData, theme } = JSON.parse(event.body);

    if (!email || !userData || !theme) {
      throw new Error("Missing required fields: email, userData, or theme");
    }

    console.log('Payment request for:', {
      email,
      userName: userData.name,
      userAge: userData.age,
      themeTitle: theme.title
    });

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia',
    });

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1200, // $12.00 in cents
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        email,
        userName: userData.name,
        userAge: userData.age,
        themeId: theme.id,
        themeTitle: theme.title,
        userMessage: userData.message || `Happy ${userData.age}th Birthday!`,
      },
      description: `VIBE CARD - ${theme.title} for ${userData.name}`,
      receipt_email: email,
    });

    console.log('✅ Payment intent created:', paymentIntent.id);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      }),
    };
  } catch (error: any) {
    console.error("🔥 Create payment intent error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};