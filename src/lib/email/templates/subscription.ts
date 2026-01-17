/**
 * Email templates for subscription change notifications
 */
export function getSubscriptionActivatedEmailTemplate({
  planTier,
  billingPeriodEnd,
  orderLimit,
  billingUrl,
}: {
  planTier: string;
  billingPeriodEnd: string;
  orderLimit: number | string;
  billingUrl: string;
}) {
  const planName = planTier.charAt(0).toUpperCase() + planTier.slice(1);
  const subject = `✅ Subscription Activated: ${planName} Plan`;
  
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
            ✅ Subscription Activated
          </h1>
          <p style="margin: 0; color: #166534; font-size: 14px;">
            Your ${planName} plan is now active
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1a1a1a;">
            Subscription Details
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Plan:</td>
              <td style="padding: 8px 0; font-weight: 600; font-size: 14px; color: #1a1a1a;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Limit:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${orderLimit === 'unlimited' ? 'Unlimited' : orderLimit.toLocaleString()} orders/month</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Billing Period Ends:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${new Date(billingPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${billingUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
            Manage Subscription
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
Subscription Activated

Your ${planName} plan is now active.

Subscription Details:
- Plan: ${planName}
- Order Limit: ${orderLimit === 'unlimited' ? 'Unlimited' : orderLimit.toLocaleString()} orders/month
- Billing Period Ends: ${new Date(billingPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Manage Subscription: ${billingUrl}

---
This is an automated notification from your fulfillment platform.
  `.trim();

  return { subject, html, text };
}

export function getSubscriptionUpdatedEmailTemplate({
  oldPlanTier,
  newPlanTier,
  billingPeriodEnd,
  orderLimit,
  billingUrl,
}: {
  oldPlanTier: string;
  newPlanTier: string;
  billingPeriodEnd: string;
  orderLimit: number | string;
  billingUrl: string;
}) {
  const oldPlanName = oldPlanTier.charAt(0).toUpperCase() + oldPlanTier.slice(1);
  const newPlanName = newPlanTier.charAt(0).toUpperCase() + newPlanTier.slice(1);
  const isUpgrade = ['starter', 'professional', 'enterprise'].indexOf(newPlanTier) > ['starter', 'professional', 'enterprise'].indexOf(oldPlanTier);
  const subject = `${isUpgrade ? '⬆️' : '⬇️'} Subscription ${isUpgrade ? 'Upgraded' : 'Changed'}: ${newPlanName} Plan`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: ${isUpgrade ? '#f0fdf4' : '#fef3c7'}; border: 1px solid ${isUpgrade ? '#86efac' : '#fcd34d'}; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h1 style="margin: 0 0 8px 0; font-size: 24px; color: ${isUpgrade ? '#166534' : '#92400e'};">
            ${isUpgrade ? '⬆️' : '⬇️'} Subscription ${isUpgrade ? 'Upgraded' : 'Changed'}
          </h1>
          <p style="margin: 0; color: ${isUpgrade ? '#166534' : '#92400e'}; font-size: 14px;">
            Your plan has been ${isUpgrade ? 'upgraded' : 'changed'} from ${oldPlanName} to ${newPlanName}
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1a1a1a;">
            Subscription Details
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Previous Plan:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${oldPlanName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">New Plan:</td>
              <td style="padding: 8px 0; font-weight: 600; font-size: 14px; color: #1a1a1a;">${newPlanName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Order Limit:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${orderLimit === 'unlimited' ? 'Unlimited' : orderLimit.toLocaleString()} orders/month</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Billing Period Ends:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${new Date(billingPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${billingUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
            Manage Subscription
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
Subscription ${isUpgrade ? 'Upgraded' : 'Changed'}

Your plan has been ${isUpgrade ? 'upgraded' : 'changed'} from ${oldPlanName} to ${newPlanName}.

Subscription Details:
- Previous Plan: ${oldPlanName}
- New Plan: ${newPlanName}
- Order Limit: ${orderLimit === 'unlimited' ? 'Unlimited' : orderLimit.toLocaleString()} orders/month
- Billing Period Ends: ${new Date(billingPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

Manage Subscription: ${billingUrl}

---
This is an automated notification from your fulfillment platform.
  `.trim();

  return { subject, html, text };
}

export function getSubscriptionCanceledEmailTemplate({
  planTier,
  billingPeriodEnd,
  billingUrl,
}: {
  planTier: string;
  billingPeriodEnd: string;
  billingUrl: string;
}) {
  const planName = planTier.charAt(0).toUpperCase() + planTier.slice(1);
  const subject = `⚠️ Subscription Canceled: ${planName} Plan`;
  
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
            ⚠️ Subscription Canceled
          </h1>
          <p style="margin: 0; color: #991b1b; font-size: 14px;">
            Your ${planName} plan subscription has been canceled
          </p>
        </div>

        <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #1a1a1a;">
            Subscription Details
          </h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px; width: 140px;">Plan:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${planName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-size: 14px;">Access Until:</td>
              <td style="padding: 8px 0; font-size: 14px; color: #1a1a1a;">${new Date(billingPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
            </tr>
          </table>
        </div>

        <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>What happens next:</strong> Your subscription will remain active until ${new Date(billingPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. After that date, your account will be downgraded and you'll lose access to premium features.
          </p>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="${billingUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600; font-size: 14px;">
            Reactivate Subscription
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
Subscription Canceled

Your ${planName} plan subscription has been canceled.

Subscription Details:
- Plan: ${planName}
- Access Until: ${new Date(billingPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

What happens next: Your subscription will remain active until ${new Date(billingPeriodEnd).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}. After that date, your account will be downgraded and you'll lose access to premium features.

Reactivate Subscription: ${billingUrl}

---
This is an automated notification from your fulfillment platform.
  `.trim();

  return { subject, html, text };
}
