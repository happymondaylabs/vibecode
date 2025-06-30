import { UserData, Theme } from '../types';

export interface VideoGenerationRequest {
  userData: UserData;
  theme: Theme;
}

export interface VideoGenerationResponse {
  video_url: string;
  status: 'completed' | 'processing' | 'failed';
  request_id?: string;
}

// Call the Netlify Function instead of Fal.ai directly
export async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
  try {
    console.log('=== CALLING NETLIFY FUNCTION ===');
    console.log('User:', request.userData.name, 'Age:', request.userData.age);
    console.log('Theme:', request.theme.title);
    console.log('================================');
    
    const response = await fetch('/.netlify/functions/generateVideo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userData: request.userData,
        theme: request.theme
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Netlify function response:', result);

    if (result.videoUrl) {
      return {
        video_url: result.videoUrl,
        status: 'completed',
        request_id: result.requestId
      };
    } else {
      throw new Error('No video URL in response from Netlify function');
    }

  } catch (err: any) {
    console.error("❌ Netlify function call error:", err);
    
    // Provide more helpful error messages
    if (err.message.includes('fetch')) {
      throw new Error('Failed to connect to video generation service. Please check your internet connection.');
    } else if (err.message.includes('HTTP 500')) {
      throw new Error('Video generation service is temporarily unavailable. Please try again in a few minutes.');
    } else if (err.message.includes('HTTP 404')) {
      throw new Error('Video generation service not found. Please contact support.');
    }
    
    throw err instanceof Error ? err : new Error(String(err));
  }
}

// For now, we'll remove the status checking since we're doing direct generation
export async function checkVideoStatus(requestId: string): Promise<VideoGenerationResponse> {
  // This would need another Netlify function if we implement async processing
  throw new Error('Status checking not implemented for Netlify functions yet');
}