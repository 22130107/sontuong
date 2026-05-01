"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import ImageUploader from "@/components/admin/ImageUploader";

interface Slider {
  id: number;
  image: string;
  alt_text: string;
  link_url: string | null;
  is_active: number;
  sort_order: number;
}

const EMPTY_FORM = { image: "", alt_text: "", link_url: "", is_active: true, sort_order: 0 };

export default function AdminBannerPage() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Modal thêm/sửa
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; data: Slider | null }>({
    open: false, mode: "add", data: null,
  });
  const [form, setForm] = useState(EMPTY_FORM);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const token = () =>
    typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

  const fetchSliders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sliders?all=1");
      const result = await res.json();
      if (result.success) setSliders(result.data as Slider[]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSliders(); }, [fetchSliders]);

  // Mở modal thêm
  const openAdd = () => {
    setForm({ ...EMPTY_FORM, sort_order: sliders.length });
    setModal({ open: true, mode: "add", data: null });
  };

  // Mở modal sửa
  const openEdit = (s: Slider) => {
    setForm({
      image: s.image,
      alt_text: s.alt_text,
      link_url: s.link_url || "",
      is_active: s.is_active === 1,
      sort_order: s.sort_order,
    });
    setModal({ open: true, mode: "edit", data: s });
  };

  const closeModal = () => setModal({ open: false, mode: "add", data: null });

  const handleSave = async () => {
    if (!form.image) { showToast("Vui lòng chọn ảnh banner", "error"); return; }
    setSaving(true);

    // Tự tạo alt_text từ tên file nếu chưa có
    const autoAlt = form.alt_text.trim() 
      || form.image.split("/").pop()?.replace(/[-_]/g, " ").replace(/\.[^.]+$/, "") 
      || "Banner NaSun Paint";

    const payload = {
      image: form.image,
      alt_text: autoAlt,
      link_url: form.link_url.trim() || null,
      is_active: form.is_active,
      sort_order: Number(form.sort_order),
    };

    try {
      let res: Response;
      if (modal.mode === "add") {
        res = await fetch("/api/sliders", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/sliders/${modal.data!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
          body: JSON.stringify(payload),
        });
      }
      const result = await res.json();
      if (result.success) {
        showToast(modal.mode === "add" ? "Thêm banner thành công" : "Cập nhật banner thành công", "success");
        closeModal();
        fetchSliders();
      } else {
        showToast(result.message || "Lỗi không xác định", "error");
      }
    } catch {
      showToast("Lỗi kết nối server", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (s: Slider) => {
    await fetch(`/api/sliders/${s.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
      body: JSON.stringify({ is_active: s.is_active !== 1 }),
    });
    fetchSliders();
  };

  const handleDelete = async (id: number) => {
    const slider = sliders.find((s) => s.id === id);
    const res = await fetch(`/api/sliders/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token()}` },
    });
    const result = await res.json();
    if (result.success) {
      showToast("Đã xóa banner", "success");
      // Xóa file upload nếu là local
      if (slider?.image?.startsWith("/uploads/")) {
        await fetch("/api/upload", {
          method: "DELETE",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}` },
          body: JSON.stringify({ url: slider.image }),
        }).catch(() => {});
      }
      fetchSliders();
    } else {
      showToast("Lỗi xóa banner", "error");
    }
    setDeleteId(null);
  };

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Quản lý Banner / Slider</h1>
              <p className="text-sm text-gray-500 mt-0.5">{sliders.length} banner</p>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-lg hover:opacity-90"
              style={{ backgroundColor: "#1a3a8f" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm banner
            </button>
          </header>

          <div className="flex-1 overflow-auto p-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
              </div>
            ) : sliders.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-3">🖼️</div>
                <p className="text-gray-500 mb-4">Chưa có banner nào</p>
                <button onClick={openAdd} className="px-4 py-2 text-sm font-bold text-white rounded-lg" style={{ backgroundColor: "#1a3a8f" }}>
                  Thêm banner đầu tiên
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sliders.map((s, idx) => (
                  <div key={s.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Preview ảnh */}
                    <div className="relative aspect-video bg-gray-100">
                      <Image src={s.image} alt={s.alt_text} fill className="object-cover" sizes="400px" />
                      {/* Badge thứ tự */}
                      <span className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded">
                        #{idx + 1}
                      </span>
                      {/* Badge trạng thái */}
                      <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded ${s.is_active ? "bg-green-500 text-white" : "bg-gray-400 text-white"}`}>
                        {s.is_active ? "Hiển thị" : "Ẩn"}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="font-medium text-gray-800 text-sm truncate">{s.alt_text}</p>
                      {s.link_url && (
                        <p className="text-xs text-blue-500 truncate mt-0.5">{s.link_url}</p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        {/* Toggle hiển thị */}
                        <button
                          onClick={() => handleToggleActive(s)}
                          className={`flex-1 h-8 rounded-lg text-xs font-medium transition-colors ${
                            s.is_active
                              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                              : "bg-green-50 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          {s.is_active ? "Ẩn" : "Hiện"}
                        </button>
                        {/* Sửa */}
                        <button
                          onClick={() => openEdit(s)}
                          className="flex-1 h-8 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-xs font-medium transition-colors"
                        >
                          Sửa
                        </button>
                        {/* Xóa */}
                        <button
                          onClick={() => setDeleteId(s.id)}
                          className="h-8 w-8 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal thêm/sửa */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-800 text-lg">
                {modal.mode === "add" ? "Thêm banner mới" : "Chỉnh sửa banner"}
              </h2>
              <button onClick={closeModal} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Ảnh */}
              <ImageUploader
                label="Ảnh banner"
                required
                value={form.image}
                onChange={(url) => setForm((p) => ({ ...p, image: url }))}
                aspectRatio="wide"
              />

              {/* Alt text */}
              <div className="hidden">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả ảnh (alt text) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.alt_text}
                  onChange={(e) => setForm((p) => ({ ...p, alt_text: e.target.value }))}
                  placeholder="VD: Banner sơn nước Vũng Tàu"
                  className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Link URL */}
              <div className="hidden">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link khi click <span className="text-gray-400 font-normal">(tuỳ chọn)</span>
                </label>
                <input
                  type="url"
                  value={form.link_url}
                  onChange={(e) => setForm((p) => ({ ...p, link_url: e.target.value }))}
                  placeholder="https://..."
                  className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Sort order + Active */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
                  <input
                    type="number"
                    min={0}
                    value={form.sort_order}
                    onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, is_active: !p.is_active }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${form.is_active ? "bg-green-500" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                      {form.is_active ? "Hiển thị" : "Ẩn"}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t">
              <button
                onClick={closeModal}
                className="flex-1 h-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 h-10 text-white rounded-lg text-sm font-bold disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ backgroundColor: "#1a3a8f" }}
              >
                {saving ? (
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : null}
                {modal.mode === "add" ? "Thêm banner" : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm xóa */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">Xác nhận xóa</h3>
            <p className="text-sm text-gray-500 text-center mb-6">Banner này sẽ bị xóa vĩnh viễn.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 h-10 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 h-10 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Xóa</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.type === "success"
            ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            : <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          }
          {toast.msg}
        </div>
      )}
    </AdminGuard>
  );
}
