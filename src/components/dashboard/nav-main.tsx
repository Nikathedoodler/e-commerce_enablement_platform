"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { getDateRangeFromPreset } from "@/components/dashboard/analytics/date-range-selector";
import {
  getOrderAnalyticsBatched,
  getInventoryStats,
} from "@/lib/supabase/queries/analytics";

export function NavMain({
  items,
  onSelect,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  onSelect?: (main: string, sub?: string) => void;
}) {
  const { setOpenMobile } = useSidebar();
  const queryClient = useQueryClient();
  
  const slugify = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  // Prefetch analytics data on hover
  const handleAnalyticsHover = () => {
    const dateRange = getDateRangeFromPreset("30d");
    
    // Prefetch critical analytics data using the same query keys and functions as the hooks
    queryClient.prefetchQuery({
      queryKey: [
        "analytics",
        "order-analytics-batched",
        dateRange.startDate,
        dateRange.endDate,
      ],
      queryFn: () =>
        getOrderAnalyticsBatched(dateRange.startDate, dateRange.endDate),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

    queryClient.prefetchQuery({
      queryKey: ["analytics", "inventory-stats"],
      queryFn: () => getInventoryStats(),
      staleTime: 1000 * 60 * 15, // 15 minutes
    });
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items?.length ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      const mainSlug = slugify(item.title);
                      const subSlug = slugify(subItem.title);
                      const href = `/dashboard/${mainSlug}/${subSlug}`;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link
                              href={href}
                              onClick={() => {
                                onSelect?.(item.title, subItem.title);
                                setOpenMobile(false);
                              }}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link
                  href={`/dashboard/${slugify(item.title)}`}
                  onClick={() => {
                    setOpenMobile(false);
                  }}
                  onMouseEnter={() => {
                    // Prefetch analytics data when hovering over Analytics link
                    if (item.title.toLowerCase() === "analytics") {
                      handleAnalyticsHover();
                    }
                  }}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
