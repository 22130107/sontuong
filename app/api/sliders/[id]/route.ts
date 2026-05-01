import { NextRequest } from "next/server";
import { z } from "zod";
import { query, execute } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";

const imageUrl = z.string().min(1).refine(
  (v) => v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"),
  { message: "Ảnh phải là URL hoặc đường dẫn /uploads/..." }
);

const UpdateSchema = z.object({
  image:      imageUrl.optional(),
  alt_text:   z.string().min(1).optional(),
  link_url:   z.string().url().nullable().optional().or(z.literal("").transform(() => null)),
  is_active:  z.boolean().optional(),
  sort_order: z.number().int().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const parsed = UpdateSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());

    const fields: string[] = [];
    const values: unknown[] = [];

    const d = parsed.data;
    if (d.image      !== undefined) { fields.push("image = ?");      values.push(d.image); }
    if (d.alt_text   !== undefined) { fields.push("alt_text = ?");   values.push(d.alt_text); }
    if (d.link_url   !== undefined) { fields.push("link_url = ?");   values.push(d.link_url); }
    if (d.is_active  !== undefined) { fields.push("is_active = ?");  values.push(d.is_active ? 1 : 0); }
    if (d.sort_order !== undefined) { fields.push("sort_order = ?"); values.push(d.sort_order); }

    if (fields.length === 0) return badRequest("Không có dữ liệu cập nhật");

    values.push(id);
    await execute(`UPDATE sliders SET ${fields.join(", ")} WHERE id = ?`, values);
    return ok(null, "Cập nhật slider thành công");
  } catch (err) { return serverError(err); }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = requireAuth(_req);
    if (auth instanceof Response) return auth;

    const { id } = await params;

    // Lấy URL ảnh trước khi xóa
    const rows = await query<{ image: string }>("SELECT image FROM sliders WHERE id = ?", [id]);
    await execute("DELETE FROM sliders WHERE id = ?", [id]);

    // Xóa file upload nếu là local
    if (rows[0]?.image) {
      const { deleteUploadedFile } = await import("@/lib/delete-upload");
      await deleteUploadedFile(rows[0].image);
    }

    return ok(null, "Xóa slider thành công");
  } catch (err) { return serverError(err); }
}
