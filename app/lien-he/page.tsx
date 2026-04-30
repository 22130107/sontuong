import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import ContactPageClient from "./ContactPageClient";
import { Suspense } from "react";
import { COMPANY_INFO } from "@/lib/data";

export const metadata: Metadata = {
  title: "Liên Hệ",
  description:
    "Liên hệ Sơn Mặt Trời Việt NaSun tại Vũng Tàu để được tư vấn miễn phí.",
  alternates: {
    canonical: "https://example.com/lien-he",
  },
  openGraph: {
    title: "Liên Hệ | Sơn Mặt Trời Việt NaSun – Vũng Tàu",
    description:
      "Liên hệ Sơn Mặt Trời Việt NaSun tại Vũng Tàu để được tư vấn miễn phí.",
    url: "https://example.com/lien-he",
    type: "website",
  },
};

const breadcrumbs = [
  { label: "Trang chủ", href: "/" },
  { label: "Liên hệ" },
];

export default function ContactPage() {
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact form */}
            <div className="bg-white p-6 rounded">
              <h1 className="font-bold text-2xl text-[rgb(26,58,143)] uppercase mb-6">
                Gửi Yêu Cầu Tư Vấn
              </h1>
              <Suspense fallback={<div>Đang tải...</div>}>
                <ContactPageClient />
              </Suspense>
            </div>

            {/* Contact info + map */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded">
                <h2 className="font-bold text-xl text-[rgb(26,58,143)] uppercase mb-4">
                  Thông Tin Liên Hệ
                </h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgb(232,184,0)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[rgb(26,58,143)]">Địa chỉ</p>
                      <p className="text-gray-700">{COMPANY_INFO.address}</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgb(232,184,0)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[rgb(26,58,143)]">Điện thoại</p>
                      <a href={`tel:${COMPANY_INFO.phone}`} className="text-gray-700 hover:text-[rgb(232,184,0)]">
                        {COMPANY_INFO.phone}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgb(232,184,0)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[rgb(26,58,143)]">Hỗ trợ kỹ thuật</p>
                      <a href={`tel:${COMPANY_INFO.phoneSupport}`} className="text-gray-700 hover:text-[rgb(232,184,0)]">
                        {COMPANY_INFO.phoneSupport}
                      </a>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-[rgb(232,184,0)] flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-[rgb(26,58,143)]">Email</p>
                      <a href={`mailto:${COMPANY_INFO.email}`} className="text-gray-700 hover:text-[rgb(232,184,0)]">
                        {COMPANY_INFO.email}
                      </a>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Google Maps embed */}
              <div className="bg-white p-4 rounded">
                <h2 className="font-bold text-lg text-[rgb(26,58,143)] uppercase mb-3">
                  Bản Đồ
                </h2>
                <div className="rounded overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3921.0!2d107.0843!3d10.3459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDIwJzQ1LjIiTiAxMDfCsDA1JzAzLjUiRQ!5e0!3m2!1svi!2svn!4v1234567890"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bản đồ Sơn Mặt Trời Việt NaSun Vũng Tàu"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
