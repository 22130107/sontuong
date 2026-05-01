import { NextRequest } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/api-response";

// POST /api/admin/revalidate - Revalidate cache
export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const { type, target } = body;

    if (!type || !target) {
      return badRequest("Thiếu thông tin type và target");
    }

    switch (type) {
      case "tag":
        revalidateTag(target, {});
        break;
      case "path":
        revalidatePath(target);
        break;
      default:
        return badRequest("Type không hợp lệ. Chỉ chấp nhận 'tag' hoặc 'path'");
    }

    return ok(null, `Đã revalidate ${type}: ${target}`);
  } catch (err) {
    return serverError(err);
  }
}