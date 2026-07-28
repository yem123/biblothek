"use client";

import { useEffect, useState } from "react";
import {
  listOfflineFiles,
  getOfflineFile,
  deleteOfflineFile,
} from "@/lib/offlineDb";
import type { OfflineRecord } from "@/lib/offlineDb";
import Image from "next/image";
import { OfflinePdfViewer } from "@/components/OfflinePdfViewer";

type ListItem = Omit<OfflineRecord, "blob">;

export default function OfflinePage() {
  const [items, setItems] = useState<ListItem[] | null>(null);
  const [playing, setPlaying] = useState<{
    item: ListItem;
    url: string;
  } | null>(null);

  useEffect(() => {
    listOfflineFiles().then(setItems);
  }, []);

  async function play(item: ListItem) {
    const blob = await getOfflineFile(item.id);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    setPlaying({ item, url });
  }

  async function remove(item: ListItem) {
    await deleteOfflineFile(item.id);
    setItems((prev) => prev?.filter((i) => i.id !== item.id) ?? null);
    if (playing?.item.id === item.id) {
      setPlaying(null);
    }
  }

  function formatSize(bytes: number): string {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
        <DownloadEmptyIcon />
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

  return (
    <main className="p-6">
      <h1 className="mb-4 text-lg font-semibold text-gray-900">
        Downloaded ({items.length})
      </h1>

      <div className="flex flex-col divide-y divide-gray-200 rounded-lg border border-gray-200">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3">
            <button
              onClick={() => play(item)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-gray-100">
                <Image
                  src={
                    item.thumbnailUrl ??
                    (item.mediaType === "video"
                      ? "/thumbnails/video-thumbnail.jpg"
                      : "/thumbnails/pdf-thumbnail.jpg")
                  }
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>

              <div className="min-w-0">
                <p className="line-clamp-1 text-sm font-medium text-gray-900">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">{formatSize(item.size)}</p>
              </div>
            </button>

            <button
              onClick={() => remove(item)}
              title="Remove"
              aria-label="Remove download"
              className="shrink-0 rounded p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
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

function DownloadEmptyIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className="text-gray-300"
    >
      <path
        d="M12 3v10M8 9l4 4 4-4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 17v3a1 1 0 001 1h14a1 1 0 001-1v-3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
