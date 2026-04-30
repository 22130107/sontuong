export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: string;
  images: string[];
  thumbnail: string;
  description: string;
  specs?: Record<string, string>;
  inStock: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  image: string;
  description?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  details?: string;
}

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  publishedAt: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type ProjectCategory =
  | "chung-cu"
  | "biet-thu"
  | "nha-pho"
  | "phong-bep"
  | "phong-ngu"
  | "phong-tre-em";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
