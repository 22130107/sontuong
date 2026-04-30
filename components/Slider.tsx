"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface SliderImage {
  src: string;
  alt: string;
}

interface SliderProps {
  images: SliderImage[];
  autoPlayInterval?: number;
}

export default function Slider({ images, autoPlayInterval = 5000 }: SliderProps) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, autoPlayInterval]);

  return (
    <section className="relative w-full overflow-hidden" aria-label="Banner slider">
      {/* Slides */}
      <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Prev button */}
      <button
        onClick={prev}
        aria-label="Previous"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center border-2 border-white rounded-full text-white bg-black/20 hover:bg-black/40 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Next button */}
      <button
        onClick={next}
        aria-label="Next"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center border-2 border-white rounded-full text-white bg-black/20 hover:bg-black/40 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <ol className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {images.map((_, index) => (
          <li key={index}>
            <button
              aria-label={`Page dot ${index + 1}`}
              onClick={() => setCurrent(index)}
              className={`w-3 h-3 rounded-full border-2 border-white transition-all ${
                index === current ? "bg-white" : "bg-transparent opacity-60"
              }`}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
