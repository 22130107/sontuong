import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import { getServicesFromDB } from "@/lib/db-data";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Dịch Vụ",
  description: "Dịch vụ thi công sơn nước, sơn nhà mới, sơn sửa nhà cũ, thi công trần thạch cao, xử lý tường nứt thấm dột tại Vũng Tàu.",
  alternates: { canonical: "https://example.com/dich-vu" },
  openGraph: {
    title: "Dịch Vụ | Sơn Mặt Trời Việt NaSun – Vũng Tàu",
    description: "Dịch vụ thi công sơn nước, trần thạch cao, xử lý tường nứt thấm dột tại Vũng Tàu.",
    url: "https://example.com/dich-vu",
    type: "website",
  },
};

const breadcrumbs = [
  { label: "Trang chủ", href: "/" },
  { label: "Dịch vụ" },
];

export default async function ServicesPage() {
  const services = await getServicesFromDB();
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
              Dịch Vụ Thi Công Sơn Nước
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={`/dich-vu/${service.slug}`}
                  className="group block rounded overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[585/400] overflow-hidden">
                    <Image
                      src={service.image}
                      alt={`${service.title} - Sơn nước Mặt Trời Việt NaSun Vũng Tàu`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="font-bold text-[rgb(26,58,143)] text-lg mb-2 group-hover:text-[rgb(232,184,0)] transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {service.description}
                    </p>
                    <span className="inline-block mt-3 text-[rgb(232,184,0)] text-sm font-medium">
                      Xem chi tiết →
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/lien-he"
                className="inline-flex items-center gap-2 px-8 py-3 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors text-lg"
              >
                Liên hệ tư vấn
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
