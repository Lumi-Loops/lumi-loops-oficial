import { Resend } from "resend";

interface SendVisitorConfirmationEmailParams {
  name: string;
  email: string;
  inquiryId: string;
}

/**
 * Sends a confirmation email to a visitor after they submit an inquiry
 * Includes a registration link with the inquiry ID as reference
 */
export async function sendVisitorConfirmationEmail({
  name,
  email,
  inquiryId,
}: SendVisitorConfirmationEmailParams): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email send");
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const registrationUrl = `${
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  }/auth/signup?ref=${inquiryId}`;

  try {
    await resend.emails.send({
      from: "Lumiloops <no-reply@lumiloops.com>",
      to: email,
      subject: "Thanks for your inquiry — Let's stay in touch!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.5; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
              .header h2 { margin: 0; font-size: 24px; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .cta-button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-top: 15px; font-weight: 600; }
              .cta-button:hover { background: #4338ca; }
              .footer { color: #6b7280; font-size: 12px; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Hi ${name}!</h2>
              </div>
              <div class="content">
                <p>Thanks for reaching out to Lumiloops. We've received your inquiry and our team will review it shortly.</p>
                <p>To stay updated and manage your projects easily, we invite you to create your free Lumiloops account. Once you register with the same email, your inquiry will be automatically linked to your account.</p>
                <div style="text-align: center;">
                  <a href="${registrationUrl}" class="cta-button">Create My Account</a>
                </div>
                <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                  After registering, you'll be able to:
                </p>
                <ul style="color: #6b7280; font-size: 14px;">
                  <li>Track your inquiry status in real-time</li>
                  <li>Receive notifications about updates</li>
                  <li>Manage multiple projects from your dashboard</li>
                  <li>Access premium features</li>
                </ul>
                <p style="margin-top: 20px;">Thank you,<br/><strong>The Lumiloops Team</strong></p>
                <div class="footer">
                  <p>© 2025 Lumiloops. All rights reserved.</p>
                  <p>This email was sent because an inquiry was submitted from your email address. If this wasn't you, please disregard this email.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.info(`Visitor confirmation email sent to ${email}`);
  } catch (error) {
    console.error(
      `Failed to send visitor confirmation email to ${email}:`,
      error
    );
    throw error;
  }
}
