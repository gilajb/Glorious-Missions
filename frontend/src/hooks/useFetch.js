import { useCallback, useEffect, useState } from "react";

// The Render backend's free plan spins down after ~15 min idle, so the
// first request after that gets a connection failure or 5xx while it wakes
// back up (typically 20-50s). Retrying those two error kinds with backoff
// keeps `loading` true through that window instead of surfacing the page's
// empty/fallback state for what's actually a cold start, not missing data.
// Non-transient kinds (404/429/400/401/403) are not retried.
const RETRYABLE_KINDS = new Set(["network", "server"]);
const RETRY_DELAYS_MS = [2000, 4000, 8000, 15000, 20000];

/**
 * Runs an API call on mount (and whenever `deps` changes) and exposes
 * {data, error, loading, reload}. `error`, when set, is the ApiError thrown
 * by the API client -- read `error.kind` ("not_found" | "rate_limited" |
 * "validation" | "server" | "network") to decide what to render.
 *
 * @param {() => Promise<any>} fetchFn
 * @param {React.DependencyList} [deps]
 */
export function useFetch(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetchFn is intentionally excluded from the callback's own deps: callers
  // pass a fresh arrow function each render (e.g. `() => getMissions()`), so
  // depending on it would refetch every render. `deps` is how a caller opts
  // into refetching (e.g. `[section]` for a page whose section can change).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const load = useCallback(() => {
    let cancelled = false;
    let timeoutId;
    setLoading(true);
    setError(null);

    const attempt = (retryCount) => {
      fetchFn()
        .then((result) => {
          if (!cancelled) {
            setData(result);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (cancelled) return;
          const delay = RETRYABLE_KINDS.has(err.kind) ? RETRY_DELAYS_MS[retryCount] : undefined;
          if (delay !== undefined) {
            timeoutId = setTimeout(() => attempt(retryCount + 1), delay);
          } else {
            setError(err);
            setLoading(false);
          }
        });
    };

    attempt(0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => load(), [load]);

  return { data, error, loading, reload: load };
}
