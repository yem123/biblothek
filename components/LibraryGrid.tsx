import LibraryCard from "./LibraryCard";
import type { PdfNode, PdfFileNode, PdfFolderNode } from "@/lib/pdfs";

export default function LibraryGrid({ nodes }: { nodes: PdfNode[] }) {
  return (
    <>
      {nodes.map((node) => (
        <Section
          key={node.type === "folder" ? node.path : node.id}
          node={node}
        />
      ))}
    </>
  );
}

function Section({ node }: { node: PdfNode }) {
  if (node.type === "file") return null;

  const files: PdfFileNode[] = [];
  const subfolders: PdfFolderNode[] = [];

  for (const child of node.children) {
    if (child.type === "file") {
      files.push(child);
    } else {
      subfolders.push(child);
    }
  }

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-900">{node.name}</h2>
        <div className="h-px flex-1 bg-gray-300" />
      </div>

      {files.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {files.map((file, index) => (
            <LibraryCard key={file.id} node={file} priority={index < 4} />
          ))}
        </div>
      )}

      {subfolders.map((sub) => (
        <div key={sub.path} className="mt-8">
          <Section node={sub} />
        </div>
      ))}
    </div>
  );
}
