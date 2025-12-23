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
      // Try multiple ways to get the code parameter
      const code = searchParams.get("code");
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");

      // Fallback: check window.location directly in case searchParams doesn't work
      const urlParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const codeFromUrl = urlParams?.get("code");
      const tokenHashFromUrl = urlParams?.get("token_hash");
      const typeFromUrl = urlParams?.get("type");

      // Use whichever method found the params
      const finalCode = code || codeFromUrl;
      const finalTokenHash = tokenHash || tokenHashFromUrl;
      const finalType = type || typeFromUrl;

      // Debug: log all URL parameters
      console.log("Reset password page - URL params:", {
        code,
        codeFromUrl,
        finalCode,
        tokenHash,
        tokenHashFromUrl,
        finalTokenHash,
        type,
        typeFromUrl,
        finalType,
        allParams: Object.fromEntries(searchParams.entries()),
        windowLocation:
          typeof window !== "undefined" ? window.location.href : "N/A",
      });

      // If no token parameters, redirect to login
      if (!finalCode && (!finalTokenHash || finalType !== "recovery")) {
        console.log("No valid token parameters found:", {
          code: finalCode,
          tokenHash: finalTokenHash,
          type: finalType,
        });
        toast.error("Invalid or missing reset token");
        router.push("/auth/login");
        return;
      }

      const supabase = createClient();

      // For password reset with code parameter, Supabase redirect should establish session automatically
      // Check if user is already authenticated from the redirect
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Session already established, user can reset password
        console.log("User session found, allowing password reset");
        setIsValidToken(true);
        setIsVerifying(false);
        return;
      }

      // If no session yet, check if we have valid parameters
      // For code-based flow, Supabase should have established session via redirect
      // If we have a code but no session, the link might be invalid/expired
      if (finalCode && !user) {
        console.warn("Code parameter present but no user session found");
        // Give it a moment - sometimes the session takes a moment to establish
        await new Promise((resolve) => setTimeout(resolve, 500));
        const {
          data: { user: retryUser },
        } = await supabase.auth.getUser();
        if (retryUser) {
          setIsValidToken(true);
          setIsVerifying(false);
          return;
        }
        toast.error("Invalid or expired reset link. Please request a new one.");
        router.push("/auth/login");
        return;
      }

      if (finalTokenHash && finalType === "recovery") {
        // For token_hash flow, we'll verify on form submit
        setIsValidToken(true);
        setIsVerifying(false);
      } else if (!finalCode && !finalTokenHash) {
        // No valid parameters at all
        toast.error("Invalid reset link");
        router.push("/auth/login");
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

      // Fallback: check window.location directly
      const urlParams =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search)
          : null;
      const finalTokenHash = tokenHash || urlParams?.get("token_hash");
      const finalType = type || urlParams?.get("type");

      const supabase = createClient();

      // For code-based flow, the session is already established in useEffect
      // For token_hash flow, verify the OTP now
      if (finalTokenHash && finalType === "recovery") {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: finalTokenHash,
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
