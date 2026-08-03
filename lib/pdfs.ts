import { getCloudflareContext } from "@opennextjs/cloudflare";

export type PdfFileNode = {
  type: "file";
  mediaType: "pdf" | "video" | "playlist" | "youtube";
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string | null;
  subtitleUrl: string | null;
};

export type PdfFolderNode = {
  type: "folder";
  name: string;
  path: string;
  children: PdfNode[];
};

export type PdfNode = PdfFolderNode | PdfFileNode;

export function getThumbnail(node: PdfFileNode, pages?: number | null): string {
  if (node.thumbnailUrl) return node.thumbnailUrl;

  if (node.mediaType === "video") {
    return "/thumbnails/video-thumbnail.jpg";
  }

  if (pages != null && pages >= 30) {
    return "/thumbnails/book-thumbnail.jpg";
  }

  return "/thumbnails/pdf-thumbnail.jpg";
}

export async function getPdfTree(): Promise<PdfNode[]> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const response = await env.LIBRARY_API.fetch("https://internal/");

    if (!response.ok) {
      throw new Error(`Failed to load Files: ${response.status}`);
    }

    return response.json();
  } catch {
    const response = await fetch(
      "https://german-library-api.yemanemeasho2021.workers.dev/",
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(`Failed to load Files: ${response.status}`);
    }

    return response.json();
  }
}

export function findPdfById(nodes: PdfNode[], id: string): PdfFileNode | null {
  for (const node of nodes) {
    if (node.type === "file") {
      if (node.id === id) {
        return node;
      }
    } else {
      const found = findPdfById(node.children, id);

      if (found) {
        return found;
      }
    }
  }

  return null;
}

export function findFirstPdf(nodes: PdfNode[]): PdfFileNode | null {
  for (const node of nodes) {
    if (node.type === "file") {
      return node;
    }

    const found = findFirstPdf(node.children);

    if (found) {
      return found;
    }
  }

  return null;
}

export function countFiles(node: PdfNode): number {
  if (node.type === "file") return 1;
  return node.children.reduce((sum, child) => sum + countFiles(child), 0);
}

export function collectThumbnails(node: PdfFolderNode, limit = 4): string[] {
  const thumbs: string[] = [];

  function walk(n: PdfNode) {
    if (thumbs.length >= limit) return;
    if (n.type === "file") {
      thumbs.push(getThumbnail(n));
    } else {
      for (const child of n.children) {
        if (thumbs.length >= limit) return;
        walk(child);
      }
    }
  }

  for (const child of node.children) {
    if (thumbs.length >= limit) break;
    walk(child);
  }

  return thumbs;
}

export function findFolderByPath(
  nodes: PdfNode[],
  path: string,
): PdfFolderNode | null {
  for (const node of nodes) {
    if (node.type === "folder") {
      if (node.path === path) return node;
      const found = findFolderByPath(node.children, path);
      if (found) return found;
    }
  }
  return null;
}

export function findFolderPath(
  nodes: PdfNode[],
  id: string,
  trail: string[] = [],
): string[] | null {
  for (const node of nodes) {
    if (node.type === "file") {
      if (node.id === id) return trail;
    } else {
      const found = findFolderPath(node.children, id, [...trail, node.name]);
      if (found) return found;
    }
  }
  return null;
}

export function collectCoverType(node: PdfFolderNode): "pdf" | "video" | null {
  for (const child of node.children) {
    if (child.type === "file") {
      return child.mediaType === "pdf" ? "pdf" : "video";
    }

    const found = collectCoverType(child);
    if (found) return found;
  }

  return null;
}

export function findParentFolder(
  nodes: PdfNode[],
  id: string,
  parent: PdfFolderNode | null = null,
): PdfFolderNode | null {
  for (const node of nodes) {
    if (node.type === "file") {
      if (node.id === id) return parent;
    } else {
      const found = findParentFolder(node.children, id, node);
      if (found) return found;
    }
  }
  return null;
}