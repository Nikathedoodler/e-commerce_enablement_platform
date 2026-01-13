import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Chatbot } from "@/components/dashboard/chatbot";

export default async function AIAssistantPage() {
  const supabase = await createClient();
  const {
    error,
    data: { user },
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/auth/login");
  }

  return (
    <div className="-mx-4 md:-mx-6 -mt-4 md:-mt-6 h-[calc(100vh-10rem)] flex flex-col overflow-hidden">
      <div className="flex-1 px-4 md:px-6 lg:px-12 xl:px-24 min-h-0">
        <Chatbot className="h-full w-full" noCard />
      </div>
    </div>
  );
}
