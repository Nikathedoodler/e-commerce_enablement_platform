/**
 * Email template for new Shopify order notification
 */
export function getNewOrderEmailTemplate({
  orderNumber,
  customerEmail,
  total,
  itemCount,
  orderUrl,
}: {
  orderNumber: string;
  customerEmail: string;
  total: number;
  itemCount: number;
  orderUrl: string;
}) {
  const subject = `New Order: ${orderNumber}`;
  
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
            🎉 New Order Received
          </h1>
          <p style="margin: 0; color: #666; font-size: 14px;">
            A new order has been synced from Shopify
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1a1a1a;">
            Order Details
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Order Number:</td>
              <td style="padding: 8px 0; font-weight: 600; font-size: 14px; color: #1a1a1a;">${orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Customer:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${customerEmail}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Total:</td>
              <td style="padding: 8px 0; font-weight: 600; font-size: 16px; color: #1a1a1a;">$${total.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Items:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${itemCount} item${itemCount !== 1 ? 's' : ''}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${orderUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
            View Order in Dashboard
          </a>
        </div>

        <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
          <p style="margin: 0; color: #666; font-size: 12px;">
            This is an automated notification from your fulfillment platform.
          </p>
        </div>
      </body>
    </html>
  `;

  const text = `
New Order Received

A new order has been synced from Shopify.

Order Details:
- Order Number: ${orderNumber}
- Customer: ${customerEmail}
- Total: $${total.toFixed(2)}
- Items: ${itemCount} item${itemCount !== 1 ? 's' : ''}

View Order: ${orderUrl}

---
This is an automated notification from your fulfillment platform.
  `.trim();

  return { subject, html, text };
}
