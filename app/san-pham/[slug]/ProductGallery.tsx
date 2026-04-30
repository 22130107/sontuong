"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Main image */}
      <div className="relative aspect-square border border-gray-200 bg-white mb-3 overflow-hidden">
        <Image
          src={images[active] ?? images[0]}
          alt={`${name} - ảnh chính`}
          fill
          className="object-contain p-3"
          sizes="220px"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-[60px] h-[60px] border-2 transition-colors bg-white ${
                active === i
                  ? "border-[rgb(232,184,0)]"
                  : "border-gray-200 hover:border-[rgb(232,184,0)]"
              }`}
              aria-label={`Xem ảnh ${i + 1}`}
            >
              <Image
                src={img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                className="object-contain p-1"
                sizes="60px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
