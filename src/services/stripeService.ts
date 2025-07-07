import { loadStripe } from '@stripe/stripe-js';
import { UserData, Theme } from '../types';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

export interface PaymentRequest {
  email: string;
  userData: UserData;
  theme: Theme;
}

export interface PaymentResponse {
  clientSecret: string;
  paymentIntentId: string;
}

// Create payment intent
export async function createPaymentIntent(request: PaymentRequest): Promise<PaymentResponse> {
  try {
    console.log('🔄 Creating payment intent...');
    
    const response = await fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Payment intent created');
    
    return result;
  } catch (err: any) {
    console.error("❌ Payment intent creation error:", err);
    throw err instanceof Error ? err : new Error(String(err));
  }
}

// Get Stripe instance
export async function getStripe() {
  return await stripePromise;
}

// Process payment
export async function processPayment(
  clientSecret: string,
  paymentMethod: any,
  billingDetails: any
) {
  try {
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    console.log('🔄 Processing payment...');

    const { error, paymentIntent } = await stripe.confirmPayment({
      clientSecret,
      confirmParams: {
        payment_method_data: {
          type: 'card',
          card: paymentMethod,
          billing_details: billingDetails,
        },
      },
      redirect: 'if_required',
    });

    if (error) {
      console.error('❌ Payment failed:', error);
      throw new Error(error.message || 'Payment failed');
    }

    if (paymentIntent?.status === 'succeeded') {
      console.log('✅ Payment succeeded:', paymentIntent.id);
      return paymentIntent;
    } else {
      throw new Error('Payment was not completed successfully');
    }
  } catch (err: any) {
    console.error("❌ Payment processing error:", err);
    throw err instanceof Error ? err : new Error(String(err));
  }
}