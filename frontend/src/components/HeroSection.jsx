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
  children,
}) {
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

      <div className="relative z-10 w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop pt-space-3xl md:pt-space-4xl pb-space-3xl md:pb-space-4xl flex flex-col justify-end min-h-[60vh] md:min-h-[70vh]">
        <div className="max-w-3xl flex flex-col items-start">
          {eyebrow && (
            <div className="inline-flex items-center gap-space-xs px-space-md py-space-xxs rounded-full bg-surface-container-lowest/90 backdrop-blur-md mb-space-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface">
                {eyebrow}
              </span>
            </div>
          )}

          <h1 className="font-display text-display-mobile md:text-display text-surface-container-lowest drop-shadow-sm font-bold tracking-tight mb-space-md">
            {title}
          </h1>

          {subtitle && (
            <p className="font-body-lg text-body-lg text-surface-container-high/95 max-w-2xl font-normal leading-relaxed mb-space-xl">
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

        {children}
      </div>
    </section>
  );
}
