"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Store } from "lucide-react";
import { ShopifyStore } from "@/types/shopify";
import { useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteShopifyStore, useShopifyStores } from "@/hooks/use-shopify";
import { toast } from "sonner";

type ShopifyConnectionCardProps = {
  /**
   * Callback to open the connect dialog
   * Passed from parent to trigger the connect flow
   */
  onConnectClick?: () => void;
};

function getStatusBadgeColor(status: ShopifyStore["status"]) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "inactive":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "disconnected":
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
}

/**
 * Formats the connected date for display
 */
function formatConnectedDate(dateString: string): string {
  // TODO: Format the date string (e.g., "Jan 15, 2024")
  // You can use date-fns, Intl.DateTimeFormat, or similar
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats scopes for display (comma-separated list)
 */
function formatScopes(scopes: string): string {
  // TODO: Format scopes nicely (e.g., "read_orders, write_orders" -> "Read Orders, Write Orders")
  // Or just return as-is if you prefer
  return scopes
    .split(",")
    .map((scope) =>
      scope
        .trim()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase())
    )
    .join(", ");
}

export function ShopifyConnectionCard({
  onConnectClick,
}: ShopifyConnectionCardProps) {
  const [disconnectDialogOpen, setDisconnectDialogOpen] = useState(false);
  const [storeToDisconnect, setStoreToDisconnect] =
    useState<ShopifyStore | null>(null);

  const { data, error, isLoading } = useShopifyStores();
  const deleteMutation = useDeleteShopifyStore();

  // Handle OAuth callback success/error messages from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "connected") {
      toast.success("Shopify store connected successfully!");
      // Clean URL
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (params.get("error")) {
      toast.error(`Connection failed: ${params.get("error")}`);
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // Handle disconnect action
  const handleDisconnect = async () => {
    if (!storeToDisconnect) return;

    try {
      await deleteMutation.mutateAsync(storeToDisconnect.id);
      toast.success("Store disconnected successfully");
      setDisconnectDialogOpen(false);
      setStoreToDisconnect(null);
    } catch {
      toast.error("Failed to disconnect store");
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Shopify
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="h-20 bg-muted animate-pulse rounded" />
            <div className="h-20 bg-muted animate-pulse rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state - no stores connected
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Shopify
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Store className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              No Shopify stores connected
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Connect your Shopify store to start syncing orders automatically
            </p>
            {onConnectClick && (
              <Button onClick={onConnectClick}>Connect Store</Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5" />
            Shopify
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive">
                Failed to load stores: {error.message}
              </p>
            </div>
          )}
          <div className="space-y-4">
            {data?.map((store, index) => (
              <div key={store.id}>
                {index > 0 && <Separator className="my-4" />}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    {/* Store Domain */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-base">
                        {store.shop_domain}
                      </h3>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          store.status
                        )}`}
                      >
                        {store.status.charAt(0).toUpperCase() +
                          store.status.slice(1)}
                      </span>
                    </div>

                    {/* Connected Date */}
                    <p className="text-sm text-muted-foreground">
                      Connected on {formatConnectedDate(store.connected_at)}
                    </p>

                    {/* Scopes */}
                    {store.scopes && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground mb-1">
                          Permissions:
                        </p>
                        <p className="text-xs font-mono bg-muted px-2 py-1 rounded break-words">
                          {formatScopes(store.scopes)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Disconnect Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStoreToDisconnect(store);
                      setDisconnectDialogOpen(true);
                    }}
                    className="text-destructive hover:text-destructive w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog
        open={disconnectDialogOpen}
        onOpenChange={setDisconnectDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Shopify Store?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect{" "}
              <span className="font-semibold">
                {storeToDisconnect?.shop_domain}
              </span>
              ? This will stop automatic order syncing from this store. You can
              reconnect it anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStoreToDisconnect(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
