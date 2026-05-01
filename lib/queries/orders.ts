import { query, execute, transaction } from "@/lib/db";
import type { PoolConnection } from "mysql2/promise";

export type OrderStatus = "pending" | "confirmed" | "processing" | "completed" | "cancelled";

export interface OrderRow {
  id: number;
  order_code: string;
  gender: "anh" | "chi";
  customer_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  note: string | null;
  total_items: number;
  status: OrderStatus;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItemRow {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  product_slug: string | null;
  quantity: number;
  price_note: string;
}

export interface OrderDetail extends OrderRow {
  items: OrderItemRow[];
}

// Generate order code: ORD-YYYYMMDD-XXX
async function generateOrderCode(): Promise<string> {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const countRowsOrder = await query<{ count: number }>(
    "SELECT COUNT(*) AS count FROM orders WHERE DATE(created_at) = CURDATE()"
  );
  const count = countRowsOrder[0]?.count ?? 0;
  const seq = String(count + 1).padStart(3, "0");
  return `ORD-${date}-${seq}`;
}

export async function getAllOrders(opts?: {
  status?: OrderStatus;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (opts?.status) { conditions.push("status = ?"); params.push(opts.status); }
  if (opts?.search) {
    conditions.push("(customer_name LIKE ? OR phone LIKE ? OR order_code LIKE ?)");
    params.push(`%${opts.search}%`, `%${opts.search}%`, `%${opts.search}%`);
  }

  const where  = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit  = opts?.limit  ?? 20;
  const offset = opts?.offset ?? 0;

  const rows = await query<OrderRow>(
    `SELECT * FROM orders ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const countRows2 = await query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM orders ${where}`, params
  );
  const total = countRows2[0]?.total ?? 0;

  return { rows, total };
}

export async function getOrderById(id: number): Promise<OrderDetail | null> {
  const [order] = await query<OrderRow>("SELECT * FROM orders WHERE id = ? LIMIT 1", [id]);
  if (!order) return null;
  const items = await query<OrderItemRow>("SELECT * FROM order_items WHERE order_id = ?", [id]);
  return { ...order, items };
}

export async function getOrderByCode(code: string): Promise<OrderDetail | null> {
  const [order] = await query<OrderRow>("SELECT * FROM orders WHERE order_code = ? LIMIT 1", [code]);
  if (!order) return null;
  const items = await query<OrderItemRow>("SELECT * FROM order_items WHERE order_id = ?", [order.id]);
  return { ...order, items };
}

export interface CreateOrderInput {
  gender?: "anh" | "chi";
  customer_name: string;
  phone: string;
  email?: string;
  address?: string;
  note?: string;
  source?: string;
  items: {
    product_id?: number;
    product_name: string;
    product_slug?: string;
    quantity: number;
    price_note?: string;
  }[];
}

export async function createOrder(input: CreateOrderInput): Promise<{ id: number; order_code: string }> {
  return transaction(async (conn: PoolConnection) => {
    const order_code = await generateOrderCode();

    const [result] = await conn.execute<import("mysql2").ResultSetHeader>(
      `INSERT INTO orders (order_code, gender, customer_name, phone, email, address, note, total_items, source)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_code,
        input.gender ?? "anh",
        input.customer_name,
        input.phone,
        input.email ?? null,
        input.address ?? null,
        input.note ?? null,
        input.items.reduce((s, i) => s + i.quantity, 0),
        input.source ?? "website",
      ]
    );
    const orderId = result.insertId;

    for (const item of input.items) {
      await conn.execute(
        `INSERT INTO order_items (order_id, product_id, product_name, product_slug, quantity, price_note)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id ?? null, item.product_name, item.product_slug ?? null, item.quantity, item.price_note ?? "Liên hệ"]
      );
    }

    return { id: orderId, order_code };
  });
}

export async function updateOrderStatus(id: number, status: OrderStatus): Promise<boolean> {
  const result = await execute("UPDATE orders SET status = ? WHERE id = ?", [status, id]);
  return result.affectedRows > 0;
}

export async function deleteOrder(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM orders WHERE id = ?", [id]);
  return result.affectedRows > 0;
}

// Dashboard stats
export async function getOrderStats() {
  const [stats] = await query<{
    total: number; pending: number; confirmed: number;
    processing: number; completed: number; cancelled: number;
  }>(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'pending')    AS pending,
       SUM(status = 'confirmed')  AS confirmed,
       SUM(status = 'processing') AS processing,
       SUM(status = 'completed')  AS completed,
       SUM(status = 'cancelled')  AS cancelled
     FROM orders`
  );
  return stats;
}
