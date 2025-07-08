import React, { useEffect, useState } from 'react';
import { Loader2, Zap, Sparkles, Video } from 'lucide-react';

interface TransitionLoadingProps {
  onComplete: () => void;
  themeColor: string;
  userName: string;
}

export function TransitionLoading({ onComplete, themeColor, userName }: TransitionLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);

  const messages = [
    `ANALYZING ${userName.toUpperCase()}'S VIBE...`,
    'SELECTING PERFECT THEME ELEMENTS...',
    'PREPARING YOUR CUSTOM VIDEO CARD...'
  ];

  useEffect(() => {
    // Progress animation over 3 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2.5; // Increment by 2.5% every 75ms = 3 seconds total
      });
    }, 75);

    // Message rotation
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 1000);

    // Sparkle animation
    const sparkleInterval = setInterval(() => {
      setShowSparkles(prev => !prev);
    }, 600);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearInterval(sparkleInterval);
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
          {/* Main spinning circle */}
          <div 
            className="w-20 h-20 md:w-24 md:h-24 border-4 border-black border-dashed rounded-full animate-spin mx-auto" 
            style={{ 
              borderStyle: 'dashed',
              animationDuration: '2s',
              filter: 'drop-shadow(0 0 20px rgba(0, 0, 0, 0.3))'
            }} 
          />
          
          {/* Center icon */}
          <Video className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black" size={28} />
          
          {/* Floating sparkles */}
          {showSparkles && (
            <>
              <Sparkles 
                className="absolute top-2 right-2 text-black animate-pulse" 
                size={16}
                style={{ animationDuration: '1s' }}
              />
              <Sparkles 
                className="absolute bottom-2 left-2 text-black animate-pulse" 
                size={14}
                style={{ animationDuration: '1.2s', animationDelay: '0.3s' }}
              />
              <Sparkles 
                className="absolute top-1/2 right-0 text-black animate-pulse" 
                size={12}
                style={{ animationDuration: '0.8s', animationDelay: '0.6s' }}
              />
            </>
          )}
        </div>

        {/* Loading Message */}
        <h2 className="text-xl md:text-3xl font-black uppercase tracking-wider text-black mb-2 transition-all duration-500">
          {messages[currentMessage]}
        </h2>

        {/* Subtitle */}
        <p className="text-sm md:text-base text-black opacity-80 mb-6 font-semibold">
          {progress < 33 ? 'Reading your creative energy...' :
           progress < 66 ? 'Crafting the perfect video elements...' :
           'Almost ready for checkout...'}
        </p>

        {/* Progress Bar */}
        <div className="w-72 md:w-96 mx-auto mb-6">
          <div className="bg-black bg-opacity-20 rounded-full h-3 overflow-hidden border border-black border-opacity-30">
            <div 
              className="bg-black h-full transition-all duration-75 ease-out rounded-full shadow-lg relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white via-transparent opacity-30 animate-pulse"
                style={{ animationDuration: '1.5s' }}
              />
            </div>
          </div>
          <p className="text-black text-sm mt-3 font-bold tracking-wide">
            {Math.round(progress)}% ANALYZED
          </p>
        </div>

        {/* Creative Context */}
        <div className="bg-black bg-opacity-10 rounded-lg p-4 max-w-md mx-auto border border-black border-opacity-20">
          <p className="text-black text-xs md:text-sm uppercase tracking-wide font-semibold mb-1">
            VIBE CARD PREVIEW
          </p>
          <p className="text-black text-xs opacity-75">
            Your custom video is being designed with the perfect theme, timing, and personal touches for {userName}.
          </p>
        </div>
      </div>
    </div>
  );
}