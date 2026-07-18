"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PdfNode, PdfFolderNode } from "@/lib/pdfs";

type Props = {
  pdfs: PdfNode[];
};

export default function Sidebar({ pdfs }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-72 flex-col border-r border-gray-300 bg-white">
      <div className="border-b border-gray-300 p-5">
        <h1 className="text-xl font-bold">🇩🇪 Deutsch Bibliothek</h1>

        <p className="mt-1 text-sm text-gray-500">Quick Library</p>
      </div>

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

  return (
    <Link
      href={`/lesson/${node.id}`}
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

  const [open, setOpen] = useState(defaultOpen);

  return (
    <>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center py-2 hover:bg-gray-100 ${
          defaultOpen ? "bg-gray-50 text-cyan-700" : ""
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
