import { Link } from "react-router-dom";

import Icon from "../../components/Icon";

const WAYS_TO_HELP = [
  {
    key: "sponsor",
    icon: "campaign",
    iconBg: "bg-primary-fixed",
    iconText: "text-primary",
    title: "Sponsor a Village Visit",
    description: "Help cover travel and logistics so our team can reach communities and document these stories of faith.",
    cta: "Give As You're Led",
    to: "/get-involved#giving",
    ctaClassName:
      "bg-surface-container text-on-surface hover:bg-primary hover:text-on-primary transition-colors",
    highlighted: false,
  },
  {
    key: "storytelling",
    icon: "photo_camera",
    iconBg: "bg-secondary-fixed",
    iconText: "text-secondary",
    title: "Support Documentary Storytelling",
    description:
      "Help fund the cameras, travel, and production behind every story we share from the field.",
    cta: "Support This Work",
    to: "/get-involved#giving",
    ctaClassName: "bg-primary-container text-on-primary hover:opacity-95 shadow-sm transition-opacity",
    highlighted: true,
  },
  {
    key: "prayer",
    icon: "mail",
    iconBg: "bg-tertiary-fixed",
    iconText: "text-tertiary",
    title: "Join Prayer Shield",
    description: "Receive confidential prayer bulletins directly from our field team and stand with us in prayer.",
    cta: "Subscribe for Prayer Updates",
    to: "/get-involved",
    ctaClassName:
      "bg-surface-container text-on-surface hover:bg-tertiary hover:text-on-tertiary transition-colors",
    highlighted: false,
  },
];

export default function InvolvementTeaser() {
  return (
    <section className="w-full py-space-3xl bg-surface-container">
      <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <span className="font-label-md text-label-md text-primary uppercase tracking-widest font-bold">
            Get Involved
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mt-space-xxs">
            Walk with Us
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            Prayer, presence, and partnership are all part of walking with us as we carry the
            Gospel to more communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {WAYS_TO_HELP.map((way) => (
            <div
              key={way.key}
              className={`bg-surface-container-lowest p-space-xl rounded-xl transition-shadow flex flex-col justify-between relative overflow-hidden ${
                way.highlighted ? "shadow-md" : "shadow-sm hover:shadow-md"
              }`}
            >
              {way.highlighted && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-primary-container" />
              )}
              <div>
                <div
                  className={`w-10 h-10 rounded-lg ${way.iconBg} flex items-center justify-center ${way.iconText} mb-space-md`}
                >
                  <Icon name={way.icon} className="text-[20px]" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
                  {way.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-space-md">
                  {way.description}
                </p>
              </div>
              <Link
                to={way.to}
                className={`inline-flex items-center justify-center w-full py-space-xs font-label-md text-label-md rounded-lg ${way.ctaClassName}`}
              >
                {way.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
