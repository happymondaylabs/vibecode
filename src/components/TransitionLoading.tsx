import React, { useEffect, useState } from 'react';
import { Loader2, Zap } from 'lucide-react';

interface TransitionLoadingProps {
  onComplete: () => void;
  themeColor: string;
  userName: string;
}

export function TransitionLoading({ onComplete, themeColor, userName }: TransitionLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);

  const messages = [
    'INITIALIZING VIDEO GENERATION...',
    'ANALYZING VIBE PARAMETERS...',
    'PREPARING PAYMENT CHECKOUT...'
  ];

  useEffect(() => {
    // Fast progress animation over 2.5 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 200);
          return 100;
        }
        return prev + 4; // Increment by 4% every 100ms = 2.5 seconds total
      });
    }, 100);

    // Message rotation
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 800);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [onComplete]);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 transition-all duration-500"
      style={{ backgroundColor: themeColor }}
    >
      <div className="text-center px-4">
        {/* Animated Icon */}
        <div className="relative mb-6">
          <div 
            className="w-16 h-16 md:w-20 md:h-20 border-4 border-black border-dashed rounded-full animate-spin mx-auto opacity-90" 
            style={{ 
              borderStyle: 'dashed',
              animationDuration: '1.5s',
              filter: 'drop-shadow(0 0 15px rgba(0, 0, 0, 0.4))'
            }} 
          />
          <Zap className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black" size={24} />
        </div>

        {/* Loading Message */}
        <h2 className="text-lg md:text-2xl font-technical font-black uppercase tracking-technical text-black mb-4 transition-all duration-300">
          {messages[currentMessage]}
        </h2>

        {/* Progress Bar */}
        <div className="w-64 md:w-80 mx-auto mb-4">
          <div className="bg-black bg-opacity-30 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-black h-full transition-all duration-100 ease-out rounded-full shadow-lg"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p 
            className="text-black text-sm mt-2 opacity-90 font-semibold"
            style={{ fontFamily: 'JetBrains Mono, Space Mono, Roboto Mono, Courier New, monospace' }}
          >
            {Math.round(progress)}% READY
          </p>
        </div>

        {/* User Context */}
        <p className="text-black text-xs md:text-sm font-secondary text-uppercase tracking-wide opacity-75">
          PREPARING {userName}'S VIBE CARD
        </p>
      </div>
    </div>
  );
}