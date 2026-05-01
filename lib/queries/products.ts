import { query, execute, transaction } from "@/lib/db";
import type { PoolConnection } from "mysql2/promise";

export interface ProductRow {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: string;
  description: string | null;
  thumbnail: string;
  in_stock: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProductDetail extends ProductRow {
  images: { id: number; url: string; alt_text: string | null; sort_order: number }[];
  specs:  { id: number; spec_key: string; spec_value: string; sort_order: number }[];
}

// ── READ ─────────────────────────────────────────────────────

export async function getAllProducts(opts?: {
  category?: string;
  inStock?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (opts?.category) {
    conditions.push("p.category = ?");
    params.push(opts.category);
  }
  if (opts?.inStock !== undefined) {
    conditions.push("p.in_stock = ?");
    params.push(opts.inStock ? 1 : 0);
  }
  if (opts?.search) {
    conditions.push("(p.name LIKE ? OR p.description LIKE ?)");
    params.push(`%${opts.search}%`, `%${opts.search}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit  = opts?.limit  ?? 20;
  const offset = opts?.offset ?? 0;

  const rows = await query<ProductRow>(
    `SELECT * FROM products p ${where} ORDER BY p.sort_order ASC, p.id ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  const countRows = await query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM products p ${where}`,
    params
  );
  const total = countRows[0]?.total ?? 0;

  return { rows, total };
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  const [product] = await query<ProductRow>(
    "SELECT * FROM products WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (!product) return null;
  return enrichProduct(product);
}

export async function getProductById(id: number): Promise<ProductDetail | null> {
  const [product] = await query<ProductRow>(
    "SELECT * FROM products WHERE id = ? LIMIT 1",
    [id]
  );
  if (!product) return null;
  return enrichProduct(product);
}

async function enrichProduct(product: ProductRow): Promise<ProductDetail> {
  const images = await query(
    "SELECT id, url, alt_text, sort_order FROM product_images WHERE product_id = ? ORDER BY sort_order ASC",
    [product.id]
  );
  const specs = await query(
    "SELECT id, spec_key, spec_value, sort_order FROM product_specs WHERE product_id = ? ORDER BY sort_order ASC",
    [product.id]
  );
  return { ...product, images, specs } as ProductDetail;
}

// ── WRITE ────────────────────────────────────────────────────

export interface CreateProductInput {
  slug: string;
  name: string;
  category?: string;
  price?: string;
  description?: string;
  thumbnail: string;
  in_stock?: boolean;
  sort_order?: number;
  images?: { url: string; alt_text?: string; sort_order?: number }[];
  specs?:  { spec_key: string; spec_value: string; sort_order?: number }[];
}

export async function createProduct(input: CreateProductInput): Promise<number> {
  return transaction(async (conn: PoolConnection) => {
    const [result] = await conn.execute<import("mysql2").ResultSetHeader>(
      `INSERT INTO products (slug, name, category, price, description, thumbnail, in_stock, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        input.slug,
        input.name,
        input.category ?? "Sơn nước",
        input.price ?? "Liên hệ",
        input.description ?? null,
        input.thumbnail,
        input.in_stock !== false ? 1 : 0,
        input.sort_order ?? 0,
      ]
    );
    const productId = result.insertId;

    if (input.images?.length) {
      for (const img of input.images) {
        await conn.execute(
          "INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES (?, ?, ?, ?)",
          [productId, img.url, img.alt_text ?? null, img.sort_order ?? 0]
        );
      }
    }

    if (input.specs?.length) {
      for (const spec of input.specs) {
        await conn.execute(
          "INSERT INTO product_specs (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?)",
          [productId, spec.spec_key, spec.spec_value, spec.sort_order ?? 0]
        );
      }
    }

    return productId;
  });
}

export async function updateProduct(
  id: number,
  input: Partial<CreateProductInput>
): Promise<boolean> {
  return transaction(async (conn: PoolConnection) => {
    const fields: string[] = [];
    const params: unknown[] = [];

    if (input.slug        !== undefined) { fields.push("slug = ?");        params.push(input.slug); }
    if (input.name        !== undefined) { fields.push("name = ?");        params.push(input.name); }
    if (input.category    !== undefined) { fields.push("category = ?");    params.push(input.category); }
    if (input.price       !== undefined) { fields.push("price = ?");       params.push(input.price); }
    if (input.description !== undefined) { fields.push("description = ?"); params.push(input.description); }
    if (input.thumbnail   !== undefined) { fields.push("thumbnail = ?");   params.push(input.thumbnail); }
    if (input.in_stock    !== undefined) { fields.push("in_stock = ?");    params.push(input.in_stock ? 1 : 0); }
    if (input.sort_order  !== undefined) { fields.push("sort_order = ?");  params.push(input.sort_order); }

    if (fields.length) {
      params.push(id);
      await conn.execute(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`, params as string[]);
    }

    // Replace images if provided
    if (input.images !== undefined) {
      await conn.execute("DELETE FROM product_images WHERE product_id = ?", [id]);
      for (const img of input.images) {
        await conn.execute(
          "INSERT INTO product_images (product_id, url, alt_text, sort_order) VALUES (?, ?, ?, ?)",
          [id, img.url, img.alt_text ?? null, img.sort_order ?? 0] as string[]
        );
      }
    }

    // Replace specs if provided
    if (input.specs !== undefined) {
      await conn.execute("DELETE FROM product_specs WHERE product_id = ?", [id]);
      for (const spec of input.specs) {
        await conn.execute(
          "INSERT INTO product_specs (product_id, spec_key, spec_value, sort_order) VALUES (?, ?, ?, ?)",
          [id, spec.spec_key, spec.spec_value, spec.sort_order ?? 0] as string[]
        );
      }
    }

    return true;
  });
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM products WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
