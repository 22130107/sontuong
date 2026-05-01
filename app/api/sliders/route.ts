import { NextRequest } from "next/server";
import { z } from "zod";
import { query, execute } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, created, badRequest, serverError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    // Admin có thể xem tất cả (kể cả ẩn), public chỉ xem active
    const url = new URL(req.url);
    const all = url.searchParams.get("all") === "1";

    const rows = all
      ? await query("SELECT * FROM sliders ORDER BY sort_order ASC, id ASC")
      : await query("SELECT * FROM sliders WHERE is_active = 1 ORDER BY sort_order ASC");

    return ok(rows);
  } catch (err) { return serverError(err); }
}

// Chấp nhận cả URL đầy đủ (https://...) và path local (/uploads/...)
const imageUrl = z.string().min(1).refine(
  (v) => v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"),
  { message: "Ảnh phải là URL hoặc đường dẫn /uploads/..." }
);

const CreateSchema = z.object({
  image:      imageUrl,
  alt_text:   z.string().min(1),
  link_url:   z.string().url().nullable().optional().or(z.literal("").transform(() => null)),
  is_active:  z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const parsed = CreateSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());

    const { image, alt_text, link_url, is_active, sort_order } = parsed.data;
    const result = await execute(
      "INSERT INTO sliders (image, alt_text, link_url, is_active, sort_order) VALUES (?, ?, ?, ?, ?)",
      [image, alt_text, link_url ?? null, is_active !== false ? 1 : 0, sort_order ?? 0]
    );
    return created({ id: result.insertId }, "Tạo slider thành công");
  } catch (err) { return serverError(err); }
}
