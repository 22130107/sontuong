"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="bg-white overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
      {/* Main product image */}
      <div className="relative overflow-hidden">
        <Link href={`/san-pham/${product.slug}`} className="block">
          <div className="relative aspect-square bg-white">
            <Image
              src={product.images[activeImg] ?? product.thumbnail}
              alt={`${product.name} - Sơn nước Vũng Tàu Mặt Trời Việt NaSun`}
              fill
              loading="eager"
              className="object-contain p-2 hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </Link>
      </div>

      {/* Info section */}
      <div className="px-3 pt-3 pb-4 border-t border-gray-100 text-center">
        {/* Color swatches / thumbnail gallery */}
        {product.images.length > 1 && (
          <div className="flex justify-center gap-1 mb-3 flex-wrap">
            {product.images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative w-[50px] h-[50px] flex-shrink-0 border p-[3px] transition-colors ${
                  activeImg === i
                    ? "border-[rgb(232,184,0)]"
                    : "border-gray-200 hover:border-[rgb(232,184,0)]"
                }`}
                aria-label={`Xem ảnh ${i + 1}`}
              >
                <Image
                  src={img}
                  alt={`${product.name} màu ${i + 1}`}
                  fill
                  className="object-contain"
                  sizes="50px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Product name */}
        <div className="mb-1">
          <Link
            href={`/san-pham/${product.slug}`}
            className="font-medium text-[rgb(26,58,143)] text-[15px] leading-5 hover:text-[rgb(232,184,0)] transition-colors line-clamp-2 block"
          >
            {product.name.toUpperCase()}
          </Link>
        </div>

        {/* Price */}
        <div className="mt-2 mb-3 text-sm leading-none">
          <span className="text-gray-600">Giá: </span>
          <span className="font-bold text-red-600 text-[20px] leading-none">
            {product.price}
          </span>
        </div>

        {/* Actions row */}
        <ul className="flex items-center justify-between pt-2 border-t border-gray-200 text-[13px]">
          <li className="flex-1">
            {product.inStock ? (
              <span className="text-[rgb(2,166,77)] flex items-center justify-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Còn hàng
              </span>
            ) : (
              <span className="text-red-500">Hết hàng</span>
            )}
          </li>
          <li className="flex-1">
            <button
              onClick={() => addItem(product)}
              className="text-[rgb(232,184,0)] hover:underline flex items-center justify-center gap-1 w-full"
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              Thêm vào giỏ
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
