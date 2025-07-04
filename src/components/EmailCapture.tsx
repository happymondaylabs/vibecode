import React, { useState } from 'react';
import { UserData } from '../types';

interface EmailCaptureProps {
  userData: UserData;
  onSubmit: (email: string) => void;
}

export function EmailCapture({ userData, onSubmit }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('EMAIL IS REQUIRED');
      return;
    }
    
    if (!validateEmail(email)) {
      setError('INVALID EMAIL FORMAT');
      return;
    }

    setError('');
    onSubmit(email);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h3 className="text-2xl font-semibold uppercase tracking-wider text-center mb-2">
          ALMOST THERE!
        </h3>
        <p className="text-center text-gray-600 mb-8 uppercase text-sm tracking-wide">
          Your vibe card for {userData.name} is almost ready
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
              setError('');
            }}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none ${
              error 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-300 focus:border-black bg-white'
            }`}
            placeholder="ENTER YOUR EMAIL"
          />
          {error && (
            <span className="text-xs text-red-600 font-semibold mt-1 block">{error}</span>
          )}
        </div>

        {/* Benefits List */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold uppercase text-sm tracking-wide mb-3 text-gray-700">
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

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-black text-white rounded-lg font-semibold text-lg uppercase tracking-wider hover:text-orange-400 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          CONTINUE TO CHECKOUT
        </button>
      </div>
    </div>
  );
}