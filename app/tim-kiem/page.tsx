import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, NEWS, SERVICES } from "@/lib/data";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Kết Quả Tìm Kiếm",
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() || "";

  const matchedProducts = query
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    : [];

  const matchedNews = query
    ? NEWS.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query)
      )
    : [];

  const matchedServices = query
    ? SERVICES.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      )
    : [];

  const totalResults =
    matchedProducts.length + matchedNews.length + matchedServices.length;

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Tìm kiếm" },
  ];

  return (
    <div className="bg-[rgb(246,247,249)] min-h-screen">
      <Header />
      <main id="main" className="py-4 pb-16">
        <div className="max-w-[1320px] mx-auto px-4">
          {/* Breadcrumb */}
          <div className="bg-white flex items-center min-h-[60px] px-4 mb-4 rounded">
            <Breadcrumb items={breadcrumbs} />
          </div>

          <div className="bg-white p-6 rounded">
            <h1 className="font-bold text-2xl text-[rgb(26,58,143)] mb-2">
              Kết quả tìm kiếm
            </h1>
            {query && (
              <p className="text-gray-600 mb-6">
                Tìm thấy <strong>{totalResults}</strong> kết quả cho từ khóa:{" "}
                <strong className="text-[rgb(232,184,0)]">&ldquo;{params.q}&rdquo;</strong>
              </p>
            )}

            {!query && (
              <p className="text-gray-500">Vui lòng nhập từ khóa để tìm kiếm.</p>
            )}

            {/* Products */}
            {matchedProducts.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-lg text-[rgb(26,58,143)] uppercase mb-4 border-b border-gray-200 pb-2">
                  Sản phẩm ({matchedProducts.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {matchedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {matchedServices.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-lg text-[rgb(26,58,143)] uppercase mb-4 border-b border-gray-200 pb-2">
                  Dịch vụ ({matchedServices.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {matchedServices.map((s) => (
                    <Link
                      key={s.id}
                      href={`/dich-vu/${s.slug}`}
                      className="flex gap-3 p-3 border border-gray-100 rounded hover:shadow-sm transition-shadow"
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                        <Image src={s.image} alt={s.title} fill className="object-cover" sizes="64px" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[rgb(26,58,143)] text-sm">{s.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{s.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* News */}
            {matchedNews.length > 0 && (
              <div>
                <h2 className="font-bold text-lg text-[rgb(26,58,143)] uppercase mb-4 border-b border-gray-200 pb-2">
                  Tin tức ({matchedNews.length})
                </h2>
                <div className="space-y-3">
                  {matchedNews.map((a) => (
                    <Link
                      key={a.id}
                      href={`/tin-tuc/${a.slug}`}
                      className="flex gap-3 p-3 border border-gray-100 rounded hover:shadow-sm transition-shadow"
                    >
                      <div className="relative w-20 h-16 flex-shrink-0 rounded overflow-hidden">
                        <Image src={a.image} alt={a.title} fill className="object-cover" sizes="80px" />
                      </div>
                      <div>
                        <h3 className="font-medium text-[rgb(26,58,143)] text-sm">{a.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{a.excerpt}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {query && totalResults === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Không tìm thấy kết quả nào cho từ khóa &ldquo;{params.q}&rdquo;
                </p>
                <Link
                  href="/san-pham"
                  className="text-[rgb(232,184,0)] underline"
                >
                  Xem tất cả sản phẩm
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
