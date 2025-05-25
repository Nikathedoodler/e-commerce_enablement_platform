"use client";

import { AppSidebar } from "@/components/dashboard/app-sidebar";
import TextGenerator from "@/components/TextGenerator";
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
// import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const [selected, setSelected] = useState<{ main: string; sub?: string }>({
    main: "Models",
    sub: "Gemini",
  });
  // const session = await getServerSession();
  // if (!session) {
  //   redirect("/login");
  // }

  return (
    <SidebarProvider>
      <AppSidebar
        {...({
          onSelect: (main: string, sub?: string) => setSelected({ main, sub }),
        } as any)}
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
        {/* Main content switching logic */}
        {selected.main === "Models" && selected.sub === "Gemini" && (
          <TextGenerator />
        )}
        {/* Add more conditional renders for other tools/pages as needed */}
      </SidebarInset>
    </SidebarProvider>
  );
}
