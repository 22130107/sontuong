/** Standardized API response helpers */

export function ok<T>(data: T, message = "Success") {
  return Response.json({ success: true, message, data }, { status: 200 });
}

export function created<T>(data: T, message = "Created") {
  return Response.json({ success: true, message, data }, { status: 201 });
}

export function noContent() {
  return new Response(null, { status: 204 });
}

export function badRequest(message: string, errors?: unknown) {
  return Response.json({ success: false, message, errors }, { status: 400 });
}

export function unauthorized(message = "Unauthorized") {
  return Response.json({ success: false, message }, { status: 401 });
}

export function forbidden(message = "Forbidden") {
  return Response.json({ success: false, message }, { status: 403 });
}

export function notFound(message = "Not found") {
  return Response.json({ success: false, message }, { status: 404 });
}

export function serverError(err: unknown) {
  const message =
    process.env.NODE_ENV === "development" && err instanceof Error
      ? err.message
      : "Internal server error";
  console.error("[API Error]", err);
  return Response.json({ success: false, message }, { status: 500 });
}

/** Parse pagination params from URL */
export function parsePagination(url: URL) {
  const page  = Math.max(1, Number(url.searchParams.get("page")  ?? 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 20)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}
