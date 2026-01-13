"use client";

import * as React from "react";
import { ArrowDownToLine, Warehouse, Settings2, Package, HelpCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

type Profile = {
  company_name?: string | null;
  full_name?: string | null;
  role?: string | null;
} | null;

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { TeamSwitcher } from "@/components/dashboard/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Orders",
      url: "#",
      icon: Package,
      isActive: true,
      items: [
        {
          title: "All Orders",
          url: "#",
        },
        {
          title: "Pending",
          url: "#",
        },
        {
          title: "Fulfilled",
          url: "#",
        },
      ],
    },
    {
      title: "Inventory",
      url: "#",
      icon: Warehouse,
      items: [
        {
          title: "All Items",
          url: "#",
        },
        {
          title: "Low Stock",
          url: "#",
        },
        {
          title: "Add New",
          url: "#",
        },
      ],
    },
    {
      title: "Receiving",
      url: "#",
      icon: ArrowDownToLine,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Profile",
          url: "#",
        },
        {
          title: "Integrations",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
      ],
    },
    {
      title: "Support",
      url: "#",
      icon: HelpCircle,
      items: [
        {
          title: "AI Assistant",
          url: "#",
        },
        {
          title: "Help Center",
          url: "#",
        },
        {
          title: "Contact",
          url: "#",
        },
      ],
    },
  ],
};

export function AppSidebar({
  onNavSelect,
  profile,
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  onNavSelect?: (main: string, sub?: string) => void;
  profile?: Profile;
  user?: User | null;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher companyName={profile?.company_name} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onSelect={onNavSelect} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: profile?.full_name ?? "User",
            email: user?.email ?? "",
            avatar: "",
          }}
          profile={profile}
          authUser={user}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
