"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateProfile } from "@/lib/actions/profile";
import { toast } from "sonner";

type ProfileFormProps = {
  profile: {
    full_name?: string | null;
    company_name?: string | null;
  } | null;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const fullName = formData.get("fullName") as string;
    const companyName = (formData.get("companyName") as string) || undefined;

    const result = await updateProfile({
      fullName,
      companyName,
    });

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success("Profile updated successfully");
    setLoading(false);
    // Refresh the page to update the sidebar with new company name
    router.refresh();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
              <Input
                id="fullName"
                type="text"
                name="fullName"
                placeholder="John Doe"
                defaultValue={profile?.full_name || ""}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="companyName">Company Name</FieldLabel>
              <Input
                id="companyName"
                type="text"
                name="companyName"
                placeholder="Company Name"
                defaultValue={profile?.company_name || ""}
              />
              <FieldDescription>
                Your company name will be displayed in the sidebar
              </FieldDescription>
            </Field>
            <Field>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
