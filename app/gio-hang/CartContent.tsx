"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

export default function CartContent() {
  const { items, totalItems, removeItem, updateQuantity } = useCart();
  const router = useRouter();

  const handleRequestQuote = () => {
    const productList = items
      .map((item) => `- ${item.product.name} (SL: ${item.quantity})`)
      .join("\n");
    const message = `Yêu cầu báo giá:\n${productList}`;
    router.push(`/lien-he?message=${encodeURIComponent(message)}`);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white p-8 rounded text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-bold text-gray-600 mb-4">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-6">
          Bạn chưa có sản phẩm nào trong giỏ hàng.
        </p>
        <Link
          href="/san-pham"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded">
      <h1 className="font-bold text-2xl text-[rgb(26,58,143)] uppercase mb-6">
        Giỏ Hàng ({totalItems} sản phẩm)
      </h1>

      {/* Cart table */}
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
                      <Image
                        src={item.product.thumbnail}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    </div>
                    <div>
                      <Link
                        href={`/san-pham/${item.product.slug}`}
                        className="font-medium text-[rgb(26,58,143)] hover:text-[rgb(232,184,0)] transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.product.category}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <span className="font-bold text-red-600">{item.product.price}</span>
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-[rgb(232,184,0)] hover:text-[rgb(232,184,0)] transition-colors"
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:border-[rgb(232,184,0)] hover:text-[rgb(232,184,0)] transition-colors"
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="py-4 pl-4 text-right">
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    aria-label={`Xóa ${item.product.name}`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
        <Link
          href="/san-pham"
          className="flex items-center gap-2 px-5 py-2.5 border-2 border-[rgb(26,58,143)] text-[rgb(26,58,143)] font-bold rounded hover:bg-[rgb(26,58,143)] hover:text-white transition-colors text-sm"
        >
          ← Tiếp tục mua sắm
        </Link>

        <button
          onClick={handleRequestQuote}
          className="flex items-center gap-2 px-6 py-3 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors"
        >
          Gửi yêu cầu báo giá
        </button>
      </div>
    </div>
  );
}
