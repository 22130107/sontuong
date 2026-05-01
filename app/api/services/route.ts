import { NextRequest } from "next/server";
import { z } from "zod";
import { getAllServices, createService } from "@/lib/queries/services";
import { requireAuth } from "@/lib/auth";
import { ok, created, badRequest, serverError, parsePagination } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const { limit, offset, page } = parsePagination(url);
    const search = url.searchParams.get("search") ?? undefined;
    const { rows, total } = await getAllServices({ search, limit, offset });
    return ok({ items: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) { return serverError(err); }
}

const CreateSchema = z.object({
  slug:        z.string().min(1).max(255),
  title:       z.string().min(1).max(255),
  description: z.string().min(1),
  details:     z.string().optional(),
  image:       z.string().min(1).refine((v) => v.startsWith("/") || v.startsWith("http"), { message: "Ảnh không hợp lệ" }),
  sort_order:  z.number().int().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;
    const parsed = CreateSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());
    const id = await createService(parsed.data);
    return created({ id }, "Tạo dịch vụ thành công");
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Duplicate entry")) return badRequest("Slug đã tồn tại");
    return serverError(err);
  }
}
