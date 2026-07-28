"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  listOfflineFiles,
  getOfflineFile,
  deleteOfflineFile,
} from "@/lib/offlineDb";
import type { OfflineRecord } from "@/lib/offlineDb";
import { OfflinePdfViewer } from "@/components/OfflinePdfViewer";

type ListItem = Omit<OfflineRecord, "blob">;

type OfflineFolder = {
  type: "folder";
  name: string;
  children: OfflineNode[];
};

type OfflineNode = OfflineFolder | ListItem;

function isFolder(node: OfflineNode): node is OfflineFolder {
  return "type" in node && node.type === "folder";
}

function buildTree(items: ListItem[]): OfflineNode[] {
  const root: OfflineNode[] = [];

  for (const item of items) {
    const trail =
      item.breadcrumb && item.breadcrumb.length > 0
        ? item.breadcrumb
        : ["Other"];

    let level = root;

    for (const segment of trail) {
      let folder = level.find((n) => isFolder(n) && n.name === segment) as
        | OfflineFolder
        | undefined;

      if (!folder) {
        folder = { type: "folder", name: segment, children: [] };
        level.push(folder);
      }

      level = folder.children;
    }

    level.push(item);
  }

  sortNodes(root);
  return root;
}

function sortNodes(nodes: OfflineNode[]): void {
  nodes.sort((a, b) => {
    const nameA = isFolder(a) ? a.name : a.name;
    const nameB = isFolder(b) ? b.name : b.name;
    return nameA.localeCompare(nameB);
  });

  for (const node of nodes) {
    if (isFolder(node)) {
      sortNodes(node.children);
    }
  }
}

function collectThumbs(node: OfflineNode, limit = 3): (string | null)[] {
  const thumbs: (string | null)[] = [];

  function walk(n: OfflineNode) {
    if (thumbs.length >= limit) return;
    if (!isFolder(n)) {
      thumbs.push(n.thumbnailUrl);
    } else {
      for (const child of n.children) {
        if (thumbs.length >= limit) return;
        walk(child);
      }
    }
  }

  walk(node);
  return thumbs;
}

function countItems(node: OfflineNode): number {
  if (!isFolder(node)) return 1;
  return node.children.reduce((sum, child) => sum + countItems(child), 0);
}

function coverMediaType(node: OfflineNode): "pdf" | "video" | null {
  if (!isFolder(node)) return node.mediaType;
  for (const child of node.children) {
    const found = coverMediaType(child);
    if (found) return found;
  }
  return null;
}

function formatSize(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function OfflinePage() {
  const [items, setItems] = useState<ListItem[] | null>(null);
  const [path, setPath] = useState<string[]>([]);
  const [playing, setPlaying] = useState<{
    item: ListItem;
    url: string;
  } | null>(null);

  useEffect(() => {
    listOfflineFiles().then(setItems);
  }, []);

  const tree = useMemo(() => (items ? buildTree(items) : []), [items]);

  const currentLevel = useMemo(() => {
    return path.reduce<OfflineNode[]>((level, segment) => {
      const folder = level.find((n) => isFolder(n) && n.name === segment) as
        | OfflineFolder
        | undefined;

      return folder ? folder.children : [];
    }, tree);
  }, [tree, path]);

  async function play(item: ListItem) {
    const blob = await getOfflineFile(item.id);
    if (!blob) return;
    setPlaying({ item, url: URL.createObjectURL(blob) });
  }

  async function remove(item: ListItem) {
    await deleteOfflineFile(item.id);
    setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? null);
    if (playing?.item.id === item.id) setPlaying(null);
  }

  if (items === null) {
    return (
      <main className="flex flex-1 items-center justify-center p-6 text-gray-500">
        Loading downloads…
      </main>
    );
  }

  if (playing) {
    return (
      <main className="flex h-full flex-col p-4">
        <button
          onClick={() => setPlaying(null)}
          className="mb-3 self-start text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back to downloads
        </button>

        {playing.item.mediaType === "video" ? (
          <video
            src={playing.url}
            controls
            autoPlay
            className="w-full flex-1 rounded-xl bg-black"
          />
        ) : (
          <OfflinePdfViewer url={playing.url} />
        )}

        <h1 className="mt-3 text-lg font-semibold text-gray-900">
          {playing.item.name}
        </h1>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <h1 className="text-lg font-semibold text-gray-900">
          No items downloaded
        </h1>
        <p className="max-w-xs text-sm text-gray-500">
          Videos and PDFs you save for offline will show up here. Connect to the
          internet and tap &quot;Download&quot; on anything you&apos;d like to
          access offline.
        </p>
      </main>
    );
  }

  // At the very top level, treat each folder as a category header
  // (like the home page) instead of a clickable playlist card.
  if (path.length === 0) {
    return (
      <main className="p-6">
        <h1 className="mb-6 text-lg font-semibold text-gray-900">
          Downloaded ({items.length})
        </h1>

        {tree.map((node) => {
          if (!isFolder(node)) return null;

          return (
            <div key={node.name} className="mb-10">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-lg font-semibold text-gray-900">
                  {node.name}
                </h2>
                <div className="h-px flex-1 bg-gray-300" />
              </div>

              <NodeGrid
                nodes={node.children}
                onOpenFolder={(name) => setPath([node.name, name])}
                onPlay={play}
                onRemove={remove}
              />
            </div>
          );
        })}
      </main>
    );
  }

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => setPath((p) => p.slice(0, -1))}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>
        <h1 className="text-lg font-semibold text-gray-900">
          {path[path.length - 1]}
        </h1>
      </div>

      <NodeGrid
        nodes={currentLevel}
        onOpenFolder={(name) => setPath((p) => [...p, name])}
        onPlay={play}
        onRemove={remove}
      />
    </main>
  );
}

