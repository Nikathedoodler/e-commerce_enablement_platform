import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * POST /api/cron/analytics-reports
 * Cron job endpoint to send weekly analytics reports to all active users
 * Called by Vercel Cron every Monday at 9 AM
 * 
 * This endpoint:
 * 1. Fetches all users with active subscriptions
 * 2. Generates analytics report for each user
 * 3. Sends email report to each user
 */
export async function POST(req: NextRequest) {
  try {
    // Verify cron secret (optional but recommended for security)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = createServiceRoleClient();

    // Fetch all users with active subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("status", "active");

    if (subError) {
      console.error("Error fetching subscriptions:", subError);
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      );
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active subscriptions found",
        reportsSent: 0,
      });
    }

    const userIds = subscriptions.map((sub) => sub.user_id);
    let reportsSent = 0;
    let reportsFailed = 0;

    // Send report to each user
    for (const userId of userIds) {
      try {
        // Call the analytics report endpoint for each user
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                       (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
        
        const reportUrl = `${baseUrl}/api/analytics/report?userId=${userId}&period=7d&sendEmail=true`;
        
        const response = await fetch(reportUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          reportsSent++;
          console.log(`Analytics report sent to user ${userId}`);
        } else {
          reportsFailed++;
          console.error(`Failed to send report to user ${userId}`);
        }
      } catch (error) {
        reportsFailed++;
        console.error(`Error sending report to user ${userId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      totalUsers: userIds.length,
      reportsSent,
      reportsFailed,
    });
  } catch (error) {
    console.error("Error in analytics reports cron job:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}

// Also allow GET for manual testing
export async function GET(req: NextRequest) {
  return POST(req);
}
