import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import CartContent from "./CartContent";

export const metadata: Metadata = {
  title: "Giỏ Hàng",
  description: "Giỏ hàng của bạn tại Sơn Mặt Trời Việt NaSun Vũng Tàu.",
  robots: {
    index: false,
    follow: false,
  },
};

const breadcrumbs = [
  { label: "Trang chủ", href: "/" },
  { label: "Giỏ hàng" },
];

export default function CartPage() {
  return (
    <div className="bg-[rgb(246,247,249)] min-h-screen">
      <Header />
      <main id="main" className="py-4 pb-16">
        <div className="max-w-[1320px] mx-auto px-4">
          {/* Breadcrumb */}
          <div className="bg-white flex items-center min-h-[60px] px-4 mb-4 rounded">
            <Breadcrumb items={breadcrumbs} />
          </div>

          <CartContent />
        </div>
      </main>
      <Footer />
    </div>
  );
}
