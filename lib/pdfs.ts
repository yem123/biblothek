import { getCloudflareContext } from "@opennextjs/cloudflare";

export type PdfFileNode = {
  type: "file";
  mediaType: "pdf" | "video" | "audio";
  id: string;
  name: string;
  url: string;
  thumbnailUrl: string | null;
};

export type PdfFolderNode = {
  type: "folder";
  name: string;
  path: string;
  children: PdfNode[];
};

export type PdfNode = PdfFolderNode | PdfFileNode;

export async function getPdfTree(): Promise<PdfNode[]> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const response = await env.LIBRARY_API.fetch("https://internal/");

    if (!response.ok) {
      throw new Error(`Failed to load PDF library: ${response.status}`);
    }

    return response.json();
  } catch {
    const response = await fetch(
      "https://german-library-api.yemanemeasho2021.workers.dev",
      { cache: "no-store" },
    );

    if (!response.ok) {
      throw new Error(`Failed to load PDF library: ${response.status}`);
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
