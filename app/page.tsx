import { getPdfTree } from "@/lib/pdfs";

export default async function HomePage() {
  const tree = await getPdfTree();

  return (
    <main>
      <pre>{JSON.stringify(tree, null, 2)}</pre>
    </main>
  );
}
