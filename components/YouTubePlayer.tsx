"use client";

import { useEffect, useRef } from "react";
import { getYouTubeId } from "@/lib/youtube";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeApi(): Promise<void> {
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    window.onYouTubeIframeAPIReady = () => resolve();
  });

  return apiLoadPromise;
}

export default function YouTubePlayer({
  url,
  onEnded,
}: {
  url: string;
  onEnded: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const onEndedRef = useRef(onEnded);

  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  const videoId = getYouTubeId(url);

  useEffect(() => {
    if (!videoId || !containerRef.current) return;

    let cancelled = false;

    loadYouTubeApi().then(() => {
      if (cancelled || !containerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId,
        playerVars: { autoplay: 1, rel: 0 },
        events: {
          onStateChange: (event: { data: number }) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              onEndedRef.current();
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy?.();
    };
  }, [videoId]);

  if (!videoId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-black text-sm text-white">
        Invalid YouTube link
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="aspect-video w-full overflow-hidden rounded-xl"
    />
  );
}
