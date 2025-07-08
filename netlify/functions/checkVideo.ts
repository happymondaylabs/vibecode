import type { Handler } from "@netlify/functions";
import { fal } from "@fal-ai/client";

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
    console.log('=== CHECK VIDEO STATUS ===');
    
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Request body is required" })
      };
    }

    const { requestId } = JSON.parse(event.body);
    if (!requestId) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "Missing requestId" })
      };
    }

    console.log('Checking status for request ID:', requestId);

    // Handle developer bypass
    if (requestId === "DEV_BYPASS") {
      console.log('🛠 DEVELOPER BYPASS: Returning test video URL');
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: "/test-video.mp4" }),
      };
    }

    // Validate FAL_KEY
    if (!process.env.FAL_KEY) {
      return {
        statusCode: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ error: "FAL_KEY not configured" })
      };
    }

    // Configure FAL AI
    fal.config({ credentials: process.env.FAL_KEY! });

    // Check the status
    const status = await fal.queue.status("fal-ai/veo3", {
      requestId,
      logs: true
    });

    console.log('Status response:', status.status);

    if (status.status === "COMPLETED") {
      const result = await fal.queue.result("fal-ai/veo3", { requestId });
      
      if (!result.data?.video?.url) {
        return {
          statusCode: 500,
          headers: { "Access-Control-Allow-Origin": "*" },
          body: JSON.stringify({ error: "Video URL not found in result" })
        };
      }
      
      console.log('✅ Video completed:', result.data.video.url);
      
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoUrl: result.data.video.url }),
      };
    }

    // Still processing - return current status
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status.status }),
    };

  } catch (error: any) {
    console.error("🔥 Check video status error:", error);
    
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