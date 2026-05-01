"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

interface FormData { gender: "anh" | "chi"; name: string; phone: string; email: string; address: string; note: string; }

export default function CartContent() {
  const { items, totalItems, removeItem, updateQuantity, clearCart } = useCart();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>({ gender: "anh", name: "", phone: "", email: "", address: "", note: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [orderCode, setOrderCode] = useState("");

  const validate = () => {
    const errs: Partial<FormData> = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập họ tên";
    if (!form.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, ""))) errs.phone = "SĐT không hợp lệ";
    return errs;
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender: form.gender,
          customer_name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || undefined,
          address: form.address.trim() || undefined,
          note: form.note.trim() || undefined,
          source: "website",
          items: items.map((item) => ({
            product_id: item.product.id ? Number(item.product.id) : undefined,
            product_name: item.product.name,
            product_slug: item.product.slug,
            quantity: item.quantity,
            price_note: item.product.price || "Liên hệ",
          })),
        }),
      });
      const result = await res.json();
      if (result.success) {
        setOrderCode(result.data.order_code);
        setSubmitted(true);
        clearCart();
      } else {
        setErrors({ name: result.message || "Đặt hàng thất bại" });
      }
    } catch {
      setErrors({ name: "Lỗi kết nối, vui lòng thử lại" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white p-10 rounded text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-500 mb-1">Mã đơn hàng: <span className="font-bold text-blue-700">{orderCode}</span></p>
        <p className="text-gray-500 mb-6">Chúng tôi sẽ liên hệ xác nhận sớm nhất.</p>
        <Link href="/san-pham" className="inline-block px-6 py-2.5 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-600 mb-4">Giỏ hàng trống</h2>
        <Link href="/san-pham" className="inline-flex items-center gap-2 px-6 py-3 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded">
      <h1 className="font-bold text-2xl text-[rgb(26,58,143)] uppercase mb-6">Giỏ Hàng ({totalItems} sản phẩm)</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 pr-4 font-bold text-gray-700">Sản phẩm</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Giá</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Số lượng</th>
              <th className="text-right py-3 pl-4 font-bold text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.product.id}>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 border border-gray-100 rounded">
                      <Image src={item.product.thumbnail} alt={item.product.name} fill className="object-contain p-1" sizes="64px" />
                    </div>
                    <div>
                      <Link href={`/san-pham/${item.product.slug}`} className="font-medium text-[rgb(26,58,143)] hover:text-[rgb(232,184,0)] transition-colors">{item.product.name}</Link>
                      <p className="text-xs text-gray-500 mt-0.5">{item.product.category}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center"><span className="font-bold text-red-600">{item.product.price}</span></td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-[rgb(232,184,0)] transition-colors">−</button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-[rgb(232,184,0)] transition-colors">+</button>
                  </div>
                </td>
                <td className="py-4 pl-4 text-right">
                  <button onClick={() => removeItem(item.product.id)} className="text-red-500 hover:text-red-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!showForm ? (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
          <Link href="/san-pham" className="flex items-center gap-2 px-5 py-2.5 border-2 border-[rgb(26,58,143)] text-[rgb(26,58,143)] font-bold rounded hover:bg-[rgb(26,58,143)] hover:text-white transition-colors text-sm">
            ← Tiếp tục mua sắm
          </Link>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-6 py-3 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors">
            Đặt hàng ngay
          </button>
        </div>
      ) : (
        <form onSubmit={handleOrder} className="mt-6 pt-6 border-t border-gray-200 space-y-3 max-w-lg">
          <h2 className="font-bold text-lg text-gray-800 mb-4">Thông tin đặt hàng</h2>
          <div className="flex gap-6">
            {(["anh", "chi"] as const).map((g) => (
              <label key={g} className="flex items-center gap-2 cursor-pointer text-sm">
                <input type="radio" name="gender" value={g} checked={form.gender === g} onChange={() => setForm((p) => ({ ...p, gender: g }))} className="accent-[rgb(232,184,0)]" />
                {g === "anh" ? "Anh" : "Chị"}
              </label>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input type="text" placeholder="Họ và tên *" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className={`w-full h-10 border rounded px-3 text-sm focus:outline-none ${errors.name ? "border-red-400" : "border-gray-300"}`} />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <input type="tel" placeholder="Số điện thoại *" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                className={`w-full h-10 border rounded px-3 text-sm focus:outline-none ${errors.phone ? "border-red-400" : "border-gray-300"}`} />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
          </div>
          <input type="text" placeholder="Địa chỉ" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="w-full h-10 border border-gray-300 rounded px-3 text-sm focus:outline-none" />
          <textarea placeholder="Ghi chú" value={form.note} onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))} rows={3} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none resize-none" />
          <div className="flex gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-300 rounded font-medium text-gray-700 hover:bg-gray-50 text-sm">Hủy</button>
            <button type="submit" disabled={loading} className="flex-1 py-2.5 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors disabled:opacity-60 text-sm">
              {loading ? "Đang gửi..." : "Xác nhận đặt hàng"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
