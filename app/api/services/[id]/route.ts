import { NextRequest } from "next/server";
import { z } from "zod";
import { getServiceById, getServiceBySlug, updateService, deleteService } from "@/lib/queries/services";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const row = isNaN(Number(id)) ? await getServiceBySlug(id) : await getServiceById(Number(id));
    if (!row) return notFound("Không tìm thấy dịch vụ");
    return ok(row);
  } catch (err) { return serverError(err); }
}

const UpdateSchema = z.object({
  slug:        z.string().min(1).max(255).optional(),
  title:       z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  details:     z.string().optional(),
  image:       z.string().min(1).refine((v) => v.startsWith("/") || v.startsWith("http"), { message: "Ảnh không hợp lệ" }).optional(),
  sort_order:  z.number().int().optional(),
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
    const updated = await updateService(numId, parsed.data);
    if (!updated) return notFound("Không tìm thấy dịch vụ");
    return ok(await getServiceById(numId), "Cập nhật thành công");
  } catch (err) { return serverError(err); }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) return badRequest("ID không hợp lệ");

    const existing = await getServiceById(numId);
    const deleted = await deleteService(numId);
    if (!deleted) return notFound("Không tìm thấy dịch vụ");

    if (existing?.image) {
      const { deleteUploadedFile } = await import("@/lib/delete-upload");
      await deleteUploadedFile(existing.image);
    }

    return ok(null, "Xóa dịch vụ thành công");
  } catch (err) { return serverError(err); }
}
