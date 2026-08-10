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

        {node.duration && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {node.duration}
          </span>
        )}
      </div>

      <p className="line-clamp-2 text-xs font-medium text-gray-900">
        {node.name}
      </p>
    </a>
  );
}
