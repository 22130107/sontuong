"use client";

import React, { useState } from "react";
import { Product } from "@/lib/types";
import OrderModal from "@/components/OrderModal";

export default function BuyNowButton({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center justify-center w-full py-3 bg-[rgb(232,184,0)] text-white font-bold text-base rounded hover:bg-yellow-600 transition-colors mb-4"
      >
        MUA NGAY
        <span className="text-xs font-normal mt-0.5 ml-2 opacity-90">
          Gọi điện xác nhận và giao hàng tận nơi
        </span>
      </button>

      <OrderModal
        product={product}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
