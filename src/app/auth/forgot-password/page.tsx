"use client";

import { useState } from "react";
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
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email") as string;

      if (!email) {
        toast.error("Please enter your email address");
        setLoading(false);
        return;
      }

      const supabase = createClient();
      const redirectTo = `${window.location.origin}/auth/reset-password`;

      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        console.error("Password reset error:", error);
        toast.error(error.message);
        setLoading(false);
        return;
      }

      console.log("Password reset response:", data);

      // Note: Supabase returns success even if email sending fails
      // The email will only be sent if SMTP is configured in Supabase dashboard
      toast.success(
        "Password reset email sent! Please check your inbox (including spam folder). The email may take a few minutes to arrive."
      );
      setEmailSent(true);
    } catch (err) {
      console.error("Error resetting password:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle>Check your email</CardTitle>
              <CardDescription>
                We&apos;ve sent you a password reset link. Click the link in the
                email to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border bg-muted/50 p-4 text-sm">
                <p className="font-medium mb-2">Please note:</p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>The email may take a few minutes to arrive</li>
                  <li>
                    Check your spam or junk folder if you don&apos;t see it
                  </li>
                  <li>Please wait before requesting another email</li>
                </ul>
              </div>
              <Link href="/auth/login">
                <Button variant="outline" className="w-full">
                  Back to login
                </Button>
              </Link>
            </CardContent>
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
            <CardTitle>Reset your password</CardTitle>
            <CardDescription>
              Enter your email address and we&apos;ll send you a link to reset
              your password. The email may take a few minutes to arrive.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleResetPassword}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="m@example.com"
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>
                </Field>
                <Field>
                  <Link
                    href="/auth/login"
                    className="text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Back to login
                  </Link>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
