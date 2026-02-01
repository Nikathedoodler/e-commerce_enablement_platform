"use client";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { trackButtonClick } from "@/lib/analytics";

// Dynamically import the demo page to reduce initial bundle size
const DemoPage = dynamic(() => import("@/app/demo/page"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full min-h-[600px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading demo...</p>
      </div>
    </div>
  ),
});

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DemoModal({ open, onOpenChange }: DemoModalProps) {
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      trackButtonClick("close_demo_modal", "demo_modal", {
        action: "close",
      });
    }
    onOpenChange(newOpen);
  };

  React.useEffect(() => {
    if (open) {
      trackButtonClick("open_demo_modal", "demo_modal", {
        action: "open",
        source: "interactive_demo",
      });
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[95vw] h-[95vh] p-0 overflow-hidden sm:max-w-[95vw] translate-y-[-50%] translate-x-[-50%]"
        showCloseButton={true}
      >
        <div className="h-full overflow-auto bg-background">
          <DemoPage />
        </div>
      </DialogContent>
    </Dialog>
  );
}
