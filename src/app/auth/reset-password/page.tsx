"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function ResetPasswordContent() {
  const [loading, setLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Verify the token is present
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!tokenHash || type !== "recovery") {
      toast.error("Invalid or missing reset token");
      router.push("/auth/login");
    }
  }, [searchParams, router]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");

    if (!tokenHash || type !== "recovery") {
      toast.error("Invalid reset token");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    // Verify the OTP and update password
    const { error: verifyError } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
    });

    if (verifyError) {
      toast.error(verifyError.message);
      setLoading(false);
      return;
    }

    // Update the password
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (updateError) {
      toast.error(updateError.message);
      return;
    }

    toast.success("Password updated successfully!");
    setPasswordUpdated(true);
    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  if (passwordUpdated) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Password updated</CardTitle>
              <CardDescription>
                Your password has been successfully updated. Redirecting to
                login...
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Set new password</CardTitle>
            <CardDescription>Enter your new password below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                    minLength={6}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    required
                    minLength={6}
                  />
                </Field>
                <Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Updating..." : "Update password"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
