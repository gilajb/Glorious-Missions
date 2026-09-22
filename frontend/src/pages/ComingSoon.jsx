import { Link } from "react-router-dom";

import Icon from "../components/Icon";

/**
 * For a page whose content isn't written yet but whose route is real and
 * intentional -- distinct from NotFound, which is for URLs that don't
 * correspond to anything. Both are minimal by design; this one just says
 * "coming soon" instead of "not found."
 */
export default function ComingSoon({ title, description = "This story is coming soon. Check back shortly." }) {
  return (
    <div className="w-full max-w-[1320px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-space-4xl flex flex-col items-center text-center gap-space-md">
      <Icon name="hourglass_top" className="text-[32px] text-outline" />
      <h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
      <p className="font-body-md text-body-md text-on-surface-variant max-w-md">{description}</p>
      <Link
        to="/"
        className="inline-flex items-center justify-center px-space-xl py-space-sm bg-primary-container text-on-primary font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-all"
      >
        Back to Home
      </Link>
    </div>
  );
}
