"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { toast } from "sonner";

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    async function exchangeToken() {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const next = searchParams.get("next");

      if (!tokenHash || !type) {
        toast.error("Invalid confirmation link");
        setStatus("error");
        router.push("/auth/login");
        return;
      }

      const supabase = createClient();

      try {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as "email",
        });

        if (error) {
          toast.error(error.message);
          setStatus("error");
          router.push("/auth/login");
          return;
        }

        toast.success("Email confirmed! Redirecting...");
        setStatus("success");
        // Redirect to the next URL or dashboard
        const redirectTo = next ? decodeURIComponent(next) : "/dashboard";
        router.push(redirectTo);
      } catch {
        toast.error("Failed to confirm email");
        setStatus("error");
        router.push("/auth/login");
      }
    }

    exchangeToken();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm text-center">
        {status === "loading" && (
          <div className="space-y-4">
            <p className="text-lg">Confirming your email...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
          </div>
        )}
        {status === "success" && (
          <p className="text-lg text-green-600">
            Email confirmed successfully!
          </p>
        )}
        {status === "error" && (
          <p className="text-lg text-red-600">Failed to confirm email</p>
        )}
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-sm text-center">
            <div className="space-y-4">
              <p className="text-lg">Loading...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto" />
            </div>
          </div>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
