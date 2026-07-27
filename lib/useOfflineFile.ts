"use client";

import { useEffect, useState } from "react";
import {
  saveOfflineFile,
  getOfflineFile,
  deleteOfflineFile,
} from "./offlineDb";

type Status = "checking" | "idle" | "downloading" | "saved" | "error";

export function useOfflineFile(
  id: string,
  url: string,
  name: string,
  mediaType: "pdf" | "video",
) {
  const [status, setStatus] = useState<Status>("checking");
  const [offlineUrl, setOfflineUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;

    getOfflineFile(id).then((blob) => {
      if (cancelled) return;

      if (blob) {
        createdUrl = URL.createObjectURL(blob);
        setOfflineUrl(createdUrl);
        setStatus("saved");
      } else {
        setStatus("idle");
      }
    });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [id]);

  async function download() {
    setStatus("downloading");

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch file");

      const blob = await res.blob();
      await saveOfflineFile(id, blob, name, mediaType);

      const createdUrl = URL.createObjectURL(blob);
      setOfflineUrl(createdUrl);
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }

  async function remove() {
    await deleteOfflineFile(id);
    if (offlineUrl) URL.revokeObjectURL(offlineUrl);
    setOfflineUrl(null);
    setStatus("idle");
  }

  return { status, offlineUrl, download, remove };
}
