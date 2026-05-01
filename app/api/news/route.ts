import { NextRequest } from "next/server";
import { z } from "zod";
import { getAllNews, createNews } from "@/lib/queries/news";
import { requireAuth } from "@/lib/auth";
import { ok, created, badRequest, serverError, parsePagination } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const { limit, offset, page } = parsePagination(url);
    const category  = url.searchParams.get("category")  ?? undefined;
    const search    = url.searchParams.get("search")    ?? undefined;
    // Public: only published; admin can pass ?published=all
    const isAdmin   = url.searchParams.get("published") === "all";
    const published = isAdmin ? undefined : true;

    const { rows, total } = await getAllNews({ category, search, published, limit, offset });
    return ok({ items: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) { return serverError(err); }
}

const CreateSchema = z.object({
  slug:         z.string().min(1).max(255),
  title:        z.string().min(1).max(500),
  excerpt:      z.string().optional(),
  content:      z.string().min(1),
  image:        z.string().min(1).refine((v) => v.startsWith("/") || v.startsWith("http"), { message: "Ảnh không hợp lệ" }),
  category:     z.string().optional(),
  published_at: z.string().optional(),
  is_published: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;
    const parsed = CreateSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());
    const id = await createNews(parsed.data);
    return created({ id }, "Tạo bài viết thành công");
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Duplicate entry")) return badRequest("Slug đã tồn tại");
    return serverError(err);
  }
}
