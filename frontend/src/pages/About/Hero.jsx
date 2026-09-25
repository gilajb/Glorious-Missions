import { getSiteContent } from "../../api/endpoints";
import Icon from "../../components/Icon";
import { useFetch } from "../../hooks/useFetch";

/**
 * Shown when GET /api/site-content/about/ 404s (nothing published yet) or
 * otherwise fails to load -- on-brand generic copy, not the literal design
 * text, so it's visibly a fallback rather than content someone forgot to
 * customize.
 */
const FALLBACK_ABOUT = {
  title: "Restoring Dignity Through Faith and Photography",
  body: "Mission Monday began behind a camera lens in the Great Rift Valley, sent to proclaim Christ. We walk alongside indigenous churches and communities with reverence, practical care, and unconditional love.",
};

/**
 * Structurally different from the shared HeroSection (no full-bleed photo --
 * a two-column layout with a quote card instead), so this is a bespoke
 * section rather than a forced fit into that component.
 *
 * The reference design here split the headline across two styles --
 * default weight in on-surface, then an inline italic, primary-colored span
 * for "Lens of Grace". Standardized to a single consistent treatment (one
 * weight, one color, no italic) matching how every other headline on the
 * site is styled -- Home's hero, section headings, etc. never mix styles
 * mid-sentence.
 */
export default function Hero() {
  const { data } = useFetch(() => getSiteContent("about"));
  const title = data?.title || FALLBACK_ABOUT.title;
  const body = data?.body || FALLBACK_ABOUT.body;

  return (
    <section className="relative w-full overflow-hidden bg-surface-container-low pt-space-xl pb-space-3xl md:pt-space-2xl md:pb-space-4xl">
      <div className="absolute inset-0 bg-gradient-to-b from-surface/80 via-transparent to-surface-container-low pointer-events-none" />
      <div className="w-full px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[1320px] mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-space-xl">
          <div className="max-w-2xl flex flex-col">
            <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-primary-fixed text-on-primary-fixed mb-space-md w-fit">
              <Icon name="church" className="text-[16px]" />
              <span className="font-label-sm text-label-sm uppercase tracking-wider">
                Our Sacred Calling &amp; Heritage
              </span>
            </div>

            <h1 className="font-display text-display-mobile md:text-display text-on-surface tracking-tight leading-none mb-space-md">
              {title}
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed mb-space-lg">
              {body}
            </p>

            <div className="flex flex-wrap items-center gap-space-md pt-space-xs">
              <a
                href="#theological-creed"
                className="inline-flex items-center gap-space-xs px-space-lg py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-transform active:scale-95"
              >
                <span>Read Our Theological Creed</span>
                <Icon name="arrow_downward" className="text-[18px]" />
              </a>
              <a
                href="#core-tenets"
                className="inline-flex items-center gap-space-xs px-space-lg py-space-sm bg-surface text-on-surface font-label-lg text-label-lg rounded-lg shadow-sm hover:bg-surface-container transition-colors"
              >
                <span>Our Field Principles</span>
              </a>
            </div>
          </div>

          <div className="w-full lg:max-w-md flex flex-col gap-space-md bg-surface-container-lowest p-space-lg rounded-xl shadow-md">
            <div className="flex items-center justify-between pb-space-xs">
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                The Shuka Chronicle
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Est. 2014</span>
            </div>
            <div className="h-[2px] w-full bg-surface-variant" />
            <p className="font-display text-[19px] italic text-on-surface leading-snug">
              &ldquo;We made a covenant never to display a child or an elder in a state of
              stripped honor to harvest pity. We photograph kings and queens of the kingdom of
              heaven.&rdquo;
            </p>
            <div className="flex items-center gap-space-sm pt-space-xs">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary shrink-0">
                <Icon name="photo_camera" className="text-[20px]" />
              </div>
              <div>
                <div className="font-label-md text-label-md text-on-surface">
                  The Founding Charter
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Glorious Photography Pictures
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
