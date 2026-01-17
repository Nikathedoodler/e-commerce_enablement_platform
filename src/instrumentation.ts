import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

export async function onRequestError(
  err: Error,
  request: {
    path: string;
    headers: Record<string, string | string[] | undefined>;
    method?: string;
  },
  context: {
    routerKind: "Pages Router" | "App Router";
    routePath?: string;
  }
) {
  // Capture errors from nested React Server Components
  Sentry.captureRequestError(err, {
    request: {
      url: request.path,
      headers: request.headers,
      method: request.method,
    },
    contexts: {
      nextjs: {
        routePath: context.routePath,
        routerKind: context.routerKind,
      },
    },
  });
}
