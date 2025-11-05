import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailTemplates: Record<
  string,
  { subject: string; template: (data: any) => string }
> = {
  viewed: {
    subject: "Your inquiry has been reviewed",
    template: (data) => `
      <h2>Hello ${data.clientName},</h2>
      <p>Good news! Our team has reviewed your project inquiry.</p>
      <p>We're assessing your requirements and will get back to you soon with a detailed proposal.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?tab=inquiries" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View your inquiry</a></p>
      <p>Best regards,<br/>Lumi Loops Team</p>
    `,
  },
  "in-progress": {
    subject: "We're working on your project",
    template: (data) => `
      <h2>Hello ${data.clientName},</h2>
      <p>Your project inquiry is now in progress!</p>
      <p>Our creative team is actively working on your project. We're excited to show you what we're creating.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?tab=inquiries" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View your inquiry</a></p>
      <p>Best regards,<br/>Lumi Loops Team</p>
    `,
  },
  responded: {
    subject: "We've sent you a response",
    template: (data) => `
      <h2>Hello ${data.clientName},</h2>
      <p>Great news! We've sent you a detailed response to your inquiry.</p>
      <p>Check your inbox for our proposal with pricing, timeline, and creative ideas for your project.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?tab=inquiries" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View your inquiry</a></p>
      <p>Best regards,<br/>Lumi Loops Team</p>
    `,
  },
  scheduled: {
    subject: "Your meeting has been scheduled",
    template: (data) => `
      <h2>Hello ${data.clientName},</h2>
      <p>Your meeting has been scheduled!</p>
      <p>Check your calendar for the meeting details. We're looking forward to discussing your project with you.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?tab=appointments" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View your appointments</a></p>
      <p>Best regards,<br/>Lumi Loops Team</p>
    `,
  },
  completed: {
    subject: "Your project is complete!",
    template: (data) => `
      <h2>Hello ${data.clientName},</h2>
      <p>Exciting news! Your project has been completed successfully!</p>
      <p>All deliverables are ready for you to download. We hope you're pleased with the results.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?tab=downloads" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Download your files</a></p>
      <p>Best regards,<br/>Lumi Loops Team</p>
    `,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientEmail, clientName, status } = body;

    // Validate required fields
    if (!clientEmail || !clientName || !status) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get email template
    const emailConfig = emailTemplates[status];
    if (!emailConfig) {
      // If no template for this status, just skip
      return NextResponse.json({
        success: true,
        message: "No email needed for this status",
      });
    }

    const { subject, template } = emailConfig;
    const htmlContent = template({ clientName });

    // Send email using Resend
    const { error } = await resend.emails.send({
      from: "hello@lumiloops.com",
      to: clientEmail,
      subject,
      html: htmlContent,
    });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 }
    );
  }
}
