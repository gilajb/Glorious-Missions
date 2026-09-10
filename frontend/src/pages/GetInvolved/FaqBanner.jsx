import { Link } from "react-router-dom";

import Icon from "../../components/Icon";

export default function FaqBanner() {
  return (
    <section className="w-full bg-surface-container-low py-space-3xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
      <div className="max-w-[1320px] mx-auto flex flex-col md:flex-row items-center justify-between gap-space-xl">
        <div className="flex flex-col gap-space-xs max-w-xl">
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold">
            Frequently Addressed Inquiries
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface">
            Questions on Cultural Preparedness?
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant">
            We prioritize local community autonomy, theological humility, and cross-cultural
            respect in every visual or ministry assignment.
          </p>
        </div>
        <div className="flex flex-wrap gap-space-sm shrink-0">
          <Link
            to="/about"
            className="px-space-lg py-space-sm rounded-lg bg-surface-container-lowest text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors shadow-sm flex items-center gap-space-xs"
          >
            <Icon name="auto_stories" className="text-[18px]" />
            <span>Read Our Theology of Mission</span>
          </Link>
          <Link
            to="/contact"
            className="px-space-lg py-space-sm rounded-lg bg-secondary text-on-secondary font-label-lg text-label-lg hover:opacity-95 transition-opacity shadow-sm flex items-center gap-space-xs"
          >
            <Icon name="support_agent" className="text-[18px]" />
            <span>Speak With Our Team</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
