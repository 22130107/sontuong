/**
 * POST /api/upload — Upload ảnh lên server
 * DELETE /api/upload — Xóa file ảnh
 * Lưu vào public/uploads/
 */
import { NextRequest } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/api-response";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) return badRequest("Không có file được gửi lên");
    if (!ALLOWED_TYPES.includes(file.type)) {
      return badRequest("Chỉ chấp nhận ảnh JPG, PNG, WebP, GIF");
    }
    if (file.size > MAX_SIZE) {
      return badRequest("Ảnh không được vượt quá 5MB");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const ext = path.extname(file.name).toLowerCase() || ".jpg";
    const baseName = path.basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50);
    const fileName = `${Date.now()}-${baseName}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, fileName), buffer);

    const url = `/uploads/${fileName}`;
    return ok({ url, fileName }, "Upload thành công");
  } catch (err) {
    return serverError(err);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const { url: fileUrl } = await req.json();
    if (!fileUrl || typeof fileUrl !== "string") return badRequest("Thiếu url");

    if (!fileUrl.startsWith("/uploads/")) return badRequest("Chỉ được xóa file trong /uploads/");

    const fileName = path.basename(fileUrl);
    if (fileName.includes("..") || fileName.includes("/")) return badRequest("Tên file không hợp lệ");

    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
    return ok(null, "Đã xóa file");
  } catch (err) {
    return serverError(err);
  }
}
