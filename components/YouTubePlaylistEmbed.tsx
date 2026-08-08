import { getYouTubePlaylistId } from "@/lib/youtube";

export default function YouTubePlaylistEmbed({
  url,
  name,
}: {
  url: string;
  name: string;
}) {
  const playlistId = getYouTubePlaylistId(url);

  if (!playlistId) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-xl bg-black text-sm text-white">
        Invalid YouTube playlist link
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4">
      <iframe
        src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
        title={name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full flex-1 rounded-xl"
      />
      <h1 className="mt-3 text-lg font-semibold text-gray-900">{name}</h1>
    </div>
  );
}
