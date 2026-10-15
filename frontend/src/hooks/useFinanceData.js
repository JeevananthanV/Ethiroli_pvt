/**
 * useFinanceData – reusable hook for finance‑portal pages.
 *
 * Provides a consistent loading / error / retry pattern so every page
 * (Calendar, Transactions, Budgets, Tax, Invoices, etc.) behaves the same
 * way without copying the same useEffect boilerplate.
 *
 * Usage
 * -----
 * const { data, loading, error, refetch } = useFinanceData(
 *   () => financePortalApi.getBudgets(),          // fetcher function
 *   [page, limit, status]                        // deps that trigger refetch
 * );
 *
 * The hook runs once on mount, sets loading=true, calls the fetcher,
 * stores the result in `data`, and sets loading=false.
 * If the fetcher throws, `error` is set and a “Retry” function is returned.
 */
import { useState, useEffect } from 'react';

// -------------------------------------------------------------------------
// Helper: tiny wrapper that ensures we always have a functional fetcher.
// -------------------------------------------------------------------------
export function useFinanceData(
  fetcher,
  deps = [],               // optional dependency array – if empty, runs only once
  options = {}
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const result = await fetcher();
        if (!cancelled) {
          setData(result);
        }
      } catch (e) {
        if (!cancelled) {
          setError(
            e.response?.data?.message || e.message || 'Failed to load data'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    // cleanup – mark as cancelled so the final `setX` does not run
    return () => {
      cancelled = true;
    };
    // If the caller passed an explicit deps array, re‑run the effect when
    // those change.  Otherwise we only run once (the default behaviour).
    if (deps.length) {
      // nothing extra needed – the effect already depends on `deps` via the
      // outer useEffect parameter, but we re‑invoke load inside the effect
      // only once.  To get true re‑fetch on dep change, we simply let the
      // effect run again because deps are in the deps array.
    }
  }, [fetcher, ...deps]);

  const refetch = () => {
    // reset state and let the effect run again
    setData(null);
    setLoading(true);
    setError(null);
  };

  return { data, loading, error, refetch };
}
export default useFinanceData;