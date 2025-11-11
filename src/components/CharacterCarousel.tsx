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
    <div className="min-h-screen" style={{ backgroundColor: '#EEEDD8' }}>
      {/* Header */}
      <header 
        className="sticky top-0 z-50 shadow-lg"
        style={{ backgroundColor: '#1B1B1B' }}
      >
        <div className="w-full px-4 md:px-8" style={{ width: '100vw', margin: 0 }}>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img 
                src="/ygpng.png" 
                alt="yougenius" 
                className="h-9 md:h-12 w-auto"
              />
            </div>
            
            {/* Center - Headlines */}
            <div className="flex-1 text-center mx-4 md:mx-8">
              <h1 
                className="font-primary text-lg md:text-2xl tracking-wider mb-1"
                style={{ 
                  color: '#EEEDD8',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                CREATE CUSTOM AI VIDEOS
              </h1>
              <p 
                className="font-secondary text-xs md:text-sm opacity-90"
                style={{ 
                  color: '#A7C342',
                  fontFamily: 'Roboto Mono, monospace',
                  fontWeight: 400
                }}
              >
                Choose a character. Pick your vibe. Get your video in 60 seconds.
              </p>
            </div>
            
            {/* Right side - Reserved for future */}
            <div className="flex-shrink-0 w-9 md:w-12"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-10 md:py-16">
        <div className="relative w-full max-w-6xl">
          {/* Main Content Card */}
          <div className="flex items-center justify-center gap-4 md:gap-16">
            {/* Left Navigation Arrow */}
            <button
              onClick={navigatePrevious}
              className="w-12 h-12 md:w-15 md:h-15 rounded-full border-3 transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg flex-shrink-0"
              style={{ 
                backgroundColor: '#A7C342',
                borderColor: '#1B1B1B'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8B8B7';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#A7C342';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              aria-label="Previous template"
            >
              <ChevronLeft size={24} style={{ color: '#1B1B1B' }} strokeWidth={3} className="mx-auto" />
            </button>

            {/* Video Card */}
            <div 
              className="rounded-xl shadow-2xl overflow-hidden flex-shrink-0"
              style={{ backgroundColor: '#E5E5E5' }}
            >
              {/* Video Container with Black Frame */}
              <div 
                className="relative p-2 md:p-2"
                style={{ 
                  backgroundColor: '#1B1B1B',
                  aspectRatio: '16/9'
                }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Video/Image Area */}
                <div className="relative w-full h-full overflow-hidden rounded-sm">
                  {/* Loading State */}
                  {!imageLoaded && (
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ backgroundColor: '#1B1B1B' }}
                    >
                      <div 
                        className="font-secondary text-sm"
                        style={{ color: '#EEEDD8' }}
                      >
                        Loading character...
                      </div>
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
                    onError={() => setImageLoaded(true)}
                  />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <div 
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(238, 237, 216, 0.9)' }}
                    >
                      <Play size={24} style={{ color: '#1B1B1B' }} className="ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {/* Character Info Bar (Bottom of Frame) */}
                  <div 
                    className="absolute bottom-0 left-0 right-0 px-4 py-3 md:px-6 md:py-4"
                    style={{ backgroundColor: '#1B1B1B' }}
                  >
                    <div className="flex items-center justify-between">
                      {/* Character Info */}
                      <div className="flex-1 min-w-0">
                        <h2 
                          className="font-primary text-lg md:text-2xl leading-tight mb-1"
                          style={{ 
                            color: '#EEEDD8',
                            fontFamily: 'Montserrat, sans-serif',
                            fontWeight: 700,
                            fontStyle: 'italic'
                          }}
                        >
                          {currentTemplate.name}
                        </h2>
                        <p 
                          className="font-secondary text-xs md:text-sm opacity-60 leading-tight"
                          style={{ 
                            color: '#EEEDD8',
                            fontFamily: 'Roboto Mono, monospace',
                            fontWeight: 400
                          }}
                        >
                          {currentTemplate.description}
                        </p>
                      </div>
                      
                      {/* Navigation Counter */}
                      <div className="ml-4 flex-shrink-0">
                        <span 
                          className="font-secondary text-sm md:text-base"
                          style={{ 
                            color: '#EEEDD8',
                            fontFamily: 'Roboto Mono, monospace',
                            fontWeight: 400
                          }}
                        >
                          {currentIndex + 1}/9
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Navigation Arrow */}
            <button
              onClick={navigateNext}
              className="w-12 h-12 md:w-15 md:h-15 rounded-full border-3 transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg flex-shrink-0"
              style={{ 
                backgroundColor: '#A7C342',
                borderColor: '#1B1B1B'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F8B8B7';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#A7C342';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
              aria-label="Next template"
            >
              <ChevronRight size={24} style={{ color: '#1B1B1B' }} strokeWidth={3} className="mx-auto" />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="flex justify-center mt-6 space-x-2 md:space-x-3">
            {templates.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToIndex(index)}
                className={`w-2.5 h-2.5 md:w-4 md:h-4 border-2 md:border-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  index === currentIndex
                    ? 'scale-120 border-3 opacity-100'
                    : 'opacity-60 hover:opacity-80'
                }`}
                style={{
                  backgroundColor: index === currentIndex ? '#A7C342' : '#EEEDD8',
                  borderColor: '#1B1B1B',
                  focusRingColor: '#1B1B1B'
                }}
                aria-label={`Go to template ${index + 1}`}
              />
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSelectCharacter}
              data-cta="true"
              className="font-primary text-lg md:text-xl px-12 md:px-16 py-4 md:py-5 border-3 rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-4 active:scale-95"
              style={{ 
                backgroundColor: '#1B1B1B',
                color: '#A7C342',
                borderColor: '#1B1B1B',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 700,
                fontStyle: 'italic',
                textTransform: 'uppercase',
                focusRingColor: '#1B1B1B'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#A7C342';
                e.currentTarget.style.color = '#1B1B1B';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1B1B1B';
                e.currentTarget.style.color = '#A7C342';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              SELECT THIS CHARACTER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}