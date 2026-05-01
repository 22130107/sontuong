/**
 * POST /api/auth  — Login
 * DELETE /api/auth — Logout (client-side, just returns 200)
 */
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { query } from "@/lib/db";
import { signToken } from "@/lib/auth";
import { ok, badRequest, unauthorized, serverError } from "@/lib/api-response";

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ", parsed.error.flatten());

    const { username, password } = parsed.data;

    const [user] = await query<{
      id: number; username: string; password_hash: string;
      full_name: string | null; role: "superadmin" | "admin" | "editor"; is_active: number;
    }>(
      "SELECT id, username, password_hash, full_name, role, is_active FROM admin_users WHERE username = ? LIMIT 1",
      [username]
    );

    if (!user || !user.is_active) return unauthorized("Tài khoản không tồn tại hoặc đã bị khóa");

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return unauthorized("Mật khẩu không đúng");

    // Update last_login
    await query("UPDATE admin_users SET last_login = NOW() WHERE id = ?", [user.id]);

    const token = signToken({ id: user.id, username: user.username, role: user.role });

    return ok({
      token,
      user: { id: user.id, username: user.username, full_name: user.full_name, role: user.role },
    }, "Đăng nhập thành công");
  } catch (err) {
    return serverError(err);
  }
}

export async function DELETE() {
  return ok(null, "Đăng xuất thành công");
}
