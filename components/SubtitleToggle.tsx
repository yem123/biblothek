"use client";

import { useEffect, useState } from "react";

export default function SubtitleToggle({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const track = video.textTracks[0];
    if (track) {
      track.mode = enabled ? "showing" : "hidden";
    }
  }, [enabled, videoRef]);

  function toggle() {
    setEnabled((prev) => !prev);
  }

  return (
    <button
      onClick={toggle}
      title={enabled ? "Turn off subtitles" : "Turn on subtitles"}
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors ${
        enabled
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M7 13h3M7 10h5M14 13h3M14 10h3" strokeLinecap="round" />
      </svg>
      CC
    </button>
  );
}
