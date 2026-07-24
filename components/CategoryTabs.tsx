"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { PdfFolderNode } from "@/lib/pdfs";

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
    <div className="border-b border-gray-200 bg-white">
      <div className="flex gap-2 overflow-x-auto px-6 py-3">
        {sections.map((section) => (
          <button
            key={section.path}
            onClick={() => handleClick(section.path)}
            className={`shrink-0 rounded-md px-4 py-1.5 text-sm font-bold transition-colors ${
              pathname === "/" && active === section.path
                ? "bg-gray-900 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {section.name}
          </button>
        ))}
      </div>
    </div>
  );
}
