"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PdfNode, PdfFolderNode } from "@/lib/pdfs";

export default function MobileMenu({ pdfs }: { pdfs: PdfNode[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden flex items-center gap-3 border-b bg-white px-4 py-3">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md border border-gray-300 px-3 py-1 text-xl"
        >
          ☰
        </button>

        <h1 className="font-semibold">Deutsch Bibliothek</h1>
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
          <h2 className="font-bold">📚 PDFs</h2>

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
      📄
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
        <span className="mr-2">{open ? "▼" : "▶"}</span>

        <span className="font-semibold truncate">📁 {node.name}</span>
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
