import { Link } from "react-router-dom";

import Icon from "../../components/Icon";

export default function EthicsCallout() {
  return (
    <section className="mt-space-3xl p-space-xl bg-surface-container rounded-2xl">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-lg items-center">
        <div className="md:col-span-8 flex flex-col gap-space-md">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-widest font-bold">
              Our Curatorial Ethics
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Dignity-First Visual Ministry
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Every photograph published by Glorious Photography Pictures is captured with
              informed consent, cultural deference, and relational accountability. We do not
              photograph hardship for emotional exploitation; we document faith, community, and
              the dignity of the people we serve.
            </p>
          </div>
          <div className="flex items-center gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm w-fit max-w-full">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0">
              <Icon name="verified" className="text-[18px]" />
            </div>
            <p className="font-body-sm text-body-sm text-on-surface leading-tight">
              100% of photographic subjects grant informed consent and receive printed family
              portraits.
            </p>
          </div>
        </div>
        <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-space-xs justify-center md:items-end">
          <Link
            to="/about"
            className="px-space-lg py-space-sm bg-surface-container-highest hover:bg-surface-dim text-on-surface font-label-md text-label-md rounded-lg transition-colors text-center"
          >
            Learn About Our Calling
          </Link>
          <Link
            to="/get-involved"
            className="px-space-lg py-space-sm bg-primary-container text-on-primary font-label-md text-label-md rounded-lg transition-colors shadow-sm text-center"
          >
            Join the Media Crew
          </Link>
        </div>
      </div>
    </section>
  );
}
