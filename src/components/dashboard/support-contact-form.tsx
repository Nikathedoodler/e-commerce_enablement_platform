"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  category: z.enum(["bug", "feature", "question", "other"], {
    required_error: "Please select a category",
  }),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

type SupportContactFormProps = {
  defaultEmail: string;
  defaultName: string;
};

export function SupportContactForm({
  defaultEmail,
  defaultName,
}: SupportContactFormProps) {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
      category: undefined,
      subject: "",
      message: "",
    },
  });

  const category = watch("category");

  const onSubmit = async (data: ContactFormData) => {
    setLoading(true);
    const toastId = toast.loading("Sending message...");

    try {
      const response = await fetch("/api/support/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to send message");
      }

      toast.success("Message sent successfully! We'll get back to you within 24-48 hours.", {
        id: toastId,
      });
      reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send message. Please try again.",
        { id: toastId }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send us a message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">
                Name <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                {...register("name")}
                disabled={loading}
              />
              {errors.name && (
                <FieldError>{errors.name.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">
                Email <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
                disabled={loading}
              />
              {errors.email && (
                <FieldError>{errors.email.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="category">
                Category <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                value={category}
                onValueChange={(value) => setValue("category", value as ContactFormData["category"])}
                disabled={loading}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug Report</SelectItem>
                  <SelectItem value="feature">Feature Request</SelectItem>
                  <SelectItem value="question">Question</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.category && (
                <FieldError>{errors.category.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="subject">
                Subject <span className="text-destructive">*</span>
              </FieldLabel>
              <Input
                id="subject"
                type="text"
                placeholder="Brief description of your issue"
                {...register("subject")}
                disabled={loading}
              />
              {errors.subject && (
                <FieldError>{errors.subject.message}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="message">
                Message <span className="text-destructive">*</span>
              </FieldLabel>
              <Textarea
                id="message"
                placeholder="Please provide as much detail as possible..."
                rows={6}
                {...register("message")}
                disabled={loading}
              />
              <FieldDescription>
                Minimum 10 characters. Include steps to reproduce if reporting a bug.
              </FieldDescription>
              {errors.message && (
                <FieldError>{errors.message.message}</FieldError>
              )}
            </Field>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
