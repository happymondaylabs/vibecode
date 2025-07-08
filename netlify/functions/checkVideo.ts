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
    console.log('Check request at:', new Date().toISOString());
    
    const requestId = event.queryStringParameters?.requestId;
    if (!requestId) {
      throw new Error("Request ID is required");
    }

    console.log('Checking status for request ID:', requestId);

    // Validate FAL_KEY
    if (!process.env.FAL_KEY) {
      throw new Error("FAL_KEY environment variable is not configured");
    }

    // Configure FAL AI
    fal.config({ credentials: process.env.FAL_KEY! });

    // Check the status with error handling
    let status;
    try {
      status = await fal.queue.status("fal-ai/veo3", {
        requestId,
        logs: false,
      });
    } catch (statusError: any) {
      console.error('FAL status check error:', statusError);
      throw new Error(`Failed to check status with FAL AI: ${statusError.message}`);
    }

    console.log('Status response:', {
      status: status.status,
      requestId: requestId,
      timestamp: new Date().toISOString()
    });

    if (status.status === "COMPLETED") {
      // Get the result with error handling
      let result;
      try {
        result = await fal.queue.result("fal-ai/veo3", { requestId });
      } catch (resultError: any) {
        console.error('FAL result fetch error:', resultError);
        throw new Error(`Failed to fetch result from FAL AI: ${resultError.message}`);
      }
      
      if (!result.data?.video?.url) {
        throw new Error("Video URL not found in completed result");
      }
      
      console.log('✅ Video completed successfully:', result.data.video.url);
      
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
    console.log('⏳ Video still processing. Status:', status.status);
    return {
      statusCode: 202,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: status.status }),
    };
  } catch (error: any) {
    console.error("🔥 Check video status error at:", new Date().toISOString());
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      requestId: event.queryStringParameters?.requestId
    });
    
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