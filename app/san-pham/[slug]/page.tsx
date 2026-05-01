import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import ProductCard from "@/components/ProductCard";
import { BreadcrumbSchema, ProductSchema } from "@/components/SchemaMarkup";
import { COMPANY_INFO } from "@/lib/data";
import { getProductsFromDB, getProductBySlugFromDB } from "@/lib/db-data";
import ProductGallery from "./ProductGallery";
import ProductTabs from "./ProductTabs";
import BuyNowButton from "./BuyNowButton";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Force dynamic rendering - không build static
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlugFromDB(slug);
  if (!product) return {};

  return {
    title: product.name,
    description: `${product.name} chính hãng tại Vũng Tàu. ${product.description}`,
    alternates: {
      canonical: `https://example.com/san-pham/${slug}`,
    },
    openGraph: {
      title: `${product.name} | Sơn Mặt Trời Việt NaSun – Vũng Tàu`,
      description: product.description,
      url: `https://example.com/san-pham/${slug}`,
      type: "website",
      images: [{ url: product.thumbnail, alt: product.name }],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlugFromDB(slug);
  if (!product) notFound();

  const allProducts = await getProductsFromDB();
  const related = allProducts.filter((p) => p.id !== product.id).slice(0, 4);

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Sản phẩm", href: "/san-pham" },
    { label: product.name },
  ];

  return (
    <div className="bg-[rgb(246,247,249)] min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} />
      <ProductSchema
        name={product.name}
        description={product.description}
        image={product.thumbnail}
        brand={product.name}
        url={`/san-pham/${slug}`}
      />
      <Header />

      <main id="main" className="py-4 pb-16">
        <div className="max-w-[1320px] mx-auto px-4">
          {/* Breadcrumb bar */}
          <div className="bg-white flex items-center min-h-[50px] px-4 mb-4">
            <Breadcrumb items={breadcrumbs} />
          </div>

          {/* ── TOP SECTION: 3 columns ── */}
          <div className="bg-white p-5 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_280px] gap-6">

              {/* Col 1 – Image gallery */}
              <ProductGallery images={product.images} name={product.name} />

              {/* Col 2 – Info */}
              <div>
                <h1 className="text-[22px] font-bold text-gray-800 mb-2 uppercase">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mb-3">
                  <span className="text-sm text-gray-600">Giá: </span>
                  <span className="font-bold text-red-600 text-xl">{product.price}</span>
                </div>

                {/* Short description */}
                <p className="text-sm text-gray-700 leading-relaxed mb-5">
                  {COMPANY_INFO.name} chuyên cung cấp sơn giá rẻ, đại lý phân phối sơn giá rẻ,
                  cửa hàng bán sơn nước giá rẻ và cung cấp các loại sơn hàng như sơn Kova, sơn
                  Dulux, sơn Jotun, sơn Nippon, sơn Esse...tại Vũng Tàu.
                </p>

                {/* Phone + Zalo buttons */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <a
                    href={`tel:${COMPANY_INFO.phone}`}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[rgb(232,184,0)] text-white font-bold rounded text-sm hover:bg-yellow-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    {COMPANY_INFO.phone}
                  </a>
                  <a
                    href={COMPANY_INFO.zalo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-[rgb(26,58,143)] text-white font-bold rounded text-sm hover:opacity-90 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z"/>
                    </svg>
                    Chat Zalo
                  </a>
                </div>

                {/* Buy now button */}
                <BuyNowButton product={product} />

                {/* Specs table */}
                {product.specs && (
                  <table className="w-full text-sm border-collapse border border-gray-200">
                    <tbody>
                      {Object.entries(product.specs).map(([key, val], i) => (
                        <tr key={key} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="py-2 px-3 font-medium text-gray-600 w-2/5 border border-gray-200">
                            {key}
                          </td>
                          <td className="py-2 px-3 text-gray-800 border border-gray-200">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Col 3 – Trust box */}
              <div>
                <div className="bg-[rgb(26,58,143)] text-white text-center py-2 px-3 font-bold text-sm uppercase mb-0">
                  KHÁCH HÀNG LỰA CHỌN {COMPANY_INFO.name.toUpperCase()}
                </div>
                <div className="border border-gray-200">
                  {[
                    {
                      icon: (
                        <svg className="w-8 h-8 text-[rgb(232,184,0)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      ),
                      title: "UY TÍN HÀNG ĐẦU",
                      desc: "Một thương hiệu sơn nước\nDanh tiếng tại Vũng Tàu",
                    },
                    {
                      icon: (
                        <svg className="w-8 h-8 text-[rgb(232,184,0)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      ),
                      title: "THI CÔNG NHANH CHÓNG TRONG NỘI THÀNH",
                      desc: "Tận tâm, nhiệt tình, chu đáo",
                    },
                    {
                      icon: (
                        <svg className="w-8 h-8 text-[rgb(232,184,0)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      ),
                      title: "SẢN PHẨM ĐA DẠNG",
                      desc: "Luôn cập nhật\nnhững sản phẩm sơn mới",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 border-b border-gray-100 last:border-0">
                      <div className="flex-shrink-0 bg-gray-900 p-2 rounded">
                        {item.icon}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-gray-800 uppercase leading-tight">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 whitespace-pre-line">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Benefits list */}
                <ul className="mt-3 space-y-1">
                  {[
                    "Miễn phí tư vấn thiết kế, thi công sơn nước tại Vũng Tàu",
                    "Xưởng thi công nội thất ngoại thất giá rẻ uy tín Vũng Tàu",
                    "Chăm sóc khách hàng trọn đời",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-green-700">
                      <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ── TABS: Mô tả / Thông tin liên hệ ── */}
          <ProductTabs description={product.description} />

          {/* ── RELATED PRODUCTS ── */}
          {related.length > 0 && (
            <div className="bg-white p-5 mt-4">
              <h2
                className="inline-block font-bold uppercase text-white text-sm px-4 py-1.5 mb-4"
                style={{
                  background: "linear-gradient(135deg, rgb(232,184,0) 0%, rgb(26,58,143) 100%)",
                  clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
                  paddingRight: "24px",
                }}
              >
                SẢN PHẨM TƯƠNG TỰ
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
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
