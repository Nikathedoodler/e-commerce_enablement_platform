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
    confirmPassword?: string
  ) => {
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Password do no match");
      return;
    }

    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "",
      },
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Check your email to confirm.");
    router.push("/login");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignupForm onSubmit={handleSignUp} loading={loading} />
      </div>
    </div>
  );
}
