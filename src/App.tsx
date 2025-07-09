import React, { useState } from 'react';
import { SEOHead } from './components/SEOHead';
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

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('form');
  const [showTransition, setShowTransition] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
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
    setCurrentStep('form');
    setShowTransition(false);
    setSelectedTheme(themes[0]);
    setUserData({ name: '', age: '', message: '' });
    setUserEmail('');
    setGeneratedVideoUrl(null);
    setIsPending(false);
    clearErrors();
    clearToasts();
    resetVideoGeneration();
  };

  const handleStartOver = () => {
    setCurrentStep('form');
    setShowTransition(false);
    setSelectedTheme(themes[0]);
    setUserData({ name: '', age: '', message: '' });
    setUserEmail('');
    setGeneratedVideoUrl(null);
    setIsPending(false);
    clearErrors();
    clearToasts();
    resetVideoGeneration();
  };

  const renderCurrentStep = () => {
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
      style={{ backgroundColor: currentThemeColor }}
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
      {currentStep !== 'loading' && currentStep !== 'complete' && !showTransition && (
        <header 
          className="bg-black text-white shadow-lg border-b-4 transition-all duration-500"
          style={{ borderBottomColor: currentThemeColor }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 md:py-3">
            <div className="flex justify-between items-center md:items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <img 
                    src="/imagelogo transparent.png" 
                    alt="VIBE CARD" 
                    className="h-12 md:h-24 w-auto"
                  />
                </div>
              </div>
              <div className="text-right text-xs max-w-xs md:max-w-md ml-4">
                <div 
                  className="mb-0.5 md:mb-2 font-technical font-semibold tracking-technical transition-all duration-500 text-xs md:text-sm"
                  style={{ color: currentThemeColor }}
                >
                  PAPER BIRTHDAY CARDS ARE BORING
                </div>
                <div className="leading-relaxed hidden md:block font-technical">
                  Send custom birthday videos that make<br />
                  people laugh, remember, and save paper.
                </div>
                <div className="leading-tight md:hidden text-xs font-technical">
                  Send custom birthday videos that make people laugh, remember, and save paper.
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-4 md:py-8">
        {renderCurrentStep()}
      </main>

      {/* Footer */}
      {currentStep !== 'loading' && currentStep !== 'complete' && !showTransition && (
        <footer 
          className="bg-black text-white shadow-lg border-t-4 mt-16 transition-all duration-500"
          style={{ borderTopColor: currentThemeColor }}
        >
          <div className="max-w-6xl mx-auto px-4 py-3 md:py-3">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
              <div>
                <div className="flex items-center">
                  <img 
                    src="/imagelogo transparent.png" 
                    alt="VIBE CARD" 
                    className="h-12 md:h-18 w-auto"
                  />
                </div>
              </div>
              <div className="text-left md:text-right text-xs max-w-md">
                <div 
                  className="mb-1 md:mb-2 font-technical font-semibold tracking-technical transition-all duration-500"
                  style={{ color: currentThemeColor }}
                >
                  © 2025 YOUGENIUS.CO
                </div>
                <div className="leading-relaxed hidden md:block font-technical">
                  Questions? Issues? We're here to help.<br />
                  Email us at info@yougenius.co
                </div>
                <div className="leading-relaxed md:hidden text-xs font-technical">
                  Questions? Email us at info@yougenius.co
                </div>
              </div>
            </div>
          </div>
        </footer>
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