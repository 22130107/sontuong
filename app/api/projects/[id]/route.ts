import { NextRequest } from "next/server";
import { z } from "zod";
import { getProjectById, getProjectBySlug, updateProject, deleteProject } from "@/lib/queries/projects";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, notFound, serverError } from "@/lib/api-response";

type Params = { params: Promise<{ id: string }> };
const CATEGORIES = ["chung-cu","biet-thu","nha-pho","phong-bep","phong-ngu","phong-tre-em"] as const;

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const row = isNaN(Number(id)) ? await getProjectBySlug(id) : await getProjectById(Number(id));
    if (!row) return notFound("Không tìm thấy công trình");
    return ok(row);
  } catch (err) { return serverError(err); }
}

const UpdateSchema = z.object({
  slug:        z.string().min(1).max(255).optional(),
  title:       z.string().min(1).max(255).optional(),
  category:    z.enum(CATEGORIES).optional(),
  image:       z.string().min(1).refine((v) => v.startsWith("/") || v.startsWith("http"), { message: "Ảnh không hợp lệ" }).optional(),
  description: z.string().optional(),
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

    const updated = await updateProject(numId, parsed.data);
    if (!updated) return notFound("Không tìm thấy công trình");
    return ok(await getProjectById(numId), "Cập nhật thành công");
  } catch (err) { return serverError(err); }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;
    const { id } = await params;
    const numId = Number(id);
    if (isNaN(numId)) return badRequest("ID không hợp lệ");

    // Lấy ảnh trước khi xóa
    const existing = await getProjectById(numId);
    const deleted = await deleteProject(numId);
    if (!deleted) return notFound("Không tìm thấy công trình");

    // Xóa file upload nếu là local
    if (existing?.image) {
      const { deleteUploadedFile } = await import("@/lib/delete-upload");
      await deleteUploadedFile(existing.image);
    }

    return ok(null, "Xóa công trình thành công");
  } catch (err) { return serverError(err); }
}
