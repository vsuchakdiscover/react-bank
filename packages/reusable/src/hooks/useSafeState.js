import { useEffect, useRef, useState } from "react";

/**
 * Provides the functionality of React.useState() with the only difference that
 * it sets a state only if its parent component is still mounted, aka "safe setState".
 */
export default function useSafeState(initialState) {
  const mountedRef = useRef(false);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    mountedRef.current = true;
    return () => (mountedRef.current = false);
  }, []);

  const safeSetState = (...args) => mountedRef.current && setState(...args);

  return [state, safeSetState];
}
