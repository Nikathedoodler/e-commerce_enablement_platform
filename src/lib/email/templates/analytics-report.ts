/**
 * Email template for scheduled analytics reports
 */
export function getAnalyticsReportEmailTemplate({
  period,
  startDate,
  endDate,
  metrics,
  reportUrl,
}: {
  period: string; // e.g., "Last 7 days", "Last 30 days"
  startDate: string;
  endDate: string;
  metrics: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    pendingShipments: number;
    lowStockItems: number;
    orderGrowth?: number; // Percentage change vs previous period
    revenueGrowth?: number; // Percentage change vs previous period
  };
  reportUrl: string;
}) {
  const subject = `📊 Analytics Report: ${period}`;
  
  const formatCurrency = (amount: number) => {
    return `$${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPercent = (value: number | undefined) => {
    if (value === undefined) return "N/A";
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #1a1a1a;">
            📊 Analytics Report
          </h1>
          <p style="margin: 0; color: #666; font-size: 14px;">
            ${period} (${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1a1a1a;">
            Key Metrics
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; color: #666; font-size: 14px; width: 50%;">Total Orders:</td>
              <td style="padding: 12px 0; font-weight: 600; font-size: 16px; color: #1a1a1a; text-align: right;">
                ${metrics.totalOrders.toLocaleString()}
                ${metrics.orderGrowth !== undefined ? `
                  <span style="font-size: 12px; color: ${metrics.orderGrowth >= 0 ? '#16a34a' : '#dc2626'}; margin-left: 8px;">
                    (${formatPercent(metrics.orderGrowth)})
                  </span>
                ` : ''}
              </td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #666; font-size: 14px;">Total Revenue:</td>
              <td style="padding: 12px 0; font-weight: 600; font-size: 16px; color: #1a1a1a; text-align: right;">
                ${formatCurrency(metrics.totalRevenue)}
                ${metrics.revenueGrowth !== undefined ? `
                  <span style="font-size: 12px; color: ${metrics.revenueGrowth >= 0 ? '#16a34a' : '#dc2626'}; margin-left: 8px;">
                    (${formatPercent(metrics.revenueGrowth)})
                  </span>
                ` : ''}
              </td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #666; font-size: 14px;">Average Order Value:</td>
              <td style="padding: 12px 0; font-size: 14px; color: #1a1a1a; text-align: right;">
                ${formatCurrency(metrics.averageOrderValue)}
              </td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #666; font-size: 14px;">Pending Shipments:</td>
              <td style="padding: 12px 0; font-size: 14px; color: #1a1a1a; text-align: right;">
                ${metrics.pendingShipments.toLocaleString()}
              </td>
            </tr>
            <tr style="border-top: 1px solid #e5e7eb;">
              <td style="padding: 12px 0; color: #666; font-size: 14px;">Low Stock Items:</td>
              <td style="padding: 12px 0; font-size: 14px; color: #1a1a1a; text-align: right;">
                ${metrics.lowStockItems.toLocaleString()}
              </td>
            </tr>
          </table>
        </div>

        ${metrics.orderGrowth !== undefined || metrics.revenueGrowth !== undefined ? `
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #166534; font-size: 14px;">
            <strong>Growth Indicators:</strong> 
            ${metrics.orderGrowth !== undefined && metrics.orderGrowth >= 0 ? `Orders increased by ${formatPercent(metrics.orderGrowth)}` : ''}
            ${metrics.orderGrowth !== undefined && metrics.orderGrowth < 0 ? `Orders decreased by ${formatPercent(Math.abs(metrics.orderGrowth))}` : ''}
            ${metrics.revenueGrowth !== undefined ? ` | Revenue ${metrics.revenueGrowth >= 0 ? 'increased' : 'decreased'} by ${formatPercent(Math.abs(metrics.revenueGrowth))}` : ''}
            compared to the previous period.
          </p>
        </div>
        ` : ''}

        <div style="text-align: center; margin-top: 32px;">
          <a href="${reportUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
            View Full Analytics Dashboard
          </a>
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            This is an automated analytics report from your fulfillment platform.
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
Analytics Report: ${period}

Period: ${new Date(startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}

Key Metrics:
- Total Orders: ${metrics.totalOrders.toLocaleString()}${metrics.orderGrowth !== undefined ? ` (${formatPercent(metrics.orderGrowth)})` : ''}
- Total Revenue: ${formatCurrency(metrics.totalRevenue)}${metrics.revenueGrowth !== undefined ? ` (${formatPercent(metrics.revenueGrowth)})` : ''}
- Average Order Value: ${formatCurrency(metrics.averageOrderValue)}
- Pending Shipments: ${metrics.pendingShipments.toLocaleString()}
- Low Stock Items: ${metrics.lowStockItems.toLocaleString()}

View Full Analytics Dashboard: ${reportUrl}

---
This is an automated analytics report from your fulfillment platform.
  `.trim();

  return { subject, html, text };
}
