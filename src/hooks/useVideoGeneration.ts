import { useState, useCallback } from 'react';
import { generateVideo, VideoGenerationRequest } from '../services/falApi';

export function useVideoGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const startGeneration = useCallback(async (request: VideoGenerationRequest) => {
    // Check for developer bypass
    const isDevBypass = 
      import.meta.env.VITE_DEV_BYPASS_NAME === request.userData.name &&
      import.meta.env.VITE_DEV_BYPASS_AGE === request.userData.age;

    if (isDevBypass) {
      console.log('🛠 Developer bypass active - simulating video generation');
      console.log(`Magic combo detected: ${request.userData.name} + ${request.userData.age}`);
      console.log(`Testing theme: ${request.theme.title} (${request.theme.id})`);
      
      // Simulate realistic generation time for testing
      setProgress(30);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(60);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(90);
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress(100);
      
      console.log('🛠 Developer bypass - using theme image as mock video');
      setVideoUrl(request.theme.image);
      setIsGenerating(false);
      return request.theme.image;
    }

    setIsGenerating(true);
    setProgress(10);
    setError(null);
    setVideoUrl(null);

    try {
      console.log('🚀 Starting queue-based video generation...');
      console.log('Request details:', JSON.stringify({
        name: request.userData.name,
        age: request.userData.age,
        theme: request.theme.title,
        themeId: request.theme.id,
        devBypass: isDevBypass
      }));
      
      setProgress(20);
      
      // Start progress simulation
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 90) {
            return prev + Math.random() * 10;
          }
          return prev;
        });
      }, 2000);

      // Call the new queue-based generation
      const result = await generateVideo(request);
      
      clearInterval(progressInterval);
      
      if (isDevBypass) {
        console.log('🛠 Developer bypass - using theme image as video URL');
        setVideoUrl(request.theme.image);
        setProgress(100);
        setIsGenerating(false);
        return request.theme.image;
      }
      
      if (result.status === 'completed' && result.video_url) {
        console.log('✅ Video completed:', result.video_url);
        setVideoUrl(result.video_url);
        setProgress(100);
        setIsGenerating(false);
        return result.video_url;
      } else if (result.status === 'pending') {
        console.log('⏰ Video generation pending, will continue in background');
        setProgress(100);
        setIsGenerating(false);
        // Don't set videoUrl, but don't throw error either
        return null;
      } else {
        throw new Error('Video generation failed - no video URL received');
      }
    } catch (err) {
      console.error('Video generation hook error:', err);
      
      // In dev bypass mode, still return success with theme image
      if (isDevBypass) {
        console.log('🛠 Developer bypass - ignoring error and using theme image');
        setVideoUrl(request.theme.image);
        setProgress(100);
        setIsGenerating(false);
        return request.theme.image;
      }
      
      setError(err instanceof Error ? err.message : String(err));
      setIsGenerating(false);
      setProgress(0);
      throw err;
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