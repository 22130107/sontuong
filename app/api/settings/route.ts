import { NextRequest } from "next/server";
import { z } from "zod";
import { query, execute } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { ok, badRequest, serverError } from "@/lib/api-response";

// Public — get all settings (no sensitive data)
export async function GET() {
  try {
    const rows = await query<{ setting_key: string; setting_value: string | null }>(
      "SELECT setting_key, setting_value FROM settings ORDER BY setting_key ASC"
    );
    // Convert to key-value object
    const settings = Object.fromEntries(rows.map((r) => [r.setting_key, r.setting_value]));
    return ok(settings);
  } catch (err) { return serverError(err); }
}

const UpdateSchema = z.record(z.string(), z.string().nullable());

// Admin — update settings (bulk)
export async function PUT(req: NextRequest) {
  try {
    const auth = requireAuth(req);
    if (auth instanceof Response) return auth;

    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) return badRequest("Dữ liệu không hợp lệ");

    for (const [key, value] of Object.entries(parsed.data)) {
      await execute(
        "INSERT INTO settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?",
        [key, value, value]
      );
    }

    return ok(null, "Cập nhật cài đặt thành công");
  } catch (err) { return serverError(err); }
}
