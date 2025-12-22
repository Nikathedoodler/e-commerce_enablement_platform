"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@/hooks/use-subscriptions";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const planNames: Record<string, string> = {
  starter: "Starter",
  professional: "Growth",
  enterprise: "Scale Pro",
};

const planPrices: Record<string, string> = {
  starter: "€199",
  professional: "€699",
  enterprise: "€2,000",
};

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [isBillingLoading, setIsBillingLoading] = useState(false);
  const { data: subscription, isLoading, error } = useSubscription();

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
        toast.error(`Error: ${errorMsg}${errorType}`);
        return;
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to create checkout session");
    } finally {
      setLoading(null);
    }
  };

  const handleBilling = async () => {
    setIsBillingLoading(true);

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(
          `Error: ${data.error || "Failed to create portal session"}`
        );
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("billing error", error);
      toast.error("Failed to redirect to billing");
    } finally {
      setIsBillingLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Subscription</CardTitle>
            {subscription?.stripe_customer_id && (
              <Button disabled={isBillingLoading} onClick={handleBilling}>
                {isBillingLoading ? "Loading..." : "Manage Billing"}
              </Button>
            )}
          </div>
          <CardDescription>
            Your active subscription plan and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          ) : error ? (
            <p className="text-sm text-destructive">
              Failed to load subscription: {error.message}
            </p>
          ) : subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">
                      {planNames[subscription.plan_tier] ||
                        subscription.plan_tier}
                    </h3>
                    <Badge
                      variant={
                        subscription.status === "active"
                          ? "default"
                          : subscription.status === "canceled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {subscription.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {planPrices[subscription.plan_tier]}/month
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Current Period Start</p>
                  <p className="font-medium">
                    {formatDate(subscription.current_period_start)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current Period End</p>
                  <p className="font-medium">
                    {formatDate(subscription.current_period_end)}
                  </p>
                </div>
              </div>
              {subscription.cancel_at_period_end && (
                <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Your subscription will cancel at the end of the current
                    billing period.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                You don't have an active subscription yet.
              </p>
              <p className="text-sm font-medium">
                Choose a plan below to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade/Change Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Available Plans</CardTitle>
          <CardDescription>
            {subscription
              ? "Upgrade or change your subscription plan"
              : "Select a plan to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border p-4 space-y-4">
              <div>
                <h3 className="font-semibold">Starter</h3>
                <p className="text-2xl font-bold">€199</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <Button
                onClick={() => handleCheckout("starter")}
                disabled={
                  loading !== null || subscription?.plan_tier === "starter"
                }
                variant={
                  subscription?.plan_tier === "starter" ? "outline" : "default"
                }
                className="w-full"
              >
                {loading === "starter"
                  ? "Loading..."
                  : subscription?.plan_tier === "starter"
                  ? "Current Plan"
                  : "Select Starter"}
              </Button>
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <div>
                <h3 className="font-semibold">Growth</h3>
                <p className="text-2xl font-bold">€699</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <Button
                onClick={() => handleCheckout("professional")}
                disabled={
                  loading !== null || subscription?.plan_tier === "professional"
                }
                variant={
                  subscription?.plan_tier === "professional"
                    ? "outline"
                    : "default"
                }
                className="w-full"
              >
                {loading === "professional"
                  ? "Loading..."
                  : subscription?.plan_tier === "professional"
                  ? "Current Plan"
                  : "Select Growth"}
              </Button>
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <div>
                <h3 className="font-semibold">Scale Pro</h3>
                <p className="text-2xl font-bold">€2,000</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
              <Button
                onClick={() => handleCheckout("enterprise")}
                disabled={
                  loading !== null || subscription?.plan_tier === "enterprise"
                }
                variant={
                  subscription?.plan_tier === "enterprise"
                    ? "outline"
                    : "default"
                }
                className="w-full"
              >
                {loading === "enterprise"
                  ? "Loading..."
                  : subscription?.plan_tier === "enterprise"
                  ? "Current Plan"
                  : "Select Scale Pro"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
