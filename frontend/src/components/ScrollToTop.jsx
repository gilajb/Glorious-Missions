import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router doesn't reset scroll position on navigation by default --
 * clicking a Link while scrolled down on the current page lands you at the
 * same scroll offset on the new page, which (depending on relative page
 * lengths) can look like the link "redirected to the bottom" of the
 * destination instead of its top. Also, BrowserRouter (non-data-router
 * mode, used here) doesn't auto-scroll to a #hash target on client-side
 * navigation the way a full page load would -- so this handles both: no
 * hash resets to the top, a hash scrolls the matching element into view
 * (elements you want this to land below the fixed header need
 * `scroll-mt-20`, same as the in-page anchors on the About page).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
