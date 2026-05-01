/**
 * Xóa file upload local nếu URL là /uploads/...
 * Bỏ qua nếu là URL ngoài (https://...)
 */
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function deleteUploadedFile(fileUrl: string | null | undefined): Promise<void> {
  if (!fileUrl || !fileUrl.startsWith("/uploads/")) return;

  const fileName = path.basename(fileUrl);
  if (!fileName || fileName.includes("..")) return;

  const filePath = path.join(process.cwd(), "public", "uploads", fileName);
  if (existsSync(filePath)) {
    await unlink(filePath).catch(() => {}); // Bỏ qua lỗi nếu file không tồn tại
  }
}
