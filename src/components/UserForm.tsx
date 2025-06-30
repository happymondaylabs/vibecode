import React, { useState } from 'react';
import { UserData, ValidationErrors } from '../types';

interface UserFormProps {
  userData: UserData;
  onUserDataChange: (data: UserData) => void;
  onSubmit: () => void;
  errors: ValidationErrors;
}

export function UserForm({ userData, onUserDataChange, onSubmit, errors }: UserFormProps) {
  const [wordCount, setWordCount] = useState(0);

  const handleMessageChange = (message: string) => {
    const words = message.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    onUserDataChange({ ...userData, message });
  };

  const isFormValid = userData.name.length > 0 && 
                     userData.age.length > 0 && 
                     userData.message.length > 0 &&
                     !errors.name && !errors.age && !errors.message;

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gray-200 p-8 rounded-lg shadow-xl border-2 border-black">
        {/* Technical Header */}
        <div className="text-center mb-8">
          <div className="bg-black text-white px-4 py-2 inline-block mb-4 font-black text-xs tracking-wider">
            PERSONAL DATA INPUT
          </div>
          <h3 className="text-2xl font-black tracking-wider">
            PASS CARD APPLICATION
          </h3>
          <div className="text-xs font-mono mt-2">FORM CODE: PCA-001</div>
        </div>

        {/* Name Field */}
        <div className="mb-6">
          <label className="block text-sm font-black tracking-wide text-black mb-2">
            FULL NAME
          </label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => onUserDataChange({ ...userData, name: e.target.value })}
            maxLength={20}
            className={`w-full px-4 py-3 border-2 rounded font-mono tracking-wide transition-all duration-200 focus:outline-none ${
              errors.name 
                ? 'border-red-500 bg-red-50' 
                : 'border-black focus:border-orange-500 bg-white'
            }`}
            placeholder="ENTER YOUR NAME"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs font-mono text-gray-600">{userData.name.length}/20</span>
            {errors.name && <span className="text-xs text-red-600 font-black">{errors.name}</span>}
          </div>
        </div>

        {/* Age Field */}
        <div className="mb-6">
          <label className="block text-sm font-black tracking-wide text-black mb-2">
            AGE
          </label>
          <input
            type="number"
            value={userData.age}
            onChange={(e) => onUserDataChange({ ...userData, age: e.target.value })}
            min="1"
            max="120"
            className={`w-full px-4 py-3 border-2 rounded font-mono transition-all duration-200 focus:outline-none ${
              errors.age 
                ? 'border-red-500 bg-red-50' 
                : 'border-black focus:border-orange-500 bg-white'
            }`}
            placeholder="ENTER AGE"
          />
          {errors.age && (
            <span className="text-xs text-red-600 font-black mt-1 block">{errors.age}</span>
          )}
        </div>

        {/* Message Field */}
        <div className="mb-8">
          <label className="block text-sm font-black tracking-wide text-black mb-2">
            VIBE DESCRIPTION
          </label>
          <input
            type="text"
            value={userData.message}
            onChange={(e) => handleMessageChange(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded font-mono transition-all duration-200 focus:outline-none ${
              errors.message 
                ? 'border-red-500 bg-red-50' 
                : 'border-black focus:border-orange-500 bg-white'
            }`}
            placeholder="DESCRIBE YOUR VIBE"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs font-mono text-gray-600">{wordCount}/10 words</span>
            {errors.message && <span className="text-xs text-red-600 font-black">{errors.message}</span>}
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={onSubmit}
          className={`w-full py-4 rounded font-black text-lg tracking-wider transition-all duration-200 transform border-2 ${
            isFormValid
              ? 'bg-black text-white border-black hover:text-orange-400 hover:scale-105 shadow-lg'
              : 'bg-gray-400 text-gray-600 border-gray-400 cursor-not-allowed'
          }`}
        >
          CREATE VIBE CARD
        </button>

        {/* Technical Footer */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-1 mb-2">
            <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">©</div>
            <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">CE</div>
            <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">⚡</div>
          </div>
          <div className="text-xs font-mono">VIBE CARD Co. Ltd. 2025</div>
        </div>
      </div>
    </div>
  );
}