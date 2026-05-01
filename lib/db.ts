/**
 * MySQL connection pool using mysql2/promise
 * Singleton pattern — reuse pool across requests in Next.js
 */
import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _mysqlPool: mysql.Pool | undefined;
}

function createPool(): mysql.Pool {
  return mysql.createPool({
    host:               process.env.DB_HOST     ?? "localhost",
    port:               Number(process.env.DB_PORT ?? 3306),
    database:           process.env.DB_NAME     ?? "nasun_paint",
    user:               process.env.DB_USER     ?? "root",
    password:           process.env.DB_PASSWORD ?? "",
    waitForConnections: true,
    connectionLimit:    10,
    queueLimit:         0,
    charset:            "utf8mb4",
    timezone:           "+07:00",   // Vietnam timezone
  });
}

// In development, reuse pool across hot-reloads
const pool: mysql.Pool =
  process.env.NODE_ENV === "production"
    ? createPool()
    : (global._mysqlPool ??= createPool());

export default pool;

// ── Helpers ──────────────────────────────────────────────────

/** Run a SELECT query, returns typed rows */
export async function query<T = mysql.RowDataPacket>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rows] = await pool.execute<mysql.RowDataPacket[]>(sql, params as any[]);
  return rows as T[];
}

/** Run INSERT/UPDATE/DELETE, returns ResultSetHeader */
export async function execute(
  sql: string,
  params?: unknown[]
): Promise<mysql.ResultSetHeader> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result] = await pool.execute<mysql.ResultSetHeader>(sql, params as any[]);
  return result;
}

/** Run multiple statements in a transaction */
export async function transaction<T>(
  fn: (conn: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    const result = await fn(conn);
    await conn.commit();
    return result;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}
