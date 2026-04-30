"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { COMPANY_INFO } from "@/lib/data";

interface OrderModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  gender: "anh" | "chi";
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
}

export default function OrderModal({ product, isOpen, onClose }: OrderModalProps) {
  const [form, setForm] = useState<FormData>({
    gender: "anh",
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const validate = (): FormErrors => {
    const errs: FormErrors = {};
    if (!form.name.trim()) errs.name = "Vui lòng nhập họ và tên";
    if (!form.phone.trim()) errs.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{9,11}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Số điện thoại không hợp lệ";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal box */}
      <div className="bg-white w-full max-w-[860px] max-h-[90vh] overflow-y-auto rounded shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[rgb(200,160,40)] px-5 py-3">
          <h2 className="font-bold text-white uppercase text-base tracking-wide">
            ĐẶT MUA {product.name.toUpperCase()}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Đóng"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          /* Success state */
          <div className="p-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-green-600 mb-2">Đặt hàng thành công!</h3>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors"
            >
              Đóng
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Left: product info + company info */}
            <div className="p-5 border-r border-gray-100">
              {/* Product summary */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
                <div className="relative w-[80px] h-[80px] flex-shrink-0 border border-gray-200 p-1">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="80px"
                  />
                </div>
                <div>
                  <p className="font-bold text-gray-800 uppercase text-sm">{product.name}</p>
                  <p className="text-sm mt-1">
                    Giá:{" "}
                    <span className="font-bold text-red-600">{product.price}</span>
                  </p>
                </div>
              </div>

              {/* Note */}
              <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                Bạn vui lòng nhập đúng số điện thoại để chúng tôi sẽ gọi xác nhận đơn hàng
                trước khi giao hàng. Xin cảm ơn!
              </p>

              {/* Company contact */}
              <div>
                <h3 className="font-bold text-gray-800 uppercase text-sm mb-3">
                  THÔNG TIN LIÊN HỆ
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-[rgb(232,184,0)] mt-0.5">🏢</span>
                    <span>{COMPANY_INFO.fullName}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[rgb(232,184,0)] mt-0.5">📍</span>
                    <span>Đ/C: {COMPANY_INFO.address}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[rgb(232,184,0)] mt-0.5">📞</span>
                    <span>Điện thoại: {COMPANY_INFO.phone}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[rgb(232,184,0)] mt-0.5">📞</span>
                    <span>Hỗ trợ kỹ thuật: {COMPANY_INFO.phoneSupport}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[rgb(232,184,0)] mt-0.5">🌐</span>
                    <span>Website: {COMPANY_INFO.website}</span>
                  </li>
                </ul>

                {/* Description */}
                <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                  Hãy liên hệ với chúng tôi để được tư vấn thi công sơn nước – thạch cao,
                  thiết kế trang trí nội ngoại thất cho khách sạn, nhà hàng, thiết kế shop
                  bán hàng, thiết kế showroom tại Vũng Tàu. Ngoài ra chúng tôi còn chuyên
                  phân phối sỉ lẻ các loại sơn nước, sơn dầu, chống thấm, bột trét tường
                  cao cấp tại Vũng Tàu.
                </p>
              </div>
            </div>

            {/* Right: order form */}
            <div className="p-5">
              <h3 className="font-bold text-gray-800 text-sm mb-4">Thông tin người mua</h3>

              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                {/* Gender */}
                <div className="flex gap-6">
                  {(["anh", "chi"] as const).map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={form.gender === g}
                        onChange={() => setForm((p) => ({ ...p, gender: g }))}
                        className="accent-[rgb(232,184,0)] w-4 h-4"
                      />
                      <span className="capitalize">{g === "anh" ? "Anh" : "Chị"}</span>
                    </label>
                  ))}
                </div>

                {/* Name + Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Họ và tên"
                      className={`w-full h-10 border rounded px-3 text-sm focus:outline-none focus:border-[rgb(232,184,0)] ${
                        errors.name ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Số điện thoại"
                      className={`w-full h-10 border rounded px-3 text-sm focus:outline-none focus:border-[rgb(232,184,0)] ${
                        errors.phone ? "border-red-400" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Địa chỉ email (Không bắt buộc)"
                  className="w-full h-10 border border-gray-300 rounded px-3 text-sm focus:outline-none focus:border-[rgb(232,184,0)]"
                />

                {/* Address */}
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Địa chỉ (Không bắt buộc)"
                  className="w-full h-10 border border-gray-300 rounded px-3 text-sm focus:outline-none focus:border-[rgb(232,184,0)]"
                />

                {/* Note */}
                <textarea
                  name="note"
                  value={form.note}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Ghi chú đơn hàng (Không bắt buộc)"
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[rgb(232,184,0)] resize-none"
                />

                {/* Total */}
                <div className="text-sm font-medium text-gray-700">
                  Tổng: <span className="font-bold">0 đ</span>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[rgb(200,160,40)] hover:bg-yellow-600 text-white font-bold uppercase tracking-wide rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Đang gửi...
                    </>
                  ) : (
                    "ĐẶT HÀNG NGAY"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
