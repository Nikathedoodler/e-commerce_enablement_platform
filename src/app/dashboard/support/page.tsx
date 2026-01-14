import { redirect } from "next/navigation";

export default async function SupportPage() {
  // Redirect to Help Center as the default support page
  redirect("/dashboard/support/help-center");
}
