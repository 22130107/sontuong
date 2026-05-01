"use client";

import { useState, useEffect, useCallback } from "react";
import { Product } from "@/lib/types";

interface UseAdminProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProduct: (data: Omit<Product, "id">) => Promise<boolean>;
  updateProduct: (id: string, data: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export function useAdminProducts(): UseAdminProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/admin/products", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        // Convert database format to frontend format
        const formattedProducts: Product[] = result.data.rows.map((row: any) => ({
          id: String(row.id),
          slug: row.slug,
          name: row.name,
          category: row.category,
          price: row.price,
          description: row.description || "",
          thumbnail: row.thumbnail,
          images: row.images?.length ? row.images.map((img: any) => img.url) : [row.thumbnail],
          specs: row.specs?.reduce((acc: Record<string, string>, spec: any) => {
            acc[spec.spec_key] = spec.spec_value;
            return acc;
          }, {}) || {},
          inStock: row.in_stock === 1,
        }));
        setProducts(formattedProducts);
      } else {
        throw new Error(result.message || "Lỗi không xác định");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = useCallback(async (data: Omit<Product, "id">): Promise<boolean> => {
    try {
      const payload = {
        slug: data.slug,
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
        thumbnail: data.thumbnail,
        in_stock: data.inStock,
        sort_order: 0,
        images: data.images?.map((url, index) => ({
          url,
          alt_text: data.name,
          sort_order: index,
        })) || [],
        specs: data.specs ? Object.entries(data.specs).map(([key, value], index) => ({
          spec_key: key,
          spec_value: value,
          sort_order: index,
        })) : [],
      };

      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        await fetchProducts(); // Refresh list
        return true;
      } else {
        throw new Error(result.message || "Lỗi tạo sản phẩm");
      }
    } catch (err) {
      console.error("Error creating product:", err);
      setError(err instanceof Error ? err.message : "Lỗi tạo sản phẩm");
      return false;
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, data: Partial<Product>): Promise<boolean> => {
    try {
      const payload: any = {};
      
      if (data.slug !== undefined) payload.slug = data.slug;
      if (data.name !== undefined) payload.name = data.name;
      if (data.category !== undefined) payload.category = data.category;
      if (data.price !== undefined) payload.price = data.price;
      if (data.description !== undefined) payload.description = data.description;
      if (data.thumbnail !== undefined) payload.thumbnail = data.thumbnail;
      if (data.inStock !== undefined) payload.in_stock = data.inStock;
      
      if (data.images) {
        payload.images = data.images.map((url, index) => ({
          url,
          alt_text: data.name || "",
          sort_order: index,
        }));
      }
      
      if (data.specs) {
        payload.specs = Object.entries(data.specs).map(([key, value], index) => ({
          spec_key: key,
          spec_value: value,
          sort_order: index,
        }));
      }

      const response = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        await fetchProducts(); // Refresh list
        return true;
      } else {
        throw new Error(result.message || "Lỗi cập nhật sản phẩm");
      }
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err instanceof Error ? err.message : "Lỗi cập nhật sản phẩm");
      return false;
    }
  }, [fetchProducts]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/admin/products/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("admin_token")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        await fetchProducts(); // Refresh list
        return true;
      } else {
        throw new Error(result.message || "Lỗi xóa sản phẩm");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      setError(err instanceof Error ? err.message : "Lỗi xóa sản phẩm");
      return false;
    }
  }, [fetchProducts]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}