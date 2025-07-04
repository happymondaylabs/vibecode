import React, { useState } from 'react';
import { ThemeSelector } from './components/ThemeSelector';
import { LoadingScreen } from './components/LoadingScreen';
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
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0]);
  const [userData, setUserData] = useState<UserData>({
    name: '',
    age: '',
    message: ''
  });
  const [userEmail, setUserEmail] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

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

  const handleFormSubmit = async () => {
    // For the form submission, we only need name and age (message is optional for now)
    const formData = { ...userData, message: userData.message || `Happy ${userData.age}th Birthday!` };
    
    if (validateUserData(formData)) {
      clearToasts();
      setUserData(formData);
      setCurrentStep('loading');

      // Start video generation
      try {
        const videoUrl = await startGeneration({
          userData: formData,
          theme: selectedTheme
        });
        setGeneratedVideoUrl(videoUrl);
      } catch (error) {
        console.error('Video generation failed:', error);
        // Continue to email step even if video generation fails
        // We'll show a placeholder video
      }
    } else {
      addToast('PLEASE FIX THE ERRORS ABOVE', 'error');
    }
  };

  const handleLoadingComplete = () => {
    setCurrentStep('email');
  };

  const handleRetryGeneration = async () => {
    resetVideoGeneration();
    try {
      const videoUrl = await startGeneration({
        userData,
        theme: selectedTheme
      });
      setGeneratedVideoUrl(videoUrl);
    } catch (error) {
      console.error('Video generation retry failed:', error);
    }
  };

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setCurrentStep('payment');
  };

  const handlePaymentComplete = () => {
    addToast('PAYMENT SUCCESSFUL! YOUR VIBE CARD IS READY', 'success');
    setCurrentStep('complete');
  };

  const handleStartOver = () => {
    setCurrentStep('form');
    setSelectedTheme(themes[0]);
    setUserData({ name: '', age: '', message: '' });
    setUserEmail('');
    setGeneratedVideoUrl(null);
    clearErrors();
    clearToasts();
    resetVideoGeneration();
  };

  const renderCurrentStep = () => {
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
          />
        );

      case 'email':
        return (
          <EmailCapture
            userData={userData}
            onSubmit={handleEmailSubmit}
          />
        );

      case 'payment':
        return (
          <PaymentOptions onPaymentComplete={handlePaymentComplete} />
        );

      case 'complete':
        return (
          <CompletionScreen
            userData={userData}
            selectedTheme={selectedTheme}
            videoUrl={generatedVideoUrl}
            onStartOver={handleStartOver}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      currentStep === 'complete' ? 'bg-orange-400' : 'bg-orange-400'
    }`}>
      {/* Header */}
      {currentStep !== 'loading' && currentStep !== 'complete' && (
        <header className="bg-black text-white shadow-lg border-b-4 border-orange-500">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-black tracking-wider">
                  VIBE CARD
                </h1>
                <p className="text-orange-400 mt-1 text-sm font-mono tracking-wide">
                  PAPER BIRTHDAY CARDS ARE BORING
                </p>
              </div>
              <div className="text-right text-xs font-mono max-w-md">
                <div className="mb-2 text-orange-400 font-black tracking-wider">
                  PAPER CARDS → VIBE CARDS
                </div>
                <div className="leading-relaxed">
                  Send custom video birthday cards that actually<br />
                  make people laugh, share, and remember you forever.
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {renderCurrentStep()}
      </main>

      {/* Footer */}
      {currentStep !== 'loading' && currentStep !== 'complete' && (
        <footer className="bg-black text-white shadow-lg border-t-4 border-orange-500 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black tracking-wider">
                  VIBE CARD
                </h2>
                <p className="text-orange-400 mt-1 text-xs font-mono tracking-wide">
                  © 2025 YOUGENIUS.CO
                </p>
              </div>
              <div className="text-right text-xs font-mono max-w-md">
                <div className="mb-2 text-orange-400 font-black tracking-wider">
                  CONTACT & SUPPORT
                </div>
                <div className="leading-relaxed">
                  Questions? Issues? We're here to help.<br />
                  Email us at info@yougenius.co
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