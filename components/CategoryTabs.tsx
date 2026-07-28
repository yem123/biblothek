"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { PdfFolderNode } from "@/lib/pdfs";
import Link from "next/link";

export default function CategoryTabs({
  sections,
}: {
  sections: PdfFolderNode[];
}) {
  const [active, setActive] = useState(sections[0]?.path ?? "");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-100px 0px -70% 0px" },
    );

    for (const section of sections) {
      const el = document.getElementById(section.path);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections, pathname]);

  useEffect(() => {
    if (pathname === "/" && window.location.hash) {
      const id = window.location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      });
    }
  }, [pathname]);

  function handleClick(path: string) {
    if (pathname === "/") {
      document.getElementById(path)?.scrollIntoView({ behavior: "smooth" });
      setActive(path);
    } else {
      router.push(`/#${path}`);
    }
  }

  return (
    <div className="flex items-center border-b border-gray-200 bg-white">
      <div className="flex gap-2 overflow-x-auto px-6 py-3">
        {sections.map((section) => (
          <button
            key={section.path}
            onClick={() => handleClick(section.path)}
            className={`shrink-0 cursor-pointer rounded-md px-4 py-1.5 text-sm font-bold transition-colors ${
              pathname === "/" && active === section.path
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>

      <Link
        href="/offline"
        className={`ml-auto mr-6 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-bold transition-colors ${
          pathname === "/offline"
            ? "bg-gray-900 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        <DownloadIcon />
        Downloads
      </Link>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" strokeLinecap="round" />
    </svg>
  );
}
