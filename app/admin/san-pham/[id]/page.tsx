"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/ProductForm";
import { getProducts } from "@/lib/admin-store";
import { Product } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null | undefined>(undefined);

  useEffect(() => {
    const found = getProducts().find((p) => p.id === id);
    setProduct(found ?? null);
  }, [id]);

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 flex-shrink-0">
            <Link
              href="/admin/san-pham"
              className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {product ? `Chỉnh sửa: ${product.name}` : "Chỉnh sửa sản phẩm"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Cập nhật thông tin sản phẩm</p>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">
            {product === undefined && (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
              </div>
            )}
            {product === null && (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm</p>
                <Link href="/admin/san-pham" className="text-blue-600 hover:underline text-sm">
                  ← Quay lại danh sách
                </Link>
              </div>
            )}
            {product && <ProductForm mode="edit" initial={product} />}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
