"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
import { toast } from "sonner";
import { LoginFormWithImage } from "@/components/login-form-with-image";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }
    router.push("/dashboard");
  };

  return (
    <LoginFormWithImage
      onSubmit={handleLogin}
      loading={loading}
      companyName="platform"
      imageSrc="/svg/third-party-logistics.webp"
    />
  );
}
