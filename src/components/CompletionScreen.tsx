import React from 'react';
import { Download, Share2, Instagram, Twitter, Play } from 'lucide-react';
import { UserData, Theme } from '../types';

interface CompletionScreenProps {
  userData: UserData;
  selectedTheme: Theme;
  videoUrl?: string | null;
  onStartOver: () => void;
  themeColor: string;
}

export function CompletionScreen({ userData, selectedTheme, videoUrl, onStartOver, themeColor }: CompletionScreenProps) {
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
    <div 
      className="min-h-screen pb-8 md:pb-0 transition-all duration-500"
      style={{ backgroundColor: themeColor }}
    >
      {/* Header */}
      <header 
        className="bg-black text-white shadow-lg border-b-4 transition-all duration-500"
        style={{ borderBottomColor: themeColor }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-4xl font-semibold tracking-wider">
                VIBE CARD
              </h1>
              <p 
                className="mt-1 text-xs md:text-sm tracking-wide transition-all duration-500"
                style={{ color: themeColor }}
              >
                PAPER BIRTHDAY CARDS ARE BORING
              </p>
            </div>
            <div className="text-left md:text-right text-xs max-w-md">
              <div 
                className="mb-1 md:mb-2 font-semibold tracking-wider transition-all duration-500"
                style={{ color: themeColor }}
              >
                PAPER CARDS → VIBE CARDS
              </div>
              <div className="leading-relaxed hidden md:block">
                Send custom video birthday cards that actually<br />
                make people laugh, share, and remember you forever.
              </div>
              <div className="leading-relaxed md:hidden text-xs">
                Send custom video birthday cards that make people laugh and remember you forever.
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        <div className="relative w-full max-w-6xl mx-auto">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="bg-gray-200 rounded-lg shadow-2xl overflow-hidden p-4 mb-4">
              {/* Mobile Header */}
              <div className="text-center mb-4">
                <h2 className="text-2xl font-semibold tracking-wider mb-1">VIBE CARD</h2>
                <div className="text-sm tracking-wide">{selectedTheme.title}</div>
              </div>

              {/* Mobile User Info */}
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
                  <span className="font-semibold block text-xs">STYLE:</span>
                  <span className="text-xs">{selectedTheme.title}</span>
                </div>
                <div>
                  <span className="font-semibold block text-xs">STATUS:</span>
                  <span className="text-xs font-semibold">
                    {videoUrl ? 'COMPLETE' : 'READY'}
                  </span>
                </div>
              </div>

              {/* Mobile Video Preview */}
              <div className="w-full bg-black rounded border-2 border-black overflow-hidden relative mb-4" style={{ aspectRatio: '16/9' }}>
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
                
                {/* Video Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <button
                    onClick={handlePlayVideo}
                    className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
                  >
                    <Play size={24} className="text-black ml-1" fill="currentColor" />
                  </button>
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="space-y-3 mb-4">
                {/* Download Video Button */}
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center px-4 py-3 bg-black text-white rounded font-semibold text-sm uppercase tracking-wider hover:text-orange-400 transition-all duration-200"
                  onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                >
                  <Download size={16} className="mr-2" />
                  DOWNLOAD VIDEO
                </button>

                {/* Share Now Button */}
                <div className="relative group">
                  <button 
                    className="w-full flex items-center justify-center px-4 py-3 bg-black text-white rounded font-semibold text-sm uppercase tracking-wider hover:text-orange-400 transition-all duration-200"
                    onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                  >
                    <Share2 size={16} className="mr-2" />
                    SHARE NOW
                  </button>
                  
                  {/* Share Options Dropdown */}
                  <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
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

                {/* Create Another Button */}
                <button
                  onClick={onStartOver}
                  className="w-full px-4 py-3 border border-black text-black rounded font-semibold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-200"
                >
                  CREATE ANOTHER
                </button>
              </div>

              {/* Mobile HP Logo */}
              <div className="flex justify-center">
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
          <div className="hidden md:block">
          {/* Main Card - Same layout as home screen but no navigation arrows */}
          <div className="flex items-center justify-center">
            <div className="relative bg-gray-200 rounded-lg shadow-2xl overflow-hidden p-8 flex-1 max-w-4xl" style={{ aspectRatio: '16/10' }}>
              <div className="flex h-full">
                {/* Left Side - Card Info */}
                <div className="w-1/2 relative">
                  <div className="pr-6 h-full">
                    {/* Header */}
                    <div className="mb-8">
                      <h2 className="text-4xl font-semibold tracking-wider mb-2">VIBE CARD</h2>
                      <div className="text-lg tracking-wide">{selectedTheme.title}</div>
                    </div>

                    {/* User Info Display */}
                    <div className="space-y-6 text-base">
                      {/* Name Field */}
                      <div className="flex items-center">
                        <span className="font-semibold w-16">NAME:</span>
                        <span className="ml-4 font-semibold">{userData.name}</span>
                      </div>

                      {/* Age Field */}
                      <div className="flex items-center">
                        <span className="font-semibold w-16">AGE:</span>
                        <span className="ml-4 font-semibold">{userData.age}</span>
                      </div>

                      {/* Style Field */}
                      <div className="flex items-center">
                        <span className="font-semibold w-16">STYLE:</span>
                        <span className="ml-4">{selectedTheme.title}</span>
                      </div>

                      {/* Type Field */}
                      <div className="flex items-center">
                        <span className="font-semibold w-16">TYPE:</span>
                        <span className="ml-4">BIRTHDAY</span>
                      </div>

                      {/* Status Field */}
                      <div className="flex items-center">
                        <span className="font-semibold w-16">STATUS:</span>
                        <span className="ml-4 text-black font-semibold">
                          {videoUrl ? 'COMPLETE' : 'READY'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Center Dotted Divider */}
                <div className="flex items-center justify-center">
                  <div className="w-px h-full border-l-2 border-dashed border-black"></div>
                </div>

                {/* Right Side - Video Preview with Buttons Below */}
                <div className="w-1/2 relative pl-6 flex flex-col">
                  {/* Video Thumbnail - Fixed 16:9 aspect ratio */}
                  <div className="w-full bg-black rounded border-2 border-black overflow-hidden relative mb-4" style={{ aspectRatio: '16/9' }}>
                    {/* Video Preview */}
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
                    
                    {/* Video Play Button Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <button
                        onClick={handlePlayVideo}
                        className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200"
                      >
                        <Play size={20} className="text-black ml-1" fill="currentColor" />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons - Inside Card Below Thumbnail */}
                  <div className="space-y-2 flex-1">
                    {/* Download Video Button */}
                    <button
                      onClick={handleDownload}
                      className="w-full flex items-center justify-center px-3 py-2 bg-black text-white rounded font-semibold text-xs uppercase tracking-wider hover:text-orange-400 transition-all duration-200"
                      onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                    >
                      <Download size={14} className="mr-2" />
                      DOWNLOAD VIDEO
                    </button>

                    {/* Share Now Button */}
                    <div className="relative group">
                      <button 
                        className="w-full flex items-center justify-center px-3 py-2 bg-black text-white rounded font-semibold text-xs uppercase tracking-wider hover:text-orange-400 transition-all duration-200"
                        onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'white'}
                      >
                        <Share2 size={14} className="mr-2" />
                        SHARE NOW
                      </button>
                      
                      {/* Share Options Dropdown */}
                      <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto z-10">
                        <div className="p-1">
                          <button
                            onClick={() => handleShare('twitter')}
                            className="w-full flex items-center px-2 py-1 text-black hover:bg-gray-100 rounded text-xs transition-colors"
                          >
                            <Twitter size={12} className="mr-2" />
                            <span className="font-semibold uppercase">Twitter</span>
                          </button>
                          <button
                            onClick={() => handleShare('instagram')}
                            className="w-full flex items-center px-2 py-1 text-black hover:bg-gray-100 rounded text-xs transition-colors"
                          >
                            <Instagram size={12} className="mr-2" />
                            <span className="font-semibold uppercase">Instagram</span>
                          </button>
                          <button
                            onClick={() => handleShare('copy')}
                            className="w-full flex items-center px-2 py-1 text-black hover:bg-gray-100 rounded text-xs transition-colors"
                          >
                            <Share2 size={12} className="mr-2" />
                            <span className="font-semibold uppercase">Copy Link</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Create Another Button */}
                    <button
                      onClick={onStartOver}
                      className="w-full px-3 py-2 border border-black text-black rounded font-semibold text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-200"
                    >
                      CREATE ANOTHER
                    </button>
                  </div>
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
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  );
}