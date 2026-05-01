"use client";

import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProjectForm from "@/components/admin/ProjectForm";

export default function AddProjectPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 flex-shrink-0">
            <Link href="/admin/cong-trinh" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Thêm công trình mới</h1>
              <p className="text-sm text-gray-500 mt-0.5">Điền thông tin công trình bên dưới</p>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            <ProjectForm mode="add" />
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
