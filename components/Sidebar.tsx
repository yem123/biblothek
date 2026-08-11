"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { PdfNode, PdfFolderNode } from "@/lib/pdfs";

type Props = {
  pdfs: PdfNode[];
};

const ICONS = {
  pdf: "/icons/pdf.svg",
  video: "/icons/video.svg",
  playlist: "/icons/video.svg",
  youtube: "/icons/video.svg",
};

export default function Sidebar({ pdfs }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-gray-300 bg-white">
      <Link href="/" className="border-b border-gray-300 p-5">
        <h1 className="flex items-center gap-2 text-xl font-bold">
          📚Deutsch Bibliothek
        </h1>

        <p className="mt-1 pl-7 text-sm text-gray-500">Pocket Library</p>
      </Link>

      <div className="flex-1 overflow-y-auto">
        {pdfs.map((node) =>
          node.type === "file" ? (
            <TreeNode key={node.id} node={node} depth={0} />
          ) : (
            <FolderNode
              key={node.path}
              node={node}
              depth={0}
              pathname={pathname}
            />
          ),
        )}
        <Link
          href="/offline"
          className="flex items-center gap-2 border-t border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
        >
          <DownloadIcon />
          View offline
        </Link>
      </div>
    </aside>
  );
}

function TreeNode({
  node,
  depth,
}: {
  node: Extract<PdfNode, { type: "file" }>;
  depth: number;
}) {
  const pathname = usePathname();

  const active = pathname === `/lesson/${node.id}`;
  const isExternal = node.mediaType === "playlist";

  const content = (
    <>
      <Image
        src={ICONS[node.mediaType]}
        alt={node.mediaType}
        width={18}
        height={18}
        className="shrink-0"
      />
      <span
        className={`ml-2 truncate ${active ? "underline text-cyan-700" : ""}`}
      >
        {node.name}
      </span>
    </>
  );

  const commonClasses = "flex items-center py-3 truncate hover:bg-gray-100";

  const paddingStyle = { paddingLeft: depth * 18 + 16 };

  if (isExternal) {
    return (
      <a
        href={node.url}
        target="_blank"
        rel="noopener noreferrer"
        className={commonClasses}
        style={paddingStyle}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={`/lesson/${node.id}`}
      className={commonClasses}
      style={paddingStyle}
    >
      {content}
    </Link>
  );
}

function FolderNode({
  node,
  depth,
  pathname,
}: {
  node: PdfFolderNode;
  depth: number;
  pathname: string;
}) {
  const defaultOpen = pathname.startsWith(`/lesson/${node.path}`);
  const isActive = pathname === `/folder/${node.path}`;

  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <div
        className={`flex w-full items-center hover:bg-gray-100 ${
          defaultOpen || isActive ? "bg-gray-50 text-cyan-700" : ""
        }`}
      >
        <Link
          href={`/folder/${node.path}`}
          className="flex min-w-0 flex-1 items-center py-2"
          onClick={() => setOpen((prev) => !prev)}
        >
          <button
            className="flex items-center py-2 pr-1"
            style={{ paddingLeft: depth * 18 + 16 }}
            aria-label={open ? "Collapse folder" : "Expand folder"}
          >
            <span className="w-3.5 text-xs text-gray-500">
              {open ? "▼" : "▶"}
            </span>
          </button>

          <Image
            src={open ? "/icons/folder-open.svg" : "/icons/folder.svg"}
            alt=""
            width={18}
            height={18}
            className="mr-2 shrink-0"
          />

          <span className="truncate font-semibold">{node.name}</span>
        </Link>
      </div>

      {open &&
        node.children.map((child) =>
          child.type === "file" ? (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ) : (
            <FolderNode
              key={child.path}
              node={child}
              depth={depth + 1}
              pathname={pathname}
            />
          ),
        )}
    </>
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