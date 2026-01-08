import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, category, subject, message } = body;

    // Validation
    if (!name || !email || !category || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: "Email service is not configured" },
        { status: 500 }
      );
    }

    const supportEmail = process.env.SUPPORT_EMAIL || "support@yourdomain.com";
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

    // Format category for display
    const categoryLabels: Record<string, string> = {
      bug: "Bug Report",
      feature: "Feature Request",
      question: "Question",
      other: "Other",
    };

    const categoryLabel = categoryLabels[category] || category;

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: supportEmail,
      replyTo: email,
      subject: `[Support] ${categoryLabel}: ${subject}`,
      html: `
        <h2>New Support Request</h2>
        <p><strong>Category:</strong> ${categoryLabel}</p>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><small>You can reply directly to this email to respond to ${name}.</small></p>
      `,
      text: `
New Support Request

Category: ${categoryLabel}
From: ${name} (${email})
Subject: ${subject}

Message:
${message}

---
You can reply directly to this email to respond to ${name}.
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Support request sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Support contact API error:", error);
    return NextResponse.json(
      { error: "Failed to process support request" },
      { status: 500 }
    );
  }
}
