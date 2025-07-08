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
    
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Request body is required" })
      };
    }

    // Parse and validate request
    const { userData, theme } = JSON.parse(event.body) as {
      userData: UserData;
      theme: Theme;
    };

    // Validate required fields
    if (!userData?.name || !userData?.age || !theme?.id || !theme?.title) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing required fields: name, age, themeId, or themeTitle" })
      };
    }

    console.log('Validated request:', { 
      userName: userData.name, 
      userAge: userData.age,
      themeId: theme.id,
      themeTitle: theme.title
    });

    // Check for developer bypass
    const isDevBypass = userData.name.toLowerCase() === "monday" && userData.age === "32";
    if (isDevBypass) {
      console.log('🛠 DEVELOPER BYPASS: Returning test request ID');
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ requestId: "DEV_BYPASS" }),
      };
    }

    // Generate the prompt
    const prompt = generatePrompt(userData, theme);
    if (!prompt) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Failed to generate prompt" })
      };
    }

    console.log("Generated prompt length:", prompt.length);

    // Build absolute image URL for theme
    const origin = process.env.SITE_ORIGIN || 'https://vibecard.shop';
    const imageUrl = `${origin}${theme.image}`;
    
    // Validate image URL format
    if (!/^https?:\/\//.test(imageUrl)) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Invalid image URL format" })
      };
    }

    // Prepare FAL.ai payload
    const payload = {
      input: {
        prompt,
        aspect_ratio: "16:9",
        duration: "8s",
        enhance_prompt: true,
        generate_audio: true,
        image_url: imageUrl
      },
      logs: true
    };

    console.log('🚀 Submitting to FAL AI with image:', imageUrl);

    // Validate FAL_KEY
    if (!process.env.FAL_KEY) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "FAL_KEY not configured" })
      };
    }
    
    // Configure and submit to FAL AI
    fal.config({ credentials: process.env.FAL_KEY! });
    
    const { request_id } = await fal.queue.submit("fal-ai/veo3", payload);

    console.log('✅ Successfully submitted with request ID:', request_id);

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
    
    // Handle specific FAL.ai errors
    if (error.message?.includes('Unprocessable Entity')) {
      return {
        statusCode: 422,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Invalid request data for video generation" })
      };
    }
    
    return {
      statusCode: 502,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: error.message || "FAL.ai service error" }),
    };
  }
};