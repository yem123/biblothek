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

  const enterPiP = async () => {
    if (
      document.pictureInPictureEnabled &&
      videoRef.current &&
      document.pictureInPictureElement !== videoRef.current
    ) {
      await videoRef.current.requestPictureInPicture();
    }
  };

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
            playsInline
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
            <span className="flex">
              <button
                className="flex justify-center p-2 cursor-pointer"
                onClick={enterPiP}
              >
                <p className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200">
                  <PipIcon />

                  <span className="lg:hidden">PiP</span>
                  <span className="hidden lg:inline">Picture in Picture</span>
                </p>
              </button>
              <DownloadButton
                id={video.id}
                url={video.url}
                name={video.name}
                mediaType={downloadableMediaType}
                thumbnailUrl={video.thumbnailUrl}
                breadcrumb={breadcrumb}
              />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function PipIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <path d="M13 13h6v5h-6z" />
    </svg>
  );
}