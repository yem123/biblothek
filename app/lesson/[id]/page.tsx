import { notFound } from "next/navigation";

import PdfViewer from "@/components/PdfViewer";
import VideoPlaylistPlayer from "@/components/VideoPlaylistPlayer";
import SingleVideoPlayer from "@/components/SingleVideoPlayer";

import {
  getPdfTree,
  findPdfById,
  findParentFolder,
  findFolderPath,
} from "@/lib/pdfs";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const tree = await getPdfTree();

  const pdf = findPdfById(tree, id);

  if (!pdf) {
    notFound();
  }

  const folderPath = findFolderPath(tree, id) ?? [];

  if (pdf.mediaType === "video") {
    const parent = findParentFolder(tree, id);

    const videoSiblings = parent
      ? parent.children.filter(
          (c): c is typeof pdf => c.type === "file" && c.mediaType === "video",
        )
      : [pdf];

    if (parent && videoSiblings.length > 1) {
      return (
        <VideoPlaylistPlayer
          current={pdf}
          playlist={videoSiblings}
          folderName={parent.name}
          folderPath={parent.path}
          breadcrumb={folderPath}
        />
      );
    }

    return <SingleVideoPlayer video={pdf} breadcrumb={folderPath} />;
  }

  return (
    <PdfViewer
      id={pdf.id}
      url={pdf.url}
      name={pdf.name}
      thumbnailUrl={pdf.thumbnailUrl}
      breadcrumb={folderPath}
    />
  );
}
