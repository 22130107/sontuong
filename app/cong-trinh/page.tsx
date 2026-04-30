import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Sidebar from "@/components/Sidebar";
import ProjectGrid from "@/components/ProjectGrid";
import { BreadcrumbSchema } from "@/components/SchemaMarkup";
import { PROJECTS } from "@/lib/data";

export const metadata: Metadata = {
  title: "Công Trình",
  description:
    "Các công trình thi công sơn nước tiêu biểu của Mặt Trời Việt NaSun tại Vũng Tàu: chung cư, biệt thự, nhà phố, văn phòng.",
  alternates: {
    canonical: "https://example.com/cong-trinh",
  },
  openGraph: {
    title: "Công Trình | Sơn Mặt Trời Việt NaSun – Vũng Tàu",
    description:
      "Các công trình thi công sơn nước tiêu biểu tại Vũng Tàu: chung cư, biệt thự, nhà phố.",
    url: "https://example.com/cong-trinh",
    type: "website",
  },
};

const breadcrumbs = [
  { label: "Trang chủ", href: "/" },
  { label: "Công trình" },
];

export default function ProjectsPage() {
  return (
    <div className="bg-[rgb(246,247,249)] min-h-screen">
      <BreadcrumbSchema items={breadcrumbs} />
      <Header />
      <main id="main" className="py-4 pb-16">
        <div className="max-w-[1350px] mx-auto px-4">
          <div className="flex gap-4">
            {/* Sidebar */}
            <aside className="hidden md:block w-[250px] flex-shrink-0 bg-white p-4 rounded self-start">
              <Sidebar />
            </aside>

            {/* Main content */}
            <div className="flex-1 bg-white p-4 rounded">
              {/* Breadcrumb */}
              <div className="flex items-center min-h-[50px] mb-4">
                <Breadcrumb items={breadcrumbs} />
              </div>

              <h1 className="font-bold text-2xl text-[rgb(26,58,143)] uppercase mb-6">
                Công Trình Thi Công Sơn Nước
              </h1>

              <ProjectGrid projects={PROJECTS} showTabs={false} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
