"use client";

import { SignupFormWithImage } from "@/components/signup-form-with-image";
import { createClient } from "@/lib/supabase/client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    const supabase = createClient();
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
    <SignupFormWithImage
      onSubmit={handleSignUp}
      loading={loading}
      imageSrc="/svg/third-party-logistics.webp"
    />
  );
}
