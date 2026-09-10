import { useCallback, useEffect, useState } from "react";

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
    setLoading(true);
    setError(null);

    fetchFn()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => load(), [load]);

  return { data, error, loading, reload: load };
}
