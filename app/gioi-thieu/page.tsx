import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import Image from "next/image";
import { COMPANY_INFO } from "@/lib/data";

export const metadata: Metadata = {
  title: "Giới Thiệu",
  description:
    "Giới thiệu về Công ty TNHH Kỹ Thuật Xây Lắp Và Thương Mại Mặt Trời Việt NaSun – chuyên thi công sơn nước, trần thạch cao tại Vũng Tàu.",
  alternates: {
    canonical: "https://example.com/gioi-thieu",
  },
  openGraph: {
    title: "Giới Thiệu | Sơn Mặt Trời Việt NaSun – Vũng Tàu",
    description:
      "Giới thiệu về Công ty TNHH Kỹ Thuật Xây Lắp Và Thương Mại Mặt Trời Việt NaSun – chuyên thi công sơn nước tại Vũng Tàu.",
    url: "https://example.com/gioi-thieu",
    type: "website",
  },
};

const breadcrumbs = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu" },
];

export default function AboutPage() {
  return (
    <div className="bg-[rgb(246,247,249)] min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} />
      {/* Sticky header for about page */}
      <Header sticky />
      <div className="h-[134px]" /> {/* Spacer for sticky header (90px top + 44px nav) */}
      <main id="main" className="py-4 pb-16">
        <div className="max-w-[1320px] mx-auto px-4">
          {/* Breadcrumb bar */}
          <div className="bg-white flex items-center min-h-[60px] px-4 mb-4 rounded">
            <Breadcrumb items={breadcrumbs} />
          </div>

          {/* Content */}
          <div className="bg-white p-6 md:p-8 rounded">
            <h2 className="font-black text-[rgb(232,184,0)] text-2xl md:text-3xl mb-4">
              GIỚI THIỆU VỀ SƠN MẶT TRỜI VIỆT NASUN
            </h2>

            <p className="text-lg mb-5">
              Trước tiên,{" "}
              <strong className="font-bold">Công ty Sơn Mặt Trời Việt NaSun</strong>{" "}
              xin gửi lời cảm ơn chân thành đến quý khách hàng đã tin dùng và
              sử dụng sản phẩm – dịch vụ của chúng tôi trong suốt thời gian qua.
            </p>

            <h3 className="text-xl font-bold mb-3">
              1. Tổng quan về Công ty TNHH Kỹ Thuật Xây Lắp Và Thương Mại Mặt Trời Việt NaSun
            </h3>

            <p className="text-lg mb-5">
              Hiện nay, trên địa bàn Vũng Tàu – Bà Rịa Vũng Tàu có rất nhiều{" "}
              <strong className="text-red-600">
                đại lý phân phối sơn và Mặt Trời Việt NaSun
              </strong>{" "}
              là một trong những đại lý sơn uy tín mà bạn có thể tin tưởng
              tuyệt đối để sử dụng các sản phẩm: sơn Kova, sơn Dulux, sơn
              Jotun, sơn Nippon, sơn Esse…tại Vũng Tàu, chất lượng, sự uy tín
              và dịch vụ tốt chính là điểm ghi dấu ấn mạnh của chúng tôi đối
              với các khách hàng.
            </p>

            <div className="my-6">
              <Image
                src="https://storage.googleapis.com/download/storage/v1/b/prd-storytodesign.appspot.com/o/h2d-ext-asset%2F7eb4c984adfd4ed9ec0dcb4173cd8544079f50e9.jpg?generation=1777545116046526&alt=media"
                alt="Công ty Sơn Mặt Trời Việt NaSun Vũng Tàu"
                width={1020}
                height={322}
                className="w-full max-w-[1020px] mx-auto rounded"
              />
            </div>

            <h3 className="text-xl font-bold mb-3">
              2. Tầm nhìn của Sơn Mặt Trời Việt NaSun
            </h3>

            <p className="text-lg mb-5">
              Trên thị trường Việt Nam rộng mở,{" "}
              <strong className="text-red-600">Sơn Mặt Trời Việt NaSun</strong> có
              thể không phải là đại lý sơn lớn nhất nhưng chất lượng thì luôn
              dẫn đầu. Hàng nghìn khách hàng đã lựa chọn{" "}
              <strong className="text-red-600">Sơn Mặt Trời Việt NaSun</strong>{" "}
              để cùng nhau xây dựng nên những công trình tươi đẹp, sang trọng.
            </p>

            <h3 className="text-xl font-bold mb-3">
              3. Lĩnh vực hoạt động chính của Sơn nước Mặt Trời Việt NaSun
            </h3>

            <ul className="mb-5 space-y-2">
              {[
                "Cung cấp sản phẩm chính hãng từ các hãng sơn lớn: Kova, Jotun, Dulux, Esse, Nippon.",
                "Cung cấp chuyên thi công sơn nước. Nhận hoàn thiện nhà xây mới, sơn sửa làm mới nhà cũ.",
                "Cung cấp dịch vụ tư vấn và thi công sơn nước, trần vách thạch cao.",
                "Tiếp nhận thi công sơn nước các dự án chung cư cao tầng, văn phòng công ty, cửa hàng, bệnh viện, siêu thị, trường học, sân tennis…",
                "Xử lý sự cố tường nứt, ố vàng, đóng rong rêu, thấm dột…",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-lg">
                  <span className="text-[rgb(232,184,0)] font-bold mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="text-lg font-medium mb-5 uppercase">
              CÔNG TY TNHH KỸ THUẬT XÂY LẮP VÀ THƯƠNG MẠI MẶT TRỜI VIỆT NASUN
              CHUYÊN THI CÔNG SƠN NƯỚC, TRẦN THẠCH CAO, SƠN NHÀ, SỬA CHỬA
              NHÀ … CHÚNG TÔI TỰ HÀO CÓ ĐỘI NGŨ NHÂN VIÊN NHIỆT HUYẾT, TẬN
              TÂM, CHU ĐÁO ĐƯỢC ĐÀO TẠO CHUYÊN MÔN, BÀI BẢN… HÃY LIÊN HỆ
              NASUN PAINT ĐỂ ĐƯỢC TƯ VẤN VÀ PHỤC VỤ TỐT NHẤT.
            </p>

            {/* Contact info */}
            <div className="border-t border-gray-200 pt-6 mt-6 space-y-2 text-center text-lg">
              <p>
                <strong>Địa chỉ:</strong> {COMPANY_INFO.address}
              </p>
              <p>
                <strong>Điện thoại:</strong>{" "}
                <a href={`tel:${COMPANY_INFO.phone}`} className="text-[rgb(232,184,0)]">
                  {COMPANY_INFO.phone}
                </a>
              </p>
              <p>
                <strong>Hỗ trợ kỹ thuật:</strong>{" "}
                <a href={`tel:${COMPANY_INFO.phoneSupport}`} className="text-[rgb(232,184,0)]">
                  {COMPANY_INFO.phoneSupport}
                </a>
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a href={`https://${COMPANY_INFO.website}`} className="text-[rgb(232,184,0)]">
                  {COMPANY_INFO.website}
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
