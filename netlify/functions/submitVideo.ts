import type { Handler } from "@netlify/functions";
import { fal } from "@fal-ai/client";
import { generatePrompt } from "../../src/services/falApi";
import type { Theme, UserData } from "../../src/types";

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
    console.log('=== SUBMIT VIDEO FUNCTION ===');
    console.log('Request received at:', new Date().toISOString());
    console.log('Event body length:', event.body?.length || 0);
    
    if (!event.body) {
      throw new Error("Request body is required");
    }

    const { userData, theme } = JSON.parse(event.body) as {
      userData: UserData;
      theme: Theme;
    };

    console.log('Parsed request data:', { 
      userName: userData.name, 
      userAge: userData.age,
      userMessage: userData.message,
      themeId: theme.id,
      themeTitle: theme.title
    });

    // Generate the prompt
    const prompt = generatePrompt(userData, theme);
    
    if (!prompt) {
      throw new Error("Generated prompt is empty");
    }

    console.log("Generated prompt length:", prompt.length);
    console.log("Prompt preview:", prompt.substring(0, 200) + "...");

    // Prepare the payload
    const payload = {
      input: {
        prompt,
        aspect_ratio: "16:9",
        duration: "8s",
        enhance_prompt: true,
        generate_audio: true,
      },
      logs: false,
    };

    console.log('🚀 Submitting to FAL AI...');
    console.log('Payload summary:', {
      promptLength: payload.input.prompt.length,
      aspectRatio: payload.input.aspect_ratio,
      duration: payload.input.duration,
      enhancePrompt: payload.input.enhance_prompt,
      generateAudio: payload.input.generate_audio
    });

    // Configure and submit to FAL AI
    if (!process.env.FAL_KEY) {
      throw new Error("FAL_KEY environment variable is not configured");
    }
    
    fal.config({ credentials: process.env.FAL_KEY! });
    
    console.log('Submitting to fal-ai/veo3...');
    const submitResult = await fal.queue.submit("fal-ai/veo3", payload);
    const request_id = submitResult.request_id;

    console.log('✅ Successfully submitted with request ID:', request_id);
    console.log('Submission timestamp:', new Date().toISOString());

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId: request_id }),
    };
  } catch (error: any) {
    console.error("🔥 Submit video error at:", new Date().toISOString());
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Check if it's a FAL API specific error
    if (error.message?.includes('fal')) {
      console.error("FAL API Error - check your FAL_KEY configuration");
    }
    
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: error.message }),
    };
  }
};