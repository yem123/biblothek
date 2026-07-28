"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { useOfflineFile } from "@/lib/useOfflineFile";
import DownloadButton from "./DownloadButton";

type Props = {
  url: string;
  id: string;
  name: string;
  thumbnailUrl: string | null;
};

const Document = dynamic(
  () => import("react-pdf").then((mod) => mod.Document),
  {
    ssr: false,
    loading: () => <div className="p-10 text-center">Loading PDF...</div>,
  },
);

const Page = dynamic(() => import("react-pdf").then((mod) => mod.Page), {
  ssr: false,
});

export default function PdfViewer({ url, id, name, thumbnailUrl }: Props) {
  const [numPages, setNumPages] = useState(0);
  const [pageWidth, setPageWidth] = useState<number>();

  const containerRef = useRef<HTMLDivElement>(null);

  const { offlineUrl } = useOfflineFile(id, url, name, "pdf", thumbnailUrl);
  const fileToShow = offlineUrl ?? url;

  useEffect(() => {
    import("react-pdf").then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    });
  }, []);

  function onLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  useEffect(() => {
    function updateWidth() {
      if (window.innerWidth >= 768) {
        setPageWidth(window.innerWidth - 400);
      } else {
        setPageWidth(window.innerWidth - 30);
      }
    }

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const saved = localStorage.getItem(`pdf-position-${id}`);

    if (saved) {
      setTimeout(() => {
        container.scrollTop = Number(saved);
      }, 300);
    }

    const save = () => {
      localStorage.setItem(`pdf-position-${id}`, String(container.scrollTop));
    };

    container.addEventListener("scroll", save);

    return () => {
      container.removeEventListener("scroll", save);
    };
  }, [id]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-white px-4 py-2">
        <p className="line-clamp-1 text-sm font-medium text-gray-900">{name}</p>
        <DownloadButton
          id={id}
          url={url}
          name={name}
          mediaType="pdf"
          thumbnailUrl={thumbnailUrl}
        />
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto bg-gray-100 p-3"
      >
        <Document
          file={fileToShow}
          onLoadSuccess={onLoadSuccess}
          loading={<div className="p-10 text-center">Loading PDF...</div>}
        >
          {Array.from({ length: numPages }, (_, index) => (
            <Page
              key={index}
              pageNumber={index + 1}
              width={pageWidth}
              className="mb-4"
            />
          ))}
        </Document>
      </div>
    </div>
  );
}
