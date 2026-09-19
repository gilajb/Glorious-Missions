/**
 * Turns a YouTube/Vimeo watch/share URL into an embeddable iframe `src`.
 * Returns null for anything else, so callers can render nothing rather than
 * a broken iframe.
 */
export function getVideoEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      const shortsMatch = parsed.pathname.match(/^\/shorts\/([\w-]+)/);
      if (shortsMatch) return `https://www.youtube.com/embed/${shortsMatch[1]}`;
    }

    if (host === "vimeo.com") {
      const idMatch = parsed.pathname.match(/^\/(\d+)/);
      if (idMatch) return `https://player.vimeo.com/video/${idMatch[1]}`;
    }
  } catch {
    return null;
  }

  return null;
}

/** Client-side sanity check mirroring the backend's validator (see
 * backend/core/validators.py::validate_video_url), used to give instant
 * feedback in the admin form before the request round-trip. */
export function isLikelyVideoUrl(url) {
  return getVideoEmbedUrl(url) !== null;
}
