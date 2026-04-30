"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Project, ProjectCategory } from "@/lib/types";

const TABS: { label: string; value: ProjectCategory }[] = [
  { label: "CHUNG CƯ", value: "chung-cu" },
  { label: "BIỆT THỰ", value: "biet-thu" },
  { label: "NHÀ PHỐ", value: "nha-pho" },
  { label: "PHÒNG BẾP", value: "phong-bep" },
  { label: "PHÒNG NGỦ", value: "phong-ngu" },
  { label: "PHÒNG TRẺ EM", value: "phong-tre-em" },
];

interface ProjectGridProps {
  projects: Project[];
  showTabs?: boolean;
}

export default function ProjectGrid({ projects, showTabs = true }: ProjectGridProps) {
  const [activeTab, setActiveTab] = useState<ProjectCategory>("chung-cu");

  const filtered = showTabs
    ? projects.filter((p) => p.category === activeTab)
    : projects;

  // If no projects in active tab, show all
  const displayProjects = filtered.length > 0 ? filtered : projects;

  return (
    <div className="w-full">
      {showTabs && (
        <ul className="flex flex-wrap items-center justify-center mb-4 border-b-2 border-[rgb(232,184,0)]">
          {TABS.map((tab) => (
            <li key={tab.value} className="mr-2 mb-0">
              <button
                onClick={() => setActiveTab(tab.value)}
                className={`px-6 py-2 text-sm font-medium text-white transition-colors ${
                  activeTab === tab.value
                    ? "bg-[rgb(232,184,0)]"
                    : "bg-[rgb(26,58,143)] hover:bg-[rgb(232,184,0)]"
                }`}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
        {displayProjects.map((project) => (
          <Link
            key={project.id}
            href={`/cong-trinh/${project.slug}`}
            className="group relative overflow-hidden block"
          >
            <div className="relative aspect-[585/400]">
              <Image
                src={project.image}
                alt={`${project.title} - Sơn nước Mặt Trời Việt NaSun Vũng Tàu`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-[rgba(51,40,151,0.89)] p-3">
                <h5 className="text-white text-sm font-medium text-center leading-tight">
                  {project.title}
                </h5>
                <div className="w-8 h-0.5 bg-white/30 mx-auto mt-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
