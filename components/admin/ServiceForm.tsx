"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Service } from "@/lib/types";
import { toSlug } from "@/lib/admin-store";
import ImageUploader from "@/components/admin/ImageUploader";

interface ServiceFormProps {
  initial?: Service;
  mode: "add" | "edit";
}

export default function ServiceForm({ initial, mode }: ServiceFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    description: initial?.description ?? "",
    details: initial?.details ?? "",
    image: initial?.image ?? "",
  });

  const handleTitleChange = (val: string) => {
    setForm((p) => ({
      ...p,
      title: val,
      slug: mode === "add" ? toSlug(val) : p.slug,
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title.trim()) errs.title = "Vui lòng nhập tên dịch vụ";
    if (!form.slug.trim()) errs.slug = "Vui lòng nhập slug";
    if (!form.description.trim()) errs.description = "Vui lòng nhập mô tả ngắn";
    if (!form.image.trim()) errs.image = "Vui lòng chọn hoặc nhập ảnh";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      details: form.details.trim() || undefined,
      image: form.image.trim(),
      sort_order: 0,
    };

    try {
      let res: Response;
      if (mode === "add") {
        res = await fetch("/api/services", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/services/${initial!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();
      if (result.success) {
        showToast(mode === "add" ? "✅ Thêm dịch vụ thành công!" : "✅ Cập nhật thành công!", "success");
        setTimeout(() => { router.push("/admin/dich-vu"); router.refresh(); }, 1000);
      } else {
        showToast(result.message || "Lỗi không xác định", "error");
        setSaving(false);
      }
    } catch {
      showToast("Lỗi kết nối server", "error");
      setSaving(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: "#1a3a8f" }} />
                Thông tin dịch vụ
              </h3>
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên dịch vụ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="VD: Thi Công Sơn Nước"
                    className={`w-full h-10 border rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 ${errors.title ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (URL) <span className="text-red-500">*</span>
                  </label>
                  <div className={`flex items-center border rounded-lg overflow-hidden focus-within:border-blue-500 ${errors.slug ? "border-red-400" : "border-gray-300"}`}>
                    <span className="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-r border-gray-200">/dich-vu/</span>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                      className="flex-1 h-10 px-3 text-sm focus:outline-none"
                    />
                  </div>
                  {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả ngắn <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => { setForm((p) => ({ ...p, description: e.target.value })); setErrors((p) => ({ ...p, description: "" })); }}
                    rows={3}
                    placeholder="Mô tả ngắn hiển thị trên trang danh sách..."
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none ${errors.description ? "border-red-400" : "border-gray-300"}`}
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung chi tiết
                  </label>
                  <textarea
                    value={form.details}
                    onChange={(e) => setForm((p) => ({ ...p, details: e.target.value }))}
                    rows={5}
                    placeholder="Nội dung đầy đủ hiển thị trên trang chi tiết dịch vụ..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: image */}
          <div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: "#cc2222" }} />
                Ảnh dịch vụ <span className="text-red-500">*</span>
              </h3>
              <ImageUploader
                value={form.image}
                onChange={(url) => { setForm((p) => ({ ...p, image: url })); setErrors((p) => ({ ...p, image: "" })); }}
                error={errors.image}
                aspectRatio="wide"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => router.back()}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Hủy
          </button>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: "#1a3a8f" }}>
            {saving ? (
              <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Đang lưu...</>
            ) : (
              <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>{mode === "add" ? "Thêm dịch vụ" : "Lưu thay đổi"}</>
            )}
          </button>
        </div>
      </form>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-medium ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.type === "success"
            ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          }
          {toast.msg}
        </div>
      )}
    </>
  );
}
