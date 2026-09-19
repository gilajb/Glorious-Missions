import VideoEmbed from "../../components/VideoEmbed";
import { isLikelyVideoUrl } from "../../utils/video";

/** A YouTube/Vimeo URL input with an inline embed preview. */
export default function VideoUrlField({ id, value, onChange, error }) {
  const showInvalidHint = value && !isLikelyVideoUrl(value);

  return (
    <div className="flex flex-col gap-space-xxs">
      <label htmlFor={id} className="font-label-md text-label-md text-on-surface">
        Video URL (YouTube or Vimeo, optional)
      </label>
      <input
        id={id}
        type="url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`px-space-md py-space-sm rounded-lg bg-surface border font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary ${
          error ? "border-error" : "border-outline-variant"
        }`}
      />
      {showInvalidHint && !error && (
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          That doesn't look like a YouTube or Vimeo link yet.
        </p>
      )}
      {error && (
        <p role="alert" className="font-body-sm text-body-sm text-error">
          {Array.isArray(error) ? error[0] : error}
        </p>
      )}
      {value && isLikelyVideoUrl(value) && (
        <div className="mt-space-xxs max-w-sm">
          <VideoEmbed url={value} title="Video preview" className="rounded-lg" />
        </div>
      )}
    </div>
  );
}
