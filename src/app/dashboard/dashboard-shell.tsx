"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React, { useState } from "react";
import type { User } from "@supabase/supabase-js";

type Profile = {
  company_name?: string | null;
  full_name?: string | null;
  role?: string | null;
} | null;

type DashboardShellProps = {
  profile: Profile;
  user: User | null;
  children: React.ReactNode;
};

export default function DashboardShell({
  profile,
  user,
  children,
}: DashboardShellProps) {
  const [selected, setSelected] = useState<{ main: string; sub?: string }>({
    main: "Orders",
    sub: "All Orders",
  });

  return (
    <SidebarProvider>
      <AppSidebar
        onNavSelect={(main: string, sub?: string) => setSelected({ main, sub })}
        profile={profile}
        user={user}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{selected.main}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{selected.sub}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
