/**
 * GET /api/health — Kiểm tra kết nối database
 */
import pool from "@/lib/db";
import { ok, serverError } from "@/lib/api-response";

export async function GET() {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute("SELECT VERSION() AS version, NOW() AS server_time, DATABASE() AS db_name");
    conn.release();

    const info = (rows as { version: string; server_time: string; db_name: string }[])[0];

    return ok({
      status: "connected",
      mysql_version: info.version,
      server_time: info.server_time,
      database: info.db_name,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    }, "Kết nối database thành công ✅");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return serverError(`Kết nối thất bại: ${message}`);
  }
}
