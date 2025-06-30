import type { Handler } from "@netlify/functions";

// Server-side Fal import (only works in Node.js environment)
const fal = require("@fal-ai/serverless-client");

// Configure Fal with server-side API key
const FAL_KEY = process.env.FAL_API_KEY;
if (!FAL_KEY) {
  throw new Error("Missing FAL_API_KEY environment variable");
}

fal.config({ credentials: FAL_KEY });

interface UserData {
  name: string;
  age: string;
  message: string;
}

interface Theme {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  code: string;
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

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    console.log("=== NETLIFY FUNCTION DEBUG ===");
    console.log("Event body:", event.body);
    console.log("FAL_KEY present:", !!FAL_KEY);
    console.log("==============================");

    if (!event.body) {
      throw new Error("Request body is required");
    }

    const { userData, theme } = JSON.parse(event.body) as {
      userData: UserData;
      theme: Theme;
    };

    console.log("Parsed request:", { 
      userName: userData.name, 
      userAge: userData.age, 
      themeId: theme.id 
    });

    const prompt = generatePrompt(userData, theme);
    
    if (!prompt) {
      throw new Error("Generated prompt is empty");
    }

    console.log("Generated prompt:", prompt);

    // Call Fal.ai video generation
    const response = await fal.run("fal-ai/fast-svd", {
      input: {
        prompt,
        duration: 8,
        aspect_ratio: "16:9",
        image_url: theme.image,
      },
    });

    console.log("Fal response:", response);

    // Extract video URL from response
    let videoUrl = null;
    if (response.video_url) {
      videoUrl = response.video_url;
    } else if (response.video && response.video.url) {
      videoUrl = response.video.url;
    } else if (response.output && response.output.video_url) {
      videoUrl = response.output.video_url;
    }

    if (!videoUrl) {
      console.error("No video URL found in response:", response);
      throw new Error("No video URL in Fal.ai response");
    }

    console.log("✅ Video generated successfully:", videoUrl);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        videoUrl,
        status: "completed",
        requestId: response.request_id || null
      }),
    };

  } catch (error: any) {
    console.error("❌ Netlify function error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        error: error.message || "Video generation failed",
        details: error.stack || String(error)
      }),
    };
  }
};