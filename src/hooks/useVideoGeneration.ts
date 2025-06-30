import { useState, useCallback } from 'react';
import { generateVideo, checkVideoStatus, VideoGenerationRequest, VideoGenerationResponse } from '../services/falApi';

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
      console.log('🚀 Starting video generation...');
      console.log('Request details:', {
        name: request.userData.name,
        age: request.userData.age,
        theme: request.theme.title,
        themeId: request.theme.id
      });
      
      setProgress(20);
      const result = await generateVideo(request);
      
      if (result.status === 'completed') {
        console.log('✅ Video completed immediately:', result.video_url);
        setVideoUrl(result.video_url);
        setProgress(100);
        setIsGenerating(false);
        return result.video_url;
      } else if (result.request_id) {
        console.log('⏳ Video queued, polling for completion...');
        setProgress(30);
        return await pollForCompletion(result.request_id);
      } else {
        throw new Error('Failed to start video generation - no request ID received');
      }
    } catch (err) {
      console.error('Video generation hook error:', err);
      // toString() will include the Error name and message
      setError(err instanceof Error ? err.toString() : String(err));
      setIsGenerating(false);
      setProgress(0);
      throw err;
    }
  }, []);

  const pollForCompletion = useCallback(async (requestId: string): Promise<string> => {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    const poll = async (): Promise<string> => {
      if (attempts >= maxAttempts) {
        throw new Error('Video generation timed out after 5 minutes');
      }

      attempts++;
      const pollProgress = 30 + ((attempts / maxAttempts) * 65);
      setProgress(Math.min(pollProgress, 95));

      try {
        console.log(`📊 Checking status (${attempts}/${maxAttempts})`);
        const status = await checkVideoStatus(requestId);
        
        if (status.status === 'completed' && status.video_url) {
          console.log('✅ Video completed:', status.video_url);
          setVideoUrl(status.video_url);
          setProgress(100);
          setIsGenerating(false);
          return status.video_url;
        } else if (status.status === 'failed') {
          throw new Error('Video generation failed on server');
        } else {
          console.log('⏳ Still processing, waiting 5 seconds...');
          await new Promise(resolve => setTimeout(resolve, 5000));
          return poll();
        }
      } catch (err) {
        console.error('Status check error:', err);
        if (attempts < 3) {
          console.log('🔄 Retrying status check...');
          await new Promise(resolve => setTimeout(resolve, 2000));
          return poll();
        } else {
          // toString() will include the Error name and message
          setError(err instanceof Error ? err.toString() : String(err));
          setIsGenerating(false);
          throw err;
        }
      }
    };

    return poll();
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