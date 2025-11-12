import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: 'video';
}

interface FormScreenProps {
  selectedTemplate: Template;
  onTemplateChange: (template: Template) => void;
  onSubmit: (formData: FormData) => void;
  onGoBack: () => void;
}

interface FormData {
  template: Template;
  useCase: 'personal' | 'brand' | 'fun';
  name: string;
  type: string;
  price: number;
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

export function FormScreen({ selectedTemplate, onTemplateChange, onSubmit, onGoBack }: FormScreenProps) {
  const [currentTemplate, setCurrentTemplate] = useState(selectedTemplate);
  const [selectedUseCase, setSelectedUseCase] = useState<'personal' | 'brand' | 'fun'>('personal');
  const [name, setName] = useState('');
  const [errors, setErrors] = useState<{name?: string}>({});

  const currentIndex = templates.findIndex(template => template.id === currentTemplate.id);

  // Update parent when template changes
  useEffect(() => {
    onTemplateChange(currentTemplate);
  }, [currentTemplate, onTemplateChange]);

  const navigateTemplate = (direction: 'prev' | 'next') => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? templates.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === templates.length - 1 ? 0 : currentIndex + 1;
    }
    setCurrentTemplate(templates[newIndex]);
  };

  const navigateToIndex = (index: number) => {
    setCurrentTemplate(templates[index]);
  };

  const getPricing = (useCase: 'personal' | 'brand' | 'fun') => {
    switch (useCase) {
      case 'personal': return 12;
      case 'brand': return 25;
      case 'fun': return 8;
      default: return 12;
    }
  };

  const getType = (useCase: 'personal' | 'brand' | 'fun') => {
    switch (useCase) {
      case 'personal': return 'PERSONAL';
      case 'brand': return 'BRAND';
      case 'fun': return 'JUST FOR FUN';
      default: return 'PERSONAL';
    }
  };

  const validateForm = () => {
    const newErrors: {name?: string} = {};

    if (!name.trim()) {
      newErrors.name = 'NAME IS REQUIRED';
    } else if (name.length > 20) {
      newErrors.name = 'NAME TOO LONG (MAX 20)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const formData: FormData = {
        template: currentTemplate,
        useCase: selectedUseCase,
        name: name.trim(),
        type: getType(selectedUseCase),
        price: getPricing(selectedUseCase)
      };
      onSubmit(formData);
    }
  };

  const isFormValid = name.trim().length > 0 && !errors.name;

  return (
    <>
        {/* Desktop Layout */}
        <div className="hidden md:flex items-center justify-center gap-4 md:gap-16 max-w-7xl mx-auto">
          {/* Left Navigation Arrow */}
          <button
            onClick={() => navigateTemplate('prev')}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg border-3 transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg flex items-center justify-center"
            style={{ 
              backgroundColor: '#A7C342',
              borderColor: '#1B1B1B',
              focusRingColor: '#1B1B1B'
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
            <ChevronLeft size={24} style={{ color: '#1B1B1B' }} strokeWidth={3} />
          </button>

          {/* Content Card */}
          <div className="flex-shrink-1 w-full max-w-4xl">
            <div 
              className="rounded-xl shadow-2xl overflow-hidden mx-5 md:mx-15"
              style={{ backgroundColor: '#E5E5E5' }}
            >
              <div 
                className="relative p-2 md:p-2"
                style={{ 
                  backgroundColor: '#1B1B1B',
                  aspectRatio: '16/9'
                }}
              >
                {/* Form/Preview Area */}
                <div className="relative w-full h-full overflow-hidden rounded-sm">
                  <div className="flex h-full">
                    {/* Left Panel - Form */}
                    <div 
                      className="flex-1 p-6 md:p-12"
                      style={{ 
                        backgroundColor: '#EEEDD8',
                        borderRight: '2px dashed #1B1B1B'
                      }}
                    >

                  {/* Use Case Selector */}
                  <div className="mb-4">
                    <h3 
                      className="text-xs font-semibold uppercase tracking-wide mb-4"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      WHAT'S THIS VIDEO FOR?
                    </h3>
                    
                    <div className="space-y-2">
                      {/* Personal Button */}
                      <button
                        onClick={() => setSelectedUseCase('personal')}
                        className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                          selectedUseCase === 'personal' 
                            ? 'border-3 font-semibold' 
                            : 'hover:translate-x-1'
                        }`}
                        style={{
                          backgroundColor: selectedUseCase === 'personal' ? '#A7C342' : 'white',
                          borderColor: '#1B1B1B',
                          borderWidth: selectedUseCase === 'personal' ? '3px' : '2px'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedUseCase !== 'personal') {
                            e.currentTarget.style.backgroundColor = '#A7C342';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedUseCase !== 'personal') {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <div 
                          className="text-sm font-semibold uppercase"
                          style={{ 
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          PERSONAL
                        </div>
                        <div 
                          className="text-xs opacity-70 mt-1"
                          style={{ 
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          Birthday, holiday, or roast
                        </div>
                      </button>

                      {/* Brand Button */}
                      <button
                        onClick={() => setSelectedUseCase('brand')}
                        className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                          selectedUseCase === 'brand' 
                            ? 'border-3 font-semibold' 
                            : 'hover:translate-x-1'
                        }`}
                        style={{
                          backgroundColor: selectedUseCase === 'brand' ? '#A7C342' : 'white',
                          borderColor: '#1B1B1B',
                          borderWidth: selectedUseCase === 'brand' ? '3px' : '2px'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedUseCase !== 'brand') {
                            e.currentTarget.style.backgroundColor = '#A7C342';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedUseCase !== 'brand') {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <div 
                          className="text-sm font-semibold uppercase"
                          style={{ 
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          BRAND
                        </div>
                        <div 
                          className="text-xs opacity-70 mt-1"
                          style={{ 
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          Ad, product launch, or promo
                        </div>
                      </button>

                      {/* Just For Fun Button */}
                      <button
                        onClick={() => setSelectedUseCase('fun')}
                        className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                          selectedUseCase === 'fun' 
                            ? 'border-3 font-semibold' 
                            : 'hover:translate-x-1'
                        }`}
                        style={{
                          backgroundColor: selectedUseCase === 'fun' ? '#A7C342' : 'white',
                          borderColor: '#1B1B1B',
                          borderWidth: selectedUseCase === 'fun' ? '3px' : '2px'
                        }}
                        onMouseEnter={(e) => {
                          if (selectedUseCase !== 'fun') {
                            e.currentTarget.style.backgroundColor = '#A7C342';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedUseCase !== 'fun') {
                            e.currentTarget.style.backgroundColor = 'white';
                          }
                        }}
                      >
                        <div 
                          className="text-sm font-semibold uppercase"
                          style={{ 
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          JUST FOR FUN
                        </div>
                        <div 
                          className="text-xs opacity-70 mt-1"
                          style={{ 
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          No occasion, pure chaos
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Input Fields */}
                  <div className="space-y-3">
                    {/* Name Field */}
                    <div>
                      <label 
                        className="block text-xs font-semibold uppercase tracking-wide mb-1"
                        style={{ 
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        NAME:
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          setErrors(prev => ({ ...prev, name: undefined }));
                        }}
                        maxLength={20}
                        className={`w-full px-3 py-3 border rounded text-sm transition-all duration-200 focus:outline-none ${
                          errors.name 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-black bg-white focus:border-2'
                        }`}
                        style={{ 
                          fontFamily: 'Roboto Mono, monospace',
                          borderColor: errors.name ? '#ef4444' : '#1B1B1B'
                        }}
                        placeholder="Enter name"
                      />
                      <div className="flex justify-between mt-1">
                        <span 
                          className="text-xs opacity-60"
                          style={{ 
                            fontFamily: 'Roboto Mono, monospace',
                            color: '#1B1B1B'
                          }}
                        >
                          {name.length}/20
                        </span>
                        {errors.name && (
                          <span 
                            className="text-xs font-semibold"
                            style={{ color: '#ef4444' }}
                          >
                            {errors.name}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Type Field (Auto-populated) */}
                    <div>
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        TYPE:
                      </label>
                      <div
                        className="text-sm"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        {getType(selectedUseCase)}
                      </div>
                    </div>
                  </div>
                </div>

                    {/* Right Panel - Preview */}
                    <div 
                      className="flex-1 p-6 md:p-8 flex flex-col items-center justify-center"
                      style={{ backgroundColor: '#D8D7C3' }}
                    >

                  {/* Summary Section */}
                  <div className="w-full max-w-sm">
                    <h3
                      className="text-lg font-semibold uppercase tracking-wide mb-4 text-center"
                      style={{
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      SUMMARY
                    </h3>

                    {/* Video Type Field */}
                    <div className="mb-4">
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        VIDEO TYPE:
                      </label>
                      <div
                        className="text-sm"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        8 SECOND CUSTOM VIDEO
                      </div>
                    </div>

                    {/* Character Field */}
                    <div className="mb-4">
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        CHARACTER:
                      </label>
                      <div
                        className="text-sm"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        {currentTemplate.name}
                      </div>
                    </div>

                    {/* Format Field */}
                    <div className="mb-6">
                      <label
                        className="block text-xs font-semibold uppercase tracking-wide mb-1"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        FORMAT:
                      </label>
                      <div
                        className="text-sm"
                        style={{
                          fontFamily: 'Roboto Mono, monospace',
                          color: '#1B1B1B'
                        }}
                      >
                        MP4 VIDEO
                      </div>
                    </div>
                  </div>
                  {/* Generate Button - Moved from left side */}
                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`w-full mt-4 px-6 py-2 border-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 ${
                      isFormValid
                        ? 'cursor-pointer'
                        : 'cursor-not-allowed opacity-50'
                    }`}
                    style={{ 
                      backgroundColor: isFormValid ? '#1B1B1B' : '#9ca3af',
                      color: isFormValid ? '#A7C342' : '#6b7280',
                      borderColor: isFormValid ? '#1B1B1B' : '#9ca3af',
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      letterSpacing: '0.05em'
                    }}
                    onMouseEnter={(e) => {
                      if (isFormValid) {
                        e.currentTarget.style.backgroundColor = '#A7C342';
                        e.currentTarget.style.color = '#1B1B1B';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isFormValid) {
                        e.currentTarget.style.backgroundColor = '#1B1B1B';
                        e.currentTarget.style.color = '#A7C342';
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }
                    }}
                  >
                    CREATE VIDEO
                  </button>
                </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Navigation Arrow */}
          <button
            onClick={() => navigateTemplate('next')}
            className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg border-3 transition-all duration-150 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-lg flex items-center justify-center"
            style={{ 
              backgroundColor: '#A7C342',
              borderColor: '#1B1B1B',
              focusRingColor: '#1B1B1B'
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
            <ChevronRight size={24} style={{ color: '#1B1B1B' }} strokeWidth={3} />
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Mobile Navigation Header */}
          <div className="flex items-center justify-between mb-4 px-4">
            <button
              onClick={() => navigateTemplate('prev')}
              className="w-10 h-10 rounded-lg border-3 transition-all duration-150 hover:scale-110 flex items-center justify-center"
              style={{ 
                backgroundColor: '#A7C342',
                borderColor: '#1B1B1B'
              }}
            >
              <ChevronLeft size={20} style={{ color: '#1B1B1B' }} strokeWidth={3} />
            </button>
            
            <div className="text-center flex-1 mx-4">
              <p 
                className="text-xs uppercase tracking-wide font-semibold"
                style={{ color: '#1B1B1B' }}
              >
                {currentIndex + 1} OF 9 TEMPLATES
              </p>
            </div>
            
            <button
              onClick={() => navigateTemplate('next')}
              className="w-10 h-10 rounded-lg border-3 transition-all duration-150 hover:scale-110 flex items-center justify-center"
              style={{ 
                backgroundColor: '#A7C342',
                borderColor: '#1B1B1B'
              }}
            >
              <ChevronRight size={20} style={{ color: '#1B1B1B' }} strokeWidth={3} />
            </button>
          </div>

          {/* Mobile Content Card */}
          <div 
            className="rounded-xl shadow-2xl overflow-hidden mx-4 pb-2"
            style={{ backgroundColor: '#EEEDD8' }}
          >
            {/* Form Section */}
            <div className="p-4">
              {/* Template Header */}
              <div className="text-center mb-4">
                <div 
                  className="text-sm font-semibold uppercase tracking-wide"
                  style={{ 
                    fontFamily: 'Roboto Mono, monospace',
                    color: '#1B1B1B'
                  }}
                >
                  {currentTemplate.name}
                </div>
              </div>

              {/* Use Case Selector */}
              <div className="mb-4">
                <h3 
                  className="text-xs font-semibold uppercase tracking-wide mb-2"
                  style={{ 
                    fontFamily: 'Roboto Mono, monospace',
                    color: '#1B1B1B'
                  }}
                >
                  WHAT'S THIS VIDEO FOR?
                </h3>
                
                <div className="space-y-2">
                  {/* Personal Button */}
                  <button
                    onClick={() => setSelectedUseCase('personal')}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                      selectedUseCase === 'personal' 
                        ? 'border-3 font-semibold' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: selectedUseCase === 'personal' ? '#A7C342' : 'white',
                      borderColor: '#1B1B1B',
                      borderWidth: selectedUseCase === 'personal' ? '3px' : '2px'
                    }}
                  >
                    <div 
                      className="text-sm font-semibold uppercase"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      PERSONAL
                    </div>
                    <div 
                      className="text-xs opacity-70 mt-1"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      Birthday, holiday, or roast
                    </div>
                  </button>

                  {/* Brand Button */}
                  <button
                    onClick={() => setSelectedUseCase('brand')}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                      selectedUseCase === 'brand' 
                        ? 'border-3 font-semibold' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: selectedUseCase === 'brand' ? '#A7C342' : 'white',
                      borderColor: '#1B1B1B',
                      borderWidth: selectedUseCase === 'brand' ? '3px' : '2px'
                    }}
                  >
                    <div 
                      className="text-sm font-semibold uppercase"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      BRAND
                    </div>
                    <div 
                      className="text-xs opacity-70 mt-1"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      Ad, product launch, or promo
                    </div>
                  </button>

                  {/* Just For Fun Button */}
                  <button
                    onClick={() => setSelectedUseCase('fun')}
                    className={`w-full p-3 border-2 rounded-lg text-left transition-all duration-200 ${
                      selectedUseCase === 'fun' 
                        ? 'border-3 font-semibold' 
                        : ''
                    }`}
                    style={{
                      backgroundColor: selectedUseCase === 'fun' ? '#A7C342' : 'white',
                      borderColor: '#1B1B1B',
                      borderWidth: selectedUseCase === 'fun' ? '3px' : '2px'
                    }}
                  >
                    <div 
                      className="text-sm font-semibold uppercase"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      JUST FOR FUN
                    </div>
                    <div 
                      className="text-xs opacity-70 mt-1"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      No occasion, pure chaos
                    </div>
                  </button>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3 mb-4">
                {/* Name Field */}
                <div>
                  <label 
                    className="block text-xs font-semibold uppercase tracking-wide mb-1"
                    style={{ 
                      fontFamily: 'Roboto Mono, monospace',
                      color: '#1B1B1B'
                    }}
                  >
                    NAME:
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    maxLength={20}
                    className={`w-full px-3 py-2 border rounded text-sm transition-all duration-200 focus:outline-none ${
                      errors.name 
                        ? 'border-red-500 bg-red-50' 
                        : 'border-black bg-white'
                    }`}
                    style={{ 
                      fontFamily: 'Roboto Mono, monospace',
                      borderColor: errors.name ? '#ef4444' : '#1B1B1B'
                    }}
                    placeholder="Enter name"
                  />
                  <div className="flex justify-between mt-1">
                    <span 
                      className="text-xs opacity-60"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      {name.length}/20
                    </span>
                    {errors.name && (
                      <span 
                        className="text-xs font-semibold"
                        style={{ color: '#ef4444' }}
                      >
                        {errors.name}
                      </span>
                    )}
                  </div>
                </div>

                {/* Style and Type Fields */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span 
                      className="block text-xs font-semibold uppercase tracking-wide mb-0.5"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      STYLE:
                    </span>
                    <span 
                      className="text-xs"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      8 second custom video
                    </span>
                  </div>
                  <div>
                    <span 
                      className="block text-xs font-semibold uppercase tracking-wide mb-0.5"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      TYPE:
                    </span>
                    <span 
                      className="text-xs uppercase"
                      style={{ 
                        fontFamily: 'Roboto Mono, monospace',
                        color: '#1B1B1B'
                      }}
                    >
                      {getType(selectedUseCase)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`w-full px-6 py-2 border-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 ${
                  isFormValid
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-50'
                }`}
                style={{ 
                  backgroundColor: isFormValid ? '#1B1B1B' : '#9ca3af',
                  color: isFormValid ? '#A7C342' : '#6b7280',
                  borderColor: isFormValid ? '#1B1B1B' : '#9ca3af',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700,
                  fontStyle: 'italic',
                  letterSpacing: '0.05em'
                }}
              >
                CREATE VIDEO
              </button>
            </div>

            {/* Preview Section */}
            <div 
              className="p-4 border-t-2 border-dashed"
              style={{ 
                backgroundColor: '#D8D7C3',
                borderColor: '#1B1B1B'
              }}
            >
              {/* Character Image */}
              <div 
                className="w-full rounded-lg overflow-hidden mb-3"
                style={{ 
                  aspectRatio: '16/9',
                  border: '4px solid #1B1B1B',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                }}
              >
                <img
                  src={currentTemplate.imageUrl}
                  alt={currentTemplate.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Template Name */}
              <div 
                className="text-sm font-semibold uppercase tracking-wide mb-2 text-center"
                style={{ 
                  fontFamily: 'Roboto Mono, monospace',
                  color: '#1B1B1B'
                }}
              >
                {currentTemplate.name}
              </div>

              {/* Description */}
              <p 
                className="text-xs text-center mb-2 opacity-85 leading-relaxed"
                style={{ 
                  fontFamily: 'Roboto Mono, monospace',
                  color: '#1B1B1B'
                }}
              >
                {currentTemplate.description}
              </p>

              {/* Template Counter */}
              <div 
                className="text-center text-sm"
                style={{ 
                  fontFamily: 'Roboto Mono, monospace',
                  color: '#1B1B1B'
                }}
              >
                {currentIndex + 1}/9
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
    </>
  );
}