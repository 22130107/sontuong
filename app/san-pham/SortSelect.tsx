"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface SortSelectProps {
  currentSort?: string;
}

export default function SortSelect({ currentSort }: SortSelectProps) {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams();
    if (e.target.value) params.set("sort", e.target.value);
    const qs = params.toString();
    router.push(`/san-pham${qs ? `?${qs}` : ""}`);
  };

  return (
    <select
      defaultValue={currentSort || ""}
      onChange={handleChange}
      aria-label="Đơn hàng của cửa hàng"
      className="h-[39px] border border-gray-200 text-sm px-3 rounded bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-[rgb(232,184,0)]"
    >
      <option value="">Mới nhất</option>
      <option value="name-asc">Tên A-Z</option>
    </select>
  );
}
