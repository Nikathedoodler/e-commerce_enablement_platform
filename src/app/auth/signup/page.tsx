"use client";

import { SignupForm } from "@/components/signup-form";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (
    email: string,
    password: string,
    confirmPassword: string,
    fullName: string,
    companyName?: string
  ) => {
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    // Step 1: Create the user account
    // Pass full_name and company_name in metadata so trigger can use them
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
        data: {
          full_name: fullName,
          company_name: companyName || null,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    // Step 2: Profile is automatically created by trigger with full_name and company_name
    // from user metadata (passed in signup options above)
    // No manual update needed!

    toast.success("Check your email to confirm your account.");
    setLoading(false);
    router.push("/auth/check-email");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSubmit={handleSignUp} loading={loading} />
      </div>
    </div>
  );
}
