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

export async function getPdfTree() {
  const url = "https://german-library-api.yemanemeasho2021.workers.dev/";

  const response = await fetch(url);

  const text = await response.text();

  console.log("PDF API STATUS:", response.status);
  console.log("PDF API BODY:", text.substring(0, 200));

  if (!response.ok) {
    throw new Error(`PDF API failed: ${response.status}`);
  }

  return JSON.parse(text);
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
