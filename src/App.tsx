import React, { useState } from 'react';
import { SEOHead } from './components/SEOHead';
import { CharacterCarousel } from './components/CharacterCarousel';
import { FormScreen } from './components/FormScreen';
import { ThemeSelector } from './components/ThemeSelector';
import { LoadingScreen } from './components/LoadingScreen';
import { TransitionLoading } from './components/TransitionLoading';
import { EmailCapture } from './components/EmailCapture';
import { PaymentOptions } from './components/PaymentOptions';
import { CompletionScreen } from './components/CompletionScreen';
import { Toast } from './components/Toast';
import { useValidation } from './hooks/useValidation';
import { useToast } from './hooks/useToast';
import { useVideoGeneration } from './hooks/useVideoGeneration';
import { themes } from './data/themes';
import { AppStep, UserData, Theme } from './types';

interface Template {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: 'video';
}

interface FormData {
  template: Template;
  useCase: 'personal' | 'brand' | 'fun';
  name: string;
  age: string;
  type: string;
  price: number;
}

function App() {
  const [currentStep, setCurrentStep] = useState<'carousel' | 'form-screen' | AppStep>('carousel');
  const [showTransition, setShowTransition] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: '',
    message: ''
  });
  const [userEmail, setUserEmail] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const { errors, validateUserData, clearErrors } = useValidation();
  const { toasts, addToast, removeToast, clearToasts } = useToast();
  const { 
    isGenerating, 
    progress, 
    error: videoError, 
    videoUrl, 
    startGeneration, 
    reset: resetVideoGeneration 
  } = useVideoGeneration();

  // Get current theme color
  const currentThemeColor = selectedTheme.color;

  const handleSelectCharacter = (template: Template) => {
    setSelectedTemplate(template);
    // Convert template to theme format for compatibility
    const themeFromTemplate: Theme = {
      id: template.id,
      title: template.name,
      description: template.description,
      image: template.imageUrl,
      category: 'Custom',
      code: '1/9',
      color: '#00FF9D'
    };
    setSelectedTheme(themeFromTemplate);
    setCurrentStep('form-screen');
  };

  const handleFormScreenSubmit = (data: FormData) => {
    setFormData(data);
    // Convert form data to userData format for compatibility
    setUserData({
      name: data.name,
      age: data.age,
      message: `Happy ${data.age}th Birthday!`
    });
    setCurrentStep('payment');
  };

  const handleFormScreenBack = () => {
    setCurrentStep('carousel');
  };

  const handleTemplateChange = (template: Template) => {
    setSelectedTemplate(template);
    // Update theme as well for compatibility
    const themeFromTemplate: Theme = {
      id: template.id,
      title: template.name,
      description: template.description,
      image: template.imageUrl,
      category: 'Custom',
      code: '1/9',
      color: '#00FF9D'
    };
    setSelectedTheme(themeFromTemplate);
  };

  const handleFormSubmit = async () => {
    // For the form submission, we only need name and age (message is optional for now)
    const formData = { ...userData, message: userData.message || `Happy ${userData.age}th Birthday!` };
    
    if (validateUserData(formData)) {
      clearToasts();
      setUserData(formData);
      setShowTransition(true);
    } else {
      addToast('PLEASE FIX THE ERRORS ABOVE', 'error');
    }
  };

  const handleTransitionComplete = () => {
    setShowTransition(false);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = async () => {
    addToast('PAYMENT SUCCESSFUL! GENERATING YOUR VIBE CARD', 'success');
    setCurrentStep('loading');

    // Now start video generation after payment
    try {
      console.log('Starting video generation after payment...');
      const videoUrl = await startGeneration({
        userData,
        theme: selectedTheme
      });
      
      if (videoUrl) {
        console.log('Video generation completed with URL');
        setGeneratedVideoUrl(videoUrl);
        setIsPending(false);
      } else {
        // Video is pending
        console.log('Video generation is pending');
        setIsPending(true);
      }
    } catch (error) {
      console.error('Video generation failed:', error instanceof Error ? error.message : String(error));
      setIsPending(false);
    }
  };

  const handleLoadingComplete = () => {
    setCurrentStep('complete');
  };

  const handleRetryGeneration = async () => {
    resetVideoGeneration();
    setIsPending(false);
    try {
      const videoUrl = await startGeneration({
        userData,
        theme: selectedTheme
      });
      
      if (videoUrl) {
        setGeneratedVideoUrl(videoUrl);
        setIsPending(false);
      } else {
        setIsPending(true);
      }
    } catch (error) {
      console.error('Video generation retry failed:', error);
      setIsPending(false);
    }
  };

  const handleGoHome = () => {
    setCurrentStep('carousel');
    setShowTransition(false);
    setSelectedTheme(themes[0]);
    setSelectedTemplate(null);
    setFormData(null);
    setUserData({ name: '', age: '', message: '' });
    setUserEmail('');
    setGeneratedVideoUrl(null);
    setIsPending(false);
    clearErrors();
    clearToasts();
    resetVideoGeneration();
  };

  const handleStartOver = () => {
    setCurrentStep('carousel');
    setShowTransition(false);
    setSelectedTheme(themes[0]);
    setSelectedTemplate(null);
    setFormData(null);
    setUserData({ name: '', age: '', message: '' });
    setUserEmail('');
    setGeneratedVideoUrl(null);
    setIsPending(false);
    clearErrors();
    clearToasts();
    resetVideoGeneration();
  };

  const renderCurrentStep = () => {
    if (currentStep === 'carousel') {
      return <CharacterCarousel onSelectCharacter={handleSelectCharacter} />;
    }

    if (currentStep === 'form-screen' && selectedTemplate) {
      return (
        <FormScreen 
          selectedTemplate={selectedTemplate}
          onTemplateChange={handleTemplateChange}
          onSubmit={handleFormScreenSubmit}
          onGoBack={handleFormScreenBack}
        />
      );
    }

    if (showTransition) {
      return (
        <TransitionLoading 
          onComplete={handleTransitionComplete}
          themeColor={currentThemeColor}
          userName={userData.name}
        />
      );
    }

    switch (currentStep) {
      case 'form':
        return (
          <div className="space-y-12">
            <ThemeSelector 
              selectedTheme={selectedTheme}
              onThemeChange={setSelectedTheme}
              userData={userData}
              onUserDataChange={setUserData}
              errors={errors}
              onSubmit={handleFormSubmit}
              themeColor={currentThemeColor}
            />
          </div>
        );

      case 'loading':
        return (
          <LoadingScreen 
            onComplete={handleLoadingComplete}
            isGenerating={isGenerating}
            progress={progress}
            error={videoError}
            onRetry={handleRetryGeneration}
            isPending={isPending}
            themeColor={currentThemeColor}
            onGoHome={handleGoHome}
          />
        );

      case 'payment':
        return (
          <PaymentOptions 
            userData={userData}
            onPaymentComplete={handlePaymentComplete}
            onGoBack={() => setCurrentStep('form')}
            themeColor={currentThemeColor}
          />
        );

      case 'complete':
        return (
          <CompletionScreen
            userData={userData}
            selectedTheme={selectedTheme}
            videoUrl={generatedVideoUrl}
            onStartOver={handleStartOver}
            themeColor={currentThemeColor}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen transition-all duration-500"
      style={{ backgroundColor: '#EEEDD8' }}
    >
      {/* SEO Head Component */}
      <SEOHead 
        title={currentStep === 'form' ? 
          `VIBE CARD - ${selectedTheme.title} Birthday Videos` : 
          'VIBE CARD - Paper Birthday Cards Are Boring'
        }
        description={currentStep === 'form' ? 
          `Create a ${selectedTheme.title.toLowerCase()} birthday video card. ${selectedTheme.description}` :
          'Create custom AI-generated birthday video cards that make people laugh, remember, and save paper.'
        }
      />
      
      {/* Header */}
      {currentStep !== 'carousel' && currentStep !== 'loading' && currentStep !== 'complete' && !showTransition && (
        <div className="min-h-screen" style={{ backgroundColor: '#EEEDD8' }}>
          {/* Header - Exact same as CharacterCarousel */}
          <header 
            className="sticky top-0 z-50 shadow-lg w-full"
            style={{ backgroundColor: '#1B1B1B' }}
          >
            <div className="w-full px-4 md:px-8">
              <div className="flex items-center justify-between h-16 md:h-20">
                {/* Left side - Headlines */}
                <div className="flex-1">
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
                
                {/* Right side - Logo */}
                <div className="flex-shrink-0">
                  <img 
                    src="/ygpng.png" 
                    alt="yougenius" 
                    className="h-18 md:h-24 w-auto"
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="px-4 py-10 md:py-16">
            {renderCurrentStep()}
          </div>
        </div>
      )}

      {/* Main Content */}
      {(currentStep === 'carousel' || currentStep === 'loading' || currentStep === 'complete' || showTransition) && (
        renderCurrentStep()
      )}


      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}

export default App;