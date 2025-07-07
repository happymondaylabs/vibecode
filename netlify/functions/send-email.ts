import type { Handler } from "@netlify/functions";

export interface OrderEmailData {
  customerEmail: string;
  customerName: string;
  customerAge: string;
  themeSelected: string;
  themeId: string;
  paymentStatus: 'success' | 'failed';
  paymentIntentId?: string;
  generationStatus: 'pending' | 'success' | 'failed';
  videoUrl?: string;
  errorMessage?: string;
  orderTimestamp: string;
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
    console.log('=== SEND EMAIL NOTIFICATION ===');
    
    if (!event.body) {
      throw new Error("Request body is required");
    }

    const orderData: OrderEmailData = JSON.parse(event.body);
    
    console.log('Sending email notification for order:', {
      customer: orderData.customerEmail,
      theme: orderData.themeSelected,
      payment: orderData.paymentStatus,
      generation: orderData.generationStatus
    });

    // Create email content
    const emailSubject = `VIBE CARD Order ${orderData.paymentStatus === 'success' ? '✅' : '❌'} - ${orderData.customerName}`;
    
    const emailBody = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Courier New', monospace; background-color: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border: 2px solid black; }
        .header { background-color: black; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .status-success { color: #16a34a; font-weight: bold; }
        .status-failed { color: #dc2626; font-weight: bold; }
        .status-pending { color: #ea580c; font-weight: bold; }
        .field { margin-bottom: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 10px; }
        .label { font-weight: bold; text-transform: uppercase; font-size: 12px; }
        .value { margin-top: 5px; }
        .urgent { background-color: #fef2f2; border: 2px solid #dc2626; padding: 15px; margin: 20px 0; }
        .footer { background-color: #f9f9f9; padding: 15px; text-align: center; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>VIBE CARD ORDER NOTIFICATION</h1>
            <p>Order received at ${new Date(orderData.orderTimestamp).toLocaleString()}</p>
        </div>
        
        <div class="content">
            <div class="field">
                <div class="label">Customer Email:</div>
                <div class="value">${orderData.customerEmail}</div>
            </div>
            
            <div class="field">
                <div class="label">Customer Name:</div>
                <div class="value">${orderData.customerName}</div>
            </div>
            
            <div class="field">
                <div class="label">Customer Age:</div>
                <div class="value">${orderData.customerAge}</div>
            </div>
            
            <div class="field">
                <div class="label">Theme Selected:</div>
                <div class="value">${orderData.themeSelected} (ID: ${orderData.themeId})</div>
            </div>
            
            <div class="field">
                <div class="label">Payment Status:</div>
                <div class="value ${orderData.paymentStatus === 'success' ? 'status-success' : 'status-failed'}">
                    ${orderData.paymentStatus.toUpperCase()}
                    ${orderData.paymentIntentId ? `(ID: ${orderData.paymentIntentId})` : ''}
                </div>
            </div>
            
            <div class="field">
                <div class="label">Video Generation Status:</div>
                <div class="value ${
                  orderData.generationStatus === 'success' ? 'status-success' : 
                  orderData.generationStatus === 'failed' ? 'status-failed' : 'status-pending'
                }">
                    ${orderData.generationStatus.toUpperCase()}
                </div>
            </div>
            
            ${orderData.videoUrl ? `
            <div class="field">
                <div class="label">Video URL:</div>
                <div class="value"><a href="${orderData.videoUrl}" target="_blank">${orderData.videoUrl}</a></div>
            </div>
            ` : ''}
            
            ${orderData.errorMessage ? `
            <div class="field">
                <div class="label">Error Details:</div>
                <div class="value status-failed">${orderData.errorMessage}</div>
            </div>
            ` : ''}
            
            ${(orderData.paymentStatus === 'success' && orderData.generationStatus === 'failed') ? `
            <div class="urgent">
                <h3>🚨 MANUAL PROCESSING REQUIRED</h3>
                <p>Payment was successful but video generation failed. Customer needs manual assistance.</p>
                <p><strong>Action Required:</strong> Contact customer at ${orderData.customerEmail} or manually generate video.</p>
            </div>
            ` : ''}
            
            ${(orderData.paymentStatus === 'failed') ? `
            <div class="urgent">
                <h3>💳 PAYMENT FAILED</h3>
                <p>Customer attempted to purchase but payment was declined.</p>
                <p><strong>Note:</strong> No video generation was attempted.</p>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <p>VIBE CARD Order Management System</p>
            <p>© 2025 YOUGENIUS.CO</p>
        </div>
    </div>
</body>
</html>
    `;

    // Send email using Netlify's built-in email service or external service
    // For now, we'll use a simple HTTP request to a service like EmailJS or SendGrid
    // You'll need to configure this with your preferred email service
    
    const emailPayload = {
      to: process.env.ADMIN_EMAIL || 'darin@yougenius.co',
      from: 'orders@vibecard.com',
      subject: emailSubject,
      html: emailBody,
      // Include order data for potential integrations
      metadata: orderData
    };

    // Example using SendGrid (you'll need to add SENDGRID_API_KEY to environment variables)
    if (process.env.SENDGRID_API_KEY) {
      const sendGridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: process.env.ADMIN_EMAIL || 'darin@yougenius.co' }],
            subject: emailSubject
          }],
          from: { email: 'orders@vibecard.com', name: 'VIBE CARD Orders' },
          content: [{
            type: 'text/html',
            value: emailBody
          }]
        })
      });

      if (!sendGridResponse.ok) {
        throw new Error(`SendGrid API error: ${sendGridResponse.status}`);
      }
    } else {
      // Fallback: Log the email content (for development)
      console.log('📧 EMAIL NOTIFICATION (SendGrid not configured):');
      console.log('To:', emailPayload.to);
      console.log('Subject:', emailPayload.subject);
      console.log('Order Data:', orderData);
    }

    console.log('✅ Email notification sent successfully');

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ success: true, message: 'Email notification sent' }),
    };
  } catch (error: any) {
    console.error("🔥 Email notification error:", error);
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