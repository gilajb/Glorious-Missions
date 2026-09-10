import { Link } from "react-router-dom";

import { getInvolvedLinks } from "../../api/endpoints";
import Icon from "../../components/Icon";
import { useFetch } from "../../hooks/useFetch";

function iconForSocialLink(title = "") {
  const t = title.toLowerCase();
  if (t.includes("instagram")) return "photo_camera";
  if (t.includes("youtube")) return "smart_display";
  if (t.includes("whatsapp")) return "chat";
  if (t.includes("facebook")) return "thumb_up";
  if (t.includes("tiktok")) return "music_note";
  if (t.includes("twitter") || t === "x" || t.startsWith("x ")) return "alternate_email";
  return "public";
}

function EmptyRow({ children }) {
  return <p className="font-body-sm text-body-sm text-on-surface-variant italic">{children}</p>;
}

function CardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg animate-pulse flex flex-col gap-space-sm">
      <div className="h-4 w-1/3 bg-surface-container rounded" />
      <div className="h-5 w-2/3 bg-surface-container rounded" />
      <div className="h-4 w-full bg-surface-container rounded" />
    </div>
  );
}

/**
 * Fetches GetInvolvedLink once and groups by link_type (donate/social/email)
 * -- the API has no `published` filter, so every row it returns is meant to
 * be public already. The reference design's "Financial Partnership" card
 * had a specific M-Pesa till number and bank account baked into the markup;
 * publishing invented payment details would be actively dangerous (someone
 * could send real money to a made-up account), so that card renders
 * whatever real `donate` links exist instead, with an honest empty state if
 * none are published yet -- same treatment for the `email` (prayer network)
 * and `social` (community channels) groups.
 */
export default function Pillars() {
  const { data, error, loading } = useFetch(() => getInvolvedLinks());
  const links = data || [];
  const failed = !loading && error;

  const donateLinks = links.filter((l) => l.link_type === "donate");
  const emailLinks = links.filter((l) => l.link_type === "email");
  const socialLinks = links.filter((l) => l.link_type === "social");

  return (
    <div className="flex flex-col gap-space-xl">
      <div className="flex flex-col gap-space-xxs">
        <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold">
          Distinct Avenues of Engagement
        </span>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Pillars of Solidarity</h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Choose how you wish to weave your hands and heart into this visual and pastoral journey.
        </p>
      </div>

      <div className="flex flex-col gap-space-lg">
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* Financial Partnership & Giving -- donate-type links */}
            <div
              id="giving"
              className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-sm hover:shadow-md transition-shadow scroll-mt-20"
            >
              <div className="flex items-center justify-between">
                <span className="px-space-xs py-space-xxs rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider">
                  Sustainable Ministry
                </span>
                <Icon name="payments" className="text-primary text-[20px]" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Financial Partnership &amp; Giving
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Your giving fuels field ministry, documentary work, and practical care.
              </p>
              <div className="flex flex-col gap-space-xs pt-space-xxs">
                {failed || donateLinks.length === 0 ? (
                  <EmptyRow>Giving channels are being set up — check back soon.</EmptyRow>
                ) : (
                  donateLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-space-xs font-label-md text-label-md text-primary hover:text-primary-container transition-colors font-bold"
                    >
                      <span>{link.title}</span>
                      <Icon name="arrow_forward" className="text-[16px]" />
                    </a>
                  ))
                )}
              </div>
            </div>

            {/* Documentary Storyteller Fellowship -- static, points at the form below */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="px-space-xs py-space-xxs rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm uppercase tracking-wider">
                  Storyteller Guild
                </span>
                <Icon name="camera" className="text-secondary text-[20px]" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Documentary Storyteller Fellowship
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                We welcome visual artists, photographers, and writers passionate about telling
                these stories with dignity and grace.
              </p>
              <div className="pt-space-xxs">
                <a
                  href="#volunteer-form"
                  className="inline-flex items-center gap-space-xs font-label-md text-label-md text-secondary hover:underline font-bold"
                >
                  <span>Apply for Fellowship</span>
                  <Icon name="north_east" className="text-[16px]" />
                </a>
              </div>
            </div>

            {/* Prayer & Intercession -- email-type links */}
            <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="px-space-xs py-space-xxs rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider">
                  Spiritual Shield
                </span>
                <Icon name="church" className="text-tertiary text-[20px]" />
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">
                Prayer &amp; Intercession Guild
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Join our prayer network to receive requests from the field and stand with us.
              </p>
              <div className="flex flex-col gap-space-xs pt-space-xxs">
                <Link
                  to="/prayer"
                  className="inline-flex items-center gap-space-xs font-label-md text-label-md text-tertiary hover:underline font-bold"
                >
                  <span>Submit a Prayer Request</span>
                  <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
                {!failed &&
                  emailLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      className="inline-flex items-center gap-space-xs font-label-md text-label-md text-tertiary hover:underline font-bold"
                    >
                      <span>{link.title}</span>
                      <Icon name="arrow_forward" className="text-[16px]" />
                    </a>
                  ))}
              </div>
            </div>

            {/* Community Channels & Advocacy -- social-type links */}
            <div
              id="community-channels"
              className="bg-surface-container rounded-xl p-space-lg flex flex-col gap-space-md scroll-mt-20"
            >
              <div className="flex flex-col gap-space-xxs">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Community Channels &amp; Advocacy
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Amplify these stories by following and sharing our channels.
                </p>
              </div>
              {failed || socialLinks.length === 0 ? (
                <EmptyRow>Our social channels will be linked here soon.</EmptyRow>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  {socialLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-surface-container-lowest hover:bg-surface-container-high transition-colors p-space-md rounded-lg flex flex-col items-center text-center gap-space-xs shadow-sm"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                        <Icon name={iconForSocialLink(link.title)} className="text-[20px]" />
                      </div>
                      <span className="font-label-md text-label-md text-on-surface">{link.title}</span>
                      {link.description && (
                        <span className="font-body-sm text-body-sm text-on-surface-variant">
                          {link.description}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
