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
import { planFeatures, planComparisonRows } from "@/lib/constants/plans";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useUsageLimits } from "@/hooks/use-usage-limits";

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
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const { data: subscription, isLoading, error } = useSubscription();
  const {
    data: usage,
    isLoading: usageLoading,
    error: usageError,
  } = useUsageLimits();

  const percentage = usage?.limit ? (usage.current / usage.limit) * 100 : 0;

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
              <div className="flex items-center gap-10 text-sm">
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

              {/* Usage Limits Section */}
              {usageLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ) : usageError ? (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    Failed to load usage data: {usageError.message}
                  </p>
                </div>
              ) : usage ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <p className="text-muted-foreground">Order Usage</p>
                    <p className="font-medium">
                      {usage.isUnlimited ? (
                        <span>
                          {usage.current} orders{" "}
                          <span className="text-muted-foreground">
                            (Unlimited)
                          </span>
                        </span>
                      ) : (
                        <span>
                          {usage.current} / {usage.limit} orders
                        </span>
                      )}
                    </p>
                  </div>
                  {!usage.isUnlimited && (
                    <>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            percentage >= 100
                              ? "bg-red-500"
                              : percentage >= 80
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                      {percentage >= 100 && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3">
                          <p className="text-sm text-red-800 dark:text-red-200">
                            Order limit exceeded. Please upgrade to continue
                            processing orders.
                          </p>
                        </div>
                      )}
                      {percentage >= 80 && percentage < 100 && (
                        <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-3">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            You&apos;re approaching your order limit (
                            {usage.remaining} remaining). Consider upgrading to
                            avoid interruptions.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : null}
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
                You don&apos;t have an active subscription yet.
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
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={() => setIsComparisonOpen(!isComparisonOpen)}
              className="flex items-center gap-2"
            >
              {isComparisonOpen ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Comparison
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Compare Plans
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Comparison Table */}
      {isComparisonOpen && (
        <Card>
          <CardHeader>
            <CardTitle>Plan Comparison</CardTitle>
            <CardDescription>
              Compare features across all plans. Your current plan is
              highlighted.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-semibold text-muted-foreground border-b">
                      Feature
                    </th>
                    {planFeatures.map((plan) => {
                      const isCurrentPlan =
                        subscription?.plan_tier === plan.tier;
                      return (
                        <th
                          key={plan.tier}
                          className={`text-left px-4 py-3 text-sm font-semibold border-b ${
                            isCurrentPlan
                              ? "bg-primary/10 border-primary/20"
                              : ""
                          }`}
                        >
                          <div className="flex flex-col gap-1">
                            <span className="text-base font-bold">
                              {plan.name}
                            </span>
                            {isCurrentPlan && (
                              <Badge variant="default" className="w-fit">
                                Current Plan
                              </Badge>
                            )}
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {planComparisonRows.map((row, idx) => (
                    <tr
                      key={row.label}
                      className={
                        idx % 2 === 0 ? "bg-muted/30" : "bg-background"
                      }
                    >
                      <td className="px-4 py-3 text-sm font-medium text-muted-foreground">
                        {row.label}
                      </td>
                      {planFeatures.map((plan) => {
                        const isCurrentPlan =
                          subscription?.plan_tier === plan.tier;
                        return (
                          <td
                            key={`${plan.tier}-${row.key}`}
                            className={`px-4 py-3 text-sm ${
                              isCurrentPlan ? "bg-primary/5 font-medium" : ""
                            }`}
                          >
                            {plan[row.key]}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
