import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | NaSun Paint",
    template: "%s | Admin NaSun",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}
