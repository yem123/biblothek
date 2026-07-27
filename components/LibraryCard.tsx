"use client";

import Link from "next/link";
import Image from "next/image";
import type { PdfFileNode } from "@/lib/pdfs";
import { getThumbnail } from "@/lib/pdfs";
import { useVideoDuration, formatDuration } from "@/lib/useVideoDuration";
import { usePdfPageCount } from "@/lib/usePdfPageCount";

export default function LibraryCard({
  node,
  priority = false,
}: {
  node: PdfFileNode;
  priority?: boolean;
}) {
  const duration = useVideoDuration(node.mediaType === "video" ? node.url : "");
  const pages = usePdfPageCount(node.mediaType === "pdf" ? node.url : "");

  return (
    <Link
      href={`/lesson/${node.id}`}
      className={`group flex grow flex-col gap-2 ${
        node.mediaType === "pdf" ? "basis-28 max-w-36" : "basis-40 max-w-56"
      }`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-lg bg-gray-200 ${
          node.mediaType === "pdf" ? "aspect-3/4" : "aspect-video"
        }`}
      >
        <img
          src={getThumbnail(node, pages)}
          alt={node.name}
          className="object-cover transition-transform duration-200 group-hover:scale-105 absolute inset-0 w-full h-full"
        />

        {node.mediaType === "video" && duration !== null && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(duration)}
          </span>
        )}

        {node.mediaType === "pdf" && pages !== null && (
          <span className="absolute bottom-1.5 right-1.5 rounded bg-black/80 px-1.5 py-0.5 text-xs font-medium text-white">
            {`${pages} ${pages > 1 ? "pages" : "page"}`}
          </span>
        )}
      </div>

      <p className="line-clamp-2 text-xs font-medium text-gray-900">
        {node.name}
      </p>
    </Link>
  );
}
