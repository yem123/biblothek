import Link from "next/link";
import Image from "next/image";
import type { PdfFolderNode } from "@/lib/pdfs";
import { collectThumbnails, collectCoverType, countFiles } from "@/lib/pdfs";

export default function PlaylistCard({
  node,
  priority = false,
}: {
  node: PdfFolderNode;
  priority?: boolean;
}) {
  const thumbs = collectThumbnails(node, 3);
  const count = countFiles(node);
  const coverType = collectCoverType(node);
  const [cover, ...behind] = thumbs;

  const isPdf = coverType === "pdf";
  const aspectClass = isPdf ? "aspect-[3/4]" : "aspect-video";

  return (
    <Link
      href={`/folder/${node.path}`}
      className={`group flex flex-col gap-2 pt-3 ${
        isPdf ? "w-26 sm:w-32 md:w-36" : "w-40 sm:w-48"
      }`}
    >
      <div className={`relative w-full ${aspectClass}`}>
        {behind
          .slice()
          .reverse()
          .map((thumb, reversedIndex) => {
            const i = behind.length - 1 - reversedIndex;
            const offsetPercent = (i + 1) * 6;
            const scale = 1 - (i + 1) * 0.08;

            return (
              <div
                key={i}
                className="absolute inset-0 overflow-hidden rounded-xl bg-gray-300 shadow-sm"
                style={{
                  transform: `translateY(-${offsetPercent}%) scale(${scale})`,
                }}
              >
                {thumb && (
                  <img
                    src={thumb}
                    alt=""
                    className="object-cover border-t border-white"
                  />
                )}
              </div>
            );
          })}

        <div className="absolute inset-0 overflow-hidden rounded-lg bg-gray-200 shadow-md ring-1 ring-black/5">
          {cover && (
            <img
              src={cover}
              alt={node.name}             
              className="object-cover transition-transform border-t border-white duration-200 group-hover:scale-105"
            />
          )}

          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h10v2H4z" />
            </svg>
            <span className="text-xs font-semibold">
              {count} {count === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </div>

      <p className="line-clamp-2 text-sm font-medium text-gray-900">
        {node.name}
      </p>
    </Link>
  );
}
