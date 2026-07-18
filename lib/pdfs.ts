import fs from "fs/promises";
import path from "path";

export type PdfFileNode = {
  type: "file";
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

const ROOT = path.join(process.cwd(), "public", "pdfs");

export async function getPdfTree(): Promise<PdfNode[]> {
  return readDirectory(ROOT);
}

async function readDirectory(dir: string, relative = ""): Promise<PdfNode[]> {
  const entries = await fs.readdir(dir, {
    withFileTypes: true,
  });

  entries.sort((a, b) => a.name.localeCompare(b.name));

  const nodes: PdfNode[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const folderRelative = relative
        ? `${relative}/${entry.name}`
        : entry.name;

      nodes.push({
        type: "folder",
        name: entry.name,
        path: slugify(folderRelative),
        children: await readDirectory(full, folderRelative),
      });

      continue;
    }

    if (!entry.name.toLowerCase().endsWith(".pdf")) {
      continue;
    }

    const fileRelative = path.relative(ROOT, full).replace(/\\/g, "/");

    nodes.push({
      type: "file",
      id: slugify(fileRelative),
      name: entry.name.replace(/\.pdf$/i, ""),
      url: "/pdfs/" + encodeURI(fileRelative),
    });
  }

  return nodes;
}

export function findPdfById(nodes: PdfNode[], id: string): PdfFileNode | null {
  for (const node of nodes) {
    if (node.type === "file") {
      if (node.id === id) {
        return node;
      }
    } else {
      const result = findPdfById(node.children, id);

      if (result) {
        return result;
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

function slugify(file: string): string {
  return file
    .replace(/\.pdf$/i, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/\\/g, "/")
    .toLowerCase()
    .replace(/\//g, "--")
    .replace(/\s+/g, "-")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9-]/g, "");
}
