import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { StripePaymentForm } from './StripePaymentForm';
import { UserData } from '../types';

interface PaymentOptionsProps {
  userData: UserData;
  onPaymentComplete: () => void;
  onGoBack: () => void;
  themeColor: string;
}

export function PaymentOptions({ userData, onPaymentComplete, onGoBack, themeColor }: PaymentOptionsProps) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(true);

  // Check for developer bypass
  const isDevBypass =
    userData.name.toLowerCase() === "monday" && userData.age === "32";

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailSubmit = () => {
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
    setPaymentError('');
    setShowPaymentForm(true);

    // If developer bypass is active, skip payment
    if (isDevBypass) {
      console.log('🛠 DEVELOPER BYPASS: Skipping payment, proceeding to test video generation');
      console.log(`Magic combo detected: ${userData.name} + ${userData.age}`);
      handlePaymentSuccess();
      return;
    }
  };

  const handlePaymentSuccess = () => {
    console.log('Payment completed successfully');
    onPaymentComplete();
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error received:', error);
    setPaymentError(error);
    setShowPaymentForm(false);
  };

  const isEmailValid = email.trim().length > 0 && !emailError && validateEmail(email);

  // Show bypass indicator in development
  const showBypassIndicator = isDevBypass && import.meta.env.DEV;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#EEEDD8' }}>
      {/* Developer Bypass Indicator */}
      {showBypassIndicator && (
        <div className="mb-4 p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg max-w-4xl mx-auto">
          <div className="flex items-center justify-center">
            <span className="text-yellow-800 font-semibold text-sm uppercase tracking-wide">
              🛠 DEVELOPER BYPASS: REAL VIDEO GENERATION WITHOUT PAYMENT
            </span>
          </div>
        </div>
      )}

      {/* Desktop Layout */}
      <div className="hidden md:flex items-center justify-center px-4 py-16">
        {/* Left Navigation Arrow */}
        <button
          onClick={onGoBack}
          className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg border-3 transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg flex items-center justify-center"
          style={{
            backgroundColor: '#A7C342',
            borderColor: '#1B1B1B',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#F8B8B7';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#A7C342';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
          }}
          aria-label="Go back"
        >
          <ChevronLeft size={24} style={{ color: '#1B1B1B' }} strokeWidth={3} />
        </button>

        {/* Content Card */}
        <div className="flex-shrink-1 w-full max-w-4xl">
          <div
            className="rounded-xl shadow-2xl overflow-hidden mx-5 md:mx-15"
            style={{ backgroundColor: '#E5E5E5' }}
          >
            <div
              className="relative p-2 md:p-2"
              style={{
                backgroundColor: '#1B1B1B',
                aspectRatio: '16/9'
              }}
            >
              {/* Form/Preview Area */}
              <div className="relative w-full h-full overflow-hidden rounded-sm">
                <div className="flex h-full">
                  {/* Left Panel - Order Info */}
                  <div
                    className="flex-1 p-6 md:p-12"
                    style={{
                      backgroundColor: '#EEEDD8',
                      borderRight: '2px dashed #1B1B1B'
                    }}
                  >
                    {/* Order Details */}
                    <div className="space-y-3 mb-6">
                      <h2
                        className="text-lg font-bold uppercase tracking-wide mb-6"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        PAYMENT CHECKOUT
                      </h2>

                      {/* Name Field */}
                      <div>
                        <label
                          className="block text-xs font-semibold uppercase tracking-wide mb-1"
                          style={{
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          NAME:
                        </label>
                        <div
                          className="text-sm"
                          style={{
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          {userData.name}
                        </div>
                      </div>

                      {/* Price Field */}
                      <div>
                        <label
                          className="block text-xs font-semibold uppercase tracking-wide mb-1"
                          style={{
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          PRICE:
                        </label>
                        <div
                          className="text-lg font-bold"
                          style={{
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          $12.00
                        </div>
                      </div>

                      {/* Type Field */}
                      <div>
                        <label
                          className="block text-xs font-semibold uppercase tracking-wide mb-1"
                          style={{
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          TYPE:
                        </label>
                        <div
                          className="text-xs uppercase"
                          style={{
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          ONE-TIME
                        </div>
                      </div>

                      {/* What's Included */}
                      <div className="mt-6">
                        <h4
                          className="text-xs font-semibold uppercase tracking-wide mb-2"
                          style={{
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          WHAT'S INCLUDED:
                        </h4>
                        <ul className="space-y-1 text-xs" style={{ fontFamily: 'Roboto Mono, monospace', color: '#1B1B1B' }}>
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
                    </div>
                  </div>

                  {/* Right Panel - Payment Form */}
                  <div
                    className="flex-1 p-6 md:p-12 flex flex-col"
                    style={{ backgroundColor: '#EEEDD8' }}
                  >
                    {/* Email Field */}
                    <div className="mb-4">
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        EMAIL ADDRESS:
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailError('');
                        }}
                        className={`w-full px-3 py-3 border rounded text-sm transition-all duration-200 focus:outline-none ${
                          emailError
                            ? 'border-red-500 bg-red-50'
                            : 'border-black bg-white focus:border-2'
                        }`}
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          borderColor: emailError ? '#ef4444' : '#1B1B1B'
                        }}
                        placeholder="Enter your email"
                      />
                      {emailError && (
                        <span
                          className="text-xs font-semibold mt-1 block"
                          style={{ color: '#ef4444', fontFamily: 'Roboto Mono, monospace' }}
                        >
                          {emailError}
                        </span>
                      )}
                    </div>

                    {/* Payment Form */}
                    <div className="flex-1 flex flex-col justify-end">
                      <div className="mb-4">
                        <StripePaymentForm
                          userData={userData}
                          theme={{ id: 'custom', title: 'Custom Video' } as any}
                          email={email}
                          onPaymentSuccess={handlePaymentSuccess}
                          onPaymentError={handlePaymentError}
                          themeColor={themeColor}
                        />
                      </div>

                      {/* Payment Error */}
                      {paymentError && (
                        <div
                          className="text-xs font-semibold bg-red-50 p-3 rounded mt-2"
                          style={{ color: '#ef4444', fontFamily: 'Roboto Mono, monospace' }}
                        >
                          {paymentError}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Navigation Arrow - Hidden on payment page */}
        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12" />
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden px-4 py-8">
        {/* Back Button */}
        <button
          onClick={onGoBack}
          className="mb-4 flex items-center text-sm font-semibold uppercase tracking-wide"
          style={{
            fontFamily: 'Roboto Mono, monospace',
            color: '#1B1B1B'
          }}
        >
          <ChevronLeft size={20} style={{ color: '#1B1B1B' }} strokeWidth={3} />
          <span className="ml-1">BACK</span>
        </button>

        {/* Mobile Content Card */}
        <div
          className="rounded-xl shadow-2xl overflow-hidden pb-2"
          style={{ backgroundColor: '#EEEDD8' }}
        >
          {/* Form Section */}
          <div className="p-4">
            {/* Header */}
            <h2
              className="text-lg font-bold uppercase tracking-wide mb-6 text-center"
              style={{
                fontFamily: 'Roboto Mono, monospace',
                color: '#1B1B1B'
              }}
            >
              PAYMENT CHECKOUT
            </h2>

            {/* Order Info */}
            <div className="bg-white p-4 rounded border-2 mb-4" style={{ borderColor: '#1B1B1B' }}>
              <div className="space-y-3 text-sm mb-4">
                <div>
                  <span
                    className="block text-xs font-semibold uppercase tracking-wide mb-0.5"
                    style={{ fontFamily: 'Roboto Mono, monospace', color: '#1B1B1B' }}
                  >
                    NAME:
                  </span>
                  <span style={{ fontFamily: 'Roboto Mono, monospace', color: '#1B1B1B' }}>
                    {userData.name}
                  </span>
                </div>
                <div>
                  <span
                    className="block text-xs font-semibold uppercase tracking-wide mb-0.5"
                    style={{ fontFamily: 'Roboto Mono, monospace', color: '#1B1B1B' }}
                  >
                    PRICE:
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ fontFamily: 'Roboto Mono, monospace', color: '#1B1B1B' }}
                  >
                    $12.00
                  </span>
                </div>
                <div>
                  <span
                    className="block text-xs font-semibold uppercase tracking-wide mb-0.5"
                    style={{ fontFamily: 'Roboto Mono, monospace', color: '#1B1B1B' }}
                  >
                    TYPE:
                  </span>
                  <span
                    className="text-xs uppercase"
                    style={{ fontFamily: 'Roboto Mono, monospace', color: '#1B1B1B' }}
                  >
                    ONE-TIME
                  </span>
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h4
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ fontFamily: 'Roboto Mono, monospace', color: '#1B1B1B' }}
                >
                  WHAT'S INCLUDED:
                </h4>
                <ul className="space-y-1 text-xs" style={{ fontFamily: 'Roboto Mono, monospace', color: '#1B1B1B' }}>
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
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label
                className="block text-xs font-semibold uppercase tracking-wide mb-1"
                style={{
                  fontFamily: 'Roboto Mono, monospace',
                  color: '#1B1B1B'
                }}
              >
                EMAIL ADDRESS:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                className={`w-full px-3 py-2 border rounded text-sm transition-all duration-200 focus:outline-none ${
                  emailError
                    ? 'border-red-500 bg-red-50'
                    : 'border-black bg-white'
                }`}
                style={{
                  fontFamily: 'Roboto Mono, monospace',
                  borderColor: emailError ? '#ef4444' : '#1B1B1B'
                }}
                placeholder="Enter your email"
              />
              {emailError && (
                <span
                  className="text-xs font-semibold mt-1 block"
                  style={{ color: '#ef4444', fontFamily: 'Roboto Mono, monospace' }}
                >
                  {emailError}
                </span>
              )}
            </div>

            {/* Payment Form */}
            <div className="mb-4">
              <StripePaymentForm
                userData={userData}
                theme={{ id: 'custom', title: 'Custom Video' } as any}
                email={email}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
                themeColor={themeColor}
              />
            </div>

            {/* Payment Error */}
            {paymentError && (
              <div
                className="text-xs font-semibold bg-red-50 p-3 rounded mt-2"
                style={{ color: '#ef4444', fontFamily: 'Roboto Mono, monospace' }}
              >
                {paymentError}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center mt-6 space-x-3">
        <div
          className="w-4 h-4 rounded-sm transition-all duration-200 border border-gray-300 bg-white"
        />
        <div
          className="w-4 h-4 rounded-sm transition-all duration-200 border border-gray-300 bg-white"
        />
        <div
          className="w-4 h-4 rounded-sm transition-all duration-200 border border-black shadow-sm"
          style={{ backgroundColor: themeColor }}
        />
      </div>
    </div>
  );
}
