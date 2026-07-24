import { getPdfTree } from "@/lib/pdfs";
import type { PdfFolderNode } from "@/lib/pdfs";
import FolderContents from "@/components/FolderContents";

export default async function HomePage() {
  const tree = await getPdfTree();
  const sections = tree.filter((n): n is PdfFolderNode => n.type === "folder");

  return (
    <div className="p-6">
      {sections.map((section) => (
        <div key={section.path} id={section.path} className="mb-10 scroll-mt-6">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-900">
              {section.name}
            </h2>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <FolderContents nodes={section.children} />
        </div>
      ))}
    </div>
  );
}
