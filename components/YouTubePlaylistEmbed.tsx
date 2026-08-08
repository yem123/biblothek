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
    <div className="w-full overflow-hidden rounded-xl bg-black">
      <iframe
        src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
        title={name}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-60 sm:h-90 lg:h-140"
      />

      <div className="p-3 text-sm sm:text-base font-medium text-white bg-neutral-900">
        {name}
      </div>
    </div>
  );
}
