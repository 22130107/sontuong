import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import { PRODUCTS } from "@/lib/data";
import SortSelect from "./SortSelect";

export const metadata: Metadata = {
  title: "Sản Phẩm",
  description:
    "Danh sách sản phẩm sơn nước chính hãng tại Vũng Tàu. Giá tốt, chất lượng đảm bảo.",
  alternates: {
    canonical: "https://example.com/san-pham",
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Sản Phẩm | Sơn Mặt Trời Việt NaSun – Vũng Tàu",
    description:
      "Danh sách sản phẩm sơn nước chính hãng tại Vũng Tàu.",
    url: "https://example.com/san-pham",
    type: "website",
  },
};

const breadcrumbs = [
  { label: "Trang chủ", href: "/" },
  { label: "Sản phẩm" },
];

interface PageProps {
  searchParams: Promise<{ sort?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sort = params.sort;

  let products = [...PRODUCTS];

  if (sort === "name-asc") {
    products = products.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="bg-[rgb(246,247,249)] min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} />
      <Header />

      <main id="main">
        {/* Breadcrumb + sort bar */}
        <div className="flex items-center justify-between w-full max-w-[1320px] mx-auto px-4 mt-4 bg-white min-h-[60px]">
          <div className="flex-1">
            <Breadcrumb items={breadcrumbs} />
          </div>
          <div className="flex items-center gap-3 ml-4">
            <p className="text-sm whitespace-nowrap text-gray-700">
              Hiển thị tất cả {products.length} kết quả
            </p>
            <SortSelect currentSort={sort} />
          </div>
        </div>

        {/* Main layout: sidebar + product grid */}
        <div className="flex gap-0 w-full max-w-[1320px] mx-auto px-4 mt-4 mb-16">
          {/* Sidebar */}
          <aside className="hidden md:block w-[250px] flex-shrink-0 bg-white pt-4 pr-4 pb-4 pl-0 self-start">
            <Sidebar />
          </aside>

          {/* Products area */}
          <div className="flex-1 bg-white p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[10px]">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
