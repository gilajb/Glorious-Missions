import { Link } from "react-router-dom";

import Icon from "./Icon";
import SafeImage from "./SafeImage";

/**
 * Reusable page hero. Each page supplies its own copy/image/CTAs; the visual
 * treatment (overlay, sizing, typography) stays consistent site-wide.
 *
 * A CTA is `{ label, to, icon? }`: `to` renders a router `<Link>` for
 * internal navigation. `background` is nullable -- until Cloudinary is
 * configured (or for pages with no photo yet) it falls back to a plain
 * surface tone rather than a broken image.
 *
 * `aside`, if given, sits beside the headline on large screens and below
 * the CTAs on small ones (e.g. the home page's scripture card).
 *
 * `children`, if given, renders below the CTAs (e.g. a page-specific stats
 * strip) -- kept out of this component so it stays generic.
 */
export default function HeroSection({
  eyebrow,
  title,
  subtitle,
  background = null,
  backgroundAlt = "",
  primaryCta,
  secondaryCta,
  aside,
  children,
  priority = true,
}) {
  const isShortTitle = typeof title === "string" && title.trim().length <= 12;

  return (
    // -mt-20 cancels Layout's `pt-20` (the fixed header's height) so the
    // background photo runs full-bleed behind the translucent header, as in
    // the reference design -- this only reads correctly when HeroSection is
    // a page's first rendered element.
    <section className="relative w-full -mt-20 overflow-hidden bg-surface-container-low">
      <div className="absolute inset-0 z-0">
        <SafeImage
          src={background}
          alt={backgroundAlt}
          className="w-full h-full object-cover object-center"
          priority={priority}
        />
        {/*
          The content block is pinned to the bottom (`justify-end` below), so
          the scrim must be darkest there and lighten toward the top -- the
          original export's gradient did the opposite (a light, fully-opaque
          stop right behind the headline), which is why the text was
          unreadable over a bright photo.
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-on-background/90 via-on-background/60 to-on-background/10" />
        <div className="absolute inset-0 bg-secondary/15 mix-blend-multiply" />
      </div>

      {/*
        pt-space-4xl (96px) rather than the smaller 3xl: the fixed header is
        83px tall (h-20 + its 3px stripe) and this section runs full-bleed
        behind it, so top padding is the only thing keeping the title clear
        of the header once content (long body copy + wrapping CTAs on
        mobile) exceeds min-h and the flex box has no slack left above it.
      */}
      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pt-space-4xl pb-space-xl md:pb-space-2xl flex flex-col justify-end min-h-[70vh] md:min-h-[max(30rem,31.25vw)]">
        <div className="grid gap-space-xl lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:items-end">
        <div className="max-w-2xl flex flex-col items-start">
          {eyebrow && (
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xxs rounded-full bg-surface-container-lowest/90 backdrop-blur-md mb-space-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface">
                {eyebrow}
              </span>
            </div>
          )}

          {/*
            A one-word title ("SENT") at the regular display size looks lost
            against a full-bleed photo, so short titles get a statement size.
            Longer admin-entered titles keep the regular display scale.
          */}
          <h1
            className={`font-display text-surface-container-lowest drop-shadow-md font-bold ${
              isShortTitle
                ? "text-[clamp(2.75rem,7vw,4.75rem)] leading-none tracking-[0.08em]"
                : "text-display-mobile md:text-display tracking-tight"
            }`}
          >
            {title}
          </h1>

          <span aria-hidden="true" className="block w-16 h-1 rounded-full bg-primary-container mt-space-sm mb-space-md" />

          {subtitle && (
            <p className="font-display italic text-[19px] leading-[1.4] md:text-[22px] text-surface-container-lowest/90 max-w-xl drop-shadow-sm mb-space-xl md:mb-space-2xl">
              {subtitle}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div className="flex flex-wrap items-center gap-space-md w-full sm:w-auto">
              {primaryCta && (
                <Link
                  to={primaryCta.to}
                  className="inline-flex items-center justify-center px-space-xl py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-md hover:bg-primary transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {primaryCta.icon && <Icon name={primaryCta.icon} className="text-[20px] mr-space-xs" />}
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  to={secondaryCta.to}
                  className="inline-flex items-center justify-center px-space-xl py-space-sm bg-surface-container-lowest/95 backdrop-blur-sm text-on-surface font-label-lg text-label-lg rounded-lg shadow-sm hover:bg-surface-container-lowest hover:text-primary transition-all"
                >
                  {secondaryCta.icon && (
                    <Icon name={secondaryCta.icon} className="text-[20px] mr-space-xs" />
                  )}
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>

        {aside}
        </div>

        {children}
      </div>
    </section>
  );
}
