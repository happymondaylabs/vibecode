import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Theme, UserData, ValidationErrors } from '../types';
import { themes } from '../data/themes';

interface ThemeSelectorProps {
  selectedTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  userData: UserData;
  onUserDataChange: (data: UserData) => void;
  errors: ValidationErrors;
  onSubmit: () => void;
}

export function ThemeSelector({ 
  selectedTheme, 
  onThemeChange, 
  userData, 
  onUserDataChange, 
  errors,
  onSubmit
}: ThemeSelectorProps) {
  const currentIndex = themes.findIndex(theme => theme.id === selectedTheme.id);

  const navigateTheme = (direction: 'prev' | 'next') => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? themes.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === themes.length - 1 ? 0 : currentIndex + 1;
    }
    onThemeChange(themes[newIndex]);
  };

  const handleGenerateCard = () => {
    onSubmit();
  };

  const isFormValid = userData.name.trim().length > 0 && 
                     userData.age.trim().length > 0 && 
                     !errors.name && !errors.age;

  return (
    <div className="relative w-full max-w-6xl mx-auto mb-12">
      <div className="flex items-center justify-center">
        {/* Left Navigation Arrow */}
        <button
          onClick={() => navigateTheme('prev')}
          className="mr-8 p-3 rounded-full bg-black bg-opacity-20 text-black hover:bg-opacity-30 hover:text-white transition-all duration-200 transform hover:scale-110"
        >
          <ChevronLeft size={32} strokeWidth={3} />
        </button>

        {/* Main Pass Card */}
        <div className="relative bg-gray-200 rounded-lg shadow-2xl overflow-hidden p-8 flex-1 max-w-4xl" style={{ aspectRatio: '16/10' }}>
          <div className="flex h-full">
            {/* Left Side - Pass Card Info with Form */}
            <div className="w-1/2 relative">
              <div className="pr-6 h-full">
                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-4xl font-semibold tracking-wider mb-2">VIBE CARD</h2>
                  <div className="text-lg tracking-wide">{selectedTheme.title}</div>
                </div>

                {/* Form Fields */}
                <div className="space-y-6 text-base">
                  {/* Name Field */}
                  <div className="flex items-center">
                    <span className="font-semibold w-16">NAME:</span>
                    <div className="flex-1 ml-4">
                      <input
                        type="text"
                        value={userData.name}
                        onChange={(e) => onUserDataChange({ ...userData, name: e.target.value })}
                        maxLength={20}
                        className={`w-full px-3 py-2 border-2 rounded text-sm tracking-wide transition-all duration-200 focus:outline-none ${
                          errors.name 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-400 focus:border-black bg-white'
                        }`}
                        placeholder="ENTER NAME"
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-600">{userData.name.length}/20</span>
                        {errors.name && <span className="text-xs text-red-600 font-semibold">{errors.name}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Age Field */}
                  <div className="flex items-center">
                    <span className="font-semibold w-16">AGE:</span>
                    <div className="flex-1 ml-4">
                      <input
                        type="number"
                        value={userData.age}
                        onChange={(e) => onUserDataChange({ ...userData, age: e.target.value })}
                        min="1"
                        max="120"
                        className={`w-full px-3 py-2 border-2 rounded text-sm transition-all duration-200 focus:outline-none ${
                          errors.age 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-400 focus:border-black bg-white'
                        }`}
                        placeholder="ENTER AGE"
                      />
                      {errors.age && (
                        <span className="text-xs text-red-600 font-semibold mt-1 block">{errors.age}</span>
                      )}
                    </div>
                  </div>

                  {/* Style Field - Dynamic based on selected theme */}
                  <div className="flex items-center">
                    <span className="font-semibold w-16">STYLE:</span>
                    <span className="ml-4">{selectedTheme.title}</span>
                  </div>

                  {/* Type Field - Static */}
                  <div className="flex items-center">
                    <span className="font-semibold w-16">TYPE:</span>
                    <span className="ml-4">BIRTHDAY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Dotted Divider */}
            <div className="flex items-center justify-center">
              <div className="w-px h-full border-l-2 border-dashed border-black"></div>
            </div>

            {/* Right Side - Image */}
            <div className="w-1/2 relative pl-6">
              <div className="w-full h-48 bg-black rounded border-2 border-black overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={selectedTheme.image}
                  alt={selectedTheme.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Funny Description */}
              <div className="mt-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedTheme.description}
                </p>
              </div>
              
              <div className="text-center text-sm">{selectedTheme.code}</div>
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

          {/* Generate Card Button - Lower Right - Full width of thumbnail */}
          <div className="absolute bottom-6 right-6 pl-6" style={{ width: 'calc(50% - 24px)' }}>
            <button 
              onClick={handleGenerateCard}
              disabled={!isFormValid}
              className={`w-full px-6 py-3 font-semibold text-sm tracking-wider transition-all duration-200 ${
                isFormValid
                  ? 'bg-black text-white hover:text-orange-400 cursor-pointer'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
              }`}
            >
              GENERATE CARD
            </button>
          </div>
        </div>

        {/* Right Navigation Arrow */}
        <button
          onClick={() => navigateTheme('next')}
          className="ml-8 p-3 rounded-full bg-black bg-opacity-20 text-black hover:bg-opacity-30 hover:text-white transition-all duration-200 transform hover:scale-110"
        >
          <ChevronRight size={32} strokeWidth={3} />
        </button>
      </div>

      {/* Minimalist Progress Indicator */}
      <div className="flex justify-center mt-6">
        <div className="flex items-center space-x-3">
          {themes.map((_, index) => (
            <button
              key={index}
              onClick={() => onThemeChange(themes[index])}
              className={`
                w-4 h-4 rounded-sm transition-all duration-300 ease-out border
                ${index === currentIndex 
                  ? 'bg-black border-black shadow-sm' 
                  : 'bg-white border-gray-300 hover:border-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-black focus:ring-opacity-50
                transform hover:scale-110 active:scale-95
              `}
              aria-label={`Go to theme ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}