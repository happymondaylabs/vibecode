import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: 'video';
}

interface CharacterCarouselProps {
  onSelectCharacter: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: 'male-model-commercial',
    name: 'MALE MODEL COMMERCIAL',
    description: 'A shirtless exotic model delivers your birthday message like it\'s an infamous body wash ad.',
    imageUrl: '/image1.png',
    type: 'video'
  },
  {
    id: 'female-model-commercial',
    name: 'FEMALE MODEL COMMERCIAL',
    description: 'A female goddess says happy birthday like she\'s in love, like the classic burger commercial.',
    imageUrl: '/imagePINKMODEL.png',
    type: 'video'
  },
  {
    id: 'bigfoot-vlog',
    name: 'BIGFOOT VLOG',
    description: 'A hairy influencer emerges from the woods to wish you a weirdly wholesome birthday.',
    imageUrl: '/bigfoot-new.png',
    type: 'video'
  },
  {
    id: 'breaking-news',
    name: 'BREAKING NEWS',
    description: 'A dramatic anchor interrupts regular programming to report... somebody is old.',
    imageUrl: '/imagenewsanchoir.png',
    type: 'video'
  },
  {
    id: 'fake-infomercial',
    name: 'FAKE INFOMERCIAL',
    description: 'A narrated ad selling random products for people turning this age, like pills for old people.',
    imageUrl: '/Image8.png',
    type: 'video'
  },
  {
    id: 'jesus-of-nazareth',
    name: 'JESUS OF NAZARETH',
    description: 'Jesus delivers a divine birthday blessing... with just the right amount of holy confusion.',
    imageUrl: '/imagejesus.png',
    type: 'video'
  },
  {
    id: 'fast-food-manager',
    name: 'FAST FOOD MANAGER',
    description: 'A pissed off fast food manager goes off and serves up some hard truths instead of fries.',
    imageUrl: '/imageangry-manager.png',
    type: 'video'
  },
  {
    id: 'swamp-man',
    name: 'SWAMP MAN',
    description: 'A swamp man with a mullet reels in your birthday with a surprise and a great attitude.',
    imageUrl: '/imageswamp.png',
    type: 'video'
  },
  {
    id: 'hot-fireman',
    name: 'HOT FIREMAN',
    description: 'Did someone say there was a fire? If so, this is one hot birthday.',
    imageUrl: '/imagefireman.png',
    type: 'video'
  }
];

export function CharacterCarousel({ onSelectCharacter }: CharacterCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentTemplate = templates[currentIndex];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        navigatePrevious();
      } else if (event.key === 'ArrowRight') {
        navigateNext();
      } else if (event.key === 'Enter' || event.key === ' ') {
        if (document.activeElement?.getAttribute('data-cta') === 'true') {
          handleSelectCharacter();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  // Preload adjacent images
  useEffect(() => {
    const preloadImage = (src: string) => {
      const img = new Image();
      img.src = src;
    };

    // Preload next and previous images
    const nextIndex = (currentIndex + 1) % templates.length;
    const prevIndex = (currentIndex - 1 + templates.length) % templates.length;
    
    preloadImage(templates[nextIndex].imageUrl);
    preloadImage(templates[prevIndex].imageUrl);
  }, [currentIndex]);

  const navigateToIndex = (index: number) => {
    if (index === currentIndex || isTransitioning) return;
    
    setIsTransitioning(true);
    setImageLoaded(false);
    
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 200);
  };

  const navigateNext = () => {
    const nextIndex = (currentIndex + 1) % templates.length;
    navigateToIndex(nextIndex);
  };

  const navigatePrevious = () => {
    const prevIndex = (currentIndex - 1 + templates.length) % templates.length;
    navigateToIndex(prevIndex);
  };

  const handleSelectCharacter = () => {
    onSelectCharacter(currentTemplate);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navigateNext();
    } else if (isRightSwipe) {
      navigatePrevious();
    }
  };

  return (
    <div className="min-h-screen bg-green-400 flex items-center justify-center p-4" style={{ backgroundColor: '#00FF9D' }}>
      <div className="relative w-full max-w-4xl">
        {/* Navigation Arrows */}
        <button
          onClick={navigatePrevious}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-12 md:-translate-x-16 z-10 w-12 h-12 md:w-15 md:h-15 rounded-full border-3 border-black transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          style={{ backgroundColor: 'rgba(0, 255, 157, 0.9)' }}
          aria-label="Previous template"
        >
          <ChevronLeft size={24} className="text-black mx-auto" strokeWidth={3} />
        </button>

        <button
          onClick={navigateNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-12 md:translate-x-16 z-10 w-12 h-12 md:w-15 md:h-15 rounded-full border-3 border-black transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          style={{ backgroundColor: 'rgba(0, 255, 157, 0.9)' }}
          aria-label="Next template"
        >
          <ChevronRight size={24} className="text-black mx-auto" strokeWidth={3} />
        </button>

        {/* Main Content Card */}
        <div className="bg-gray-200 rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#E5E5E5' }}>
          {/* Video Container with Black Frame */}
          <div 
            className="relative bg-black p-2 md:p-2"
            style={{ aspectRatio: '16/9' }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Video/Image Area */}
            <div className="relative w-full h-full bg-black rounded-sm overflow-hidden">
              {/* Loading State */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                  <div className="text-white font-secondary text-sm">Loading character...</div>
                </div>
              )}
              
              {/* Character Image */}
              <img
                src={currentTemplate.imageUrl}
                alt={`${currentTemplate.name} - ${currentTemplate.description}`}
                className={`w-full h-full object-cover transition-opacity duration-200 ${
                  isTransitioning ? 'opacity-0' : 'opacity-100'
                } ${imageLoaded ? 'block' : 'hidden'}`}
                onLoad={handleImageLoad}
                onError={() => setImageLoaded(true)} // Show even if image fails to load
              />

              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                  <Play size={24} className="text-black ml-1" fill="currentColor" />
                </div>
              </div>

              {/* Character Info Bar (Bottom of Frame) */}
              <div className="absolute bottom-0 left-0 right-0 bg-black px-4 py-3 md:px-6 md:py-4">
                <div className="flex items-center justify-between">
                  {/* Character Info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-primary text-white text-lg md:text-2xl leading-tight mb-1">
                      {currentTemplate.name}
                    </h2>
                    <p className="font-secondary text-white text-xs md:text-sm opacity-60 leading-tight">
                      {currentTemplate.description}
                    </p>
                  </div>
                  
                  {/* Navigation Counter */}
                  <div className="ml-4 flex-shrink-0">
                    <span className="font-secondary text-white text-sm md:text-base">
                      {currentIndex + 1}/9
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex justify-center mt-6 space-x-2 md:space-x-3">
          {templates.map((_, index) => (
            <button
              key={index}
              onClick={() => navigateToIndex(index)}
              className={`w-2.5 h-2.5 md:w-4 md:h-4 border-2 md:border-3 border-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
                index === currentIndex
                  ? 'bg-transparent scale-120 border-3'
                  : 'bg-white opacity-60 hover:opacity-80'
              }`}
              aria-label={`Go to template ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleSelectCharacter}
            data-cta="true"
            className="font-primary text-lg md:text-xl px-12 md:px-16 py-4 md:py-5 bg-black border-3 border-black rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-4 active:scale-95"
            style={{ 
              color: '#00FF9D',
              backgroundColor: 'black'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#00FF9D';
              e.currentTarget.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'black';
              e.currentTarget.style.color = '#00FF9D';
            }}
          >
            SELECT THIS CHARACTER
          </button>
        </div>
      </div>
    </div>
  );
}