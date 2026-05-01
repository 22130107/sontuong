import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";
import { getProductById, updateProduct, deleteProduct } from "@/lib/queries/products";
import { deleteUploadedFile } from "@/lib/delete-upload";
import { revalidateTag } from "next/cache";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/admin/products/[id] - Lấy chi tiết sản phẩm
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) return badRequest("ID sản phẩm không hợp lệ");

    const product = await getProductById(productId);
    if (!product) return notFound("Không tìm thấy sản phẩm");

    return ok(product);
  } catch (err) {
    return serverError(err);
  }
}

// PUT /api/admin/products/[id] - Cập nhật sản phẩm
const UpdateProductSchema = z.object({
  slug: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  category: z.string().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().min(1).refine((v)=>v.startsWith("/")||v.startsWith("http"),{message:"Ảnh không hợp lệ"}).optional(),
  in_stock: z.boolean().optional(),
  sort_order: z.number().int().optional(),
  images: z.array(z.object({
    url: z.string().min(1).refine((v)=>v.startsWith("/")||v.startsWith("http"),{message:"Ảnh không hợp lệ"}),
    alt_text: z.string().optional(),
    sort_order: z.number().int().optional(),
  })).optional(),
  specs: z.array(z.object({
    spec_key: z.string().min(1),
    spec_value: z.string().min(1),
    sort_order: z.number().int().optional(),
  })).optional(),
});

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) return badRequest("ID sản phẩm không hợp lệ");

    const parsed = UpdateProductSchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());
    }

    const success = await updateProduct(productId, parsed.data);
    if (!success) return notFound("Không tìm thấy sản phẩm");

    // Revalidate cache
    revalidateTag("products", {});
    revalidateTag("product-list", {});
    revalidateTag(`product-${productId}`, {});

    return ok(null, "Cập nhật sản phẩm thành công");
  } catch (err) {
    return serverError(err);
  }
}

// DELETE /api/admin/products/[id] - Xóa sản phẩm
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const { id } = await params;
    const productId = parseInt(id);
    if (isNaN(productId)) return badRequest("ID sản phẩm không hợp lệ");

    // Lấy ảnh trước khi xóa
    const product = await getProductById(productId);
    if (!product) return notFound("Không tìm thấy sản phẩm");

    const success = await deleteProduct(productId);
    if (!success) return notFound("Không tìm thấy sản phẩm");

    // Xóa file ảnh local sau khi xóa DB thành công
    await deleteUploadedFile(product.thumbnail);
    for (const img of product.images) {
      await deleteUploadedFile(img.url);
    }

    // Revalidate cache
    revalidateTag("products", {});
    revalidateTag("product-list", {});

    return ok(null, "Xóa sản phẩm thành công");
  } catch (err) {
    return serverError(err);
  }
}