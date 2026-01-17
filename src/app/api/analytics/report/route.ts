import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { EmailService } from "@/lib/email/service";
import { getAnalyticsReportEmailTemplate } from "@/lib/email/templates/analytics-report";
import { getUserEmail } from "@/lib/email/helpers";

/**
 * Get base URL for generating dashboard links
 */
function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/**
 * GET /api/analytics/report
 * Generates and sends analytics report email for a user
 * Can be called by cron job or manually
 * 
 * Query params:
 * - userId: User ID to generate report for (required)
 * - period: Report period - "7d", "30d", "90d" (default: "7d")
 * - sendEmail: Whether to send email (default: true)
 */
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") || "7d";
    const sendEmail = searchParams.get("sendEmail") !== "false";

    if (!userId) {
      return NextResponse.json(
        { error: "userId query parameter is required" },
        { status: 400 }
      );
    }

    const supabase = createServiceRoleClient();

    // Calculate date range based on period
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date();
    
    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90d":
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    startDate.setHours(0, 0, 0, 0);

    // Calculate previous period for growth comparison
    const previousEndDate = new Date(startDate);
    previousEndDate.setMilliseconds(previousEndDate.getMilliseconds() - 1);
    const previousStartDate = new Date(startDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    previousStartDate.setDate(previousStartDate.getDate() - daysDiff);

    // Fetch current period metrics
    const { data: currentOrders, error: ordersError } = await supabase
      .from("orders")
      .select("total, created_at")
      .eq("user_id", userId)
      .gte("created_at", startDate.toISOString())
      .lte("created_at", endDate.toISOString());

    if (ordersError) {
      console.error("Error fetching orders:", ordersError);
      return NextResponse.json(
        { error: "Failed to fetch orders" },
        { status: 500 }
      );
    }

    // Fetch previous period metrics for comparison
    const { data: previousOrders } = await supabase
      .from("orders")
      .select("total, created_at")
      .eq("user_id", userId)
      .gte("created_at", previousStartDate.toISOString())
      .lte("created_at", previousEndDate.toISOString());

    // Fetch pending shipments
    const { data: pendingOrders } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", userId)
      .in("status", ["pending", "processing"]);

    // Fetch low stock items
    const { data: inventoryItems } = await supabase
      .from("inventory")
      .select("quantity, reorder_threshold")
      .eq("user_id", userId);

    // Calculate metrics
    const totalOrders = currentOrders?.length || 0;
    const totalRevenue = currentOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const pendingShipments = pendingOrders?.length || 0;
    const lowStockItems = inventoryItems?.filter(
      (item) => item.quantity <= item.reorder_threshold
    ).length || 0;

    // Calculate growth percentages
    const previousTotalOrders = previousOrders?.length || 0;
    const previousTotalRevenue = previousOrders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
    
    const orderGrowth = previousTotalOrders > 0
      ? ((totalOrders - previousTotalOrders) / previousTotalOrders) * 100
      : undefined;
    const revenueGrowth = previousTotalRevenue > 0
      ? ((totalRevenue - previousTotalRevenue) / previousTotalRevenue) * 100
      : undefined;

    const metrics = {
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingShipments,
      lowStockItems,
      orderGrowth,
      revenueGrowth,
    };

    // Format period label
    const periodLabels: Record<string, string> = {
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      "90d": "Last 90 days",
    };
    const periodLabel = periodLabels[period] || period;

    // Generate report URL
    const baseUrl = getBaseUrl();
    const reportUrl = `${baseUrl}/dashboard/analytics`;

    // Send email if requested
    if (sendEmail) {
      try {
        const userEmail = await getUserEmail(userId);
        if (userEmail) {
          const emailTemplate = getAnalyticsReportEmailTemplate({
            period: periodLabel,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            metrics,
            reportUrl,
          });

          const emailResult = await EmailService.sendEmail({
            to: userEmail,
            subject: emailTemplate.subject,
            html: emailTemplate.html,
            text: emailTemplate.text,
          });

          if (emailResult.success) {
            console.log(`Analytics report email sent for user ${userId}`);
          } else {
            console.error(`Failed to send analytics report email: ${emailResult.error}`);
          }
        } else {
          console.warn(`Could not get user email for user_id: ${userId}`);
        }
      } catch (emailError) {
        console.error("Error sending analytics report email:", emailError);
      }
    }

    // Return metrics (useful for testing or API consumption)
    return NextResponse.json({
      success: true,
      period: periodLabel,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      metrics,
      emailSent: sendEmail,
    });
  } catch (error) {
    console.error("Error generating analytics report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
