import { useCallback, useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

/**
 * True when the primary input is a precise, hover-capable pointer.
 *
 * Uses `useSyncExternalStore` rather than `useState` + `useEffect`: the server
 * has no media queries, so it needs an explicit server snapshot (`false`).
 * Reading `matchMedia` during the initial client render instead would produce
 * markup that disagrees with the server's and trip a hydration mismatch.
 */
export function usePointerFine() {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const query = window.matchMedia(QUERY);
    query.addEventListener("change", onStoreChange);
    return () => query.removeEventListener("change", onStoreChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false
  );
}
