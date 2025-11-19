/**
 * Google Analytics 4 Event Tracking Utility
 *
 * GA4 Events Structure:
 * - event_name: The name of the event (e.g., "form_submit", "button_click")
 * - event_parameters: Additional data about the event (optional)
 *   - Common parameters: value, currency, items, etc.
 *   - Custom parameters: Any data you want to track
 *
 * How it works:
 * 1. We check if gtag is available (only runs in browser)
 * 2. We call gtag('event', eventName, eventParams)
 * 3. GA4 receives the event and stores it
 */

// Declare gtag function for TypeScript
type GAEventParams = Record<string, unknown>;

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetId: string | Date,
      config?: GAEventParams
    ) => void;
    dataLayer?: GAEventParams[];
  }
}

/**
 * Track a custom event in GA4
 *
 * @param eventName - The name of the event (e.g., "form_submit", "button_click")
 * @param eventParams - Optional parameters to send with the event
 *
 * Example:
 * trackEvent("form_submit", {
 *   form_name: "email_signup",
 *   form_location: "footer",
 *   value: 0
 * });
 */
export const trackEvent = (eventName: string, eventParams?: GAEventParams) => {
  // Only run in browser (not during server-side rendering)
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, eventParams || {});
  }
};

/**
 * Common event tracking functions for your app
 * These make it easier to track specific actions
 */

// Track form submissions
export const trackFormSubmit = (
  formName: string,
  formLocation: string,
  additionalData?: GAEventParams
) => {
  trackEvent("form_submit", {
    form_name: formName,
    form_location: formLocation,
    ...additionalData,
  });
};

// Track button clicks
export const trackButtonClick = (
  buttonName: string,
  buttonLocation: string,
  additionalData?: GAEventParams
) => {
  trackEvent("button_click", {
    button_name: buttonName,
    button_location: buttonLocation,
    ...additionalData,
  });
};

// Track link clicks
export const trackLinkClick = (
  linkText: string,
  linkUrl: string,
  linkLocation: string
) => {
  trackEvent("link_click", {
    link_text: linkText,
    link_url: linkUrl,
    link_location: linkLocation,
  });
};

// Track pricing plan interactions
export const trackPricingInteraction = (
  action: string, // "view_plan", "compare_features", "calculate_savings"
  planName?: string,
  additionalData?: GAEventParams
) => {
  trackEvent("pricing_interaction", {
    action,
    plan_name: planName,
    ...additionalData,
  });
};
