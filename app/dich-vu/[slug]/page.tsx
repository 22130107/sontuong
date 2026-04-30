import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import { SERVICES } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `https://example.com/dich-vu/${slug}`,
    },
    openGraph: {
      title: `${service.title} | Sơn Mặt Trời Việt NaSun – Vũng Tàu`,
      description: service.description,
      url: `https://example.com/dich-vu/${slug}`,
      type: "website",
      images: [{ url: service.image, alt: service.title }],
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Dịch vụ", href: "/dich-vu" },
    { label: service.title },
  ];

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
            <h1 className="text-2xl font-bold text-[rgb(26,58,143)] mb-4 uppercase">
              {service.title}
            </h1>

            <div className="relative aspect-[16/9] mb-6 rounded overflow-hidden">
              <Image
                src={service.image}
                alt={`${service.title} - Sơn nước Mặt Trời Việt NaSun Vũng Tàu`}
                fill
                className="object-cover"
                sizes="(max-width: 1320px) 100vw, 1320px"
                priority
              />
            </div>

            <p className="text-gray-700 text-lg leading-relaxed mb-4">
              {service.description}
            </p>

            {service.details && (
              <p className="text-gray-700 leading-relaxed mb-6">
                {service.details}
              </p>
            )}

            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
