import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="bg-[rgb(246,247,249)] min-h-screen">
      <Header />
      <main className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-8xl font-black text-[rgb(232,184,0)] mb-4">404</h1>
          <h2 className="text-2xl font-bold text-[rgb(26,58,143)] mb-4">
            Trang không tìm thấy
          </h2>
          <p className="text-gray-600 mb-8">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[rgb(232,184,0)] text-white font-bold rounded hover:bg-yellow-600 transition-colors"
          >
            ← Về trang chủ
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
