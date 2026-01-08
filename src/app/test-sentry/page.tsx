"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TestSentryPage() {
  const triggerClientError = () => {
    // This will trigger a client-side error that Sentry should catch
    throw new Error("Test error from Sentry test page - Client Side");
  };

  const triggerAsyncError = async () => {
    // Simulate an async error
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error("Test async error from Sentry test page");
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Sentry Error Tracking Test</CardTitle>
          <CardDescription>
            Click the buttons below to test Sentry error tracking. Check your
            Sentry dashboard after triggering an error.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Test Client-Side Error:</h3>
            <p className="text-sm text-muted-foreground">
              This will throw a synchronous error that Sentry should capture.
            </p>
            <Button onClick={triggerClientError} variant="destructive">
              Trigger Client Error
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Test Async Error:</h3>
            <p className="text-sm text-muted-foreground">
              This will throw an async error that Sentry should capture.
            </p>
            <Button onClick={triggerAsyncError} variant="destructive">
              Trigger Async Error
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> After clicking a button, check your Sentry
              dashboard at{" "}
              <a
                href="https://sentry.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                sentry.io
              </a>{" "}
              to see if the error appears. It may take a few seconds to show up.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
