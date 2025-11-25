"use client";

import * as React from "react";
import {
  ArrowDownToLine,
  Warehouse,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Package,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavProjects } from "@/components/dashboard/nav-projects";
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
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
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
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
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
  profile?: any;
  user?: any;
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onSelect={onNavSelect} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} profile={profile} authUser={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
