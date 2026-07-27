"use client";

import { useOfflineFile } from "@/lib/useOfflineFile";

export default function DownloadButton({
  id,
  url,
  name,
  mediaType,
}: {
  id: string;
  url: string;
  name: string;
  mediaType: "pdf" | "video";
}) {
  const { status, download, remove } = useOfflineFile(id, url, name, mediaType);

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
      <div className="flex items-center gap-1.5 rounded-md bg-green-50 pl-2.5 pr-1 py-1 text-xs font-semibold text-green-700">
        <CheckIcon />
        <span>Downloaded</span>

        <button
          onClick={() => {
            if (confirm(`Remove "${name}" from offline downloads?`)) {
              remove();
            }
          }}
          title="Cancel download"
          aria-label="Cancel download"
          className="ml-1 rounded p-1 text-red-400 transition-colors hover:text-red-500 active:bg-green-200"
        >
          <TrashIcon />
        </button>
      </div>
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
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12" strokeLinecap="round" />
      <path d="M7 10l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19h16" strokeLinecap="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 12l5 5L20 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18" strokeLinecap="round" />
      <path d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6l-1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v6M14 11v6" strokeLinecap="round" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className="animate-spin">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}