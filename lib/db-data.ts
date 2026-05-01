/**
 * Server-side data fetching từ MySQL database
 * Dùng trong Next.js Server Components thay thế lib/data.ts
 * Fallback về lib/data.ts nếu DB chưa kết nối
 */
import { Product, Project, Service, NewsArticle } from "./types";
import { unstable_cache } from "next/cache";

// ── Helpers ──────────────────────────────────────────────────

async function dbQuery<T>(sql: string, params?: unknown[]): Promise<T[]> {
  const { default: pool } = await import("./db");
  const [rows] = await pool.execute(sql, params as never);
  return rows as T[];
}

// ── Products ─────────────────────────────────────────────────

export const getProductsFromDB = unstable_cache(
  async (opts?: {
    limit?: number;
    sort?: string;
  }): Promise<Product[]> => {
    const limit = opts?.limit ?? 100;
    const orderBy = opts?.sort === "name-asc" ? "name ASC" : "sort_order ASC, id ASC";

    const rows = await dbQuery<{
      id: number; slug: string; name: string; category: string;
      price: string; description: string | null; thumbnail: string;
      in_stock: number;
    }>(
      `SELECT id, slug, name, category, price, description, thumbnail, in_stock
       FROM products ORDER BY ${orderBy} LIMIT ?`,
      [limit]
    );

    // Fetch images for all products in one query
    const ids = rows.map((r) => r.id);
    let imagesMap: Record<number, string[]> = {};
    if (ids.length > 0) {
      const placeholders = ids.map(() => "?").join(",");
      const imgRows = await dbQuery<{ product_id: number; url: string }>(
        `SELECT product_id, url FROM product_images WHERE product_id IN (${placeholders}) ORDER BY sort_order ASC`,
        ids
      );
      for (const img of imgRows) {
        if (!imagesMap[img.product_id]) imagesMap[img.product_id] = [];
        imagesMap[img.product_id].push(img.url);
      }
    }

    return rows.map((r) => ({
      id: String(r.id),
      slug: r.slug,
      name: r.name,
      category: r.category,
      price: r.price,
      description: r.description ?? "",
      thumbnail: r.thumbnail,
      images: imagesMap[r.id]?.length ? imagesMap[r.id] : [r.thumbnail],
      inStock: r.in_stock === 1,
    }));
  },
  ["products"],
  {
    tags: ["products", "product-list"],
    revalidate: 3600, // 1 hour
  }
);

export const getProductBySlugFromDB = unstable_cache(
  async (slug: string): Promise<Product | null> => {
    const rows = await dbQuery<{
      id: number; slug: string; name: string; category: string;
      price: string; description: string | null; thumbnail: string; in_stock: number;
    }>(
      "SELECT id, slug, name, category, price, description, thumbnail, in_stock FROM products WHERE slug = ? LIMIT 1",
      [slug]
    );
    if (!rows[0]) return null;
    const r = rows[0];

    const imgRows = await dbQuery<{ url: string }>(
      "SELECT url FROM product_images WHERE product_id = ? ORDER BY sort_order ASC",
      [r.id]
    );
    const specRows = await dbQuery<{ spec_key: string; spec_value: string }>(
      "SELECT spec_key, spec_value FROM product_specs WHERE product_id = ? ORDER BY sort_order ASC",
      [r.id]
    );

    const specs: Record<string, string> = {};
    for (const s of specRows) specs[s.spec_key] = s.spec_value;

    return {
      id: String(r.id),
      slug: r.slug,
      name: r.name,
      category: r.category,
      price: r.price,
      description: r.description ?? "",
      thumbnail: r.thumbnail,
      images: imgRows.length ? imgRows.map((i) => i.url) : [r.thumbnail],
      inStock: r.in_stock === 1,
      specs: Object.keys(specs).length ? specs : undefined,
    };
  },
  ["product-by-slug"],
  {
    tags: ["products"],
    revalidate: 3600, // 1 hour
  }
);

// ── Projects ─────────────────────────────────────────────────

export async function getProjectsFromDB(opts?: { limit?: number }): Promise<Project[]> {
  const rows = await dbQuery<{
    id: number; slug: string; title: string; category: string;
    image: string; description: string | null;
  }>(
    "SELECT id, slug, title, category, image, description FROM projects ORDER BY sort_order ASC, id ASC LIMIT ?",
    [opts?.limit ?? 100]
  );

  return rows.map((r) => ({
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    category: r.category as Project["category"],
    image: r.image,
    description: r.description ?? undefined,
  }));
}

export async function getProjectBySlugFromDB(slug: string): Promise<Project | null> {
  const rows = await dbQuery<{
    id: number; slug: string; title: string; category: string;
    image: string; description: string | null;
  }>(
    "SELECT id, slug, title, category, image, description FROM projects WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    category: r.category as Project["category"],
    image: r.image,
    description: r.description ?? undefined,
  };
}

// ── Services ─────────────────────────────────────────────────

export async function getServicesFromDB(): Promise<Service[]> {
  const rows = await dbQuery<{
    id: number; slug: string; title: string;
    description: string; details: string | null; image: string;
  }>(
    "SELECT id, slug, title, description, details, image FROM services ORDER BY sort_order ASC, id ASC"
  );

  return rows.map((r) => ({
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    description: r.description,
    details: r.details ?? undefined,
    image: r.image,
  }));
}

export async function getServiceBySlugFromDB(slug: string): Promise<Service | null> {
  const rows = await dbQuery<{
    id: number; slug: string; title: string;
    description: string; details: string | null; image: string;
  }>(
    "SELECT id, slug, title, description, details, image FROM services WHERE slug = ? LIMIT 1",
    [slug]
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    description: r.description,
    details: r.details ?? undefined,
    image: r.image,
  };
}

// ── News ─────────────────────────────────────────────────────

export async function getNewsFromDB(opts?: { limit?: number }): Promise<NewsArticle[]> {
  const rows = await dbQuery<{
    id: number; slug: string; title: string; excerpt: string | null;
    content: string; image: string; category: string; published_at: string;
  }>(
    "SELECT id, slug, title, excerpt, content, image, category, published_at FROM news WHERE is_published = 1 ORDER BY published_at DESC LIMIT ?",
    [opts?.limit ?? 50]
  );

  return rows.map((r) => ({
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content,
    image: r.image,
    category: r.category,
    publishedAt: r.published_at,
  }));
}

export async function getNewsBySlugFromDB(slug: string): Promise<NewsArticle | null> {
  const rows = await dbQuery<{
    id: number; slug: string; title: string; excerpt: string | null;
    content: string; image: string; category: string; published_at: string;
  }>(
    "SELECT id, slug, title, excerpt, content, image, category, published_at FROM news WHERE slug = ? AND is_published = 1 LIMIT 1",
    [slug]
  );
  if (!rows[0]) return null;
  const r = rows[0];
  return {
    id: String(r.id),
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    content: r.content,
    image: r.image,
    category: r.category,
    publishedAt: r.published_at,
  };
}

// ── Sliders ──────────────────────────────────────────────────

export async function getSlidersFromDB() {
  const { default: pool } = await import("./db");
  // Dùng query trực tiếp, không cache
  const [rows] = await pool.execute(
    "SELECT id, image, alt_text, link_url FROM sliders WHERE is_active = 1 ORDER BY sort_order ASC"
  );
  return rows as { id: number; image: string; alt_text: string; link_url: string | null }[];
}
