import { UserData, Theme } from '../types';

export interface EmailNotificationData {
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
}

export async function sendOrderNotification(data: EmailNotificationData): Promise<void> {
  try {
    console.log('📧 Sending order notification email...');
    
    const emailData = {
      ...data,
      orderTimestamp: new Date().toISOString()
    };

    const response = await fetch('/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    console.log('✅ Order notification email sent successfully');
  } catch (error: any) {
    console.error('❌ Failed to send order notification email:', error);
    // Don't throw error - email failure shouldn't break the main flow
  }
}

// Helper function to send payment success notification
export async function notifyPaymentSuccess(
  userData: UserData,
  theme: Theme,
  customerEmail: string,
  paymentIntentId: string
): Promise<void> {
  await sendOrderNotification({
    customerEmail,
    customerName: userData.name,
    customerAge: userData.age,
    themeSelected: theme.title,
    themeId: theme.id,
    paymentStatus: 'success',
    paymentIntentId,
    generationStatus: 'pending'
  });
}

// Helper function to send payment failure notification
export async function notifyPaymentFailure(
  userData: UserData,
  theme: Theme,
  customerEmail: string,
  errorMessage: string
): Promise<void> {
  await sendOrderNotification({
    customerEmail,
    customerName: userData.name,
    customerAge: userData.age,
    themeSelected: theme.title,
    themeId: theme.id,
    paymentStatus: 'failed',
    generationStatus: 'failed',
    errorMessage
  });
}

// Helper function to send generation success notification
export async function notifyGenerationSuccess(
  userData: UserData,
  theme: Theme,
  customerEmail: string,
  paymentIntentId: string,
  videoUrl: string
): Promise<void> {
  await sendOrderNotification({
    customerEmail,
    customerName: userData.name,
    customerAge: userData.age,
    themeSelected: theme.title,
    themeId: theme.id,
    paymentStatus: 'success',
    paymentIntentId,
    generationStatus: 'success',
    videoUrl
  });
}

// Helper function to send generation failure notification
export async function notifyGenerationFailure(
  userData: UserData,
  theme: Theme,
  customerEmail: string,
  paymentIntentId: string,
  errorMessage: string
): Promise<void> {
  await sendOrderNotification({
    customerEmail,
    customerName: userData.name,
    customerAge: userData.age,
    themeSelected: theme.title,
    themeId: theme.id,
    paymentStatus: 'success',
    paymentIntentId,
    generationStatus: 'failed',
    errorMessage
  });
}