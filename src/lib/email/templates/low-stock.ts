/**
 * Email template for low stock alert
 */
export function getLowStockEmailTemplate({
  sku,
  itemName,
  currentQuantity,
  reorderThreshold,
  location,
  inventoryUrl,
}: {
  sku: string;
  itemName: string;
  currentQuantity: number;
  reorderThreshold: number;
  location: string | null;
  inventoryUrl: string;
}) {
  const subject = `⚠️ Low Stock Alert: ${sku}`;
  
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
            ⚠️ Low Stock Alert
          </h1>
          <p style="margin: 0; color: #991b1b; font-size: 14px;">
            An inventory item has fallen below its reorder threshold
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1a1a1a;">
            Item Details
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">SKU:</td>
              <td style="padding: 8px 0; font-family: monospace; font-weight: 600; font-size: 14px; color: #1a1a1a;">${sku}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Item Name:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${itemName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Current Quantity:</td>
              <td style="padding: 8px 0; font-weight: 600; font-size: 16px; color: #dc2626;">${currentQuantity}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Reorder Threshold:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${reorderThreshold}</td>
            </tr>
            ${location ? `
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Location:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${location}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>Action Required:</strong> Please restock this item to avoid stockouts. Current quantity (${currentQuantity}) is at or below the reorder threshold (${reorderThreshold}).
          </p>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${inventoryUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
            View Inventory
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
Low Stock Alert

An inventory item has fallen below its reorder threshold.

Item Details:
- SKU: ${sku}
- Item Name: ${itemName}
- Current Quantity: ${currentQuantity}
- Reorder Threshold: ${reorderThreshold}
${location ? `- Location: ${location}` : ''}

Action Required: Please restock this item to avoid stockouts. Current quantity (${currentQuantity}) is at or below the reorder threshold (${reorderThreshold}).

View Inventory: ${inventoryUrl}

---
This is an automated notification from your fulfillment platform.
  `.trim();

  return { subject, html, text };
}
