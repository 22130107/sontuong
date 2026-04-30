import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import { PROJECTS } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.description || `Công trình ${project.title} - Sơn nước Mặt Trời Việt NaSun Vũng Tàu`,
    alternates: {
      canonical: `https://example.com/cong-trinh/${slug}`,
    },
    openGraph: {
      title: `${project.title} | Sơn Mặt Trời Việt NaSun – Vũng Tàu`,
      description: project.description,
      url: `https://example.com/cong-trinh/${slug}`,
      type: "website",
      images: [{ url: project.image, alt: project.title }],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) notFound();

  const related = PROJECTS.filter(
    (p) => p.category === project.category && p.id !== project.id
  ).slice(0, 3);

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Công trình", href: "/cong-trinh" },
    { label: project.title },
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
              {project.title}
            </h1>

            <div className="relative aspect-[16/9] mb-6 rounded overflow-hidden">
              <Image
                src={project.image}
                alt={`${project.title} - Sơn nước Mặt Trời Việt NaSun Vũng Tàu`}
                fill
                className="object-cover"
                sizes="(max-width: 1320px) 100vw, 1320px"
                priority
              />
            </div>

            {project.description && (
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {project.description}
              </p>
            )}

            <Link
              href="/lien-he"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors"
            >
              Liên hệ tư vấn
            </Link>
          </div>

          {/* Related projects */}
          {related.length > 0 && (
            <div className="bg-white p-6 rounded mt-4">
              <h2 className="font-bold text-xl text-[rgb(26,58,143)] mb-4 uppercase">
                Công trình liên quan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/cong-trinh/${p.slug}`}
                    className="group relative overflow-hidden rounded block"
                  >
                    <div className="relative aspect-[585/400]">
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-[rgba(51,40,151,0.89)] p-3">
                        <h5 className="text-white text-sm font-medium text-center">
                          {p.title}
                        </h5>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
