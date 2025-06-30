import { createClient } from "@fal-ai/serverless-client";
import { UserData, Theme } from '../types';

// Configure Fal client with the API key from environment
const FAL_KEY = import.meta.env.VITE_FAL_API_KEY;
if (!FAL_KEY) throw new Error("Missing Fal API key");

// Instantiate the client using createClient factory
const fal = createClient({ credentials: FAL_KEY });

console.log('FAL API Key configured:', FAL_KEY ? 'Yes' : 'No');

export interface VideoGenerationRequest {
  userData: UserData;
  theme: Theme;
}

export interface VideoGenerationResponse {
  video_url: string;
  status: 'completed' | 'processing' | 'failed';
  request_id?: string;
}

// Generate prompt based on theme and user data
function generatePrompt(userData: UserData, theme: Theme): string {
  const { name, age } = userData;
  
  const prompts = {
    'bigfoot-vlog': `Ultra-realistic video of Bigfoot walking fast in the woods, holding a camera in selfie mode. Natural outdoor lighting, tree's, and a mountains in the background. Bigfoot is running through the woods with a concerned expression. He says to the camera, "The worst part about getting older, is number two really creeps up on you fast!" Bigfoot chuckles, then glances to the camera and says "Happy Birthday ${name}" Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'fake-infomercial': `A fake infomercial in the style of a Life Alert commercial. It opens with a wide shot of an elderly man lying at the bottom of a flight of stairs, looking distressed. A somber, authoritative male narrator's voice says, "Now that you're officially a senior citizen, time to look into Life Alert." The scene then transitions to the same elderly man, neatly dressed, sitting comfortably in an armchair, smiling warmly at the camera. He says directly to the camera, "Happy Birthday ${name}."`,
    
    'female-model-commercial': `Ultra-realistic video of a beautiful 21 year old female model washing her car, in the style of an Carls Jr commercial. White Jeep in the background. The model is holding an sponge with a seductive look on her face. Wearing a swimsuit, and a blonde hair. The model says to the camera, "I could use a little help birthday boy..." Then pours water on herself with a sponge and says "Happy Birthday ${name}". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'male-model-commercial': `Ultra-realistic video of a muscular man in a beautiful beach, in the style of an Old Spice commercial. Paradise sunshine, blue ocean and white sand beach in the background. The man is riding confidently on a brown horse with a seductive look on his face. Wearing no shirt, swim trunks, and long brown hair. The man says to the camera, "Damn, ${age} never looked so good." Then the man runs his hands through his hair, and says "Happy Birthday ${name}". Include shaky handheld motion, and a humorous, lighthearted tone.`,
    
    'breaking-news': `A young female news anchor, dressed professionally, reports live from a news desk. She looks directly at the camera with a serious but engaging expression. She says, "In tonight's headline story, the retirement home has a new Bingo champion, and it's also their birthday. Happy Birthday ${name}."`
  };

  return prompts[theme.id as keyof typeof prompts] || prompts['male-model-commercial'];
}

export async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
  try {
    const prompt = generatePrompt(request.userData, request.theme);
    
    // Validate prompt is not empty
    if (!prompt) {
      throw new Error("Prompt is empty – cannot call Fal.ai");
    }
    
    console.log('=== VIDEO GENERATION DEBUG ===');
    console.log('User:', request.userData.name, 'Age:', request.userData.age);
    console.log('Theme:', request.theme.title);
    console.log('Prompt:', prompt);
    console.log('FAL Key present:', !!FAL_KEY);
    console.log('===============================');
    
    // Use the namespaced video endpoint with correct payload structure
    const payload = {
      prompt,                        // your generated prompt string
      duration: 8,                   // seconds
      aspect_ratio: "16:9",          // aspect ratio
      image_url: request.theme.image // full URL to your theme still
    };
    
    console.log("Fal payload → text-to-video", payload);
    
    const response = await fal.video.generate({
      model: "text-to-video",
      input: payload
    });

    console.log('Fal response:', response);

    // Check different possible response structures
    let videoUrl = null;
    if (response.output) {
      videoUrl = response.output.video_url || 
                response.output.video?.url || 
                response.output.url;
    } else if (response.data) {
      videoUrl = response.data.video?.url || 
                response.data.video_url || 
                response.data.output?.url ||
                response.data.url;
    }

    if (videoUrl) {
      console.log('✅ Video generated successfully:', videoUrl);
      return {
        video_url: videoUrl,
        status: 'completed',
        request_id: response.requestId
      };
    } else {
      throw new Error('No video URL in response');
    }

  } catch (err: any) {
    console.error("❌ Fal raw error object:", err);
    if (err.details) console.error("Validation details:", err.details);
    if (err.body) console.error("Error body:", err.body);
    if (err.response) console.error("Error response:", err.response);
    if (err.message) console.error("Error message:", err.message);
    if (err.stack) console.error("Error stack:", err.stack);
    
    // rethrow so your UI can show err.message
    throw err instanceof Error ? err : new Error(JSON.stringify(err));
  }
}

export async function checkVideoStatus(requestId: string): Promise<VideoGenerationResponse> {
  try {
    const result = await fal.video.status({
      requestId: requestId,
      logs: true
    });

    console.log('Status check result:', result);

    if (result.status === 'COMPLETED') {
      let videoUrl = null;
      if (result.output) {
        videoUrl = result.output.video_url || 
                  result.output.video?.url || 
                  result.output.url;
      } else if (result.data) {
        videoUrl = result.data.video?.url || 
                  result.data.video_url || 
                  result.data.output?.url ||
                  result.data.url;
      }

      if (videoUrl) {
        return {
          video_url: videoUrl,
          status: 'completed',
          request_id: requestId
        };
      }
    } else if (result.status === 'IN_PROGRESS' || result.status === 'IN_QUEUE') {
      return {
        video_url: '',
        status: 'processing',
        request_id: requestId
      };
    }

    return {
      video_url: '',
      status: 'failed',
      request_id: requestId
    };
  } catch (err: any) {
    console.error("❌ Fal raw error object:", err);
    if (err.details) console.error("Validation details:", err.details);
    
    // rethrow so your UI can show err.message
    throw err instanceof Error ? err : new Error(JSON.stringify(err));
  }
}