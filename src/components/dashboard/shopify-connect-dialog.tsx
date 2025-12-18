"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { Store } from "lucide-react";

type ShopifyConnectDialogProps = {
  /**
   * Controls dialog open/close state
   */
  open: boolean;

  /**
   * Callback when dialog open state changes
   */
  onOpenChange: (open: boolean) => void;
};

/**
 * Validates shop domain format
 * Should be either:
 * - "mystore.myshopify.com" format
 * - Or just "mystore" (we'll append .myshopify.com)
 */
function validateShopDomain(shop: string): boolean {
  const trimmed = shop.trim().toLowerCase();

  // Allow formats like "mystore" or "mystore.myshopify.com"
  if (trimmed.includes(".")) {
    return trimmed.endsWith(".myshopify.com");
  }

  // If no dot, assume it's just the shop name
  return trimmed.length > 0 && /^[a-z0-9-]+$/.test(trimmed);
}

/**
 * Normalizes shop domain to full format
 * "mystore" -> "mystore.myshopify.com"
 * "mystore.myshopify.com" -> "mystore.myshopify.com"
 */
function normalizeShopDomain(shop: string): string {
  const trimmed = shop.trim().toLowerCase();

  if (trimmed.includes(".")) {
    return trimmed;
  }

  return `${trimmed}.myshopify.com`;
}

export function ShopifyConnectDialog({
  open,
  onOpenChange,
}: ShopifyConnectDialogProps) {
  const [shopDomain, setShopDomain] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate shop domain
    if (!validateShopDomain(shopDomain)) {
      setError(
        "Please enter a valid Shopify store domain (e.g., 'mystore' or 'mystore.myshopify.com')"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Normalize shop domain
      const normalizedDomain = normalizeShopDomain(shopDomain);

      // Redirect to OAuth initiation endpoint
      window.location.href = `/api/shopify/auth?shop=${encodeURIComponent(
        normalizedDomain
      )}`;

      // Note: Dialog will close automatically on redirect
      // No need to call onOpenChange(false) since we're navigating away
    } catch (err) {
      setError("Failed to initiate connection. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShopDomain("");
      setError(null);
      setIsSubmitting(false);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Connect Shopify Store
          </DialogTitle>
          <DialogDescription>
            Connect your Shopify store to automatically sync orders. You'll be
            redirected to Shopify to authorize the connection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <Field>
              <FieldLabel>
                Shop Domain <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                type="text"
                placeholder="mystore or mystore.myshopify.com"
                value={shopDomain}
                onChange={(e) => {
                  setShopDomain(e.target.value);
                  setError(null); // Clear error when user types
                }}
                disabled={isSubmitting}
                className={error ? "border-destructive" : ""}
              />
              <FieldDescription>
                Enter your Shopify store domain. You can use just the store name
                (e.g., "mystore") or the full domain (e.g.,
                "mystore.myshopify.com").
              </FieldDescription>
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !shopDomain.trim()}>
              {isSubmitting ? "Connecting..." : "Connect to Shopify"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
