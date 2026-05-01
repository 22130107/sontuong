/**
 * Admin product store — uses localStorage to persist changes client-side.
 * In production, replace with real API calls (database, CMS, etc.)
 */
import { Product } from "./types";
import { PRODUCTS as INITIAL_PRODUCTS } from "./data";

const STORAGE_KEY = "nasun_admin_products";

export function getProducts(): Product[] {
  if (typeof window === "undefined") return INITIAL_PRODUCTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Product[];
  } catch {
    // ignore
  }
  return INITIAL_PRODUCTS;
}

export function saveProducts(products: Product[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(product: Omit<Product, "id">): Product {
  const products = getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
  };
  saveProducts([...products, newProduct]);
  return newProduct;
}

export function updateProduct(id: string, data: Partial<Product>): Product | null {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = { ...products[idx], ...data };
  products[idx] = updated;
  saveProducts(products);
  return updated;
}

export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

export function resetProducts(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

// Simple slug generator
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ─────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────
import { Project, Service } from "./types";
import { PROJECTS as INITIAL_PROJECTS, SERVICES as INITIAL_SERVICES } from "./data";

const PROJECTS_KEY = "nasun_admin_projects";
const SERVICES_KEY = "nasun_admin_services";

export function getProjects(): Project[] {
  if (typeof window === "undefined") return INITIAL_PROJECTS;
  try {
    const raw = localStorage.getItem(PROJECTS_KEY);
    if (raw) return JSON.parse(raw) as Project[];
  } catch { /* ignore */ }
  return INITIAL_PROJECTS;
}

export function saveProjects(projects: Project[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function addProject(project: Omit<Project, "id">): Project {
  const projects = getProjects();
  const newProject: Project = { ...project, id: Date.now().toString() };
  saveProjects([...projects, newProject]);
  return newProject;
}

export function updateProject(id: string, data: Partial<Project>): Project | null {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const updated = { ...projects[idx], ...data };
  projects[idx] = updated;
  saveProjects(projects);
  return updated;
}

export function deleteProject(id: string): boolean {
  const projects = getProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length === projects.length) return false;
  saveProjects(filtered);
  return true;
}

export function resetProjects(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PROJECTS_KEY);
}

// ─────────────────────────────────────────────
// SERVICES
// ─────────────────────────────────────────────

export function getServices(): Service[] {
  if (typeof window === "undefined") return INITIAL_SERVICES;
  try {
    const raw = localStorage.getItem(SERVICES_KEY);
    if (raw) return JSON.parse(raw) as Service[];
  } catch { /* ignore */ }
  return INITIAL_SERVICES;
}

export function saveServices(services: Service[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
}

export function addService(service: Omit<Service, "id">): Service {
  const services = getServices();
  const newService: Service = { ...service, id: Date.now().toString() };
  saveServices([...services, newService]);
  return newService;
}

export function updateService(id: string, data: Partial<Service>): Service | null {
  const services = getServices();
  const idx = services.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  const updated = { ...services[idx], ...data };
  services[idx] = updated;
  saveServices(services);
  return updated;
}

export function deleteService(id: string): boolean {
  const services = getServices();
  const filtered = services.filter((s) => s.id !== id);
  if (filtered.length === services.length) return false;
  saveServices(filtered);
  return true;
}

export function resetServices(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SERVICES_KEY);
}
