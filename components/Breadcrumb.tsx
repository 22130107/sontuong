import React from "react";
import Link from "next/link";
import { BreadcrumbItem } from "@/lib/types";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="font-bold uppercase text-[rgb(34,34,34)] text-sm"
    >
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1">
            {index > 0 && (
              <span className="font-light opacity-35 mx-1">/</span>
            )}
            {item.href && index < items.length - 1 ? (
              <Link
                href={item.href}
                className="font-normal text-gray-500 hover:text-[rgb(232,184,0)] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[rgb(34,34,34)]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
