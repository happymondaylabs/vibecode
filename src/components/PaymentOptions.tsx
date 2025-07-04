import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CreditCard, Lock } from 'lucide-react';
import { UserData } from '../types';

interface PaymentOptionsProps {
  userData: UserData;
  onPaymentComplete: () => void;
}

export function PaymentOptions({ userData, onPaymentComplete }: PaymentOptionsProps) {
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Mock card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleContinueToPayment = () => {
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
    setShowPaymentForm(true);
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete();
    }, 2000);
  };

  const isEmailValid = email.trim().length > 0 && !emailError && validateEmail(email);
  const isCardValid = cardNumber.length >= 16 && expiryDate.length >= 5 && cvv.length >= 3 && cardName.length > 0;

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
                        disabled={showPaymentForm}
                        className={`w-full px-3 py-2 border-2 rounded text-sm tracking-wide transition-all duration-200 focus:outline-none ${
                          emailError 
                            ? 'border-red-500 bg-red-50' 
                            : showPaymentForm
                            ? 'border-gray-300 bg-gray-100 text-gray-600'
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

            {/* Right Side - Payment Details or Card Form */}
            <div className="w-1/2 relative pl-6">
              {!showPaymentForm ? (
                <>
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
                </>
              ) : (
                <>
                  {/* Credit Card Form */}
                  <div className="w-full bg-white border-2 border-black rounded p-4 mb-4">
                    <div className="flex items-center mb-4">
                      <Lock size={16} className="mr-2" />
                      <h4 className="font-semibold text-sm uppercase tracking-wide">SECURE PAYMENT</h4>
                    </div>
                    
                    <div className="space-y-3">
                      {/* Card Number */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1">
                          CARD NUMBER
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                          placeholder="1234 5678 9012 3456"
                          maxLength={16}
                        />
                      </div>
                      
                      {/* Expiry and CVV */}
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1">
                            EXPIRY
                          </label>
                          <input
                            type="text"
                            value={expiryDate}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setExpiryDate(value);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                            placeholder="123"
                            maxLength={3}
                          />
                        </div>
                      </div>
                      
                      {/* Cardholder Name */}
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1">
                          CARDHOLDER NAME
                        </label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black"
                          placeholder="JOHN DOE"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Security Info */}
                  <div className="text-xs text-gray-600 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CreditCard size={14} className="mr-2" />
                      <span>POWERED BY STRIPE</span>
                    </div>
                    <p>Your payment information is encrypted and secure</p>
                  </div>
                </>
              )}
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

          {/* Action Button - Lower Right */}
          <div className="absolute bottom-6 right-6 pl-6" style={{ width: 'calc(50% - 24px)' }}>
            {!showPaymentForm ? (
              <button 
                onClick={handleContinueToPayment}
                disabled={!isEmailValid}
                className={`w-full px-6 py-3 font-semibold text-sm tracking-wider transition-all duration-200 ${
                  isEmailValid
                    ? 'bg-black text-white hover:text-orange-400 cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              >
                CONTINUE TO PAYMENT
              </button>
            ) : (
              <button 
                onClick={handlePayment}
                disabled={!isCardValid || processing}
                className={`w-full px-6 py-3 font-semibold text-sm tracking-wider transition-all duration-200 ${
                  isCardValid && !processing
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
            )}
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