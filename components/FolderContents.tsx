import type { PdfNode, PdfFileNode, PdfFolderNode } from "@/lib/pdfs";
import LibraryCard from "./LibraryCard";
import PlaylistCard from "./PlaylistCard";

export default function FolderContents({ nodes }: { nodes: PdfNode[] }) {
  const files: PdfFileNode[] = [];
  const folders: PdfFolderNode[] = [];

  for (const node of nodes) {
    if (node.type === "file") files.push(node);
    else folders.push(node);
  }

  return (
    <div className="flex flex-col gap-8">
      {folders.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {folders.map((folder) => (
            <PlaylistCard key={folder.path} node={folder} />
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {files.map((file, index) => (
            <LibraryCard key={file.id} node={file} priority={index < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
