"use client";

import { useRef } from "react";
import type { PdfFileNode } from "@/lib/pdfs";
import SubtitleToggle from "./SubtitleToggle";

export default function SingleVideoPlayer({ video }: { video: PdfFileNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="flex h-full flex-col p-4">
      <video
        ref={videoRef}
        src={video.url}
        controls
        autoPlay
        crossOrigin="anonymous"
        className="w-full flex-1 rounded-xl bg-black"
      >
        {video.subtitleUrl && (
          <track
            kind="subtitles"
            src={video.subtitleUrl}
            srcLang="de"
            label="Deutsch"
            default
          />
        )}
      </video>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h1 className="text-lg font-semibold text-gray-900">{video.name}</h1>

        {video.subtitleUrl && <SubtitleToggle videoRef={videoRef} />}
      </div>
    </div>
  );
}
