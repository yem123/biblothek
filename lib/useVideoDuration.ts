"use client";

import { useEffect, useState } from "react";

const cache = new Map<string, number>();

export function useVideoDuration(url: string) {
  const [duration, setDuration] = useState<number | null>(
    cache.get(url) ?? null,
  );

  useEffect(() => {
    if (cache.has(url)) return;

    const video = document.createElement("video");
    video.preload = "metadata";
    video.src = url;

    const onLoaded = () => {
      cache.set(url, video.duration);
      setDuration(video.duration);
    };

    video.addEventListener("loadedmetadata", onLoaded);

    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.src = "";
    };
  }, [url]);

  return duration;
}

export function formatDuration(seconds: number): string {
  const totalSeconds = Math.floor(seconds);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  return `${m}:${s.toString().padStart(2, "0")}`;
}
