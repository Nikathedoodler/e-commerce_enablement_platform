import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HelpCenterLinks } from "@/components/dashboard/help-center-links";
import { SupportFAQ } from "@/components/dashboard/support-faq";
import { Card, CardContent } from "@/components/ui/card";

export default async function HelpCenterPage() {
  const supabase = await createClient();
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Help Center</h1>
        <p className="text-muted-foreground">
          Browse our guides, documentation, and frequently asked questions to
          find answers.
        </p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Documentation & Guides</h2>
          <HelpCenterLinks />
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">
            Frequently Asked Questions
          </h2>
          <Card>
            <CardContent className="pt-6">
              <SupportFAQ />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
