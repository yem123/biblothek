export async function GET(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ path: string[] }>;
  },
) {
  const { path } = await params;

  const key = "pdfs/" + path.map(decodeURIComponent).join("/");

  const env = (globalThis as any).env as Env;

  const object = await env.LIBRARY.get(key);

  if (!object) {
    return new Response("File not found", { status: 404 });
  }

  return new Response(object.body, {
    headers: {
      "Content-Type":
        object.httpMetadata?.contentType ?? "application/octet-stream",
    },
  });
}
