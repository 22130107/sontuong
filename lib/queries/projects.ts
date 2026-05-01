import { query, execute } from "@/lib/db";

export type ProjectCategory =
  | "chung-cu" | "biet-thu" | "nha-pho"
  | "phong-bep" | "phong-ngu" | "phong-tre-em";

export interface ProjectRow {
  id: number;
  slug: string;
  title: string;
  category: ProjectCategory;
  image: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export async function getAllProjects(opts?: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const conditions: string[] = [];
  const params: unknown[] = [];

  if (opts?.category) { conditions.push("category = ?"); params.push(opts.category); }
  if (opts?.search)   { conditions.push("title LIKE ?"); params.push(`%${opts.search}%`); }

  const where  = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limit  = opts?.limit  ?? 20;
  const offset = opts?.offset ?? 0;

  const rows = await query<ProjectRow>(
    `SELECT * FROM projects ${where} ORDER BY sort_order ASC, id ASC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );
  const countRows = await query<{ total: number }>(
    `SELECT COUNT(*) AS total FROM projects ${where}`, params
  );
  const total = countRows[0]?.total ?? 0;

  return { rows, total };
}

export async function getProjectBySlug(slug: string) {
  const [row] = await query<ProjectRow>("SELECT * FROM projects WHERE slug = ? LIMIT 1", [slug]);
  return row ?? null;
}

export async function getProjectById(id: number) {
  const [row] = await query<ProjectRow>("SELECT * FROM projects WHERE id = ? LIMIT 1", [id]);
  return row ?? null;
}

export interface CreateProjectInput {
  slug: string;
  title: string;
  category: ProjectCategory;
  image: string;
  description?: string;
  sort_order?: number;
}

export async function createProject(input: CreateProjectInput): Promise<number> {
  const result = await execute(
    `INSERT INTO projects (slug, title, category, image, description, sort_order)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [input.slug, input.title, input.category, input.image, input.description ?? null, input.sort_order ?? 0]
  );
  return result.insertId;
}

export async function updateProject(id: number, input: Partial<CreateProjectInput>): Promise<boolean> {
  const fields: string[] = [];
  const params: unknown[] = [];

  if (input.slug        !== undefined) { fields.push("slug = ?");        params.push(input.slug); }
  if (input.title       !== undefined) { fields.push("title = ?");       params.push(input.title); }
  if (input.category    !== undefined) { fields.push("category = ?");    params.push(input.category); }
  if (input.image       !== undefined) { fields.push("image = ?");       params.push(input.image); }
  if (input.description !== undefined) { fields.push("description = ?"); params.push(input.description); }
  if (input.sort_order  !== undefined) { fields.push("sort_order = ?");  params.push(input.sort_order); }

  if (!fields.length) return false;
  params.push(id);
  const result = await execute(`UPDATE projects SET ${fields.join(", ")} WHERE id = ?`, params);
  return result.affectedRows > 0;
}

export async function deleteProject(id: number): Promise<boolean> {
  const result = await execute("DELETE FROM projects WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
