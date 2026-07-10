import Upload from "@/components/Upload";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="text-4xl font-bold">German Dialogue Studio</h1>

      <Upload />
    </main>
  );
}
