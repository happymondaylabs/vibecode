import type { Handler } from "@netlify/functions";
import Stripe from "stripe";
import { fal } from "@fal-ai/client";
import { generatePrompt } from "../../src/services/falApi";
import { sendOrderNotification } from "./send-email";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    console.log('=== STRIPE WEBHOOK ===');
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-12-18.acacia',
    });

    const sig = event.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      throw new Error("Missing webhook signature or secret");
    }

    // Verify webhook signature
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body!,
      sig,
      webhookSecret
    );

    console.log('Webhook event type:', stripeEvent.type);

    // Handle successful payment
    if (stripeEvent.type === 'payment_intent.succeeded') {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
      
      console.log('✅ Payment succeeded:', paymentIntent.id);
      console.log('Metadata:', paymentIntent.metadata);

      // Send payment success notification
      try {
        await sendOrderNotification({
          customerEmail: paymentIntent.metadata.email,
          customerName: paymentIntent.metadata.userName,
          customerAge: paymentIntent.metadata.userAge,
          themeSelected: paymentIntent.metadata.themeTitle,
          themeId: paymentIntent.metadata.themeId,
          paymentStatus: 'success',
          paymentIntentId: paymentIntent.id,
          generationStatus: 'pending',
          orderTimestamp: new Date().toISOString()
        });
      } catch (emailError) {
        console.error('❌ Failed to send payment success email:', emailError);
      }

      // Extract user data from metadata
      const { userName, userAge, themeId, themeTitle, userMessage, email } = paymentIntent.metadata;

      if (!userName || !userAge || !themeId) {
        console.error('❌ Missing required metadata in payment intent');
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing required metadata" }),
        };
      }

      // Reconstruct user data and theme for video generation
      const userData = {
        name: userName,
        age: userAge,
        message: userMessage || `Happy ${userAge}th Birthday!`
      };

      // Find theme by ID (you might want to store this in metadata or database)
      const themes = [
        { id: 'hot-fireman', title: 'HOT FIREMAN' },
        { id: 'male-model-commercial', title: 'MALE MODEL COMMERCIAL' },
        { id: 'female-model-commercial', title: 'FEMALE MODEL COMMERCIAL' },
        { id: 'bigfoot-vlog', title: 'BIGFOOT VLOG' },
        { id: 'breaking-news', title: 'BREAKING NEWS' },
        { id: 'fake-infomercial', title: 'FAKE INFOMERCIAL' },
        { id: 'jesus-of-nazareth', title: 'JESUS OF NAZARETH' },
        { id: 'fast-food-manager', title: 'FAST FOOD MANAGER' },
        { id: 'swamp-man', title: 'SWAMP MAN' }
      ];

      const theme = themes.find(t => t.id === themeId);
      if (!theme) {
        console.error('❌ Theme not found:', themeId);
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Theme not found" }),
        };
      }

      try {
        // Generate video after successful payment
        console.log('🎬 Starting video generation for paid order...');
        
        const prompt = generatePrompt(userData, theme);
        
        // Configure FAL AI
        fal.config({ credentials: process.env.FAL_KEY! });

        // Submit video generation
        const payload = {
          input: {
            prompt,
            aspect_ratio: "16:9",
            duration: "8s",
            enhance_prompt: true,
            generate_audio: true,
          },
          logs: false,
        };

        const { request_id } = await fal.queue.submit("fal-ai/veo3", payload);
        
        console.log('✅ Video generation submitted:', request_id);
        
        // Send generation success notification (if video completes immediately)
        // Note: For queue-based generation, we'll send this from a separate status check
        
        // Here you could store the request_id with the payment_intent_id in a database
        // for later retrieval when the video is complete
        
        // For now, we'll just log it
        console.log(`Payment ${paymentIntent.id} -> Video Request ${request_id}`);
        
      } catch (videoError) {
        console.error('❌ Video generation failed for payment:', paymentIntent.id, videoError);
        
        // Send generation failure notification
        try {
          await sendOrderNotification({
            customerEmail: email,
            customerName: userName,
            customerAge: userAge,
            themeSelected: themeTitle,
            themeId: themeId,
            paymentStatus: 'success',
            paymentIntentId: paymentIntent.id,
            generationStatus: 'failed',
            errorMessage: videoError instanceof Error ? videoError.message : String(videoError),
            orderTimestamp: new Date().toISOString()
          });
        } catch (emailError) {
          console.error('❌ Failed to send generation failure email:', emailError);
        }
        // Don't fail the webhook - payment was successful
        // You might want to send an email notification about the video generation failure
      }
    }

    // Handle failed payment
    if (stripeEvent.type === 'payment_intent.payment_failed') {
      const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
      console.log('❌ Payment failed:', paymentIntent.id);
      
      // Send payment failure notification
      try {
        const { userName, userAge, themeId, themeTitle, email } = paymentIntent.metadata;
        if (userName && userAge && themeId && email) {
          await sendOrderNotification({
            customerEmail: email,
            customerName: userName,
            customerAge: userAge,
            themeSelected: themeTitle || 'Unknown Theme',
            themeId: themeId,
            paymentStatus: 'failed',
            generationStatus: 'failed',
            errorMessage: 'Payment was declined or failed',
            orderTimestamp: new Date().toISOString()
          });
        }
      } catch (emailError) {
        console.error('❌ Failed to send payment failure email:', emailError);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error: any) {
    console.error("🔥 Webhook error:", error);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};