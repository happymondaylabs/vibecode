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
    console.log('Event body:', event.body);
    
    if (!event.body) {
      throw new Error("Request body is required");
    }

    const { userData, theme } = JSON.parse(event.body) as {
      userData: UserData;
      theme: Theme;
    };

    console.log('Parsed request:', { 
      userName: userData.name, 
      userAge: userData.age, 
      themeId: theme.id 
    });

    // Generate the prompt
    const prompt = generatePrompt(userData, theme);
    
    if (!prompt) {
      throw new Error("Generated prompt is empty");
    }

    console.log("Generated prompt:", prompt);

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

    console.log('🚀 FAL payload →', JSON.stringify(payload, null, 2));

    // Configure and submit to FAL AI
    fal.config({ credentials: process.env.FAL_KEY! });
    const { request_id } = await fal.queue.submit("fal-ai/veo3", payload);

    console.log('✅ Submitted with request ID:', request_id);

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId: request_id }),
    };
  } catch (error: any) {
    console.error("🔥 Submit video error:", error);
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