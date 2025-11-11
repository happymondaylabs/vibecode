import React, { useEffect, useState } from 'react';
import { Loader2, AlertCircle, RefreshCw, Clock } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
  isGenerating?: boolean;
  progress?: number;
  error?: string | null;
  onRetry?: () => void;
  isPending?: boolean;
  themeColor?: string;
  onGoHome?: () => void;
}

export function LoadingScreen({ 
  onComplete, 
  isGenerating = false, 
  progress = 0, 
  error = null,
  onRetry,
  isPending = false,
  themeColor = '#FF700A',
  onGoHome
}: LoadingScreenProps) {
  // Check if this is a dev bypass session
  const isDevBypass = 
    typeof window !== 'undefined' && 
    window.location.search.includes('dev=true');

  const [localProgress, setLocalProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING...');

  const loadingMessages = [
    isDevBypass ? 'DEV MODE: TEST VIDEO GENERATION...' : 'INITIALIZING...',
    isDevBypass ? 'DEV MODE: SUBMITTING TO QUEUE...' : 'SUBMITTING TO QUEUE...',
    isDevBypass ? 'DEV MODE: PROCESSING REQUEST...' : 'ANALYZING VIBE...',
    isDevBypass ? 'DEV MODE: GENERATING VIDEO...' : 'QUEUED FOR PROCESSING...',
    isDevBypass ? 'DEV MODE: CREATING VIDEO...' : 'CREATING VIDEO...',
    isDevBypass ? 'DEV MODE: APPLYING EFFECTS...' : 'APPLYING EFFECTS...',
    isDevBypass ? 'DEV MODE: FINALIZING VIDEO...' : 'FINAL TOUCHES...',
    isDevBypass ? 'DEV MODE: VIDEO COMPLETE!' : 'COMPLETE!'
  ];

  // Handle pending state
  if (isPending) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: themeColor }}
          >
            <Clock className="text-white" size={48} />
          </div>

          <h2 className="text-3xl font-semibold uppercase tracking-wider text-white mb-4">
            GENERATION IN PROGRESS
          </h2>
          <style jsx>{`
            h2 {
              font-family: 'JetBrains Mono', 'Space Mono', 'Roboto Mono', 'Courier New', monospace;
            }
          `}</style>

          <div className="bg-yellow-900 bg-opacity-50 p-6 rounded-lg mb-8">
            <p className="text-yellow-200 text-lg leading-relaxed mb-4 font-technical">
              Your yougenius video is taking longer than usual to generate.
            </p>
            <p className="text-yellow-300 text-sm leading-relaxed font-technical">
              This is normal for complex videos. We'll email you when it's ready, 
              or you can continue and check back later.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onComplete}
              className="w-full px-8 py-3 font-technical font-semibold text-sm uppercase tracking-wider transition-all duration-200"
              style={{ 
                backgroundColor: themeColor, 
                color: 'white',
                border: `2px solid ${themeColor}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = themeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = themeColor;
                e.currentTarget.style.color = 'white';
              }}
            >
              CONTINUE TO CHECKOUT
            </button>

            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full px-8 py-3 border border-white text-white font-technical font-semibold text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-200"
              >
                CHECK STATUS AGAIN
              </button>
            )}
          </div>

          <p className="text-gray-400 text-xs mt-4 uppercase tracking-wide font-technical">
            You can complete your order and we'll deliver the video when ready
          </p>

          {/* Processing Tips */}
          <div className="mt-8 p-4 bg-gray-900 bg-opacity-50 rounded-lg text-left">
            <h4 className="text-white font-technical font-semibold text-sm mb-3 uppercase tracking-wide">
              Why This Happens:
            </h4>
            <ul className="text-gray-300 text-xs space-y-2 font-technical">
              <li>• High-quality video generation takes time</li>
              <li>• Complex themes require more processing</li>
              <li>• Server queue may be busy during peak hours</li>
              <li>• Your video will be worth the wait!</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  useEffect(() => {
    if (isGenerating) {
      setLocalProgress(progress);
      const messageIndex = Math.floor((progress / 100) * (loadingMessages.length - 1));
      setLoadingText(loadingMessages[messageIndex] || loadingMessages[0]);

      if (progress >= 100) {
        setTimeout(() => onComplete(), 1000);
      }
    } else if (!error) {
      const interval = setInterval(() => {
        setLocalProgress(prev => {
          const newProgress = prev + 1;
          
          const messageIndex = Math.floor((newProgress / 100) * (loadingMessages.length - 1));
          setLoadingText(loadingMessages[messageIndex] || loadingMessages[0]);

          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => onComplete(), 1000);
            return 100;
          }
          return newProgress;
        });
      }, 30);

      return () => clearInterval(interval);
    }
  }, [onComplete, isGenerating, progress, error]);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ backgroundColor: themeColor }}
          >
            <Clock className="text-white" size={48} />
          </div>

          <h2 className="text-2xl md:text-3xl font-semibold uppercase tracking-wider text-white mb-6">
            yougenius PROCESSING
          </h2>

          <div 
            className="p-6 rounded-lg mb-8"
            style={{ backgroundColor: `${themeColor}20` }}
          >
            <p className="text-white text-lg leading-relaxed mb-4">
              yougenius VIDEOS ARE TAKING LONGER THAN EXPECTED.
            </p>
            <p className="text-white text-base leading-relaxed opacity-90">
              WE WILL EMAIL YOU YOUR CUSTOM yougenius VIDEO WHEN IT'S READY
            </p>
            <p 
              className="text-sm mt-2 font-semibold"
              style={{ color: themeColor }}
            >
              [ESTIMATED WAIT TIME 2-3 HOURS]
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={onGoHome || onComplete}
              className="w-full px-8 py-3 font-semibold text-sm uppercase tracking-wider transition-all duration-200"
              style={{ 
                backgroundColor: themeColor, 
                color: 'white',
                border: `2px solid ${themeColor}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = themeColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = themeColor;
                e.currentTarget.style.color = 'white';
              }}
            >
              BACK TO HOME
            </button>
          </div>

          <p className="text-gray-400 text-xs mt-4 uppercase tracking-wide">
            Try again later or contact support for assistance
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
      <div className="text-center px-4">
        <div className="relative mb-8">
          <div className="w-16 h-16 md:w-24 md:h-24 border-4 border-white border-dashed rounded-full animate-spin mx-auto opacity-80" 
               style={{ 
                 borderStyle: 'dashed',
                 animationDuration: '2s',
                 filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))'
               }} 
          />
          <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400" size={24} />
        </div>

        <h2 
          className="text-xl md:text-3xl font-black uppercase tracking-wider mb-4"
          style={{ color: themeColor }}
          style={{ 
            color: themeColor,
            fontFamily: 'JetBrains Mono, Space Mono, Roboto Mono, Courier New, monospace'
          }}
        >
          {loadingText}
        </h2>

        <div className="w-64 md:w-80 mx-auto mb-6">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full transition-all duration-300 ease-out rounded-full"
              style={{ 
                width: `${isGenerating ? progress : localProgress}%`,
                backgroundColor: themeColor
              }}
            />
          </div>
          <p 
            className="text-sm mt-2 opacity-75"
            style={{ color: themeColor }}
            style={{ 
              color: themeColor,
              fontFamily: 'JetBrains Mono, Space Mono, Roboto Mono, Courier New, monospace'
            }}
          >
            {Math.round(isGenerating ? progress : localProgress)}% COMPLETE
          </p>
        </div>

        <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wide font-technical">
          {isGenerating ? 'EST. 3–8 MIN TO GENERATE' : 'EST. 3–5 MIN TO CREATE'}
        </p>
        <style jsx>{`
          p {
            font-family: 'JetBrains Mono', 'Space Mono', 'Roboto Mono', 'Courier New', monospace;
          }
        `}</style>

        {isGenerating && (
          <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gray-900 bg-opacity-50 rounded-lg max-w-sm mx-auto">
            <p className="text-gray-300 text-xs uppercase tracking-wide font-technical">
              {progress < 30 ? 'SUBMITTING TO QUEUE...' :
               progress < 60 ? 'PROCESSING IN QUEUE...' :
               progress < 90 ? 'FINALIZING VIDEO...' :
               'ALMOST READY!'}
            </p>
          </div>
        )}

        <div className="absolute top-10 md:top-20 left-4 md:left-20 text-white opacity-30 transform rotate-12">
          <div className="text-3xl md:text-6xl font-light">↗</div>
        </div>
        <div className="absolute bottom-10 md:bottom-20 right-4 md:right-20 text-white opacity-30 transform -rotate-12">
          <div className="text-3xl md:text-6xl font-light">↙</div>
        </div>
      </div>
    </div>
  );
}