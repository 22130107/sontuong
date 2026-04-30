"use client";

import React, { useState } from "react";
import { COMPANY_INFO } from "@/lib/data";

interface ProductTabsProps {
  description: string;
}

export default function ProductTabs({ description }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"mo-ta" | "lien-he">("mo-ta");
  const [expanded, setExpanded] = useState(false);

  const fullText = `${COMPANY_INFO.name} chuyên cung cấp sơn giá rẻ, đại lý phân phối sơn giá rẻ, cửa hàng bán sơn nước giá rẻ và cung cấp các loại sơn hàng như sơn Kova, sơn Dulux, sơn Jotun, sơn Nippon, sơn Esse...tại Vũng Tàu.

Công ty TNHH kỹ thuật xây lắp và thương mại chuyên cung cấp ${COMPANY_INFO.name} đã và đang không ngừng cung cấp những sản phẩm sơn chính hãng, đúng chất lượng, đa dạng chủng loại cùng vô số các dịch vụ đi kèm hoàn hảo nhằm đem đến sự hài lòng cao nhất ở khách hàng cũng như đóng góp tích cực cho ngành công nghiệp sơn tại Việt Nam nói chung và Vũng Tàu nói riêng.

${description}`;

  const previewLength = 300;
  const showToggle = fullText.length > previewLength;
  const displayText = expanded || !showToggle ? fullText : fullText.slice(0, previewLength) + "...";

  return (
    <div className="bg-white">
      {/* Tab headers */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("mo-ta")}
          className={`px-6 py-3 text-sm font-bold uppercase transition-colors ${
            activeTab === "mo-ta"
              ? "border-b-2 border-[rgb(232,184,0)] text-[rgb(232,184,0)]"
              : "text-gray-600 hover:text-[rgb(232,184,0)]"
          }`}
        >
          Mô tả
        </button>
        <button
          onClick={() => setActiveTab("lien-he")}
          className={`px-6 py-3 text-sm font-bold uppercase transition-colors ${
            activeTab === "lien-he"
              ? "border-b-2 border-[rgb(232,184,0)] text-[rgb(232,184,0)]"
              : "text-gray-600 hover:text-[rgb(232,184,0)]"
          }`}
        >
          Thông tin liên hệ
        </button>
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === "mo-ta" && (
          <div>
            <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {displayText}
            </div>
            {showToggle && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 flex items-center gap-1 text-sm text-[rgb(232,184,0)] hover:underline mx-auto"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                {expanded ? "Thu gọn" : "Xem thêm"}
              </button>
            )}
          </div>
        )}

        {activeTab === "lien-he" && (
          <div className="text-sm text-gray-700 space-y-3">
            <div className="flex items-start gap-2">
              <svg className="w-4 h-4 text-[rgb(232,184,0)] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span><strong>Địa chỉ:</strong> {COMPANY_INFO.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[rgb(232,184,0)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>
                <strong>Điện thoại:</strong>{" "}
                <a href={`tel:${COMPANY_INFO.phone}`} className="text-[rgb(232,184,0)]">
                  {COMPANY_INFO.phone}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[rgb(232,184,0)] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>
                <strong>Hỗ trợ kỹ thuật:</strong>{" "}
                <a href={`tel:${COMPANY_INFO.phoneSupport}`} className="text-[rgb(232,184,0)]">
                  {COMPANY_INFO.phoneSupport}
                </a>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-[rgb(232,184,0)] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span>
                <strong>Website:</strong>{" "}
                <a href={`https://${COMPANY_INFO.website}`} className="text-[rgb(232,184,0)]">
                  {COMPANY_INFO.website}
                </a>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
