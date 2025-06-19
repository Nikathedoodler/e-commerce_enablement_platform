import { SidebarProvider } from "@/components/ui/sidebar";
import { redirect } from "next/navigation";
import { auth } from "../../../auth";
import DashboardClient from "@/components/DashboardClient";

export default async function Page() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <SidebarProvider>
      <DashboardClient />
    </SidebarProvider>
  );
}
