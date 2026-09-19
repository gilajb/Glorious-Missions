import { getVideoEmbedUrl } from "../utils/video";

/**
 * Renders a YouTube/Vimeo `video_url` as a responsive playable iframe.
 * Mirrors SafeImage's contract: renders nothing when there's nothing valid
 * to show, rather than a broken embed.
 */
export default function VideoEmbed({ url, title = "Video", className = "" }) {
  const src = getVideoEmbedUrl(url);
  if (!src) return null;

  return (
    <div className={`relative w-full aspect-video overflow-hidden ${className}`}>
      <iframe
        src={src}
        title={title}
        className="absolute inset-0 w-full h-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
