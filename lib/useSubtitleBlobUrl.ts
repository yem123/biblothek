"use client";

import { useEffect, useState } from "react";

export function useSubtitleBlobUrl(url: string | null) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setBlobUrl(null);
      return;
    }

    let currentUrl: string | null = null;
    let cancelled = false;

    fetch(url)
      .then((res) => res.text())
      .then((text) => {
        if (cancelled) return;
        const blob = new Blob([text], { type: "text/vtt" });
        currentUrl = URL.createObjectURL(blob);
        setBlobUrl(currentUrl);
      })
      .catch(() => {
        if (!cancelled) setBlobUrl(null);
      });

    return () => {
      cancelled = true;
      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, [url]);

  return blobUrl;
}
