import Icon from "../../components/Icon";

/**
 * Distinct treatment from every other page's hero: a solid tertiary-green
 * band with a low-opacity diagonal polygon, rather than a photo + dark
 * scrim (Home) or a plain gradient (About/Missions/Contact). Kept as-is
 * from the reference for now -- flagged for review in the handoff, not a
 * silent decision either way.
 *
 * The reference's "142+ Active Field Servants" / "18 Hubs" stat cards were
 * dropped: invented numbers with nothing in the schema to back them, same
 * category of fabrication already corrected on Home/Missions/Gallery.
 */
export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-tertiary text-on-tertiary py-space-3xl px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" fill="currentColor" preserveAspectRatio="none" viewBox="0 0 100 100">
          <polygon points="0,0 100,0 50,100" />
        </svg>
      </div>
      <div className="relative max-w-[1320px] mx-auto flex flex-col gap-space-sm">
        <div className="inline-flex items-center gap-space-xs px-space-sm py-space-xxs rounded-full bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm uppercase tracking-widest self-start">
          <Icon name="diversity_3" className="text-[14px]" />
          <span>Communion &middot; Service &middot; Presence</span>
        </div>
        <h1 className="font-display text-display-mobile md:text-display leading-tight text-on-tertiary">
          Walk Beside Us in the Harvest
        </h1>
        <p className="font-body-lg text-body-lg text-on-tertiary/90 leading-relaxed max-w-xl">
          We believe real transformation unfolds at the intersection of dedicated prayer, cultural
          storytelling, and practical hospitality across Kenya.
        </p>
      </div>
    </section>
  );
}
