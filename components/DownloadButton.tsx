"use client";

import { useOfflineFile } from "@/lib/useOfflineFile";

export default function DownloadButton({
  id,
  url,
  name,
}: {
  id: string;
  url: string;
  name: string;
}) {
  const { status, download, remove } = useOfflineFile(id, url, name);

  if (status === "checking") return null;

  if (status === "downloading") {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-500"
      >
        <Spinner />
        Saving…
      </button>
    );
  }

  if (status === "saved") {
    return (
      <button
        onClick={remove}
        title="Remove downloaded copy"
        className="flex items-center gap-1.5 rounded-md bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-600"
      >
        <CheckIcon />
        <span>Downloaded</span>
      </button>
    );
  }

  return (
    <button
      onClick={download}
      title="Save for offline"
      className="flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200"
    >
      <DownloadIcon />
      Download
    </button>
  );
}

function DownloadIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin">
      <circle
        cx="12"
        cy="12"
        r="9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M21 12a9 9 0 00-9-9"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
