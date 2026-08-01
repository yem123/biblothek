"use client";

import { useRef } from "react";
import type { PdfFileNode } from "@/lib/pdfs";
import { useSubtitleBlobUrl } from "@/lib/useSubtitleBlobUrl";
import { useOfflineFile } from "@/lib/useOfflineFile";
import SubtitleToggle from "./SubtitleToggle";
import DownloadButton from "./DownloadButton";
import YouTubePlayer from "./YouTubePlayer";

export default function SingleVideoPlayer({
  video,
  breadcrumb,
}: {
  video: PdfFileNode;
  breadcrumb: string[];
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const subtitleBlobUrl = useSubtitleBlobUrl(video.subtitleUrl);
  const downloadableMediaType: "pdf" | "video" =
    video.mediaType === "pdf" ? "pdf" : "video";

  const { offlineUrl } = useOfflineFile(
    video.id,
    video.url,
    video.name,
    downloadableMediaType,
    video.thumbnailUrl,
    breadcrumb,
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

        {video.mediaType === "youtube" ? (
          <YouTubePlayer url={video.url} onEnded={() => {}} />
        ) : (
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
        )}

        <div className="flex items-center gap-2">
          {video.mediaType !== "youtube" && subtitleBlobUrl && (
            <SubtitleToggle videoRef={videoRef} />
          )}
          {video.mediaType === "video" && (
            <DownloadButton
              id={video.id}
              url={video.url}
              name={video.name}
              mediaType={downloadableMediaType}
              thumbnailUrl={video.thumbnailUrl}
              breadcrumb={breadcrumb}
            />
          )}
        </div>
      </div>
    </div>
  );
}
