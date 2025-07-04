import React, { useState } from 'react';
import { CreditCard, Lock } from 'lucide-react';
import { UserData } from '../types';

interface PaymentOptionsProps {
  userData: UserData;
  onPaymentComplete: () => void;
}

export function PaymentOptions({ userData, onPaymentComplete }: PaymentOptionsProps) {
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  // Mock card form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');

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

  const isEmailValid = email.trim().length > 0 && !emailError && validateEmail(email);
  const isCardValid = cardNumber.length >= 16 && expiryDate.length >= 5 && cvv.length >= 3 && cardName.length > 0;
  const isFormValid = isEmailValid && isCardValid;

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-8 px-4">
      <div className="flex items-center justify-center">
        {/* Main Payment Card */}
        <div className="relative bg-gray-200 rounded-lg shadow-2xl overflow-hidden p-6 flex-1 w-full" style={{ aspectRatio: '16/9' }}>
          <div className="flex h-full">
            {/* Left Side - Payment Info */}
            <div className="w-1/2 relative">
              <div className="pr-4 h-full flex flex-col">
                {/* Header */}
                <div className="mb-3">
                  <h2 className="text-3xl font-semibold tracking-wider mb-1">VIBE CARD</h2>
                  <div className="text-base tracking-wide">PAYMENT CHECKOUT</div>
                </div>

                {/* Form Fields */}
                <div className="space-y-2 text-sm flex-1">
                  {/* Name Field - Display Only */}
                  <div className="flex items-center">
                    <span className="font-semibold w-14 text-xs">NAME:</span>
                    <span className="ml-4 font-semibold">{userData.name}</span>
                  </div>

                  {/* Age Field - Display Only */}
                  <div className="flex items-center">
                    <span className="font-semibold w-14 text-xs">AGE:</span>
                    <span className="ml-4 font-semibold">{userData.age}</span>
                  </div>

                  {/* Price Field */}
                  <div className="flex items-center">
                    <span className="font-semibold w-14 text-xs">PRICE:</span>
                    <span className="ml-4 text-lg font-semibold">$10.00</span>
                  </div>

                  {/* Type Field */}
                  <div className="flex items-center">
                    <span className="font-semibold w-14 text-xs">TYPE:</span>
                    <span className="ml-4">ONE-TIME PAYMENT</span>
                  </div>

                  {/* What's Included - Moved from right side */}
                  <div className="mt-3">
                    <h4 className="font-semibold text-xs tracking-wide mb-2 text-gray-700 uppercase">
                      WHAT'S INCLUDED:
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                        CUSTOM VIDEO GENERATED
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                        MP4 DOWNLOAD READY
                      </li>
                      <li className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                        EMAIL DELIVERY INCLUDED
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Dotted Divider */}
            <div className="flex items-center justify-center">
              <div className="w-px h-full border-l-2 border-dashed border-black"></div>
            </div>

            {/* Right Side - Credit Card Form */}
            <div className="w-1/2 relative pl-4">
              {/* Credit Card Form */}
              <div className="w-full bg-white border-2 border-black rounded p-2 mb-2">
                <div className="flex items-center mb-2">
                  <Lock size={14} className="mr-2" />
                  <h4 className="font-semibold text-xs uppercase tracking-wide">SECURE PAYMENT</h4>
                </div>
                
                <div className="space-y-1.5">
                  {/* Card Number */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-0.5">
                      CARD NUMBER
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        // Add spaces every 4 digits for display
                        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setCardNumber(value.slice(0, 19)); // Max 16 digits + 3 spaces
                      }}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  {/* Expiry and CVV */}
                  <div className="flex space-x-1.5">
                    <div className="flex-1">
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-0.5">
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
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-0.5">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                  
                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-0.5">
                      CARDHOLDER NAME
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:border-black"
                      placeholder="JOHN DOE"
                    />
                  </div>
                </div>
              </div>
              
              {/* Email Field - Moved from left side */}
              <div className="mb-2">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-0.5">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  className={`w-full px-2 py-1.5 border-2 rounded text-xs tracking-wide transition-all duration-200 focus:outline-none ${
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
              
              {/* Security Info */}
              <div className="text-xs text-gray-600 text-center mt-1">
                <div className="flex items-center justify-center mb-1">
                  <CreditCard size={10} className="mr-1" />
                  <span>POWERED BY STRIPE</span>
                </div>
                <p className="text-xs">Encrypted and secure</p>
              </div>
            </div>
          </div>

          {/* HP Logo and Symbols */}
          <div className="absolute bottom-4 left-6">
            <div className="flex items-center space-x-3">
              <div className="bg-black text-white px-2 py-1 font-semibold text-xs">HP</div>
              <div className="flex space-x-2">
                <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">©</div>
                <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">CE</div>
                <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">⚡</div>
                <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">♻</div>
              </div>
            </div>
          </div>

          {/* Payment Button - Lower Right */}
          <div className="absolute bottom-4 right-6 pl-4" style={{ width: 'calc(50% - 24px)' }}>
            <button 
              onClick={handlePayment}
              disabled={!isFormValid || processing}
              className={`w-full px-4 py-2 font-semibold text-xs tracking-wider transition-all duration-200 ${
                isFormValid && !processing
                  ? 'bg-black text-white hover:text-orange-400 cursor-pointer'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                  PROCESSING...
                </div>
              ) : (
                'PAY & GENERATE VIDEO'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator - Single dot to show we're on payment step */}
      <div className="flex justify-center mt-4">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 rounded-sm bg-white border border-gray-300" />
          <div className="w-3 h-3 rounded-sm bg-black border-black shadow-sm" />
          <div className="w-3 h-3 rounded-sm bg-white border border-gray-300" />
        </div>
      </div>
    </div>
  );
}