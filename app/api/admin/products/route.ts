import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAuth } from "@/lib/auth";
import { ok, created, badRequest, serverError } from "@/lib/api-response";
import { getAllProducts, createProduct } from "@/lib/queries/products";
import { revalidateTag } from "next/cache";

// GET /api/admin/products - Lấy danh sách sản phẩm
export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const url = new URL(req.url);
    const category = url.searchParams.get("category") || undefined;
    const search = url.searchParams.get("search") || undefined;
    const limit = parseInt(url.searchParams.get("limit") || "50");
    const offset = parseInt(url.searchParams.get("offset") || "0");

    const result = await getAllProducts({
      category,
      search,
      limit,
      offset,
    });

    return ok(result);
  } catch (err) {
    return serverError(err);
  }
}

// POST /api/admin/products - Tạo sản phẩm mới
const CreateProductSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  category: z.string().optional(),
  price: z.string().optional(),
  description: z.string().optional(),
  thumbnail: z.string().min(1).refine((v)=>v.startsWith("/")||v.startsWith("http"),{message:"Ảnh không hợp lệ"}),
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

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const parsed = CreateProductSchema.safeParse(await req.json());
    if (!parsed.success) {
      return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());
    }

    const productId = await createProduct(parsed.data);

    // Revalidate cache
    revalidateTag("products", {});
    revalidateTag("product-list", {});

    return created({ id: productId }, "Tạo sản phẩm thành công");
  } catch (err) {
    return serverError(err);
  }
}