"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import type { PdfNode, PdfFolderNode } from "@/lib/pdfs";

const ICONS = {
  pdf: "/icons/pdf.svg",
  video: "/icons/video.svg",
};

export default function MobileMenu({ pdfs }: { pdfs: PdfNode[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden flex items-start gap-3 border-b bg-white px-4 py-3">
        <button onClick={() => setOpen(true)} className="text-xl">
          ☰
        </button>
        <Link href="/" className="font-semibold flex flex-col">
          <span className="text-md">Deutsch Bibliothek</span>
          <span className="-mt-1 text-xs text-gray-500">Pocket Library</span>
        </Link>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen w-72 flex flex-col
          bg-white shadow-xl
          transition-transform duration-200
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between border-b p-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            📚Deutsch Bibliothek
          </Link>

          <button onClick={() => setOpen(false)} className="text-xl">
            ×
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {pdfs.map((node) =>
            node.type === "file" ? (
              <TreeNode
                key={node.id}
                node={node}
                depth={0}
                closeMenu={() => setOpen(false)}
              />
            ) : (
              <Folder
                key={node.path}
                node={node}
                depth={0}
                closeMenu={() => setOpen(false)}
              />
            ),
          )}
          <Link
            href="/offline"
            className="flex items-center gap-2 border-t border-gray-300 px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            <DownloadIcon />
            Downloads
          </Link>
        </nav>
      </aside>
    </>
  );
}

function TreeNode({
  node,
  depth,
  closeMenu,
}: {
  node: Extract<PdfNode, { type: "file" }>;
  depth: number;
  closeMenu: () => void;
}) {
  const pathname = usePathname();

  const active = pathname === `/lesson/${node.id}`;

  return (
    <Link
      href={`/lesson/${node.id}`}
      onClick={() => {
        localStorage.setItem("last-pdf", node.id);
        closeMenu();
      }}
      className="flex items-center py-3 truncate hover:bg-gray-100"
      style={{
        paddingLeft: depth * 18 + 16,
      }}
    >
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
    </Link>
  );
}

function Folder({
  node,
  depth,
  closeMenu,
}: {
  node: PdfFolderNode;
  depth: number;
  closeMenu: () => void;
}) {
  const pathname = usePathname();

  const activeFolder = pathname.startsWith(`/lesson/${node.path}`);

  const [open, setOpen] = useState(activeFolder);

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center py-3 ${
          activeFolder ? "bg-gray-100 text-cyan-900" : "hover:bg-gray-100"
        }`}
        style={{
          paddingLeft: depth * 18 + 16,
        }}
      >
        <span className="mr-1 w-3.5 text-xs text-gray-500">
          {open ? "▼" : "▶"}
        </span>

        <Image
          src={open ? "/icons/folder-open.svg" : "/icons/folder.svg"}
          alt=""
          width={18}
          height={18}
          className="mr-2 shrink-0"
        />

        <span className="font-semibold truncate">{node.name}</span>
      </button>

      {open &&
        node.children.map((child) =>
          child.type === "file" ? (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              closeMenu={closeMenu}
            />
          ) : (
            <Folder
              key={child.path}
              node={child}
              depth={depth + 1}
              closeMenu={closeMenu}
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