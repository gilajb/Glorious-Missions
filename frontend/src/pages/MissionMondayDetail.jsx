import DOMPurify from "dompurify";
import { Link, useParams } from "react-router-dom";

import Icon from "../components/Icon";
import SafeImage from "../components/SafeImage";
import VideoEmbed from "../components/VideoEmbed";
import { getMission } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";

/**
 * `article` is admin-authored HTML, already sanitized server-side
 * (backend/core/sanitize.py) before it's stored. Sanitizing again here is
 * defense-in-depth -- see the admin portal's design notes on why this one
 * field is rendered as trusted HTML rather than as plain text.
 */
export default function MissionMondayDetail() {
  const { id } = useParams();
  const { data: mission, error, loading } = useFetch(() => getMission(id), [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-margin-mobile py-space-3xl animate-pulse">
        <div className="h-8 w-2/3 bg-surface-container rounded mb-space-md" />
        <div className="aspect-video bg-surface-container rounded-xl mb-space-lg" />
        <div className="h-4 w-full bg-surface-container rounded mb-space-xs" />
        <div className="h-4 w-5/6 bg-surface-container rounded" />
      </div>
    );
  }

  if (error || !mission) {
    return (
      <div className="max-w-3xl mx-auto px-margin-mobile py-space-3xl flex flex-col items-center text-center gap-space-sm">
        <Icon name="explore_off" className="text-[32px] text-outline" />
        <p className="font-body-md text-body-md text-on-surface-variant">
          We couldn't find that Mission Monday post.
        </p>
        <Link to="/mission-mondays" className="font-label-md text-label-md text-primary hover:underline">
          Back to Mission Mondays
        </Link>
      </div>
    );
  }

  const cleanArticle = DOMPurify.sanitize(mission.article || "");

  return (
    <article className="max-w-3xl mx-auto px-margin-mobile py-space-2xl flex flex-col gap-space-lg">
      <Link
        to="/mission-mondays"
        className="inline-flex items-center gap-space-xs font-label-md text-label-md text-on-surface-variant hover:text-on-surface self-start"
      >
        <Icon name="arrow_back" className="text-[18px]" />
        All Mission Mondays
      </Link>

      <div className="flex flex-col gap-space-xs">
        {mission.county && (
          <span className="inline-flex items-center gap-1 self-start px-space-sm py-space-xxs rounded-full bg-tertiary-container text-on-tertiary font-label-sm text-label-sm">
            <Icon name="place" className="text-[14px]" />
            {mission.county} County
          </span>
        )}
        <h1 className="font-display text-headline-lg md:text-display-mobile text-on-surface tracking-tight">
          {mission.title}
        </h1>
        {mission.publish_date && (
          <p className="font-label-sm text-label-sm text-on-surface-variant">
            {new Date(mission.publish_date).toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      {mission.photos?.[0] && (
        <div className="rounded-xl overflow-hidden aspect-video bg-surface-container">
          <SafeImage
            src={mission.photos[0].image}
            alt={mission.title}
            className="w-full h-full object-cover"
            priority
          />
        </div>
      )}

      {mission.video_url && <VideoEmbed url={mission.video_url} title={mission.title} className="rounded-xl" />}

      {cleanArticle ? (
        <div
          className="font-body-md text-body-md text-on-surface leading-relaxed flex flex-col gap-space-sm [&_h2]:font-headline-sm [&_h2]:text-headline-sm [&_h3]:font-headline-sm [&_h3]:text-body-lg [&_ul]:list-disc [&_ul]:pl-space-lg [&_ol]:list-decimal [&_ol]:pl-space-lg [&_a]:text-primary [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-outline-variant [&_blockquote]:pl-space-md [&_blockquote]:italic"
          dangerouslySetInnerHTML={{ __html: cleanArticle }}
        />
      ) : (
        mission.summary && (
          <p className="font-body-md text-body-md text-on-surface leading-relaxed">{mission.summary}</p>
        )
      )}

      {mission.photos?.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
          {mission.photos.slice(1).map((photo) => (
            <div key={photo.id} className="aspect-square rounded-lg overflow-hidden bg-surface-container">
              <SafeImage src={photo.image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
