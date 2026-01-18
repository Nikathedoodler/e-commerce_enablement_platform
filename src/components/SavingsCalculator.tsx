"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Calculator, TrendingDown, CheckCircle2 } from "lucide-react";

type SavingsCalculatorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type CalculationResult = {
  currentMonthlyCost: number;
  recommendedPlan: {
    name: string;
    monthlyFee: number;
    fulfillmentCostPerOrder: number;
    newMonthlyCost: number;
    savings: number;
    savingsPercentage: number;
  } | null;
  allPlans: Array<{
    name: string;
    monthlyFee: number;
    fulfillmentCostPerOrder: number;
    newMonthlyCost: number;
    savings: number;
    savingsPercentage: number;
    maxOrders: number;
  }>;
};

const PRICING_PLANS = [
  {
    name: "Starter",
    monthlyFee: 199,
    fulfillmentCostPerOrder: 4.0,
    maxOrders: 250,
  },
  {
    name: "Growth",
    monthlyFee: 699,
    fulfillmentCostPerOrder: 3.5,
    maxOrders: 2000,
  },
  {
    name: "Scale Pro",
    monthlyFee: 0, // Custom pricing - estimate based on volume
    fulfillmentCostPerOrder: 3.2,
    maxOrders: Infinity,
  },
];

export function SavingsCalculator({
  open,
  onOpenChange,
}: SavingsCalculatorProps) {
  const [formData, setFormData] = useState({
    currentFulfillmentCost: "",
    monthlyOrderVolume: "",
    currentStorageCost: "",
    currentPlatformFee: "",
  });
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (
      !formData.currentFulfillmentCost ||
      parseFloat(formData.currentFulfillmentCost) <= 0
    ) {
      newErrors.currentFulfillmentCost =
        "Please enter a valid fulfillment cost";
    }

    if (
      !formData.monthlyOrderVolume ||
      parseFloat(formData.monthlyOrderVolume) <= 0
    ) {
      newErrors.monthlyOrderVolume = "Please enter a valid order volume";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateSavings = () => {
    if (!validateForm()) return;

    const currentFulfillmentCost = parseFloat(formData.currentFulfillmentCost);
    const monthlyOrderVolume = parseFloat(formData.monthlyOrderVolume);
    const currentStorageCost = parseFloat(formData.currentStorageCost) || 0;
    const currentPlatformFee = parseFloat(formData.currentPlatformFee) || 0;

    // Calculate current monthly cost
    const currentMonthlyCost =
      currentFulfillmentCost * monthlyOrderVolume +
      currentStorageCost +
      currentPlatformFee;

    // Calculate costs for each plan
    const allPlans = PRICING_PLANS.map((plan) => {
      // For Scale Pro, use a realistic minimum estimate based on volume
      // Scale Pro is enterprise/custom pricing, so it should have a higher base cost
      let monthlyFee = plan.monthlyFee;
      if (plan.name === "Scale Pro") {
        // Estimate based on volume: higher base fee for enterprise tier
        // This ensures Scale Pro isn't always the cheapest option
        if (monthlyOrderVolume >= 2000) {
          monthlyFee = 2000; // Base for high volume
        } else if (monthlyOrderVolume >= 1000) {
          monthlyFee = 1500; // Base for medium-high volume
        } else {
          monthlyFee = 1200; // Minimum base for Scale Pro tier
        }
      }

      const newMonthlyCost =
        monthlyFee + plan.fulfillmentCostPerOrder * monthlyOrderVolume;
      const savings = currentMonthlyCost - newMonthlyCost;
      const savingsPercentage =
        currentMonthlyCost > 0 ? (savings / currentMonthlyCost) * 100 : 0;

      return {
        name: plan.name,
        monthlyFee,
        fulfillmentCostPerOrder: plan.fulfillmentCostPerOrder,
        newMonthlyCost,
        savings,
        savingsPercentage,
        maxOrders: plan.maxOrders,
      };
    });

    // Filter plans that can handle the order volume
    const eligiblePlans = allPlans.filter(
      (plan) => monthlyOrderVolume <= plan.maxOrders
    );

    // For recommendations, exclude Scale Pro unless volume is very high (2000+)
    // Scale Pro is enterprise/custom pricing and shouldn't be auto-recommended for smaller volumes
    const recommendablePlans = eligiblePlans.filter(
      (plan) => plan.name !== "Scale Pro" || monthlyOrderVolume >= 2000
    );

    // Find the plan with highest savings from recommendable plans
    const bestPlan =
      recommendablePlans.length > 0
        ? recommendablePlans.reduce((best, current) =>
            current.savings > best.savings ? current : best
          )
        : null;

    // Only recommend if there are actual savings (positive)
    const recommendedPlan = bestPlan && bestPlan.savings > 0 ? bestPlan : null;

    setResults({
      currentMonthlyCost,
      recommendedPlan,
      allPlans,
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleReset = () => {
    setFormData({
      currentFulfillmentCost: "",
      monthlyOrderVolume: "",
      currentStorageCost: "",
      currentPlatformFee: "",
    });
    setResults(null);
    setErrors({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] sm:max-w-lg md:max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
            <Calculator className="h-5 w-5 sm:h-6 sm:w-6" />
            Calculate Your Savings
          </DialogTitle>
          <DialogDescription className="text-sm">
            Enter your current fulfillment costs to see how much you could save
            with our platform.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {!results ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                calculateSavings();
              }}
              className="space-y-4 sm:space-y-6"
            >
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="currentFulfillmentCost">
                    Current Fulfillment Cost per Order (€) *
                  </FieldLabel>
                  <FieldDescription>
                    How much do you currently pay per order for fulfillment?
                  </FieldDescription>
                  <Input
                    id="currentFulfillmentCost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 5.50"
                    value={formData.currentFulfillmentCost}
                    onChange={(e) =>
                      handleInputChange(
                        "currentFulfillmentCost",
                        e.target.value
                      )
                    }
                    className={
                      errors.currentFulfillmentCost ? "border-destructive" : ""
                    }
                  />
                  {errors.currentFulfillmentCost && (
                    <FieldError>{errors.currentFulfillmentCost}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="monthlyOrderVolume">
                    Monthly Order Volume *
                  </FieldLabel>
                  <FieldDescription>
                    How many orders do you fulfill per month?
                  </FieldDescription>
                  <Input
                    id="monthlyOrderVolume"
                    type="number"
                    step="1"
                    min="1"
                    placeholder="e.g., 500"
                    value={formData.monthlyOrderVolume}
                    onChange={(e) =>
                      handleInputChange("monthlyOrderVolume", e.target.value)
                    }
                    className={
                      errors.monthlyOrderVolume ? "border-destructive" : ""
                    }
                  />
                  {errors.monthlyOrderVolume && (
                    <FieldError>{errors.monthlyOrderVolume}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="currentStorageCost">
                    Current Monthly Storage Cost (€) (Optional)
                  </FieldLabel>
                  <FieldDescription>
                    Your current monthly warehouse/storage fees
                  </FieldDescription>
                  <Input
                    id="currentStorageCost"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 300"
                    value={formData.currentStorageCost}
                    onChange={(e) =>
                      handleInputChange("currentStorageCost", e.target.value)
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="currentPlatformFee">
                    Current Monthly Platform/Software Fee (€) (Optional)
                  </FieldLabel>
                  <FieldDescription>
                    Any monthly fees for logistics software or platforms
                  </FieldDescription>
                  <Input
                    id="currentPlatformFee"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 99"
                    value={formData.currentPlatformFee}
                    onChange={(e) =>
                      handleInputChange("currentPlatformFee", e.target.value)
                    }
                  />
                </Field>
              </FieldGroup>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button type="submit" className="flex-1 w-full sm:w-auto">
                  Calculate Savings
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {/* Current Cost Summary */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">
                    Your Current Monthly Cost
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    €
                    {results.currentMonthlyCost.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Plan */}
              {results.recommendedPlan ? (
                <Card className="border-2 border-lime-400 bg-lime-50/50">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-lime-600" />
                        <span>
                          Recommended Plan: {results.recommendedPlan.name}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          New Monthly Cost
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900">
                          €
                          {results.recommendedPlan.newMonthlyCost.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs sm:text-sm text-gray-600">
                          Monthly Savings
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-lime-600 flex items-center gap-1">
                          <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5" />€
                          {results.recommendedPlan.savings.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500">
                          (
                          {results.recommendedPlan.savingsPercentage.toFixed(1)}
                          % savings)
                        </div>
                      </div>
                    </div>
                    <Separator />
                    <div className="text-xs sm:text-sm text-gray-600">
                      <strong>Annual Savings:</strong> €
                      {(results.recommendedPlan.savings * 12).toLocaleString(
                        "en-US",
                        {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-2 border-amber-400 bg-amber-50/50">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-base sm:text-lg text-amber-900">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                        <span>You&apos;re Already Getting a Great Deal!</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
                    <p className="text-sm sm:text-base text-gray-700">
                      Based on your current costs, our platform would not
                      provide savings at this time. Your current setup appears
                      to be more cost-effective for your order volume.
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      However, our platform offers additional benefits beyond
                      cost savings, including real-time tracking, automated
                      workflows, and seamless integrations. Feel free to reach
                      out if you&apos;d like to learn more about these
                      value-added features.
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* All Plans Comparison */}
              <Card>
                <CardHeader className="p-4 sm:p-6">
                  <CardTitle className="text-base sm:text-lg">
                    Compare All Plans
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0">
                  <div className="space-y-3 sm:space-y-4">
                    {results.allPlans.map((plan) => {
                      const isRecommended =
                        plan.name === results.recommendedPlan?.name;
                      const isEligible =
                        parseFloat(formData.monthlyOrderVolume) <=
                        plan.maxOrders;
                      const hasSavings = plan.savings > 0;

                      return (
                        <div
                          key={plan.name}
                          className={`p-3 sm:p-4 rounded-lg border ${
                            isRecommended
                              ? "border-lime-400 bg-lime-50/50"
                              : hasSavings
                              ? "border-green-200 bg-green-50/30"
                              : "border-gray-200"
                          } ${!isEligible ? "opacity-50" : ""}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0">
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h3 className="font-semibold text-base sm:text-lg">
                                  {plan.name}
                                </h3>
                                {isRecommended && (
                                  <span className="text-xs bg-lime-400 text-lime-900 px-2 py-1 rounded-full font-semibold whitespace-nowrap">
                                    RECOMMENDED
                                  </span>
                                )}
                                {!isEligible && (
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full whitespace-nowrap">
                                    Volume too high
                                  </span>
                                )}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 mt-1 break-words">
                                {plan.name === "Scale Pro" ? (
                                  <span>
                                    Custom pricing (est. €
                                    {plan.monthlyFee.toFixed(0)}/mo) + €
                                    {plan.fulfillmentCostPerOrder.toFixed(2)}
                                    /order
                                  </span>
                                ) : (
                                  <span>
                                    €{plan.monthlyFee.toFixed(0)}/mo + €
                                    {plan.fulfillmentCostPerOrder.toFixed(2)}
                                    /order
                                  </span>
                                )}
                              </div>
                              {plan.name === "Scale Pro" &&
                                parseFloat(formData.monthlyOrderVolume) <
                                  2000 && (
                                  <div className="text-xs text-amber-600 mt-1 italic">
                                    Contact us for custom pricing tailored to
                                    your needs
                                  </div>
                                )}
                            </div>
                            <div className="text-left sm:text-right flex-shrink-0">
                              <div className="text-xs sm:text-sm text-gray-600">
                                Monthly Cost
                              </div>
                              <div className="text-lg sm:text-xl font-bold text-gray-900">
                                €
                                {plan.newMonthlyCost.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </div>
                              {hasSavings ? (
                                <div className="text-xs sm:text-sm text-lime-600 font-semibold mt-1">
                                  Save €
                                  {plan.savings.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                                </div>
                              ) : plan.savings < 0 ? (
                                <div className="text-xs sm:text-sm text-red-600 font-semibold mt-1">
                                  +€
                                  {Math.abs(plan.savings).toLocaleString(
                                    "en-US",
                                    {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }
                                  )}{" "}
                                  more
                                </div>
                              ) : (
                                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                                  No change
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="flex-1 w-full sm:w-auto"
                >
                  Calculate Again
                </Button>
                <Button
                  onClick={() => {
                    handleReset();
                    onOpenChange(false);
                  }}
                  className="flex-1 w-full sm:w-auto"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
