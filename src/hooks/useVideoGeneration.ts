import { useState, useCallback } from 'react';
import { UserData, Theme } from '../types';

export interface VideoGenerationRequest {
  userData: UserData;
  theme: Theme;
}

export function useVideoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const startGeneration = useCallback(async (request: VideoGenerationRequest) => {
    setIsGenerating(true);
    setProgress(10);
    setError(null);
    setVideoUrl(null);

    // Check for developer bypass
    const isDevBypass = 
      import.meta.env.VITE_DEV_BYPASS_NAME === request.userData.name &&
      import.meta.env.VITE_DEV_BYPASS_AGE === request.userData.age;

    if (isDevBypass) {
      console.log('🛠 DEVELOPER BYPASS: Testing video generation');
      console.log(`Magic combo: ${request.userData.name} + ${request.userData.age}`);
      console.log(`Testing theme: ${request.theme.title}`);
    }

    try {
      console.log('🚀 Starting video generation via Netlify Functions...');
      
      setProgress(20);
      
      // 1. Submit video generation request
      const submitResponse = await fetch('/.netlify/functions/submitVideo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: request.userData,
          theme: request.theme
        })
      });

      if (!submitResponse.ok) {
        const errorData = await submitResponse.json().catch(() => ({}));
        throw new Error(errorData.error || `Submit failed: ${submitResponse.status}`);
      }

      const { requestId } = await submitResponse.json();
      console.log('✅ Video submitted with request ID:', requestId);

      setProgress(30);

      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 85) {
            return prev + Math.random() * 8;
          }
          return prev;
        });
      }, 3000);

      // 2. Poll for completion (5 minutes max)
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes at 5-second intervals
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
        
        console.log(`⏳ Checking video status (attempt ${attempts + 1}/${maxAttempts})...`);
        
        try {
          const statusResponse = await fetch('/.netlify/functions/checkVideo', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ requestId })
          });

          if (statusResponse.ok) {
            const result = await statusResponse.json();
            
            if (result.videoUrl) {
              clearInterval(progressInterval);
              console.log('✅ Video completed:', result.videoUrl);
              
              if (isDevBypass) {
                console.log('🛠 DEV BYPASS: Video generation completed successfully!');
              }
              
              setVideoUrl(result.videoUrl);
              setProgress(100);
              setIsGenerating(false);
              return result.videoUrl;
            } else if (result.status) {
              console.log('⏳ Video still processing:', result.status);
              attempts++;
              continue;
            }
          } else {
            const errorData = await statusResponse.json().catch(() => ({}));
            console.error(`❌ Status check failed: ${statusResponse.status} - ${errorData.error}`);
            attempts++;
            continue;
          }
        } catch (statusError) {
          console.error(`❌ Error checking status (attempt ${attempts + 1}):`, statusError);
          attempts++;
          continue;
        }
      }
      
      // Timeout reached - return pending status
      clearInterval(progressInterval);
      console.log('⏰ Video generation taking longer than 5 minutes');
      
      if (isDevBypass) {
        console.log('🛠 DEV BYPASS: Video pending - this is normal for real generation');
      }
      
      setProgress(100);
      setIsGenerating(false);
      return null; // Indicates pending status

    } catch (err) {
      console.error('Video generation error:', err);
      
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      // Provide user-friendly error messages
      let userMessage = errorMessage;
      if (errorMessage.includes('fetch')) {
        userMessage = 'Network error: Unable to connect to video service. Please check your connection.';
      } else if (errorMessage.includes('Submit failed: 422')) {
        userMessage = 'Invalid video parameters. Please try a different theme or contact support.';
      } else if (errorMessage.includes('Submit failed: 502')) {
        userMessage = 'Video service temporarily unavailable. Please try again in a few minutes.';
      }
      
      setError(userMessage);
      setIsGenerating(false);
      setProgress(0);
      throw new Error(userMessage);
    }
  }, []);

  const reset = useCallback(() => {
    console.log('🔄 Resetting video generation state');
    setIsGenerating(false);
    setProgress(0);
    setError(null);
    setVideoUrl(null);
  }, []);

  return {
    isGenerating,
    progress,
    error,
    videoUrl,
    startGeneration,
    reset
  };
}