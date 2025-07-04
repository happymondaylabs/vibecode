import React from 'react';
import { Download, Share2, Instagram, Twitter, Play } from 'lucide-react';
import { UserData, Theme } from '../types';

interface CompletionScreenProps {
  userData: UserData;
  selectedTheme: Theme;
  videoUrl?: string | null;
  onStartOver: () => void;
}

export function CompletionScreen({ userData, selectedTheme, videoUrl, onStartOver }: CompletionScreenProps) {
  const handleDownload = () => {
    if (videoUrl) {
      // Download the actual generated video
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `vibe-card-${userData.name.toLowerCase().replace(' ', '-')}.mp4`;
      link.click();
    } else {
      // Fallback to theme image if no video was generated
      const link = document.createElement('a');
      link.href = selectedTheme.image;
      link.download = `vibe-card-${userData.name.toLowerCase().replace(' ', '-')}.mp4`;
      link.click();
    }
  };

  const handlePlayVideo = () => {
    if (videoUrl) {
      window.open(videoUrl, '_blank');
    }
  };

  const handleShare = (platform: string) => {
    const text = `Check out my new VIBE CARD! "${userData.message}" - Created with VIBE CARD`;
    const url = window.location.href;
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct URL sharing, so we'll copy to clipboard
        navigator.clipboard.writeText(text);
        alert('Caption copied to clipboard! Share your VIBE CARD on Instagram.');
        return;
      default:
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Link copied to clipboard!');
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-orange-400">
      {/* Header */}
      <header className="bg-black text-white shadow-lg border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-semibold tracking-wider">
                VIBE CARD
              </h1>
              <p className="text-orange-400 mt-1 text-xs tracking-wide">
                PAPER BIRTHDAY CARDS ARE BORING
              </p>
            </div>
            <div className="text-right text-xs max-w-md">
              <div className="mb-1 text-orange-400 font-semibold tracking-wider">
                ORDER COMPLETE
              </div>
              <div className="leading-relaxed">
                Your custom video birthday card is ready!
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Horizontal Layout */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="flex">
            {/* Left Side - Video Preview */}
            <div className="w-1/2 p-6">
              <h2 className="text-2xl font-semibold uppercase tracking-wider mb-4 text-center">
                YOUR VIBE CARD
              </h2>
              
              {/* Video Container */}
              <div className="relative bg-black rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    className="w-full h-full object-cover"
                    poster={selectedTheme.image}
                    controls={false}
                    muted
                    loop
                    autoPlay
                  />
                ) : (
                  <img
                    src={selectedTheme.image}
                    alt={selectedTheme.title}
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button
                    onClick={handlePlayVideo}
                    className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
                  >
                    <Play size={24} className="text-black ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>

              {/* Video Status */}
              <div className="text-center mb-4">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wide ${
                  videoUrl ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {videoUrl ? '✓ VIDEO READY' : '⏳ PROCESSING'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center px-4 py-3 bg-black text-white rounded-lg font-semibold text-sm uppercase tracking-wider hover:text-orange-400 transition-all duration-200"
                >
                  <Download size={16} className="mr-2" />
                  DOWNLOAD VIDEO
                </button>

                <div className="relative group">
                  <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 text-white rounded-lg font-semibold text-sm uppercase tracking-wider hover:text-orange-400 transition-all duration-200">
                    <Share2 size={16} className="mr-2" />
                    SHARE NOW
                  </button>
                  
                  {/* Share Options Dropdown */}
                  <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
                    <div className="p-2">
                      <button
                        onClick={() => handleShare('twitter')}
                        className="w-full flex items-center px-3 py-2 text-black hover:bg-gray-100 rounded text-sm transition-colors"
                      >
                        <Twitter size={14} className="mr-2" />
                        <span className="font-semibold uppercase">Twitter</span>
                      </button>
                      <button
                        onClick={() => handleShare('instagram')}
                        className="w-full flex items-center px-3 py-2 text-black hover:bg-gray-100 rounded text-sm transition-colors"
                      >
                        <Instagram size={14} className="mr-2" />
                        <span className="font-semibold uppercase">Instagram</span>
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="w-full flex items-center px-3 py-2 text-black hover:bg-gray-100 rounded text-sm transition-colors"
                      >
                        <Share2 size={14} className="mr-2" />
                        <span className="font-semibold uppercase">Copy Link</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Order Details & Actions */}
            <div className="w-1/2 p-6 bg-gray-50">
              <h3 className="text-xl font-semibold uppercase tracking-wider mb-6">
                ORDER DETAILS
              </h3>

              {/* Order Summary */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-sm uppercase">Name:</span>
                  <span className="text-sm">{userData.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-sm uppercase">Age:</span>
                  <span className="text-sm">{userData.age}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-sm uppercase">Theme:</span>
                  <span className="text-sm">{selectedTheme.title}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-sm uppercase">Type:</span>
                  <span className="text-sm">BIRTHDAY CARD</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="font-semibold text-sm uppercase">Status:</span>
                  <span className={`text-sm font-semibold ${videoUrl ? 'text-green-600' : 'text-yellow-600'}`}>
                    {videoUrl ? 'COMPLETE' : 'PROCESSING'}
                  </span>
                </div>
              </div>

              {/* What's Included */}
              <div className="mb-6 p-4 bg-white rounded-lg border">
                <h4 className="font-semibold uppercase text-sm tracking-wide mb-3 text-gray-700">
                  WHAT'S INCLUDED:
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    CUSTOM VIDEO GENERATED
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    MP4 DOWNLOAD READY
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    UNLIMITED SHARING
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    LIFETIME ACCESS
                  </li>
                </ul>
              </div>

              {/* Payment Summary */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-green-800 uppercase text-sm">Total Paid:</span>
                  <span className="text-2xl font-bold text-green-800">$10.00</span>
                </div>
                <p className="text-xs text-green-600 mt-1 uppercase tracking-wide">
                  ✓ Payment Successful
                </p>
              </div>

              {/* Additional Actions */}
              <div className="space-y-3">
                <button
                  onClick={onStartOver}
                  className="w-full px-4 py-3 border-2 border-black text-black rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-200"
                >
                  CREATE ANOTHER CARD
                </button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    Need help? Contact support@vibecard.com
                  </p>
                </div>
              </div>

              {/* HP Logo and Symbols */}
              <div className="flex items-center justify-center space-x-3 mt-6 pt-4 border-t border-gray-200">
                <div className="bg-black text-white px-3 py-1 font-semibold text-xs">HP</div>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">©</div>
                  <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">CE</div>
                  <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">⚡</div>
                  <div className="w-4 h-4 border border-black rounded-full flex items-center justify-center text-xs">♻</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}