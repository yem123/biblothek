"use client";

import Image from "next/image";
import type { PdfFileNode } from "@/lib/pdfs";
import { getThumbnail } from "@/lib/pdfs";

export default function PlaylistVideoCard({ node }: { node: PdfFileNode }) {
  return (
    <a
      href={node.url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex grow flex-col gap-2 basis-40 max-w-56"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-200">
        <Image
          src={getThumbnail(node)}
          alt={node.name}
          fill
          unoptimized
          className="object-cover transition-transform duration-200 group-hover:scale-105"
          sizes="(max-width: 768px) 25vw, 140px"
        />

        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="rounded-full bg-white/90 p-3 shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-black"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      <p className="line-clamp-2 text-xs font-medium text-gray-900">
        {node.name}
      </p>
    </a>
  );
}
