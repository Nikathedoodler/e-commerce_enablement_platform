"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
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
  const [isValidToken, setIsValidToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function verifyToken() {
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      // Debug: log all URL parameters
      console.log("Reset password page - URL params:", {
        code,
        tokenHash,
        type,
        allParams: Object.fromEntries(searchParams.entries()),
      });

      // If no token parameters, redirect to login
      if (!code && (!tokenHash || type !== "recovery")) {
        console.log("No valid token parameters found:", {
          code,
          tokenHash,
          type,
        });
        toast.error("Invalid or missing reset token");
        router.push("/auth/login");
        return;
      }

      const supabase = createClient();

      // Handle code-based flow - exchange code for session immediately
      if (code) {
        try {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            console.error("Code exchange error:", exchangeError);
            toast.error(
              exchangeError.message || "Invalid or expired reset link"
            );
            router.push("/auth/login");
            return;
          }

          setIsValidToken(true);
          setIsVerifying(false);
        } catch (err) {
          console.error("Error exchanging code:", err);
          toast.error("Failed to verify reset link");
          router.push("/auth/login");
        }
      } else if (tokenHash && type === "recovery") {
        // For token_hash flow, we'll verify on form submit
        setIsValidToken(true);
        setIsVerifying(false);
      }
    }

    verifyToken();
  }, [searchParams, router]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
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

      const supabase = createClient();

      // For code-based flow, the session is already established in useEffect
      // For token_hash flow, verify the OTP now
      if (tokenHash && type === "recovery") {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "recovery",
        });

        if (verifyError) {
          console.error("OTP verify error:", verifyError);
          toast.error(verifyError.message);
          setLoading(false);
          return;
        }
      }

      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        console.error("Password update error:", updateError);
        toast.error(updateError.message);
        setLoading(false);
        return;
      }

      toast.success("Password updated successfully!");
      setPasswordUpdated(true);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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

  if (isVerifying || !isValidToken) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Verifying reset link...</CardTitle>
              <CardDescription>
                Please wait while we verify your password reset link.
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
