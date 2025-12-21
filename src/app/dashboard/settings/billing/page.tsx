"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (
    planTier: "starter" | "professional" | "enterprise"
  ) => {
    setLoading(planTier);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planTier }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Checkout error:", data);
        const errorMsg = data.error || "Failed to create checkout session";
        const errorType = data.type ? ` (${data.type})` : "";
        alert(`Error: ${errorMsg}${errorType}`);
        return;
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Failed to create checkout session");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Test Checkout</h2>
          <p className="text-sm text-muted-foreground">
            Click a button below to test the Stripe checkout flow for each plan:
          </p>
          <div className="flex gap-4">
            <Button
              onClick={() => handleCheckout("starter")}
              disabled={loading !== null}
              variant="outline"
            >
              {loading === "starter" ? "Loading..." : "Test Starter (€199)"}
            </Button>
            <Button
              onClick={() => handleCheckout("professional")}
              disabled={loading !== null}
              variant="outline"
            >
              {loading === "professional"
                ? "Loading..."
                : "Test Professional (€699)"}
            </Button>
            <Button
              onClick={() => handleCheckout("enterprise")}
              disabled={loading !== null}
              variant="outline"
            >
              {loading === "enterprise"
                ? "Loading..."
                : "Test Enterprise (€2,000)"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
