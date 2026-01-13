"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useShippingSettings,
  useUpdateShippingSettings,
} from "@/hooks/use-shipping-settings";
import { toast } from "sonner";
import type { DHLServiceType } from "@/types/shipping";

const SERVICE_TYPES: { value: DHLServiceType; label: string }[] = [
  { value: "EXPRESS_WORLDWIDE", label: "Express Worldwide" },
  { value: "EXPRESS_12_00", label: "Express 12:00" },
  { value: "ECONOMY_SELECT", label: "Economy Select" },
  { value: "EXPRESS_ENVELOPE", label: "Express Envelope" },
  {
    value: "EXPRESS_WORLDWIDE_NON_DOCUMENTS",
    label: "Express Worldwide Non-Documents",
  },
];

export default function ShippingSettingsPage() {
  const { data: settings, isLoading, error } = useShippingSettings();
  const updateSettings = useUpdateShippingSettings();

  // Form state
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [defaultWeight, setDefaultWeight] = useState("1.0");
  const [defaultLength, setDefaultLength] = useState("");
  const [defaultWidth, setDefaultWidth] = useState("");
  const [defaultHeight, setDefaultHeight] = useState("");
  const [defaultServiceType, setDefaultServiceType] =
    useState<DHLServiceType>("EXPRESS_WORLDWIDE");
  const [onStatusProcessing, setOnStatusProcessing] = useState(true);
  const [shopifyOrders, setShopifyOrders] = useState(false);
  const [manualOrders, setManualOrders] = useState(false);

  // Shipper info
  const [shipperName, setShipperName] = useState("");
  const [shipperCompany, setShipperCompany] = useState("");
  const [shipperAddress1, setShipperAddress1] = useState("");
  const [shipperAddress2, setShipperAddress2] = useState("");
  const [shipperCity, setShipperCity] = useState("");
  const [shipperState, setShipperState] = useState("");
  const [shipperPostalCode, setShipperPostalCode] = useState("");
  const [shipperCountry, setShipperCountry] = useState("GE");
  const [shipperPhone, setShipperPhone] = useState("");
  const [shipperEmail, setShipperEmail] = useState("");

  // Load settings into form
  useEffect(() => {
    if (settings) {
      setAutoGenerate(settings.auto_generate_labels);
      setDefaultWeight(settings.default_package_weight.toString());
      setDefaultLength(settings.default_package_length?.toString() || "");
      setDefaultWidth(settings.default_package_width?.toString() || "");
      setDefaultHeight(settings.default_package_height?.toString() || "");
      setDefaultServiceType(settings.default_service_type);
      setOnStatusProcessing(
        settings.auto_generate_rules?.on_status_processing ?? true
      );
      setShopifyOrders(settings.auto_generate_rules?.shopify_orders ?? false);
      setManualOrders(settings.auto_generate_rules?.manual_orders ?? false);

      setShipperName(settings.shipper_name || "");
      setShipperCompany(settings.shipper_company_name || "");
      setShipperAddress1(settings.shipper_address1 || "");
      setShipperAddress2(settings.shipper_address2 || "");
      setShipperCity(settings.shipper_city || "");
      setShipperState(settings.shipper_state || "");
      setShipperPostalCode(settings.shipper_postal_code || "");
      setShipperCountry(settings.shipper_country || "GE");
      setShipperPhone(settings.shipper_phone || "");
      setShipperEmail(settings.shipper_email || "");
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!autoGenerate) {
      // If auto-generation is disabled, just save the toggle
      try {
        await updateSettings.mutateAsync({
          auto_generate_labels: false,
        });
        toast.success("Settings saved successfully");
        return;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to save settings"
        );
        return;
      }
    }

    // Validate required fields for auto-generation
    if (
      !shipperName ||
      !shipperAddress1 ||
      !shipperCity ||
      !shipperPostalCode ||
      !shipperCountry ||
      !shipperPhone
    ) {
      toast.error("Please fill in all required shipper information");
      return;
    }

    if (!defaultWeight || parseFloat(defaultWeight) <= 0) {
      toast.error("Default package weight must be greater than 0");
      return;
    }

    try {
      await updateSettings.mutateAsync({
        auto_generate_labels: true,
        default_package_weight: parseFloat(defaultWeight),
        default_package_length: defaultLength
          ? parseFloat(defaultLength)
          : undefined,
        default_package_width: defaultWidth
          ? parseFloat(defaultWidth)
          : undefined,
        default_package_height: defaultHeight
          ? parseFloat(defaultHeight)
          : undefined,
        default_service_type: defaultServiceType,
        auto_generate_rules: {
          on_status_processing: onStatusProcessing,
          shopify_orders: shopifyOrders,
          manual_orders: manualOrders,
        },
        shipper_name: shipperName,
        shipper_company_name: shipperCompany || undefined,
        shipper_address1: shipperAddress1,
        shipper_address2: shipperAddress2 || undefined,
        shipper_city: shipperCity,
        shipper_state: shipperState || undefined,
        shipper_postal_code: shipperPostalCode,
        shipper_country: shipperCountry,
        shipper_phone: shipperPhone,
        shipper_email: shipperEmail || undefined,
      });
      toast.success("Settings saved successfully");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save settings"
      );
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shipping Settings
          </h1>
          <p className="text-muted-foreground">
            Configure automatic shipping label generation
          </p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shipping Settings
          </h1>
          <p className="text-muted-foreground">
            Configure automatic shipping label generation
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">
              Error loading settings:{" "}
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shipping Settings</h1>
        <p className="text-muted-foreground">
          Configure automatic shipping label generation and default package
          information
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Auto-Generation Toggle */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Automatic Label Generation</CardTitle>
            <CardDescription>
              Enable automatic shipping label generation based on your rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoGenerate"
                    checked={autoGenerate}
                    onChange={(e) => setAutoGenerate(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="autoGenerate" className="cursor-pointer">
                    Enable automatic label generation
                  </Label>
                </div>
                <FieldDescription>
                  When enabled, labels will be automatically generated based on
                  your rules below
                </FieldDescription>
              </Field>

              {autoGenerate && (
                <>
                  <Field>
                    <Label>Auto-Generation Rules</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="onStatusProcessing"
                          checked={onStatusProcessing}
                          onChange={(e) =>
                            setOnStatusProcessing(e.target.checked)
                          }
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label
                          htmlFor="onStatusProcessing"
                          className="cursor-pointer"
                        >
                          Generate when order status changes to
                          &quot;processing&quot;
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="shopifyOrders"
                          checked={shopifyOrders}
                          onChange={(e) => setShopifyOrders(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label
                          htmlFor="shopifyOrders"
                          className="cursor-pointer"
                        >
                          Generate for Shopify orders when created
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="manualOrders"
                          checked={manualOrders}
                          onChange={(e) => setManualOrders(e.target.checked)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label
                          htmlFor="manualOrders"
                          className="cursor-pointer"
                        >
                          Generate for manually created orders
                        </Label>
                      </div>
                    </div>
                  </Field>
                </>
              )}
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Default Package Information */}
        {autoGenerate && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Default Package Information</CardTitle>
              <CardDescription>
                Default values used for automatically generated labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="defaultWeight">
                    Default Weight (kg) *
                  </FieldLabel>
                  <Input
                    id="defaultWeight"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={defaultWeight}
                    onChange={(e) => setDefaultWeight(e.target.value)}
                    required={autoGenerate}
                  />
                </Field>

                <div className="grid grid-cols-3 gap-4">
                  <Field>
                    <FieldLabel htmlFor="defaultLength">Length (cm)</FieldLabel>
                    <Input
                      id="defaultLength"
                      type="number"
                      step="0.1"
                      min="0"
                      value={defaultLength}
                      onChange={(e) => setDefaultLength(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="defaultWidth">Width (cm)</FieldLabel>
                    <Input
                      id="defaultWidth"
                      type="number"
                      step="0.1"
                      min="0"
                      value={defaultWidth}
                      onChange={(e) => setDefaultWidth(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="defaultHeight">Height (cm)</FieldLabel>
                    <Input
                      id="defaultHeight"
                      type="number"
                      step="0.1"
                      min="0"
                      value={defaultHeight}
                      onChange={(e) => setDefaultHeight(e.target.value)}
                    />
                  </Field>
                </div>

                <Field>
                  <FieldLabel htmlFor="defaultServiceType">
                    Default Service Type
                  </FieldLabel>
                  <select
                    id="defaultServiceType"
                    value={defaultServiceType}
                    onChange={(e) =>
                      setDefaultServiceType(e.target.value as DHLServiceType)
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {SERVICE_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>
        )}

        {/* Shipper Information */}
        {autoGenerate && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Warehouse/Shipper Information</CardTitle>
              <CardDescription>
                Your warehouse address used as the origin for shipping labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="shipperName">Contact Name *</FieldLabel>
                  <Input
                    id="shipperName"
                    type="text"
                    value={shipperName}
                    onChange={(e) => setShipperName(e.target.value)}
                    required={autoGenerate}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="shipperCompany">Company Name</FieldLabel>
                  <Input
                    id="shipperCompany"
                    type="text"
                    value={shipperCompany}
                    onChange={(e) => setShipperCompany(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="shipperAddress1">
                    Address Line 1 *
                  </FieldLabel>
                  <Input
                    id="shipperAddress1"
                    type="text"
                    value={shipperAddress1}
                    onChange={(e) => setShipperAddress1(e.target.value)}
                    required={autoGenerate}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="shipperAddress2">
                    Address Line 2
                  </FieldLabel>
                  <Input
                    id="shipperAddress2"
                    type="text"
                    value={shipperAddress2}
                    onChange={(e) => setShipperAddress2(e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="shipperCity">City *</FieldLabel>
                    <Input
                      id="shipperCity"
                      type="text"
                      value={shipperCity}
                      onChange={(e) => setShipperCity(e.target.value)}
                      required={autoGenerate}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="shipperState">
                      State/Province
                    </FieldLabel>
                    <Input
                      id="shipperState"
                      type="text"
                      value={shipperState}
                      onChange={(e) => setShipperState(e.target.value)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="shipperPostalCode">
                      Postal Code *
                    </FieldLabel>
                    <Input
                      id="shipperPostalCode"
                      type="text"
                      value={shipperPostalCode}
                      onChange={(e) => setShipperPostalCode(e.target.value)}
                      required={autoGenerate}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="shipperCountry">
                      Country Code *
                    </FieldLabel>
                    <Input
                      id="shipperCountry"
                      type="text"
                      value={shipperCountry}
                      onChange={(e) => setShipperCountry(e.target.value)}
                      required={autoGenerate}
                      placeholder="GE"
                    />
                    <FieldDescription>
                      ISO country code (e.g., GE, US, GB)
                    </FieldDescription>
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="shipperPhone">Phone *</FieldLabel>
                    <Input
                      id="shipperPhone"
                      type="tel"
                      value={shipperPhone}
                      onChange={(e) => setShipperPhone(e.target.value)}
                      required={autoGenerate}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="shipperEmail">Email</FieldLabel>
                    <Input
                      id="shipperEmail"
                      type="email"
                      value={shipperEmail}
                      onChange={(e) => setShipperEmail(e.target.value)}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        )}

        <Button type="submit" disabled={updateSettings.isPending}>
          {updateSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}
