import { notFound } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import PdfViewer from "@/components/PdfViewer";

import { getPdfTree, findPdfById } from "@/lib/pdfs";

export const dynamic = "force-dynamic";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const pdfs = await getPdfTree();

  const pdf = findPdfById(pdfs, id);

  if (!pdf) {
    notFound();
  }

  return (
    <div className="flex h-screen">
      <Sidebar pdfs={pdfs} />

      <div className="flex flex-1 flex-col">
        <MobileMenu pdfs={pdfs} />

        {pdf.mediaType === "pdf" && <PdfViewer id={pdf.id} url={pdf.url} />}

        {pdf.mediaType === "video" && (
          <video src={pdf.url} controls autoPlay className="h-full w-full" />
        )}

        {pdf.mediaType === "audio" && (
          <audio src={pdf.url} controls autoPlay className="mt-10 w-full" />
        )}
      </div>
    </div>
  );
}
