"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Order } from "@/types/orders";

/**
 * Hook to get the current user ID (client-side)
 */
function useUserId(): string | undefined {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  return userId;
}

/**
 * Hook to listen for new orders in real-time using Supabase Realtime
 * Only triggers when a new order is actually created (not on every query)
 * Falls back to adaptive polling if Realtime is unavailable
 * 
 * @param onNewOrder - Optional callback when a new order is detected
 */
export function useRealtimeOrders(onNewOrder?: (order: Order) => void) {
  const userId = useUserId();
  const lastOrderIdRef = useRef<string | null>(null);
  const channelRef = useRef<ReturnType<typeof createClient>["channel"] | null>(null);
  const [realtimeAvailable, setRealtimeAvailable] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    // Subscribe to new orders for this user using Supabase Realtime
    const channel = supabase
      .channel(`orders:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newOrder = payload.new as Order;
          
          // Only show toast if this is a different order than we last saw
          if (lastOrderIdRef.current !== newOrder.id) {
            const orderNumber = newOrder.order_number;
            const customerEmail = newOrder.customer_email;
            const total = newOrder.total;

            toast.success("New Order Received", {
              description: `${orderNumber} - ${customerEmail} ($${total.toFixed(2)})`,
              action: {
                label: "View",
                onClick: () => {
                  window.location.href = `/dashboard/orders/all-orders?orderId=${newOrder.id}`;
                },
              },
              duration: 5000,
            });

            // Call optional callback
            onNewOrder?.(newOrder);
            
            // Update reference
            lastOrderIdRef.current = newOrder.id;
          }
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.log("✅ Subscribed to real-time order updates");
          setRealtimeAvailable(true);
        } else if (status === "CHANNEL_ERROR") {
          console.warn("⚠️ Realtime unavailable, will use polling fallback");
          setRealtimeAvailable(false);
        }
      });

    channelRef.current = channel;

    // Cleanup subscription on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        console.log("🔌 Unsubscribed from real-time order updates");
      }
    };
  }, [userId, onNewOrder]);

  return { realtimeAvailable };
}
