import React, { useState } from 'react';
import { StripePaymentForm } from './StripePaymentForm';
import { UserData } from '../types';

interface PaymentOptionsProps {
  userData: UserData;
  onPaymentComplete: () => void;
  themeColor: string;
}

export function PaymentOptions({ userData, onPaymentComplete, themeColor }: PaymentOptionsProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [paymentError, setPaymentError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handlePaymentSuccess = () => {
    onPaymentComplete();
  };

  const handlePaymentError = (error: string) => {
    setPaymentError(error);
  };

  const isEmailValid = email.trim().length > 0 && validateEmail(email);

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-8 md:mb-12">
      {/* Mobile Layout */}
      <div className="md:hidden">
        <div className="bg-gray-200 rounded-lg shadow-2xl overflow-hidden p-4 mb-4">
          {/* Mobile Header */}
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold tracking-wider mb-1">VIBE CARD</h2>
            <div className="text-sm tracking-wide">PAYMENT CHECKOUT</div>
          </div>

          {/* Mobile Order Summary */}
          <div className="bg-white p-4 rounded border mb-4">
            <h4 className="font-semibold text-sm tracking-wide mb-3 text-gray-700 uppercase">
              ORDER SUMMARY:
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="font-semibold block text-xs">NAME:</span>
                <span className="font-semibold">{userData.name}</span>
              </div>
              <div>
                <span className="font-semibold block text-xs">AGE:</span>
                <span className="font-semibold">{userData.age}</span>
              </div>
              <div>
                <span className="font-semibold block text-xs">PRICE:</span>
                <span className="text-lg font-semibold">$12.00</span>
              </div>
              <div>
                <span className="font-semibold block text-xs">TYPE:</span>
                <span className="text-xs">ONE-TIME</span>
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-4">
              <h4 className="font-semibold text-xs tracking-wide mb-2 text-gray-700 uppercase">
                WHAT'S INCLUDED:
              </h4>
              <ul className="space-y-1 text-xs text-gray-700">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                  CUSTOM VIDEO VIBE CARD
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                  MP4 DOWNLOAD READY
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                  SHARABLE LINK
                </li>
              </ul>
            </div>

            {/* Important Notes */}
            <div className="border-t pt-3">
              <h4 className="font-semibold text-xs tracking-wide mb-1 text-gray-700 uppercase">
                IMPORTANT:
              </h4>
              <ul className="space-y-0.5 text-xs text-gray-700">
                <li>• NO REFUNDS</li>
                <li>• QUESTIONS? EMAIL INFO@YOUGENIUS.CO</li>
                <li>• VIDEO DELIVERED TO EMAIL WITHIN 24 HOURS</li>
              </ul>
            </div>
          </div>

          {/* Mobile Payment Form */}
          <div className="space-y-4 mb-4">            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold uppercase tracking-wide text-gray-700 mb-2">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                  setPaymentError('');
                }}
                className={`w-full px-3 py-2 border-2 rounded text-sm tracking-wide transition-all duration-200 focus:outline-none ${
                  emailError 
                    ? 'border-red-500 bg-red-50' 
                    : 'border-gray-300 bg-white'
                }`}
                onFocus={(e) => e.target.style.borderColor = themeColor}
                onBlur={(e) => e.target.style.borderColor = emailError ? '#ef4444' : '#d1d5db'}
                placeholder="ENTER YOUR EMAIL"
              />
              {emailError && (
                <span className="text-xs text-red-600 font-semibold mt-1 block">{emailError}</span>
              )}
              <p className="text-xs text-gray-600 mt-1">Your video will be delivered to this email</p>
            </div>
            
            {/* Payment Form */}
            {isEmailValid ? (
              <div className="bg-white border-2 border-black rounded p-3">
                <StripePaymentForm
                  userData={userData}
                  theme={{ id: 'custom', title: 'Custom Video' } as any}
                  email={email}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                  themeColor={themeColor}
                />
              </div>
            ) : (
              <div className="bg-gray-100 border-2 border-gray-300 rounded p-4 text-center">
                <p className="text-sm text-gray-600 font-semibold">
                  ENTER VALID EMAIL TO CONTINUE
                </p>
              </div>
            )}
            
            {/* Payment Error */}
            {paymentError && (
              <div className="text-red-600 text-xs font-semibold bg-red-50 p-3 rounded border border-red-200">
                {paymentError}
              </div>
            )}
          </div>

          {/* Mobile HP Logo */}
          <div className="flex justify-center mt-4">
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
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-center">
        {/* Main Payment Card */}
        <div className="relative bg-gray-200 rounded-lg shadow-2xl overflow-hidden p-6 w-full max-w-4xl" style={{ aspectRatio: '16/10' }}>
          <div className="flex h-full">
            {/* Left Side - Order Summary */}
            <div className="w-1/2 relative">
              <div className="pr-4 h-full flex flex-col">
                {/* Header */}
                <div className="mb-3">
                  <h2 className="text-3xl font-semibold tracking-wider mb-1">VIBE CARD</h2>
                  <div className="text-base tracking-wide">PAYMENT CHECKOUT</div>
                </div>

                {/* Order Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center">
                    <span className="font-semibold w-14 text-xs">NAME:</span>
                    <span className="ml-4 font-semibold">{userData.name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-14 text-xs">AGE:</span>
                    <span className="ml-4 font-semibold">{userData.age}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-14 text-xs">PRICE:</span>
                    <span className="ml-4 text-lg font-semibold">$12.00</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-semibold w-14 text-xs">TYPE:</span>
                    <span className="ml-4 text-xs">ONE-TIME PAYMENT</span>
                  </div>
                </div>

                {/* What's Included */}
                <div className="mb-4">
                  <h4 className="font-semibold text-xs tracking-wide mb-2 text-gray-700 uppercase">
                    WHAT'S INCLUDED:
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                      CUSTOM VIDEO VIBE CARD
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                      MP4 DOWNLOAD READY
                    </li>
                    <li className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-black rounded-full mr-2"></span>
                      SHARABLE LINK
                    </li>
                  </ul>
                </div>
                
                {/* Important Notes */}
                <div className="mt-auto">
                  <h4 className="font-semibold text-xs tracking-wide mb-1 text-gray-700 uppercase">
                    IMPORTANT:
                  </h4>
                  <ul className="space-y-0.5 text-xs text-gray-700">
                    <li>• NO REFUNDS</li>
                    <li>• QUESTIONS? EMAIL INFO@YOUGENIUS.CO</li>
                    <li>• VIDEO DELIVERED WITHIN 24 HOURS</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Center Dotted Divider */}
            <div className="flex items-center justify-center">
              <div className="w-px h-full border-l-2 border-dashed border-black"></div>
            </div>

            {/* Right Side - Email & Payment Form */}
            <div className="w-1/2 relative pl-4 flex flex-col">
              {/* Email Field */}
              <div className="mb-3">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-700 mb-1" style={{ fontSize: '10px' }}>
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                    setPaymentError('');
                  }}
                  className={`w-full px-2 py-1.5 border-2 rounded text-xs tracking-wide transition-all duration-200 focus:outline-none ${
                    emailError 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-white'
                  }`}
                  onFocus={(e) => e.target.style.borderColor = themeColor}
                  onBlur={(e) => e.target.style.borderColor = emailError ? '#ef4444' : '#d1d5db'}
                  placeholder="ENTER YOUR EMAIL"
                />
                {emailError && (
                  <span className="text-xs text-red-600 font-semibold mt-1 block">{emailError}</span>
                )}
                <p className="text-xs text-gray-600 mt-1">Video will be delivered to this email</p>
              </div>
              
              {/* Payment Form */}
              <div className="flex-1">
                {isEmailValid ? (
                  <div className="w-full bg-white border-2 border-black rounded p-2">
                    <StripePaymentForm
                      userData={userData}
                      theme={{ id: 'custom', title: 'Custom Video' } as any}
                      email={email}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      themeColor={themeColor}
                    />
                  </div>
                ) : (
                  <div className="w-full bg-gray-100 border-2 border-gray-300 rounded p-4 flex items-center justify-center">
                    <p className="text-xs text-gray-600 font-semibold text-center">
                      ENTER VALID EMAIL<br />TO CONTINUE
                    </p>
                  </div>
                )}
              </div>
              
              {/* Payment Error */}
              {paymentError && (
                <div className="text-red-600 text-xs font-semibold bg-red-50 p-2 rounded mt-2 border border-red-200">
                  {paymentError}
                </div>
              )}
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
        </div>
      </div>

      {/* Progress Indicator - Single dot to show we're on payment step */}
      <div className="flex justify-center mt-4 md:mt-6">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 rounded-sm bg-white border border-black" />
          <div 
            className="w-4 h-4 rounded-sm border border-black shadow-sm" 
            style={{ backgroundColor: themeColor }}
          />
          <div className="w-4 h-4 rounded-sm bg-white border border-black" />
        </div>
      </div>
    </div>
  );
}