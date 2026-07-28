"use client";

import { useRef } from "react";
import type { PdfFileNode } from "@/lib/pdfs";
import { useSubtitleBlobUrl } from "@/lib/useSubtitleBlobUrl";
import { useOfflineFile } from "@/lib/useOfflineFile";
import SubtitleToggle from "./SubtitleToggle";
import DownloadButton from "./DownloadButton";

export default function SingleVideoPlayer({ video }: { video: PdfFileNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const subtitleBlobUrl = useSubtitleBlobUrl(video.subtitleUrl);
  const { offlineUrl } = useOfflineFile(
    video.id,
    video.url,
    video.name,
    video.mediaType,
  );

  return (
    <div className="flex h-full flex-col p-4">
      <video
        ref={videoRef}
        src={offlineUrl ?? video.url}
        controls
        autoPlay
        className="w-full flex-1 rounded-xl bg-black"
      >
        {subtitleBlobUrl && (
          <track
            kind="subtitles"
            src={subtitleBlobUrl}
            srcLang="de"
            label="Deutsch"
            default
          />
        )}
      </video>

      <div className="mt-3 flex items-start justify-between gap-3">
        <h1 className="text-lg font-semibold text-gray-900">{video.name}</h1>

        <div className="flex items-center gap-2">
          {subtitleBlobUrl && <SubtitleToggle videoRef={videoRef} />}
          <DownloadButton
            id={video.id}
            url={video.url}
            name={video.name}
            mediaType={video.mediaType}
          />
        </div>
      </div>
    </div>
  );
}
