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
    companyName?: string,
    inviteCode?: string
  ) => {
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!inviteCode || !inviteCode.trim()) {
      toast.error("Invite code is required");
      setLoading(false);
      return;
    }

    // Step 1: Validate invite code
    try {
      const validateResponse = await fetch("/api/invite-codes/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode.trim().toUpperCase() }),
      });

      const validateData = await validateResponse.json();

      if (!validateData.valid) {
        toast.error(validateData.error || "Invalid invite code");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("Error validating invite code:", error);
      toast.error("Failed to validate invite code. Please try again.");
      setLoading(false);
      return;
    }

    // Step 2: Create the user account
    // Pass full_name and company_name in metadata so trigger can use them
    const supabase = createClient();
    const { data: signUpData, error } = await supabase.auth.signUp({
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

    if (!signUpData.user) {
      toast.error("Failed to create account");
      setLoading(false);
      return;
    }

    // Step 3: Mark invite code as used
    try {
      const useResponse = await fetch("/api/invite-codes/use", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: inviteCode.trim().toUpperCase(),
          userId: signUpData.user.id,
        }),
      });

      if (!useResponse.ok) {
        console.error("Failed to mark invite code as used");
        // Don't fail registration if this fails, but log it
      }
    } catch (error) {
      console.error("Error using invite code:", error);
      // Don't fail registration if this fails
    }

    // Step 4: Profile is automatically created by trigger with full_name and company_name
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
