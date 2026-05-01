import { NextRequest } from "next/server";
import { z } from "zod";
import { getNewsById, getNewsBySlug, updateNews, deleteNews } from "@/lib/queries/news";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const row = isNaN(Number(id)) ? await getNewsBySlug(id) : await getNewsById(Number(id));
    if (!row) return notFound("Không tìm thấy bài viết");
    return ok(row);
  } catch (err) { return serverError(err); }
}

const UpdateSchema = z.object({
  slug:         z.string().min(1).max(255).optional(),
  title:        z.string().min(1).max(500).optional(),
  excerpt:      z.string().optional(),
  content:      z.string().min(1).optional(),
  image:        z.string().min(1).refine((v) => v.startsWith("/") || v.startsWith("http"), { message: "Ảnh không hợp lệ" }).optional(),
  category:     z.string().optional(),
  published_at: z.string().optional(),
  is_published: z.boolean().optional(),
});

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) return badRequest("ID không hợp lệ");
    const parsed = UpdateSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());
    const updated = await updateNews(numId, parsed.data);
    if (!updated) return notFound("Không tìm thấy bài viết");
    return ok(await getNewsById(numId), "Cập nhật thành công");
  } catch (err) { return serverError(err); }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) return badRequest("ID không hợp lệ");
    const deleted = await deleteNews(numId);
    if (!deleted) return notFound("Không tìm thấy bài viết");
    return ok(null, "Xóa bài viết thành công");
  } catch (err) { return serverError(err); }
}
