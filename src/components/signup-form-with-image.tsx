"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type SignupFormWithImageProps = Omit<React.ComponentProps<"div">, "onSubmit"> & {
  onSubmit?: (
    email: string,
    password: string,
    confirmPassword: string,
    fullName: string,
    companyName?: string,
    inviteCode?: string
  ) => void | Promise<void>;
  loading: boolean;
  errorMessage?: string;
  imageSrc?: string;
};

// Social Login Icons
const AppleIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const GoogleIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const MetaIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export function SignupFormWithImage({
  onSubmit,
  loading,
  className,
  imageSrc = "/svg/third-party-logistics.webp",
  ...props
}: SignupFormWithImageProps) {
  return (
    <div
      className={cn("flex min-h-svh w-full flex-col md:flex-row", className)}
      {...props}
    >
      {/* Left side - Signup Form */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground">
              Enter your information to get started
            </p>
          </div>

          <form
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              onSubmit?.(
                formData.get("email") as string,
                formData.get("password") as string,
                formData.get("confirm-password") as string,
                formData.get("fullName") as string,
                (formData.get("companyName") as string) || undefined,
                (formData.get("inviteCode") as string) || undefined
              );
            }}
            className="space-y-4"
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                <Input
                  id="fullName"
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  required
                />
              </Field>

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
                <FieldLabel htmlFor="companyName">
                  Company Name (Optional)
                </FieldLabel>
                <Input
                  id="companyName"
                  type="text"
                  name="companyName"
                  placeholder="Acme Inc."
                />
                <FieldDescription>Your company name (optional)</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="inviteCode">Invite Code</FieldLabel>
                <Input
                  id="inviteCode"
                  type="text"
                  name="inviteCode"
                  placeholder="ABC123"
                  required
                  className="uppercase"
                  style={{ textTransform: "uppercase" }}
                />
                <FieldDescription>
                  Enter your invite code to register
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirm-password"
                  type="password"
                  name="confirm-password"
                  placeholder="Confirm your password"
                  required
                />
                <FieldDescription>Please confirm your password.</FieldDescription>
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={true}
              title="Coming soon"
            >
              <AppleIcon />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={true}
              title="Coming soon"
            >
              <GoogleIcon />
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              disabled={true}
              title="Coming soon"
            >
              <MetaIcon />
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden md:flex md:flex-1 items-center justify-center bg-muted p-4 md:p-6">
        <div className="relative w-full h-full max-w-4xl min-h-[600px]">
          <Image
            src={imageSrc}
            alt="Signup illustration"
            fill
            className={cn(
              imageSrc.endsWith(".svg") || imageSrc.endsWith(".webp")
                ? "object-contain"
                : "object-cover rounded-lg"
            )}
            priority
            sizes="(max-width: 768px) 0vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
}
