import { UserData, Theme } from '../types';

// Generate prompt based on theme and user data
export function generatePrompt(userData: UserData, theme: Theme): string {
  const { name, age } = userData;
  
  const prompts = {
    'bigfoot-vlog': `Ultra-realistic video of Bigfoot walking fast in the woods, holding a camera in selfie mode. Natural outdoor lighting, tree's, and a mountains in the background. Bigfoot is running through the woods with a concerned expression. He says to the camera, "The worst part about getting older, is number two really creeps up on you fast!" Bigfoot chuckles, then glances to the camera and says "Happy Birthday ${name}" Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'fake-infomercial': `A fake infomercial in the style of a Life Alert commercial. It opens with a wide shot of an elderly man lying at the bottom of a flight of stairs, looking distressed. A somber, authoritative male narrator's voice says, "Now that you're officially a senior citizen, time to look into Life Alert." The scene then transitions to the same elderly man, neatly dressed, sitting comfortably in an armchair, smiling warmly at the camera. He says directly to the camera, "Happy Birthday ${name}."`,
    
    'female-model-commercial': `Ultra-realistic video of a beautiful 21 year old female model washing her car, in the style of an Carls Jr commercial. White Jeep in the background. The model is holding an sponge with a seductive look on her face. Wearing a swimsuit, and a blonde hair. The model says to the camera, "I could use a little help birthday boy..." Then pours water on herself with a sponge and says "Happy Birthday ${name}". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'male-model-commercial': `Ultra-realistic video of a muscular man in a beautiful beach, in the style of an Old Spice commercial. Paradise sunshine, blue ocean and white sand beach in the background. The man is riding confidently on a brown horse with a seductive look on his face. Wearing no shirt, swim trunks, and long brown hair. The man says to the camera, "Damn, ${age} never looked so good." Then the man runs his hands through his hair, and says "Happy Birthday ${name}". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'breaking-news': `A young female news anchor, dressed professionally, reports live from a news desk. She looks directly at the camera with a serious but engaging expression. She says, "In tonight's headline story, the retirement home has a new Bingo champion, and it's also their birthday. Happy Birthday ${name}."`
    ,
    
    'jesus-of-nazareth': `Ultra-realistic video of Jesus in Nazareth, in the style of a youtube vlog. Time period is 30 AD, city market, city of Nazareth in the background. Jesus is holding a bible with a confused look on his face. Wearing a white gown, and long brown hair. Jesus says to the camera, "Behold, another birthday" Then throws his bible over his shoulder and says, "I usually have a bible verse when you turn ${age}, not this time, sorry aunt ${name}". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'fast-food-manager': `Ultra-realistic video of a angry, overweight black woman in a fast food restaurant, in the style of an Atlanta reality tv show. Restaurant kitchen in the background. The woman is standing at the front counter angry with a mad look on her face. Wearing a black shirt, small yellow cheeseburger logo, and a black hat. The woman says to the camera, "Look I don't know who you think you're talkin' to" Then grabs a cheeseburger from the counter, throws it on the ground, and says "Forget your ${age}th birthday ${name}, make your own damn cheeseburger!!!". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'swamp-man': `Ultra-realistic video of a chubby man in a Florida swamp, in the style of a Swamp People tv show. Brown water, bushes, and swamp in the background. The man is standing in the water confidently with a confused look on his face. Wearing no shirt, tattoos, and a mullet haircut. The man says to the camera, "Happy Birthday ${name} and lookin' good for ${age}!!!" Then goes underwater and comes out with a large crocodile in a headlock, and says "Now this is senior living". Include shaky handheld motion, and a humorous, lighthearted tone.`
  };

  return prompts[theme.id as keyof typeof prompts] || prompts['male-model-commercial'];
}

export interface VideoGenerationRequest {
  userData: UserData;
  theme: Theme;
}

export interface VideoGenerationResponse {
  video_url: string;
  status: 'completed' | 'processing' | 'failed';
  request_id?: string;
}

// Submit video generation request
export async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
  // Check for developer bypass
  const isDevBypass = 
    import.meta.env.VITE_DEV_BYPASS_NAME === request.userData.name &&
    import.meta.env.VITE_DEV_BYPASS_AGE === request.userData.age;

  if (isDevBypass) {
    console.log('🛠 Developer bypass - returning mock video response');
    // Simulate a short delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      video_url: request.theme.image, // Use theme image as mock video
      status: 'completed',
      request_id: 'dev-bypass-' + Date.now()
    };
  }

  try {
    console.log('=== SUBMITTING VIDEO GENERATION ===');
    console.log('User:', request.userData.name, 'Age:', request.userData.age);
    console.log('Theme:', request.theme.title);
    console.log('================================');
    
    // Submit the request
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
      throw new Error(errorData.error || `HTTP ${submitResponse.status}: ${submitResponse.statusText}`);
    }

    const submitResult = await submitResponse.json();
    console.log('✅ Video submitted with request ID:', submitResult.requestId);

    // Poll for completion
    const requestId = submitResult.requestId;
    let attempts = 0;
    const maxAttempts = 240; // 20 minutes max (5 second intervals)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const statusResponse = await fetch(`/.netlify/functions/checkVideo?requestId=${requestId}`);
      
      if (statusResponse.status === 200) {
        const result = await statusResponse.json();
        console.log('✅ Video completed:', result.videoUrl);
        return {
          video_url: result.videoUrl,
          status: 'completed',
          request_id: requestId
        };
      } else if (statusResponse.status === 202) {
        const statusResult = await statusResponse.json();
        console.log('⏳ Video still processing:', statusResult.status);
        attempts++;
        continue;
      } else {
        throw new Error('Failed to check video status');
      }
    }
    
    // Instead of throwing an error, return a pending status
    console.log('⏰ Video generation taking longer than expected, returning pending status');
    return {
      video_url: '',
      status: 'pending',
      request_id: requestId
    };

  } catch (err: any) {
    console.error("❌ Video generation error:", err);
    
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

// Check video generation status
export async function checkVideoStatus(requestId: string): Promise<VideoGenerationResponse> {
  try {
    const response = await fetch(`/.netlify/functions/checkVideo?requestId=${requestId}`);
    
    if (response.status === 200) {
      const result = await response.json();
      return {
        video_url: result.videoUrl,
        status: 'completed',
        request_id: requestId
      };
    } else if (response.status === 202) {
      const statusResult = await response.json();
      return {
        video_url: '',
        status: 'processing',
        request_id: requestId
      };
    } else {
      throw new Error('Failed to check video status');
    }
  } catch (err: any) {
    console.error("❌ Status check error:", err);
    throw err instanceof Error ? err : new Error(String(err));
  }
}