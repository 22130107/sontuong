"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ProjectForm from "@/components/admin/ProjectForm";
import { Project } from "@/lib/types";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null | undefined>(undefined);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((result) => {
        if (result.success) {
          const r = result.data;
          setProject({
            id: String(r.id), slug: r.slug, title: r.title,
            category: r.category, image: r.image, description: r.description,
          });
        } else setProject(null);
      })
      .catch(() => setProject(null));
  }, [id]);

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
              <h1 className="text-xl font-bold text-gray-800">
                {project ? `Chỉnh sửa: ${project.title}` : "Chỉnh sửa công trình"}
              </h1>
            </div>
          </header>
          <div className="flex-1 overflow-auto p-6">
            {project === undefined && <div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>}
            {project === null && <div className="text-center py-20"><p className="text-gray-500 mb-4">Không tìm thấy công trình</p><Link href="/admin/cong-trinh" className="text-blue-600 hover:underline text-sm">← Quay lại</Link></div>}
            {project && <ProjectForm mode="edit" initial={project} />}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
