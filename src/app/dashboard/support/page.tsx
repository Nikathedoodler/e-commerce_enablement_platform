import { redirect } from "next/navigation";

export default async function SupportPage() {
  // Redirect to AI Assistant as the default support page
  redirect("/dashboard/support/ai-assistant");
}
