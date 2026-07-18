import { redirect } from "next/navigation";
import { getPdfTree, findFirstPdf } from "@/lib/pdfs";

export default async function HomePage() {
  const tree = await getPdfTree();

  const first = findFirstPdf(tree);

  if (!first) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>No PDFs found in public/pdfs</p>
      </main>
    );
  }

  redirect(`/lesson/${encodeURIComponent(first.id)}`);
}
