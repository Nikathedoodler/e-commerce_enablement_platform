import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardShell from "./dashboard-shell";
import { QueryProvider } from "@/lib/providers/query-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  console.log({ user, profile });
  return (
    <QueryProvider>
      <DashboardShell user={user} profile={profile}>
        {children}
      </DashboardShell>
    </QueryProvider>
  );
}
