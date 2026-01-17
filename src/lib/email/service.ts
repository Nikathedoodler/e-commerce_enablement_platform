import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

/**
 * Email service for sending transactional emails
 * Uses Resend for email delivery
 */
export class EmailService {
  /**
   * Send an email
   * Returns success status and error message if failed
   */
  static async sendEmail({
    to,
    subject,
    html,
    text,
    replyTo,
  }: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
  }): Promise<{ success: boolean; error?: string }> {
    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return { success: false, error: "Email service is not configured" };
    }

    try {
      const { error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text: text || this.htmlToText(html),
        replyTo,
      });

      if (error) {
        console.error("Resend error:", error);
        return { success: false, error: error.message || "Failed to send email" };
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Email service error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  }

  /**
   * Convert HTML to plain text (simple implementation)
   * For production, consider using a library like html-to-text
   */
  private static htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, "") // Remove HTML tags
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();
  }
}
