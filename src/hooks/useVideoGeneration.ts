import { useState, useCallback } from 'react';
import { generateVideo, VideoGenerationRequest, VideoGenerationResponse } from '../services/falApi';

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

    try {
      console.log('🚀 Starting video generation via Netlify function...');
      console.log('Request details:', {
        name: request.userData.name,
        age: request.userData.age,
        theme: request.theme.title,
        themeId: request.theme.id
      });
      
      setProgress(30);
      
      // Simulate progress while waiting for the function
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 90));
      }, 1000);

      const result = await generateVideo(request);
      
      clearInterval(progressInterval);
      
      if (result.status === 'completed' && result.video_url) {
        console.log('✅ Video completed:', result.video_url);
        setVideoUrl(result.video_url);
        setProgress(100);
        setIsGenerating(false);
        return result.video_url;
      } else {
        throw new Error('Video generation failed - no video URL received');
      }
    } catch (err) {
      console.error('Video generation hook error:', err);
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