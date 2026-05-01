import { NextRequest } from "next/server";
import { z } from "zod";
import { getAllOrders, createOrder, getOrderStats, type OrderStatus } from "@/lib/queries/orders";
import { requireAuth } from "@/lib/auth";
import { ok, created, badRequest, serverError, parsePagination } from "@/lib/api-response";
import { sendNewOrderEmail } from "@/lib/mailer";

export async function GET(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const url = new URL(req.url);

    // ?stats=true → return stats only
    if (url.searchParams.get("stats") === "true") {
      const stats = await getOrderStats();
      return ok(stats);
    }

    const { limit, offset, page } = parsePagination(url);
    const status = url.searchParams.get("status") as OrderStatus | undefined ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;

    const { rows, total } = await getAllOrders({ status, search, limit, offset });
    return ok({ items: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } });
  } catch (err) { return serverError(err); }
}

const OrderItemSchema = z.object({
  product_id:   z.number().int().positive().optional(),
  product_name: z.string().min(1),
  product_slug: z.string().optional(),
  quantity:     z.number().int().min(1).default(1),
  price_note:   z.string().optional(),
});

const CreateSchema = z.object({
  gender:        z.enum(["anh", "chi"]).optional(),
  customer_name: z.string().min(1).max(255),
  phone:         z.string().min(9).max(20),
  email:         z.string().email().optional(),
  address:       z.string().optional(),
  note:          z.string().optional(),
  source:        z.enum(["website","phone","zalo","facebook"]).optional(),
  items:         z.array(OrderItemSchema).min(1),
});

// Public endpoint — customers can place orders
export async function POST(req: NextRequest) {
  try {
    const parsed = CreateSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());

    const result = await createOrder(parsed.data);

    // Gửi email thông báo cho admin (không block response nếu lỗi)
    sendNewOrderEmail({
      order_code: result.order_code,
      gender: parsed.data.gender ?? "anh",
      customer_name: parsed.data.customer_name,
      phone: parsed.data.phone,
      email: parsed.data.email,
      address: parsed.data.address,
      note: parsed.data.note,
      source: parsed.data.source,
      items: parsed.data.items,
    }).catch((err) => console.error("[Mailer] Gửi email thất bại:", err));

    return created(result, "Đặt hàng thành công");
  } catch (err) { return serverError(err); }
}
