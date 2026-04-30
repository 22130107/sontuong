import React from "react";
import Link from "next/link";
import { COMPANY_INFO } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="relative w-full mt-8" style={{ backgroundColor: "#1a3a8f" }}>
      {/* Main footer content */}
      <section className="w-full py-10">
        <div className="max-w-[1320px] mx-auto px-4">
          {/* Heading */}
          <div className="mb-8 border-b pb-4" style={{ borderBottomColor: "rgba(255,255,255,0.15)" }}>
            <h2
              className="font-bold uppercase text-[28px] leading-tight"
              style={{ color: "#e8b800", fontFamily: "Merriweather, sans-serif" }}
            >
              VỀ CHÚNG TÔI
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About text */}
            <div>
              <p className="text-white/80 leading-relaxed text-sm">
                CÔNG TY TNHH SƠN MẶT TRỜI VIỆT NASUN CHUYÊN THI CÔNG SƠN NƯỚC,
                TRẦN THẠCH CAO, SƠN NHÀ, SỬA CHỮA NHÀ... CHÚNG TÔI TỰ HÀO CÓ
                ĐỘI NGŨ NHÂN VIÊN NHIỆT HUYẾT, TẬN TÂM, CHU ĐÁO ĐƯỢC ĐÀO TẠO
                CHUYÊN MÔN, BÀI BẢN... HÃY LIÊN HỆ NASUN PAINT ĐỂ ĐƯỢC TƯ VẤN
                VÀ PHỤC VỤ TỐT NHẤT.
              </p>
            </div>

            {/* Contact info */}
            <div>
              <h3
                className="font-bold text-[18px] mb-4 pb-2 border-b"
                style={{ color: "#e8b800", borderBottomColor: "#e8b800" }}
              >
                THÔNG TIN LIÊN HỆ
              </h3>
              <ul className="space-y-3 text-sm text-white/85">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#e8b800" }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Đ/C: {COMPANY_INFO.address}</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "#e8b800" }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-yellow-400 transition-colors">
                    Điện thoại: {COMPANY_INFO.phone}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "#e8b800" }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a href={`tel:${COMPANY_INFO.phoneSupport}`} className="hover:text-yellow-400 transition-colors">
                    Hỗ trợ kỹ thuật: {COMPANY_INFO.phoneSupport}
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: "#e8b800" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={`https://${COMPANY_INFO.website}`} className="hover:text-yellow-400 transition-colors">
                    {COMPANY_INFO.website}
                  </a>
                </li>
              </ul>

              {/* Social links */}
              <div className="flex gap-2 mt-4">
                <a href={COMPANY_INFO.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#3b5998" }} aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a href={COMPANY_INFO.zalo} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#0068ff" }} aria-label="Zalo">Z</a>
                <a href={`mailto:${COMPANY_INFO.email}`}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#cc2222" }} aria-label="Email">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a href={`tel:${COMPANY_INFO.phone}`}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "#00b14f" }} aria-label="Gọi điện">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick links */}
            <div>
              <h3
                className="font-bold text-[18px] mb-4 pb-2 border-b"
                style={{ color: "#e8b800", borderBottomColor: "#e8b800" }}
              >
                LIÊN KẾT NHANH
              </h3>
              <ul className="space-y-2">
                {[
                  { label: "Trang chủ", href: "/" },
                  { label: "Giới thiệu", href: "/gioi-thieu" },
                  { label: "Sản phẩm", href: "/san-pham" },
                  { label: "Công trình", href: "/cong-trinh" },
                  { label: "Dịch vụ", href: "/dich-vu" },
                  { label: "Tin tức", href: "/tin-tuc" },
                  { label: "Liên hệ", href: "/lien-he" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/80 hover:text-yellow-400 transition-colors flex items-center gap-1.5 text-sm"
                    >
                      <span style={{ color: "#e8b800" }}>›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="py-3 border-t" style={{ backgroundColor: "#0f2460", borderTopColor: "rgba(255,255,255,0.1)" }}>
        <div className="max-w-[1320px] mx-auto px-4 text-center text-sm text-white/70">
          © {new Date().getFullYear()} {COMPANY_INFO.fullName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
