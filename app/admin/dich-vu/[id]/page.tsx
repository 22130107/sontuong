"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ServiceForm from "@/components/admin/ServiceForm";
import { Service } from "@/lib/types";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/services/${id}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.success) {
          const r = result.data;
          setService({
            id: String(r.id), slug: r.slug, title: r.title,
            description: r.description, details: r.details, image: r.image,
          });
        } else setService(null);
      })
      .catch(() => setService(null));
  }, [id]);

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3 flex-shrink-0">
            <Link href="/admin/dich-vu" className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {service ? `Chỉnh sửa: ${service.title}` : "Chỉnh sửa dịch vụ"}
              </h1>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            {service === undefined && <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}
            {service === null && <div className="text-center py-20"><p className="text-gray-500 mb-4">Không tìm thấy dịch vụ</p><Link href="/admin/dich-vu" className="text-blue-600 hover:underline text-sm">← Quay lại</Link></div>}
            {service && <ServiceForm mode="edit" initial={service} />}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
