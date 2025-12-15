"use client";

import { ReceivingForm } from "@/components/dashboard/receiving-form";
import { ReceivingHistoryTable } from "@/components/dashboard/receiving-history-table";
import { Separator } from "@/components/ui/separator";

export default function ReceivingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Receiving</h1>
        <p className="text-muted-foreground">
          Record incoming inventory shipments
        </p>
      </div>

      {/* Receiving Form */}
      <ReceivingForm />

      <Separator className="my-8" />

      {/* Receiving History */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Receiving History
        </h2>
        <ReceivingHistoryTable />
      </div>
    </div>
  );
}

