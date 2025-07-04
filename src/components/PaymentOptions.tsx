import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  const isFormValid = email.trim().length > 0 && !emailError && validateEmail(email);

  return (
    <div className="relative w-full max-w-6xl mx-auto mb-12">
      <div className="flex items-center justify-center">
        {/* Left Navigation Arrow - Disabled/Faded */}
        <div className="mr-8 p-3 rounded-full bg-black bg-opacity-10 text-gray-400">
          <ChevronLeft size={32} strokeWidth={3} />
        </div>

        {/* Main Payment Card */}
        <div className="relative bg-gray-200 rounded-lg shadow-2xl overflow-hidden p-8 flex-1 max-w-4xl" style={{ aspectRatio: '16/10' }}>
          <div className="flex h-full">
            {/* Left Side - Payment Info */}
            <div className="w-1/2 relative">
              <div className="pr-6 h-full">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-4xl font-semibold tracking-wider mb-2">VIBE CARD</h2>
                  <div className="text-lg tracking-wide">PAYMENT CHECKOUT</div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6 text-base">
                  {/* Name Field - Display Only */}
                  <div className="flex items-center">
                    <span className="font-semibold w-16">NAME:</span>
                    <span className="ml-4 font-semibold">{userData.name}</span>
                  </div>

                  {/* Age Field - Display Only */}
                  <div className="flex items-center">
                    <span className="font-semibold w-16">AGE:</span>
                    <span className="ml-4 font-semibold">{userData.age}</span>
                  </div>

                  {/* Email Field - Input */}
                  <div className="flex items-center">
                    <span className="font-semibold w-16">EMAIL:</span>
                    <div className="flex-1 ml-4">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError('');
                        }}
                        className={`w-full px-3 py-2 border-2 rounded text-sm tracking-wide transition-all duration-200 focus:outline-none ${
                          emailError 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-400 focus:border-black bg-white'
                        }`}
                        placeholder="ENTER EMAIL"
                      />
                      {emailError && (
                        <span className="text-xs text-red-600 font-semibold mt-1 block">{emailError}</span>
                      )}
                    </div>
                  </div>

                  {/* Price Field */}
                  <div className="flex items-center">
                    <span className="font-semibold w-16">PRICE:</span>
                    <span className="ml-4 text-2xl font-semibold">$10.00</span>
                  </div>

                  {/* Type Field */}
                  <div className="flex items-center">
                    <span className="font-semibold w-16">TYPE:</span>
                    <span className="ml-4">ONE-TIME PAYMENT</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Dotted Divider */}
            <div className="flex items-center justify-center">
              <div className="w-px h-full border-l-2 border-dashed border-black"></div>
            </div>

            {/* Right Side - Payment Details */}
            <div className="w-1/2 relative pl-6">
              {/* Payment Summary Box */}
              <div className="w-full bg-black text-white rounded border-2 border-black overflow-hidden p-6 mb-4" style={{ aspectRatio: '16/9' }}>
                <div className="text-center h-full flex flex-col justify-center">
                  <h3 className="text-3xl font-semibold mb-4">$10</h3>
                  <p className="text-lg font-semibold uppercase tracking-wide mb-2">ONE-TIME FEE</p>
                  <p className="text-sm opacity-80">COMPLETE ACCESS TO YOUR VIBE CARD</p>
                </div>
              </div>
              
              {/* What's Included */}
              <div className="mb-4">
                <h4 className="font-semibold text-sm tracking-wide mb-3 text-gray-700 uppercase">
                  WHAT'S INCLUDED:
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
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
              
              <div className="text-center text-sm text-gray-600">SECURE STRIPE PAYMENT</div>
            </div>
          </div>

          {/* HP Logo and Symbols */}
          <div className="absolute bottom-6 left-8">
            <div className="flex items-center space-x-3">
              <div className="bg-black text-white px-3 py-2 font-semibold text-sm">HP</div>
              <div className="flex space-x-2">
                <div className="w-5 h-5 border border-black rounded-full flex items-center justify-center text-xs">©</div>
                <div className="w-5 h-5 border border-black rounded-full flex items-center justify-center text-xs">CE</div>
                <div className="w-5 h-5 border border-black rounded-full flex items-center justify-center text-xs">⚡</div>
                <div className="w-5 h-5 border border-black rounded-full flex items-center justify-center text-xs">♻</div>
              </div>
            </div>
          </div>

          {/* Payment Button - Lower Right */}
          <div className="absolute bottom-6 right-6 pl-6" style={{ width: 'calc(50% - 24px)' }}>
            <button 
              onClick={handlePayment}
              disabled={!isFormValid || processing}
              className={`w-full px-6 py-3 font-semibold text-sm tracking-wider transition-all duration-200 ${
                isFormValid && !processing
                  ? 'bg-black text-white hover:text-orange-400 cursor-pointer'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  PROCESSING...
                </div>
              ) : (
                'PAY & GENERATE VIDEO'
              )}
            </button>
          </div>
        </div>

        {/* Right Navigation Arrow - Disabled/Faded */}
        <div className="ml-8 p-3 rounded-full bg-black bg-opacity-10 text-gray-400">
          <ChevronRight size={32} strokeWidth={3} />
        </div>
      </div>

      {/* Progress Indicator - Single dot to show we're on payment step */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-sm bg-white border border-gray-300" />
          <div className="w-4 h-4 rounded-sm bg-black border-black shadow-sm" />
          <div className="w-4 h-4 rounded-sm bg-white border border-gray-300" />
        </div>
      </div>
    </div>
  );
}