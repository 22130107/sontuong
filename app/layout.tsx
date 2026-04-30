import type { Metadata } from "next";
import { Roboto, Merriweather } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { LocalBusinessSchema, WebsiteSchema } from "@/components/SchemaMarkup";

const roboto = Roboto({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
  variable: "--font-roboto",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-merriweather",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: {
    default: "Sơn Mặt Trời Việt NaSun – Vũng Tàu | Thi Công Sơn Nước Chuyên Nghiệp",
    template: "%s | Sơn Mặt Trời Việt NaSun – Vũng Tàu",
  },
  description:
    "Chuyên thi công sơn nước, trần thạch cao tại Vũng Tàu. Liên hệ để được tư vấn miễn phí.",
  keywords: [
    "sơn nước Vũng Tàu",
    "thi công sơn Vũng Tàu",
    "sơn Dulux Vũng Tàu",
    "sơn Jotun Vũng Tàu",
    "Mặt Trời Việt NaSun",
  ],
  authors: [{ name: "Sơn Mặt Trời Việt NaSun" }],
  creator: "Sơn Mặt Trời Việt NaSun",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://example.com",
    siteName: "Sơn Mặt Trời Việt NaSun",
    title: "Sơn Mặt Trời Việt NaSun – Vũng Tàu",
    description:
      "Chuyên thi công sơn nước, trần thạch cao tại Vũng Tàu. Liên hệ để được tư vấn miễn phí.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sơn Mặt Trời Việt NaSun Vũng Tàu",
      },
    ],
  },
  alternates: {
    canonical: "https://example.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${roboto.variable} ${merriweather.variable}`}>
      <head>
        <LocalBusinessSchema />
        <WebsiteSchema />
      </head>
      <body className={roboto.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
