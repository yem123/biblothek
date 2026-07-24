"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { PdfFileNode } from "@/lib/pdfs";
import { getThumbnail } from "@/lib/pdfs";
import { useVideoDuration, formatDuration } from "@/lib/useVideoDuration";

type Props = {
  current: PdfFileNode;
  playlist: PdfFileNode[];
  folderName: string;
  folderPath: string;
};

export default function VideoPlaylistPlayer({
  current,
  playlist,
  folderName,
  folderPath,
}: Props) {
  const router = useRouter();
  const storageKey = `playlist-settings-${folderPath}`;

  const [loop, setLoop] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? !!JSON.parse(saved).loop : false;
    } catch {
      return false;
    }
  });

  const [shuffle, setShuffle] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? !!JSON.parse(saved).shuffle : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ loop, shuffle }));
  }, [loop, shuffle, storageKey]);

  const currentIndex = playlist.findIndex((v) => v.id === current.id);

  function getNextVideo(): PdfFileNode | null {
    if (playlist.length <= 1) return null;

    if (shuffle) {
      const others = playlist.filter((v) => v.id !== current.id);
      return others[Math.floor(Math.random() * others.length)] ?? null;
    }

    const isLast = currentIndex === playlist.length - 1;

    if (isLast) {
      return loop ? playlist[0] : null;
    }

    return playlist[currentIndex + 1];
  }

  function handleEnded() {
    const next = getNextVideo();
    if (next) {
      router.push(`/lesson/${next.id}`);
    }
  }

  return (
    <div className="flex h-full flex-col lg:flex-row">
      <div className="flex shrink-0 flex-col p-4 lg:flex-1 lg:overflow-y-auto">
        <video
          key={current.id}
          src={current.url}
          controls
          autoPlay
          onEnded={handleEnded}
          className="w-full rounded-xl bg-black"
        />

        <div className="mt-2">
          <h1 className="line-clamp-1 text-sm font-semibold text-gray-900 md:line-clamp-2 md:text-xl">
            {current.name}
          </h1>
          <p className="text-xs text-gray-500">
            {folderName} · Video {currentIndex + 1} of {playlist.length}
          </p>
        </div>
      </div>

      <aside className="flex min-h-0 flex-1 w-full flex-col border-t border-gray-500 lg:h-full lg:max-h-none lg:w-96 lg:flex-none lg:border-l lg:border-t-0">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-300 bg-gray-200 p-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Playlist
            </p>
            <h2 className="font-semibold text-gray-900">{folderName}</h2>
            <p className="text-xs text-gray-500">
              {currentIndex + 1} / {playlist.length}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShuffle((s) => !s)}
              title="Shuffle"
              className={`rounded-full p-2 transition-colors ${
                shuffle
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <ShuffleIcon />
            </button>

            <button
              onClick={() => setLoop((l) => !l)}
              title="Loop"
              className={`rounded-full p-2 transition-colors ${
                loop
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <LoopIcon />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {playlist.map((video, index) => (
            <PlaylistItem
              key={video.id}
              video={video}
              index={index}
              active={video.id === current.id}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}

function PlaylistItem({
  video,
  index,
  active,
}: {
  video: PdfFileNode;
  index: number;
  active: boolean;
}) {
  const duration = useVideoDuration(video.url);

  return (
    <Link
      href={`/lesson/${video.id}`}
      className={`flex gap-3 items-center p-3 hover:bg-gray-50 ${active ? "bg-gray-100" : ""}`}
    >
      <span className="text-xs text-gray-500">{index + 1}</span>
      <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-md bg-gray-200">
        <Image
          src={getThumbnail(video)}
          alt={video.name}
          fill
          sizes="112px"
          className="object-cover"
        />
        {duration !== null && (
          <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[10px] font-medium text-white">
            {formatDuration(duration)}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col justify-center">
        <p
          className={`line-clamp-2 text-sm ${
            active ? "font-semibold text-gray-900" : "text-gray-800"
          }`}
        >
          {video.name}
        </p>
      </div>
    </Link>
  );
}

function ShuffleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M16 3h5v5" />
      <path d="M4 20L21 3" />
      <path d="M21 16v5h-5" />
      <path d="M15 15l6 6" />
      <path d="M4 4l5 5" />
    </svg>
  );
}

function LoopIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M17 2l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 22l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}
