import React, { useState } from 'react';
import { CreditCard, Zap } from 'lucide-react';

interface PaymentOptionsProps {
  onPaymentComplete: () => void;
}

export function PaymentOptions({ onPaymentComplete }: PaymentOptionsProps) {
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
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
        <h3 className="text-2xl font-black uppercase tracking-wider text-center mb-8">
          DOWNLOAD YOUR VIBE CARD
        </h3>

        {/* One-Time Payment Option */}
        <div className="mb-8">
          <div className="p-6 border-2 border-black bg-gray-50 rounded-lg">
            <div className="text-center">
              <h4 className="text-3xl font-black mb-2">$10</h4>
              <p className="text-lg font-bold uppercase tracking-wide mb-2">ONE-TIME FEE</p>
              <p className="text-sm text-gray-600 uppercase">Complete access to your VIBE CARD</p>
            </div>
          </div>
        </div>

        {/* What's Included */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold uppercase text-sm tracking-wide mb-3 text-gray-700">
            WHAT'S INCLUDED:
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              MP4 READY DOWNLOAD
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              100% CUSTOM VIDEO
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-black rounded-full mr-3"></span>
              BETTER THAN PAPER CARDS
            </li>
          </ul>
        </div>

        {/* Payment Features */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-bold uppercase text-sm tracking-wide mb-3 text-gray-700">
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
          className="w-full py-4 bg-black text-white rounded-lg font-black text-lg uppercase tracking-wider hover:text-orange-400 transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:text-white"
        >
          {processing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              PROCESSING...
            </div>
          ) : (
            'DOWNLOAD AND PAY'
          )}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4 uppercase tracking-wide">
          One-time payment • No recurring charges
        </p>
      </div>
    </div>
  );
}