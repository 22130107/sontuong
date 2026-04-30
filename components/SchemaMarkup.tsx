import React from "react";
import { COMPANY_INFO } from "@/lib/data";

interface LocalBusinessSchemaProps {
  type?: "LocalBusiness";
}

export function LocalBusinessSchema(_props: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.fullName,
    url: `https://${COMPANY_INFO.website}`,
    telephone: COMPANY_INFO.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.address,
      addressLocality: "TP Vũng Tàu",
      addressRegion: "Bà Rịa - Vũng Tàu",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: COMPANY_INFO.lat,
      longitude: COMPANY_INFO.lng,
    },
    openingHours: "Mo-Sa 07:30-17:30",
    priceRange: "$$",
    description:
      "Chuyên thi công sơn nước, trần thạch cao, sơn nhà, sửa chữa nhà tại Vũng Tàu. Phân phối sơn Dulux, Jotun, Nippon, Esse, Kova chính hãng.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebsiteSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: COMPANY_INFO.name,
    url: `https://${COMPANY_INFO.website}`,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `https://${COMPANY_INFO.website}/tim-kiem?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: { label: string; href?: string }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href
        ? `https://${COMPANY_INFO.website}${item.href}`
        : undefined,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  brand: string;
  url: string;
}

export function ProductSchema({
  name,
  description,
  image,
  brand,
  url,
}: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    brand: {
      "@type": "Brand",
      name: brand,
    },
    url: `https://${COMPANY_INFO.website}${url}`,
    offers: {
      "@type": "Offer",
      priceCurrency: "VND",
      price: "0",
      priceSpecification: {
        "@type": "PriceSpecification",
        description: "Liên hệ để biết giá",
      },
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: COMPANY_INFO.name,
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ArticleSchemaProps {
  title: string;
  image: string;
  publishedAt: string;
  url: string;
}

export function ArticleSchema({
  title,
  image,
  publishedAt,
  url,
}: ArticleSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    image,
    datePublished: publishedAt,
    author: {
      "@type": "Organization",
      name: COMPANY_INFO.name,
    },
    publisher: {
      "@type": "Organization",
      name: COMPANY_INFO.name,
      logo: {
        "@type": "ImageObject",
        url: `https://${COMPANY_INFO.website}/logo.jpg`,
      },
    },
    url: `https://${COMPANY_INFO.website}${url}`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
