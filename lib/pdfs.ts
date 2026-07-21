export type PdfFileNode = {
  type: "file";
  mediaType: "pdf" | "video" | "audio";
  id: string;
  name: string;
  url: string;
};

export type PdfFolderNode = {
  type: "folder";
  name: string;
  path: string;
  children: PdfNode[];
};

export type PdfNode = PdfFolderNode | PdfFileNode;

export async function getPdfTree(): Promise<PdfNode[]> {
  const workerUrl = "https://german-library-api.yemanemeasho2021.workers.dev/";

  console.log("USING PDF URL:", workerUrl);

  const response = await fetch(workerUrl);

  console.log("Status:", response.status);

  if (!response.ok) {
    throw new Error(`Failed to load PDF library: ${response.status}`);
  }

  return response.json();
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
