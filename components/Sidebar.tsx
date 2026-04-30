import React from "react";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS, NEWS } from "@/lib/data";

const HEADER_BG =
  "https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F4352ca4b5b2bc80b10fff0d55adb3e66b995e588.png?generation=1777545153297107&alt=media";

const PRODUCT_CATEGORIES = [
  { label: "Sơn nước", href: "/san-pham" },
  { label: "Sơn chống thấm", href: "/san-pham" },
  { label: "Sơn nội thất", href: "/san-pham" },
  { label: "Sơn ngoại thất", href: "/san-pham" },
  { label: "Trần thạch cao", href: "/dich-vu/thi-cong-tran-thach-cao" },
];

export default function Sidebar() {
  const recentProducts = PRODUCTS.slice(0, 5);
  const recentNews = NEWS.slice(0, 5);

  return (
    <aside className="space-y-6">
      {/* Product categories */}
      <div>
        <div
          className="bg-no-repeat table font-semibold relative uppercase w-full h-10 text-white text-[15px] tracking-[0.75px] leading-[37px] pl-4 mb-2"
          style={{ backgroundImage: `url("${HEADER_BG}")` }}
        >
          Danh mục sản phẩm
        </div>
        <ul className="divide-y divide-gray-100">
          {PRODUCT_CATEGORIES.map((cat) => (
            <li key={cat.label}>
              <Link
                href={cat.href}
                className="flex items-center gap-1 text-[rgb(45,52,127)] py-2 hover:text-[rgb(232,184,0)] transition-colors text-sm"
              >
                <span className="text-[rgb(232,184,0)] font-bold">›</span>
                {cat.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent products */}
      <div>
        <div
          className="bg-no-repeat table font-semibold relative uppercase w-full h-10 text-white text-[15px] tracking-[0.75px] leading-[37px] pl-4 mb-2"
          style={{ backgroundImage: `url("${HEADER_BG}")` }}
        >
          Sản phẩm mới
        </div>
        <ul className="divide-y divide-gray-100">
          {recentProducts.map((product) => (
            <li key={product.id} className="py-2">
              <Link
                href={`/san-pham/${product.slug}`}
                className="flex items-start gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="relative w-[60px] h-[60px] flex-shrink-0">
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="60px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[rgb(45,52,127)] text-sm font-medium line-clamp-2 leading-tight">
                    {product.name.toUpperCase()}
                  </p>
                  <p className="text-xs mt-1">
                    Giá:{" "}
                    <span className="font-bold text-red-600">{product.price}</span>
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent news */}
      <div>
        <div
          className="bg-no-repeat table font-semibold relative uppercase w-full h-10 text-white text-[15px] tracking-[0.75px] leading-[37px] pl-4 mb-2"
          style={{ backgroundImage: `url("${HEADER_BG}")` }}
        >
          Bài viết mới
        </div>
        <ul className="divide-y divide-gray-100">
          {recentNews.map((article) => (
            <li key={article.id} className="py-2">
              <Link
                href={`/tin-tuc/${article.slug}`}
                className="flex items-start gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="relative w-[45px] h-[45px] flex-shrink-0">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="45px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[rgb(45,52,127)] text-sm line-clamp-2 leading-tight">
                    {article.title}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
