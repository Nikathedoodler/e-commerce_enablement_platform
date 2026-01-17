/**
 * Email templates for shipping label generation notifications
 */
export function getLabelSuccessEmailTemplate({
  orderNumber,
  trackingNumber,
  carrier,
  cost,
  orderUrl,
}: {
  orderNumber: string;
  trackingNumber: string;
  carrier: string;
  cost: number | null;
  orderUrl: string;
}) {
  const subject = `Shipping Label Generated: ${orderNumber}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #166534;">
            ✅ Shipping Label Generated
          </h1>
          <p style="margin: 0; color: #166534; font-size: 14px;">
            Your shipping label has been successfully generated
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1a1a1a;">
            Label Details
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Order Number:</td>
              <td style="padding: 8px 0; font-weight: 600; font-size: 14px; color: #1a1a1a;">${orderNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Tracking Number:</td>
              <td style="padding: 8px 0; font-family: monospace; font-size: 14px; color: #1a1a1a;">${trackingNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Carrier:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${carrier}</td>
            </tr>
            ${cost !== null ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Cost:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">$${cost.toFixed(2)}</td>
            </tr>
            ` : ''}
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
Shipping Label Generated

Your shipping label has been successfully generated.

Label Details:
- Order Number: ${orderNumber}
- Tracking Number: ${trackingNumber}
- Carrier: ${carrier}
${cost !== null ? `- Cost: $${cost.toFixed(2)}` : ''}

View Order: ${orderUrl}

---
This is an automated notification from your fulfillment platform.
  `.trim();

  return { subject, html, text };
}

export function getLabelFailureEmailTemplate({
  orderNumber,
  errorMessage,
  orderUrl,
}: {
  orderNumber: string;
  errorMessage: string;
  orderUrl: string;
}) {
  const subject = `⚠️ Label Generation Failed: ${orderNumber}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; color: #991b1b;">
            ⚠️ Label Generation Failed
          </h1>
          <p style="margin: 0; color: #991b1b; font-size: 14px;">
            There was an error generating the shipping label
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
              <td style="padding: 8px 0; color: #666; font-size: 14px; vertical-align: top;">Error:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #991b1b;">${errorMessage}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>What to do:</strong> Please review the order details and try generating the label again manually, or contact support if the issue persists.
          </p>
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
Label Generation Failed

There was an error generating the shipping label.

Order Details:
- Order Number: ${orderNumber}
- Error: ${errorMessage}

What to do: Please review the order details and try generating the label again manually, or contact support if the issue persists.

View Order: ${orderUrl}

---
This is an automated notification from your fulfillment platform.
  `.trim();

  return { subject, html, text };
}
