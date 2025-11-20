import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type SignUpFormType = Omit<React.ComponentProps<typeof Card>, "onSubmit"> & {
  onSubmit?: (
    email: string,
    password: string,
    confirmPassword: string,
    fullName: string,
    companyName?: string
  ) => void | Promise<void>;
  loading: boolean;
  errorMessage?: string;
};

export function SignupForm({ onSubmit, loading }: SignUpFormType) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        {/* <CardDescription>
          Enter your information below to create your account
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            onSubmit?.(
              formData.get("email") as string,
              formData.get("password") as string,
              formData.get("confirm-password") as string,
              formData.get("fullName") as string,
              (formData.get("companyName") as string) || undefined
            );
          }}
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                name="fullName"
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
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" name="password" required />
              {/* <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription> */}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="confirm-password"
                type="password"
                name="confirm-password"
                required
              />
              <FieldDescription>Please confirm your password.</FieldDescription>
            </Field>
            <FieldGroup>
              <Field>
                <Button type="submit">
                  {loading ? "creating account..." : "Create Account"}
                </Button>
                <Button variant="outline" type="button">
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="underline">
                    Sign in
                  </Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
