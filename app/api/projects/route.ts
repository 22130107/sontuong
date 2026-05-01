import { NextRequest } from "next/server";
import { z } from "zod";
import { getAllProjects, createProject } from "@/lib/queries/projects";
import { requireAuth } from "@/lib/auth";
import { ok, created, badRequest, serverError, parsePagination } from "@/lib/api-response";

const CATEGORIES = ["chung-cu","biet-thu","nha-pho","phong-bep","phong-ngu","phong-tre-em"] as const;

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const { limit, offset, page } = parsePagination(url);
    const category = url.searchParams.get("category") ?? undefined;
    const search   = url.searchParams.get("search")   ?? undefined;

    const { rows, total } = await getAllProjects({ category, search, limit, offset });
    return ok({ items: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) { return serverError(err); }
}

const CreateSchema = z.object({
  slug:        z.string().min(1).max(255),
  title:       z.string().min(1).max(255),
  category:    z.enum(CATEGORIES),
  image:       z.string().min(1).refine((v) => v.startsWith("/") || v.startsWith("http"), { message: "Ảnh không hợp lệ" }),
  description: z.string().optional(),
  sort_order:  z.number().int().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());

    const id = await createProject(parsed.data);
    return created({ id }, "Tạo công trình thành công");
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Duplicate entry")) return badRequest("Slug đã tồn tại");
    return serverError(err);
  }
}
