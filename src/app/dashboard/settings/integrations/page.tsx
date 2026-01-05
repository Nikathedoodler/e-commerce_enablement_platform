"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShopifyConnectionCard } from "@/components/dashboard/shopify-connection-card";
import { ShopifyConnectDialog } from "@/components/dashboard/shopify-connect-dialog";

export default function IntegrationsPage() {
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground">
            Connect your storefronts and services
          </p>
        </div>
        <Button onClick={() => setConnectDialogOpen(true)} className="w-full sm:w-auto">
          Connect Store
        </Button>
      </div>
      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <ShopifyConnectionCard
          onConnectClick={() => setConnectDialogOpen(true)}
        />
        <ShopifyConnectDialog
          open={connectDialogOpen}
          onOpenChange={setConnectDialogOpen}
        />
      </div>
    </div>
  );
}
