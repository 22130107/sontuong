/**
 * GET  /api/products  — List products (public)
 * POST /api/products  — Create product (admin)
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { getAllProducts, createProduct } from "@/lib/queries/products";
import { requireAuth } from "@/lib/auth";
import { ok, created, badRequest, serverError, parsePagination } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const { limit, offset, page } = parsePagination(url);
    const category = url.searchParams.get("category") ?? undefined;
    const search   = url.searchParams.get("search")   ?? undefined;
    const inStock  = url.searchParams.has("in_stock")
      ? url.searchParams.get("in_stock") === "true"
      : undefined;

    const { rows, total } = await getAllProducts({ category, search, inStock, limit, offset });

    return ok({
      items: rows,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    return serverError(err);
  }
}

const CreateSchema = z.object({
  slug:        z.string().min(1).max(255),
  name:        z.string().min(1).max(255),
  category:    z.string().optional(),
  price:       z.string().optional(),
  description: z.string().optional(),
  thumbnail:   z.string().url(),
  in_stock:    z.boolean().optional(),
  sort_order:  z.number().int().optional(),
  images: z.array(z.object({
    url:        z.string().url(),
    alt_text:   z.string().optional(),
    sort_order: z.number().int().optional(),
  })).optional(),
  specs: z.array(z.object({
    spec_key:   z.string().min(1),
    spec_value: z.string().min(1),
    sort_order: z.number().int().optional(),
  })).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const parsed = CreateSchema.safeParse(body);
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());

    const id = await createProduct(parsed.data);
    return created({ id }, "Tạo sản phẩm thành công");
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Duplicate entry")) {
      return badRequest("Slug đã tồn tại, vui lòng chọn slug khác");
    }
    return serverError(err);
  }
}
