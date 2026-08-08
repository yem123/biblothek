export function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url);

    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1);
    }

    const v = parsed.searchParams.get("v");
    if (v) return v;

    const embedMatch = parsed.pathname.match(/\/embed\/([^/?]+)/);
    if (embedMatch) return embedMatch[1];

    return null;
  } catch {
    return null;
  }
}

export function getYouTubePlaylistId(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.searchParams.get("list");
  } catch {
    return null;
  }
}
