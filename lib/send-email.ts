import { sendOrderConfirmationEmail, type SendEmailParams } from "@/actions/api/send-email";

export async function sendOrderEmail(params: SendEmailParams): Promise<{
  success: boolean;
  messageId?: string;
  error?: string;
}> {
  try {
    const result = await sendOrderConfirmationEmail(params);
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

