import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HelpCenterLinks } from "@/components/dashboard/help-center-links";
import { SupportFAQ } from "@/components/dashboard/support-faq";
import { SupportContactForm } from "@/components/dashboard/support-contact-form";

export default async function SupportPage() {
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support & Help</h1>
        <p className="text-muted-foreground">
          Get help, find answers, or contact our support team
        </p>
      </div>

      {/* Help Center Links Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Help Center</h2>
          <p className="text-muted-foreground">
            Browse our guides and documentation to find answers to common
            questions.
          </p>
        </div>
        <HelpCenterLinks />
      </div>

      {/* FAQ Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <p className="text-muted-foreground">
            Quick answers to common questions.
          </p>
        </div>
        <SupportFAQ />
      </div>

      {/* Contact Form Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Contact Support</h2>
          <p className="text-muted-foreground">
            Can't find what you're looking for? Send us a message and we'll get
            back to you within 24-48 hours.
          </p>
        </div>
        <SupportContactForm
          defaultEmail={user.email ?? ""}
          defaultName={profile?.full_name ?? ""}
        />
      </div>
    </div>
  );
}
