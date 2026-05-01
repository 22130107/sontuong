import { query, execute } from "@/lib/db";

export interface ServiceRow {
  id: number;
  slug: string;
  title: string;
  description: string;
  details: string | null;
  image: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getAllServices(opts?: { search?: string; limit?: number; offset?: number }) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (opts?.search) { conditions.push("title LIKE ?"); params.push(`%${opts.search}%`); }

  const where  = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit  = opts?.limit  ?? 50;
  const offset = opts?.offset ?? 0;

  const rows = await query<ServiceRow>(
    `SELECT * FROM services ${where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const countRows = await query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM services ${where}`, params
  );
  const total = countRows[0]?.total ?? 0;

  return { rows, total };
}

export async function getServiceBySlug(slug: string) {
  const [row] = await query<ServiceRow>("SELECT * FROM services WHERE slug = ? LIMIT 1", [slug]);
  return row ?? null;
}

export async function getServiceById(id: number) {
  const [row] = await query<ServiceRow>("SELECT * FROM services WHERE id = ? LIMIT 1", [id]);
  return row ?? null;
}

export interface CreateServiceInput {
  slug: string;
  title: string;
  description: string;
  details?: string;
  image: string;
  sort_order?: number;
}

export async function createService(input: CreateServiceInput): Promise<number> {
  const result = await execute(
    `INSERT INTO services (slug, title, description, details, image, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [input.slug, input.title, input.description, input.details ?? null, input.image, input.sort_order ?? 0]
  );
  return result.insertId;
}

export async function updateService(id: number, input: Partial<CreateServiceInput>): Promise<boolean> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (input.slug        !== undefined) { fields.push("slug = ?");        params.push(input.slug); }
  if (input.title       !== undefined) { fields.push("title = ?");       params.push(input.title); }
  if (input.description !== undefined) { fields.push("description = ?"); params.push(input.description); }
  if (input.details     !== undefined) { fields.push("details = ?");     params.push(input.details); }
  if (input.image       !== undefined) { fields.push("image = ?");       params.push(input.image); }
  if (input.sort_order  !== undefined) { fields.push("sort_order = ?");  params.push(input.sort_order); }

  if (!fields.length) return false;
  params.push(id);
  const result = await execute(`UPDATE services SET ${fields.join(", ")} WHERE id = ?`, params);
  return result.affectedRows > 0;
}

export async function deleteService(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM services WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
