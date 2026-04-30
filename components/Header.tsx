"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { COMPANY_INFO, LOGO_URL, CART_ICON_URL, PRODUCTS } from "@/lib/data";

// NaSun brand colors
const BLUE = "#1a3a8f";
const GOLD = "#e8b800";

// Dropdown items — unique product names
const PRODUCT_DROPDOWN = Array.from(
  new Map(PRODUCTS.map((p) => [p.name, p])).values()
).map((p) => ({ label: p.name, href: `/san-pham/${p.slug}`, thumbnail: p.thumbnail }));

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Sản phẩm", href: "/san-pham", dropdown: PRODUCT_DROPDOWN },
  { label: "Công trình", href: "/cong-trinh" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Tin tức", href: "/tin-tuc" },
  { label: "Liên hệ", href: "/lien-he" },
];

// Paint roller icon (matches design)
function PaintIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0 text-[#1a3a8f]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 4V3c0-.55-.45-1-1-1H5c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V6h1v4H9c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-9h9V4h-3z"/>
    </svg>
  );
}

export default function Header({ sticky = false }: { sticky?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!sticky) return;
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sticky]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`w-full z-30 ${sticky ? "fixed top-0 left-0 right-0" : "relative"} ${
        scrolled ? "shadow-lg" : ""
      }`}
      style={{ backgroundColor: BLUE }}
    >
      {/* ── Top bar: logo + contact + search ── */}
      <div className="h-[72px]" style={{ backgroundColor: BLUE }}>
        <div className="flex items-center justify-between w-full max-w-[1320px] mx-auto px-4 h-full">
          {/* Logo */}
          <div className="w-[180px] md:w-[260px] mr-4 flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src={LOGO_URL}
                alt="Sơn Mặt Trời Việt NaSun – Nhà phân phối sơn cao cấp"
                width={260}
                height={80}
                className="max-h-[58px] w-auto object-contain"
                priority
              />
            </Link>
          </div>

          {/* Contact info */}
          <div className="hidden lg:flex items-center gap-6 flex-1">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(COMPANY_INFO.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: GOLD }}
            >
              <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{COMPANY_INFO.address}</span>
            </a>
            <a
              href={`tel:${COMPANY_INFO.phone}`}
              className="flex items-center gap-1.5 text-sm font-bold"
              style={{ color: GOLD }}
            >
              <svg className="w-4 h-4 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>{COMPANY_INFO.phone} – {COMPANY_INFO.phoneSupport}</span>
            </a>
          </div>

          {/* Search */}
          <div className="hidden md:block w-[260px] ml-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập từ khóa tìm kiếm..."
                className="w-full h-[40px] bg-white/10 text-white placeholder-white/60 text-sm px-3 pr-10 rounded border border-white/30 focus:outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-yellow-400"
                aria-label="Tìm kiếm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden ml-4 p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Mở menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Navigation bar ── */}
      <nav
        className="hidden md:flex items-center min-h-[44px] border-t"
        style={{ backgroundColor: "#142e75", borderTopColor: "rgba(255,255,255,0.15)" }}
      >
        <div className="flex items-center justify-between w-full max-w-[1320px] mx-auto px-4">
          <ul className="flex items-center flex-1">
            {NAV_ITEMS.map((item) => {
              if (item.dropdown) {
                // ── Dropdown item ──
                return (
                  <li
                    key={item.href}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      href={item.href}
                      className={`inline-flex items-center gap-1 font-bold uppercase text-[15px] tracking-wide px-3 py-[10px] transition-colors ${
                        isActive(item.href)
                          ? "text-yellow-400 border-b-2 border-yellow-400"
                          : "text-white hover:text-yellow-400"
                      }`}
                    >
                      {item.label}
                      {/* Chevron */}
                      <svg
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>

                    {/* Dropdown panel */}
                    {dropdownOpen && (
                      <div
                        className="absolute left-0 top-full z-50 bg-white shadow-xl rounded-b border-t-2 min-w-[220px]"
                        style={{ borderTopColor: GOLD }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <ul>
                          {item.dropdown.map((sub, i) => (
                            <li
                              key={sub.href}
                              className={`border-b last:border-0`}
                              style={{ borderBottomColor: "#f0f0f0" }}
                            >
                              <Link
                                href={sub.href}
                                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-[#1a3a8f] transition-colors text-[15px] font-medium"
                                onClick={() => setDropdownOpen(false)}
                              >
                                <PaintIcon />
                                <span>{sub.label}</span>
                              </Link>
                            </li>
                          ))}
                          {/* View all */}
                          <li className="border-t" style={{ borderTopColor: "#e8b800" }}>
                            <Link
                              href="/san-pham"
                              className="flex items-center justify-center gap-1 px-4 py-2.5 text-sm font-bold text-white transition-colors"
                              style={{ backgroundColor: "#1a3a8f" }}
                              onClick={() => setDropdownOpen(false)}
                            >
                              Xem tất cả sản phẩm
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                );
              }

              // ── Regular nav item ──
              return (
                <li key={item.href} className="relative">
                  <Link
                    href={item.href}
                    className={`inline-flex items-center font-bold uppercase text-[15px] tracking-wide px-3 py-[10px] transition-colors ${
                      isActive(item.href)
                        ? "text-yellow-400 border-b-2 border-yellow-400"
                        : "text-white hover:text-yellow-400"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Cart button */}
          <Link
            href="/gio-hang"
            className="flex items-center gap-2 font-bold uppercase text-sm px-4 py-2 rounded transition-colors hover:opacity-90 flex-shrink-0"
            style={{ backgroundColor: GOLD, color: "#1a1a1a" }}
          >
            <span>Giỏ hàng</span>
            <span className="relative">
              <Image
                src={CART_ICON_URL}
                alt="Giỏ hàng"
                width={24}
                height={24}
                className="brightness-0"
              />
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: "#cc2222" }}
                >
                  {totalItems}
                </span>
              )}
            </span>
          </Link>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t" style={{ backgroundColor: "#142e75", borderTopColor: "rgba(255,255,255,0.2)" }}>
          {/* Mobile search */}
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm..."
                className="w-full h-10 bg-white/10 text-white placeholder-white/60 text-sm px-3 pr-10 rounded border border-white/30 focus:outline-none"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70" aria-label="Tìm kiếm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </form>
          </div>

          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                {item.dropdown ? (
                  <>
                    {/* Sản phẩm toggle */}
                    <button
                      onClick={() => setMobileProductOpen(!mobileProductOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 font-bold uppercase text-sm border-b text-white"
                      style={{ borderBottomColor: "rgba(255,255,255,0.1)" }}
                    >
                      <span style={{ color: isActive(item.href) ? GOLD : undefined }}>
                        {item.label}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${mobileProductOpen ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {mobileProductOpen && (
                      <ul style={{ backgroundColor: "#0f2460" }}>
                        {item.dropdown.map((sub) => (
                          <li key={sub.href}>
                            <Link
                              href={sub.href}
                              onClick={() => { setMobileMenuOpen(false); setMobileProductOpen(false); }}
                              className="flex items-center gap-3 px-6 py-2.5 text-sm text-white/80 hover:text-yellow-400 border-b"
                              style={{ borderBottomColor: "rgba(255,255,255,0.07)" }}
                            >
                              <PaintIcon />
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 font-bold uppercase text-sm border-b ${
                      isActive(item.href) ? "text-yellow-400" : "text-white hover:text-yellow-400"
                    }`}
                    style={{ borderBottomColor: "rgba(255,255,255,0.1)" }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li>
              <Link
                href="/gio-hang"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 font-bold uppercase text-sm text-white"
              >
                <span>Giỏ hàng</span>
                {totalItems > 0 && (
                  <span className="text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" style={{ backgroundColor: "#cc2222" }}>
                    {totalItems}
                  </span>
                )}
              </Link>
            </li>
          </ul>

          {/* Mobile contact */}
          <div className="px-4 py-3 text-sm" style={{ color: GOLD }}>
            <p className="mb-1">📍 {COMPANY_INFO.address}</p>
            <p>📞 {COMPANY_INFO.phone} – {COMPANY_INFO.phoneSupport}</p>
          </div>
        </div>
      )}
    </header>
  );
}
