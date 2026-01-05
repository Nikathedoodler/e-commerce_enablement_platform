import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function ProfileSettingsPage() {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile information
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}

