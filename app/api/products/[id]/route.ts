/**
 * GET    /api/products/[id]  — Get one (public, id or slug)
 * PUT    /api/products/[id]  — Update (admin)
 * DELETE /api/products/[id]  — Delete (admin)
 */
import { NextRequest } from "next/server";
import { z } from "zod";
import { getProductById, getProductBySlug, updateProduct, deleteProduct } from "@/lib/queries/products";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

async function resolveProduct(id: string) {
  const numId = Number(id);
  if (!isNaN(numId)) return getProductById(numId);
  return getProductBySlug(id); // treat as slug
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const product = await resolveProduct(id);
    if (!product) return notFound("Không tìm thấy sản phẩm");
    return ok(product);
  } catch (err) {
    return serverError(err);
  }
}

const UpdateSchema = z.object({
  slug:        z.string().min(1).max(255).optional(),
  name:        z.string().min(1).max(255).optional(),
  category:    z.string().optional(),
  price:       z.string().optional(),
  description: z.string().optional(),
  thumbnail:   z.string().url().optional(),
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

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) return badRequest("ID không hợp lệ");

    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());

    const updated = await updateProduct(numId, parsed.data);
    if (!updated) return notFound("Không tìm thấy sản phẩm");

    const product = await getProductById(numId);
    return ok(product, "Cập nhật thành công");
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes("Duplicate entry")) {
      return badRequest("Slug đã tồn tại");
    }
    return serverError(err);
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) return badRequest("ID không hợp lệ");

    const deleted = await deleteProduct(numId);
    if (!deleted) return notFound("Không tìm thấy sản phẩm");

    return ok(null, "Xóa sản phẩm thành công");
  } catch (err) {
    return serverError(err);
  }
}
