import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Slider from "@/components/Slider";
import ProjectGrid from "@/components/ProjectGrid";
import ProductCard from "@/components/ProductCard";
import { getProductsFromDB, getProjectsFromDB, getSlidersFromDB } from "@/lib/db-data";

// Không cache trang chủ — luôn lấy data mới nhất từ DB
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Trang Chủ | Sơn Mặt Trời Việt NaSun – Vũng Tàu",
  description:
    "Sơn Mặt Trời Việt NaSun – Chuyên thi công sơn nước, trần thạch cao tại Vũng Tàu. Liên hệ để được tư vấn miễn phí.",
  alternates: { canonical: "https://example.com" },
  openGraph: {
    title: "Trang Chủ | Sơn Mặt Trời Việt NaSun – Vũng Tàu",
    description: "Chuyên thi công sơn nước, trần thạch cao tại Vũng Tàu. Liên hệ để được tư vấn miễn phí.",
    url: "https://example.com",
    type: "website",
  },
};

export default async function HomePage() {
  // Fetch từ DB, fallback về data tĩnh nếu DB chưa có dữ liệu
  const [products, projects, dbSliders] = await Promise.all([
    getProductsFromDB({ limit: 5 }),
    getProjectsFromDB({ limit: 6 }),
    getSlidersFromDB(),
  ]);

  const sliderImages = dbSliders.map((s) => ({ src: s.image, alt: s.alt_text }));
  return (
    <div className="bg-[rgb(246,247,249)] min-h-screen">
      <Header />
      <main id="main">
        {/* Hero Slider */}
        <Slider images={sliderImages} autoPlayInterval={5000} />

        {/* Featured Projects */}
        <section className="bg-white py-8">
          <div className="max-w-[1320px] mx-auto px-4">
            <h4
              className="text-center font-bold uppercase text-[rgb(253,239,10)] text-[17px] tracking-[0.85px] leading-[54px] mb-2"
              style={{
                backgroundImage:
                  'url("https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2Fcd4d669c1394924a08ccd738cf47c7fce2aee613.png?generation=1777545030334102&alt=media")',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                fontFamily: "Merriweather, sans-serif",
                textShadow: "rgb(153,153,153) 2px 2px 3px",
              }}
            >
              CÔNG TRÌNH TIÊU BIỂU
            </h4>
            <ProjectGrid projects={projects} showTabs={true} />
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-8">
          <div className="max-w-[1320px] mx-auto px-4">
            <h2
              className="text-center font-bold uppercase text-[rgb(26,58,143)] text-2xl mb-6"
              style={{ fontFamily: "Merriweather, sans-serif" }}
            >
              SẢN PHẨM NỔI BẬT
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="bg-white py-10">
          <div className="max-w-[1320px] mx-auto px-4">
            <h2
              className="text-center font-bold uppercase text-[rgb(26,58,143)] text-2xl mb-8"
              style={{ fontFamily: "Merriweather, sans-serif" }}
            >
              TẠI SAO CHỌN MẶT TRỜI VIỆT NASUN?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🏆",
                  title: "Sản phẩm chính hãng",
                  desc: "Phân phối trực tiếp từ các hãng sơn lớn: Dulux, Jotun, Nippon, Esse, Kova",
                },
                {
                  icon: "👷",
                  title: "Thợ lành nghề",
                  desc: "Đội ngũ thợ được đào tạo chuyên môn, kinh nghiệm nhiều năm trong nghề",
                },
                {
                  icon: "✅",
                  title: "Bảo hành công trình",
                  desc: "Cam kết bảo hành công trình, đảm bảo chất lượng sau thi công",
                },
                {
                  icon: "💰",
                  title: "Giá cả hợp lý",
                  desc: "Báo giá minh bạch, cạnh tranh, phù hợp với mọi ngân sách",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-[rgb(26,58,143)] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
