import { query, execute } from "@/lib/db";

export interface NewsRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  image: string;
  category: string;
  published_at: string;
  is_published: number;
  views: number;
  created_at: string;
  updated_at: string;
}

export async function getAllNews(opts?: {
  category?: string;
  search?: string;
  published?: boolean;
  limit?: number;
  offset?: number;
}) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (opts?.category)  { conditions.push("category = ?");    params.push(opts.category); }
  if (opts?.published !== undefined) {
    conditions.push("is_published = ?");
    params.push(opts.published ? 1 : 0);
  }
  if (opts?.search) {
    conditions.push("(title LIKE ? OR excerpt LIKE ?)");
    params.push(`%${opts.search}%`, `%${opts.search}%`);
  }

  const where  = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit  = opts?.limit  ?? 20;
  const offset = opts?.offset ?? 0;

  const rows = await query<NewsRow>(
    `SELECT id, slug, title, excerpt, image, category, published_at, is_published, views
     FROM news ${where} ORDER BY published_at DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const countRows = await query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM news ${where}`, params
  );
  const total = countRows[0]?.total ?? 0;

  return { rows, total };
}

export async function getNewsBySlug(slug: string) {
  const [row] = await query<NewsRow>("SELECT * FROM news WHERE slug = ? LIMIT 1", [slug]);
  if (!row) return null;
  // Increment views
  await execute("UPDATE news SET views = views + 1 WHERE id = ?", [row.id]);
  return row;
}

export async function getNewsById(id: number) {
  const [row] = await query<NewsRow>("SELECT * FROM news WHERE id = ? LIMIT 1", [id]);
  return row ?? null;
}

export interface CreateNewsInput {
  slug: string;
  title: string;
  excerpt?: string;
  content: string;
  image: string;
  category?: string;
  published_at?: string;
  is_published?: boolean;
}

export async function createNews(input: CreateNewsInput): Promise<number> {
  const result = await execute(
    `INSERT INTO news (slug, title, excerpt, content, image, category, published_at, is_published)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.slug,
      input.title,
      input.excerpt ?? null,
      input.content,
      input.image,
      input.category ?? "Tin tức",
      input.published_at ?? new Date().toISOString().slice(0, 19).replace("T", " "),
      input.is_published !== false ? 1 : 0,
    ]
  );
  return result.insertId;
}

export async function updateNews(id: number, input: Partial<CreateNewsInput>): Promise<boolean> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (input.slug         !== undefined) { fields.push("slug = ?");         params.push(input.slug); }
  if (input.title        !== undefined) { fields.push("title = ?");        params.push(input.title); }
  if (input.excerpt      !== undefined) { fields.push("excerpt = ?");      params.push(input.excerpt); }
  if (input.content      !== undefined) { fields.push("content = ?");      params.push(input.content); }
  if (input.image        !== undefined) { fields.push("image = ?");        params.push(input.image); }
  if (input.category     !== undefined) { fields.push("category = ?");     params.push(input.category); }
  if (input.published_at !== undefined) { fields.push("published_at = ?"); params.push(input.published_at); }
  if (input.is_published !== undefined) { fields.push("is_published = ?"); params.push(input.is_published ? 1 : 0); }

  if (!fields.length) return false;
  params.push(id);
  const result = await execute(`UPDATE news SET ${fields.join(", ")} WHERE id = ?`, params);
  return result.affectedRows > 0;
}

export async function deleteNews(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM news WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
