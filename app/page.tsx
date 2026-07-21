import { redirect } from "next/navigation";
import { getPdfTree, findFirstPdf } from "@/lib/pdfs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tree = await getPdfTree();

  if (!Array.isArray(tree)) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Library data is unavailable</p>
      </main>
    );
  }

  const first = findFirstPdf(tree);

  if (!first?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>No File found</p>
      </main>
    );
  }

  redirect(`/lesson/${first.id}`);
}
