import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonOk<T>(data: T, init?: number) {
  return NextResponse.json(data, { status: init ?? 200 });
}

export function jsonError(message: string, status: number, details?: unknown) {
  const body: { error: string; details?: unknown } = { error: message };
  if (details !== undefined && process.env.NODE_ENV !== "production") {
    body.details = details;
  }
  return NextResponse.json(body, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    const first = error.issues[0];
    const msg = first
      ? `${first.path.join(".") || "field"}: ${first.message}`
      : "Validation failed";
    return jsonError(msg, 400, error.flatten());
  }
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return jsonError("Unauthorized", 401);
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return jsonError("Forbidden", 403);
  }
  if (error instanceof Error && error.message === "NOT_FOUND") {
    return jsonError("Not found", 404);
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === "57014"
  ) {
    return jsonError(
      "Database timeout. Please try again in a moment.",
      503
    );
  }
  console.error("[api]", error);
  return jsonError("Internal server error", 500);
}
