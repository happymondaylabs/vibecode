import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Lock, Loader2 } from 'lucide-react';
import { getStripe, createPaymentIntent, processPayment } from '../services/stripeService';
import { UserData, Theme } from '../types';

interface StripePaymentFormProps {
  userData: UserData;
  theme: Theme;
  email: string;
  onPaymentSuccess: () => void;
  onPaymentError: (error: string) => void;
  themeColor: string;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '14px',
      color: '#000',
      fontFamily: 'Outfit, system-ui, sans-serif',
      fontWeight: '500',
      '::placeholder': {
        color: '#666',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
  hidePostalCode: false,
};

function PaymentForm({ userData, theme, email, onPaymentSuccess, onPaymentError, themeColor }: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!stripe || !elements) {
      onPaymentError('Stripe has not loaded yet. Please try again.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      onPaymentError('Card element not found. Please refresh and try again.');
      return;
    }

    if (!cardComplete) {
      onPaymentError('Please complete your card information.');
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent({
        email,
        userData,
        theme,
      });

      // Process payment
      const result = await processPayment(
        clientSecret,
        cardElement,
        {
          name: userData.name,
          email: email,
        }
      );

      console.log('✅ Payment completed:', result?.id || 'success');
      onPaymentSuccess();
    } catch (error: any) {
      console.error('❌ Payment error:', error);
      onPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCardChange = (event: any) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 md:space-y-4" noValidate>
      {/* Secure Payment Header */}
      <div className="flex items-center mb-1 md:mb-2">
        <Lock size={10} className="mr-1 md:w-3 md:h-3" />
        <h4 className="font-technical font-semibold uppercase tracking-wide" style={{ fontSize: 'clamp(9px, 2vw, 10px)' }}>SECURE PAYMENT</h4>
      </div>

      {/* Card Element */}
      <div className="bg-white border-2 border-gray-300 rounded p-1.5 md:p-2 focus-within:border-black transition-colors">
        <CardElement
          options={cardElementOptions}
          onChange={handleCardChange}
        />
      </div>

      {/* Card Error */}
      {cardError && (
        <div className="text-red-600 font-technical font-semibold" style={{ fontSize: 'clamp(9px, 2vw, 10px)' }}>
          {cardError}
        </div>
      )}

      {/* Security Info */}
      <div className="font-technical text-gray-600 text-center" style={{ fontSize: 'clamp(9px, 2vw, 10px)' }}>
        <div className="flex items-center justify-center mb-0.5">
          <CreditCard size={9} className="mr-1 md:w-2.5 md:h-2.5" />
          <span>POWERED BY STRIPE</span>
        </div>
        <p style={{ fontSize: 'clamp(8px, 1.8vw, 9px)' }}>Your payment information is encrypted and secure</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !cardComplete || processing}
        className={`w-full px-3 py-2 md:py-1.5 font-primary text-uppercase tracking-wider transition-all duration-200 ${
          stripe && cardComplete && !processing
            ? 'bg-black text-white cursor-pointer'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
        }`}
        style={{ fontSize: 'clamp(10px, 2.5vw, 12px)' }}
        onMouseEnter={(e) => {
          if (stripe && cardComplete && !processing) {
            e.currentTarget.style.color = themeColor;
          }
        }}
        onMouseLeave={(e) => {
          if (stripe && cardComplete && !processing) {
            e.currentTarget.style.color = 'white';
          }
        }}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <Loader2 size={12} className="animate-spin mr-1" />
            <span style={{ fontSize: 'clamp(10px, 2.5vw, 12px)' }}>Processing...</span>
          </div>
        ) : (
          'SUBMIT ORDER'
        )}
      </button>
    </form>
  );
}

export function StripePaymentForm(props: StripePaymentFormProps) {
  const stripePromise = getStripe();

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}