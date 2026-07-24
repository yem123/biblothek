import { notFound } from "next/navigation";
import { getPdfTree, findFolderByPath } from "@/lib/pdfs";
import FolderContents from "@/components/FolderContents";

export const dynamic = "force-dynamic";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;
  const tree = await getPdfTree();
  const folder = findFolderByPath(tree, path);

  if (!folder) {
    notFound();
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{folder.name}</h1>
      <FolderContents nodes={folder.children} />
    </main>
  );
}
