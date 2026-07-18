import { notFound } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import MobileMenu from "@/components/MobileMenu";
import PdfViewer from "@/components/PdfViewer";

import { getPdfTree, findPdfById } from "@/lib/pdfs";

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

        <PdfViewer id={pdf.id} url={pdf.url} />
      </div>
    </div>
  );
}
