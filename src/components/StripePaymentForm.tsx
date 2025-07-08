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
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* Secure Payment Header */}
      <div className="flex items-center mb-3">
        <Lock size={14} className="mr-2" />
        <h4 className="font-technical font-semibold text-sm uppercase tracking-wide">SECURE PAYMENT</h4>
      </div>

      {/* Card Element */}
      <div className="bg-white border-2 border-gray-300 rounded p-3 focus-within:border-black transition-colors">
        <CardElement
          options={cardElementOptions}
          onChange={handleCardChange}
        />
      </div>

      {/* Card Error */}
      {cardError && (
        <div className="text-red-600 text-xs font-technical font-semibold">
          {cardError}
        </div>
      )}

      {/* Security Info */}
      <div className="text-xs font-technical text-gray-600 text-center">
        <div className="flex items-center justify-center mb-1">
          <CreditCard size={12} className="mr-1" />
          <span>POWERED BY STRIPE</span>
        </div>
        <p style={{ fontSize: '10px' }}>Your payment information is encrypted and secure</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || !cardComplete || processing}
        className={`w-full px-4 py-2 font-technical font-semibold text-xs tracking-wider transition-all duration-200 ${
          stripe && cardComplete && !processing
            ? 'bg-black text-white cursor-pointer'
            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
        }`}
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
            <Loader2 size={14} className="animate-spin mr-2" />
            PROCESSING...
          </div>
        ) : (
          'PAY AND DOWNLOAD VIBE CARD'
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