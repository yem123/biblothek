"use client";

import { useEffect, useState } from "react";

const cache = new Map<string, number>();

export function usePdfPageCount(url: string) {
  const [pages, setPages] = useState<number | null>(cache.get(url) ?? null);

  useEffect(() => {
    if (!url || cache.has(url)) return;

    let cancelled = false;

    import("react-pdf").then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

      pdfjs.getDocument(url).promise.then((doc) => {
        if (cancelled) return;
        cache.set(url, doc.numPages);
        setPages(doc.numPages);
      });
    });

    return () => {
      cancelled = true;
    };
  }, [url]);

  return pages;
}
