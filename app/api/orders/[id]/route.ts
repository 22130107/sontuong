import { NextRequest } from "next/server";
import { z } from "zod";
import { getOrderById, updateOrderStatus, deleteOrder } from "@/lib/queries/orders";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;
    const { id } = await params;
    const order = await getOrderById(Number(id));
    if (!order) return notFound("Không tìm thấy đơn hàng");
    return ok(order);
  } catch (err) { return serverError(err); }
}

const UpdateSchema = z.object({
  status: z.enum(["pending","confirmed","processing","completed","cancelled"]),
});

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) return badRequest("ID không hợp lệ");

    const parsed = UpdateSchema.safeParse(await req.json());
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());

    const updated = await updateOrderStatus(numId, parsed.data.status);
    if (!updated) return notFound("Không tìm thấy đơn hàng");
    return ok(await getOrderById(numId), "Cập nhật trạng thái thành công");
  } catch (err) { return serverError(err); }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) return badRequest("ID không hợp lệ");
    const deleted = await deleteOrder(numId);
    if (!deleted) return notFound("Không tìm thấy đơn hàng");
    return ok(null, "Xóa đơn hàng thành công");
  } catch (err) { return serverError(err); }
}
