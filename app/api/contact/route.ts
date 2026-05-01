import { NextRequest } from "next/server";
import { z } from "zod";
import { execute, query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, created, badRequest, serverError, parsePagination } from "@/lib/api-response";

const ContactSchema = z.object({
  name:    z.string().min(1).max(255),
  phone:   z.string().min(9).max(20),
  email:   z.string().email().optional(),
  message: z.string().min(1),
});

// Public — submit contact form
export async function POST(req: NextRequest) {
  try {
    const parsed = ContactSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());

    const { name, phone, email, message } = parsed.data;
    const result = await execute(
      "INSERT INTO contact_messages (name, phone, email, message) VALUES (?, ?, ?, ?)",
      [name, phone, email ?? null, message]
    );
    return created({ id: result.insertId }, "Gửi liên hệ thành công");
  } catch (err) { return serverError(err); }
}

// Admin — list messages
export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const url = new URL(req.url);
    const { limit, offset, page } = parsePagination(url);
    const isRead = url.searchParams.has("is_read")
      ? url.searchParams.get("is_read") === "true" ? 1 : 0
      : undefined;

    const where = isRead !== undefined ? "WHERE is_read = ?" : "";
    const params = isRead !== undefined ? [isRead, limit, offset] : [limit, offset];

    const rows = await query(
      `SELECT * FROM contact_messages ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      params
    );
    const [[{ total }]] = await query<{ total: number }>(
      `SELECT COUNT(*) AS total FROM contact_messages ${where}`,
      isRead !== undefined ? [isRead] : []
    ) as unknown as [{ total: number }[]];

    return ok({ items: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) { return serverError(err); }
}
