import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import { NEWS } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tin Tức",
  description:
    "Tin tức, kinh nghiệm thi công sơn nước, hướng dẫn chọn sơn, thông tin về các thương hiệu sơn tại Vũng Tàu.",
  alternates: {
    canonical: "https://example.com/tin-tuc",
  },
  openGraph: {
    title: "Tin Tức | Sơn Mặt Trời Việt NaSun – Vũng Tàu",
    description:
      "Tin tức, kinh nghiệm thi công sơn nước, hướng dẫn chọn sơn tại Vũng Tàu.",
    url: "https://example.com/tin-tuc",
    type: "website",
  },
};

const breadcrumbs = [
  { label: "Trang chủ", href: "/" },
  { label: "Tin tức" },
];

export default function NewsPage() {
  return (
    <div className="bg-[rgb(246,247,249)] min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} />
      <Header />
      <main id="main" className="py-4 pb-16">
        <div className="max-w-[1320px] mx-auto px-4">
          {/* Breadcrumb */}
          <div className="bg-white flex items-center min-h-[60px] px-4 mb-4 rounded">
            <Breadcrumb items={breadcrumbs} />
          </div>

          <div className="bg-white p-6 rounded">
            <h1 className="font-bold text-2xl text-[rgb(26,58,143)] uppercase mb-6">
              Tin Tức & Kinh Nghiệm
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {NEWS.map((article) => (
                <Link
                  key={article.id}
                  href={`/tin-tuc/${article.slug}`}
                  className="group block rounded overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={`${article.title} - Sơn nước Mặt Trời Việt NaSun`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs text-[rgb(232,184,0)] font-medium uppercase">
                      {article.category}
                    </span>
                    <h2 className="font-bold text-[rgb(26,58,143)] text-base mt-1 mb-2 line-clamp-2 group-hover:text-[rgb(232,184,0)] transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>
                        {new Date(article.publishedAt).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="text-[rgb(232,184,0)] font-medium">
                        Đọc thêm →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
