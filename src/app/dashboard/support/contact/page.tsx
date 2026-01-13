import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SupportContactForm } from "@/components/dashboard/support-contact-form";

export default async function ContactPage() {
  const supabase = await createClient();
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  // Fetch user profile for pre-filling form
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Support</h1>
        <p className="text-muted-foreground">
          Can&apos;t find what you&apos;re looking for? Send us a message and
          we&apos;ll get back to you within 24-48 hours.
        </p>
      </div>
      <SupportContactForm
        defaultEmail={user.email ?? ""}
        defaultName={profile?.full_name ?? ""}
      />
    </div>
  );
}
