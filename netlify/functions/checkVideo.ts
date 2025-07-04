import type { Handler } from "@netlify/functions";
import { fal } from "@fal-ai/client";

export const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  // Only allow GET requests
  if (event.httpMethod !== "GET") {
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
    
    const requestId = event.queryStringParameters?.requestId;
    if (!requestId) {
      throw new Error("Request ID is required");
    }

    console.log('Checking status for request ID:', requestId);

    // Configure FAL AI
    fal.config({ credentials: process.env.FAL_KEY! });

    // Check the status
    const status = await fal.queue.status("fal-ai/veo3", {
      requestId,
      logs: false,
    });

    console.log('Status response:', status);

    if (status.status === "COMPLETED") {
      // Get the result
      const result = await fal.queue.result("fal-ai/veo3", { requestId });
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

    // Still processing
    console.log('⏳ Video still processing:', status.status);
    return {
      statusCode: 202,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status.status }),
    };
  } catch (error: any) {
    console.error("🔥 Check video status error:", error);
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