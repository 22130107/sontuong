"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/types";
import { toSlug } from "@/lib/admin-store";
import ImageUploader from "@/components/admin/ImageUploader";

interface ProductFormProps {
  initial?: Product;
  mode: "add" | "edit";
}

const CATEGORIES = ["Sơn nước", "Sơn chống thấm", "Sơn nội thất", "Sơn ngoại thất", "Sơn cao cấp", "Khác"];

export default function ProductForm({ initial, mode }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    category: initial?.category ?? "Sơn nước",
    price: initial?.price ?? "Liên hệ",
    description: initial?.description ?? "",
    thumbnail: initial?.thumbnail ?? "",
    images: initial?.images?.length ? initial.images : [""],
    inStock: initial?.inStock ?? true,
    specs: initial?.specs
      ? Object.entries(initial.specs).map(([k, v]) => ({ key: k, value: v }))
      : [{ key: "", value: "" }],
  });

  const handleNameChange = (val: string) => {
    setForm((p) => ({
      ...p,
      name: val,
      slug: mode === "add" ? toSlug(val) : p.slug,
    }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập tên sản phẩm";
    if (!form.slug.trim()) errs.slug = "Vui lòng nhập slug";
    if (!form.thumbnail.trim()) errs.thumbnail = "Vui lòng chọn hoặc nhập ảnh đại diện";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);

    const specs: Record<string, string> = {};
    form.specs.forEach(({ key, value }) => {
      if (key.trim() && value.trim()) specs[key.trim()] = value.trim();
    });

    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";

    const payload = {
      slug: form.slug.trim(),
      name: form.name.trim(),
      category: form.category,
      price: form.price.trim() || "Liên hệ",
      description: form.description.trim(),
      thumbnail: form.thumbnail.trim(),
      in_stock: form.inStock,
      sort_order: 0,
      images: form.images
        .filter((u) => u.trim())
        .map((url, i) => ({ url, alt_text: form.name.trim(), sort_order: i })),
      specs: Object.entries(specs).map(([spec_key, spec_value], i) => ({
        spec_key, spec_value, sort_order: i,
      })),
    };

    try {
      let res: Response;
      if (mode === "add") {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/admin/products/${initial!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(payload),
        });
      }

      const result = await res.json();

      if (result.success) {
        showToast(
          mode === "add" ? "✅ Thêm sản phẩm thành công!" : "✅ Cập nhật sản phẩm thành công!",
          "success"
        );
        setTimeout(() => {
          router.push("/admin/san-pham");
          router.refresh();
        }, 1000);
      } else {
        showToast(result.message || "Lỗi không xác định", "error");
        setSaving(false);
      }
    } catch (err) {
      showToast("Lỗi kết nối server", "error");
      setSaving(false);
    }
  };

  // Image list helpers
  const setImage = (idx: number, val: string) => {
    const imgs = [...form.images];
    imgs[idx] = val;
    setForm((p) => ({ ...p, images: imgs }));
  };
  const addImage = () => setForm((p) => ({ ...p, images: [...p.images, ""] }));
  const removeImage = (idx: number) =>
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));

  // Spec helpers
  const setSpec = (idx: number, field: "key" | "value", val: string) => {
    const specs = [...form.specs];
    specs[idx] = { ...specs[idx], [field]: val };
    setForm((p) => ({ ...p, specs }));
  };
  const addSpec = () => setForm((p) => ({ ...p, specs: [...p.specs, { key: "", value: "" }] }));
  const removeSpec = (idx: number) =>
    setForm((p) => ({ ...p, specs: p.specs.filter((_, i) => i !== idx) }));

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: main info ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Basic info card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: "#1a3a8f" }} />
              Thông tin cơ bản
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="VD: Sơn Dulux Weathershield"
                  className={`w-full h-10 border rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 ${errors.name ? "border-red-400" : "border-gray-300"}`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slug (URL) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border rounded-lg overflow-hidden focus-within:border-blue-500" style={{ borderColor: errors.slug ? "#f87171" : "#d1d5db" }}>
                  <span className="px-3 py-2 bg-gray-50 text-gray-400 text-sm border-r border-gray-200">/san-pham/</span>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                    placeholder="son-dulux-weathershield"
                    className="flex-1 h-10 px-3 text-sm focus:outline-none"
                  />
                </div>
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug}</p>}
              </div>

              {/* Category + Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white"
                  >
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá</label>
                  <input
                    type="text"
                    value={form.price}
                    onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                    placeholder="Liên hệ"
                    className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={4}
                  placeholder="Mô tả chi tiết sản phẩm..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {/* In stock */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, inStock: !p.inStock }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.inStock ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.inStock ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {form.inStock ? "Còn hàng" : "Hết hàng"}
                </span>
              </div>
            </div>
          </div>

          {/* Specs card */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: "#e8b800" }} />
              Thông số kỹ thuật
            </h3>
            <div className="space-y-2">
              {form.specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={spec.key}
                    onChange={(e) => setSpec(idx, "key", e.target.value)}
                    placeholder="Tên thông số"
                    className="flex-1 h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => setSpec(idx, "value", e.target.value)}
                    placeholder="Giá trị"
                    className="flex-1 h-9 border border-gray-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(idx)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 mt-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm thông số
              </button>
            </div>
          </div>
        </div>

        {/* ── Right: images ── */}
        <div className="space-y-5">
          {/* Thumbnail */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full inline-block" style={{ backgroundColor: "#cc2222" }} />
              Ảnh đại diện <span className="text-red-500">*</span>
            </h3>
            <ImageUploader
              value={form.thumbnail}
              onChange={(url) => {
                setForm((p) => ({ ...p, thumbnail: url }));
                if (errors.thumbnail) setErrors((p) => ({ ...p, thumbnail: "" }));
              }}
              required
              error={errors.thumbnail}
              aspectRatio="square"
            />
          </div>

          {/* Image gallery */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 rounded-full inline-block bg-gray-400" />
              Thư viện ảnh
            </h3>
            <div className="space-y-4">
              {form.images.map((url, idx) => (
                <div key={idx} className="relative">
                  <ImageUploader
                    value={url}
                    onChange={(val) => setImage(idx, val)}
                    label={`Ảnh ${idx + 1}`}
                    aspectRatio="square"
                  />
                  {form.images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 p-1 text-red-500 hover:text-red-700 text-xs"
                      title="Xóa ảnh này"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addImage}
                className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm ảnh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition-opacity disabled:opacity-60"
          style={{ backgroundColor: "#1a3a8f" }}
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Đang lưu...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {mode === "add" ? "Thêm sản phẩm" : "Lưu thay đổi"}
            </>
          )}
        </button>
      </div>
    </form>

    {/* Toast thông báo */}
    {toast && (
      <div
        className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-medium transition-all animate-in slide-in-from-bottom-4 ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
      >
        {toast.type === "success" ? (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
        {toast.msg}
      </div>
    )}
    </>
  );
}