function NodeGrid({
  nodes,
  onOpenFolder,
  onPlay,
  onRemove,
}: {
  nodes: OfflineNode[];
  onOpenFolder: (name: string) => void;
  onPlay: (item: ListItem) => void;
  onRemove: (item: ListItem) => void;
}) {
  const folders = nodes.filter(isFolder);
  const files = nodes.filter((n): n is ListItem => !isFolder(n));

  return (
    <div className="flex flex-col gap-8">
      {folders.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {folders.map((folder) => {
            const thumbs = collectThumbs(folder, 3);
            const [cover, ...behind] = thumbs;
            const count = countItems(folder);
            const isPdf = coverMediaType(folder) === "pdf";
            const aspectClass = isPdf ? "aspect-[3/4]" : "aspect-video";

            return (
              <button
                key={folder.name}
                onClick={() => onOpenFolder(folder.name)}
                className={`group flex flex-col gap-2 pt-3 text-left ${
                  isPdf ? "w-28 sm:w-32 md:w-36" : "w-40 sm:w-48"
                }`}
              >
                <div className={`relative w-full ${aspectClass}`}>
                  {behind
                    .slice()
                    .reverse()
                    .map((thumb, reversedIndex) => {
                      const i = behind.length - 1 - reversedIndex;
                      return (
                        <div
                          key={i}
                          className="absolute inset-0 overflow-hidden rounded-lg bg-gray-300 shadow-sm"
                          style={{
                            transform: `translateY(-${(i + 1) * 6}%) scale(${1 - (i + 1) * 0.08})`,
                          }}
                        >
                          {thumb && (
                            <Image
                              src={thumb}
                              alt=""
                              fill
                              sizes="190px"
                              className="object-cover"
                            />
                          )}
                        </div>
                      );
                    })}

                  <div className="absolute inset-0 overflow-hidden rounded-lg bg-gray-200 shadow-md ring-1 ring-black/5">
                    {cover && (
                      <Image
                        src={cover}
                        alt={folder.name}
                        fill
                        sizes="190px"
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white">
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h10v2H4z" />
                      </svg>
                      <span className="text-xs font-semibold">
                        {count} {count === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="line-clamp-2 text-sm font-medium text-gray-900">
                  {folder.name}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {files.map((item) => {
            const isPdf = item.mediaType === "pdf";
            const aspectClass = isPdf ? "aspect-[3/4]" : "aspect-video";

            return (
              <div
                key={item.id}
                className={`group flex flex-col gap-2 ${isPdf ? "w-28 sm:w-32 md:w-36" : "w-40 sm:w-48"}`}
              >
                <button
                  onClick={() => onPlay(item)}
                  className={`relative w-full ${aspectClass}`}
                >
                  <div className="absolute inset-0 overflow-hidden rounded-lg bg-gray-200 shadow-sm">
                    <Image
                      src={
                        item.thumbnailUrl ??
                        (item.mediaType === "video"
                          ? "/thumbnails/video-thumbnail.jpg"
                          : "/thumbnails/pdf-thumbnail.jpg")
                      }
                      alt={item.name}
                      fill
                      sizes="190px"
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                  </div>
                </button>

                <div className="flex items-start justify-between gap-1">
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium text-gray-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatSize(item.size)}
                    </p>
                  </div>

                  <button
                    onClick={() => onRemove(item)}
                    title="Remove"
                    aria-label="Remove download"
                    className="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M19 6l-1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
