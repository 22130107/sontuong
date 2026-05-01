"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";

export default function AddProductPage() {
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
              <h1 className="text-xl font-bold text-gray-800">Thêm sản phẩm mới</h1>
              <p className="text-sm text-gray-500 mt-0.5">Điền thông tin sản phẩm bên dưới</p>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">
            <ProductForm mode="add" />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
