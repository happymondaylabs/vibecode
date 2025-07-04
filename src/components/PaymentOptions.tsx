import React, { useState } from 'react';
import { CreditCard, Zap } from 'lucide-react';
import { UserData } from '../types';

interface PaymentOptionsProps {
  userData: UserData;
  onPaymentComplete: () => void;
}

export function PaymentOptions({ userData, onPaymentComplete }: PaymentOptionsProps) {
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePayment = async () => {
    // Validate email first
    if (!email.trim()) {
      setEmailError('EMAIL IS REQUIRED');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('INVALID EMAIL FORMAT');
      return;
    }

    setEmailError('');
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h3 className="text-2xl font-semibold uppercase tracking-wider text-center mb-8">
          COMPLETE YOUR ORDER
        </h3>
        <p className="text-center text-gray-600 mb-8 uppercase text-sm tracking-wide">
          Your vibe card for {userData.name} will be generated after payment
        </p>

        {/* Email Field */}
        <div className="mb-6">
          <label className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-2">
            EMAIL ADDRESS
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
              emailError 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 focus:border-black bg-white'
            }`}
            placeholder="ENTER YOUR EMAIL"
          />
          {emailError && (
            <span className="text-xs text-red-600 font-semibold mt-1 block">{emailError}</span>
          )}
        </div>

        {/* One-Time Payment Option */}
        <div className="mb-8">
          <div className="p-6 border-2 border-black bg-gray-50 rounded-lg">
            <div className="text-center">
              <h4 className="text-3xl font-semibold mb-2">$10</h4>
              <p className="text-lg font-semibold uppercase tracking-wide mb-2">ONE-TIME FEE</p>
              <p className="text-sm text-gray-600 uppercase">Complete access to your VIBE CARD</p>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold uppercase text-sm tracking-wide mb-3 text-gray-700">
            WHAT'S INCLUDED:
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              CUSTOM VIDEO GENERATED
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              MP4 DOWNLOAD READY
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              EMAIL DELIVERY INCLUDED
            </li>
          </ul>
        </div>

        {/* Payment Features */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold uppercase text-sm tracking-wide mb-3 text-gray-700">
            SECURE PAYMENT:
          </h4>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center">
              <CreditCard size={16} className="mr-2" />
              STRIPE SECURE
            </div>
            <div className="flex items-center">
              <Zap size={16} className="mr-2" />
              INSTANT ACCESS
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <button
          onClick={handlePayment}
          disabled={processing}
          className="w-full py-4 bg-black text-white rounded-lg font-semibold text-lg uppercase tracking-wider hover:text-orange-400 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:text-white"
        >
          {processing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              PROCESSING...
            </div>
          ) : (
            'PAY & GENERATE VIDEO'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4 uppercase tracking-wide">
          One-time payment • Video generated after payment • No recurring charges
        </p>
      </div>
    </div>
  );
}