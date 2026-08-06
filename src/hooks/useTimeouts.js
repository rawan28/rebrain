import { useRef, useCallback, useEffect } from 'react';

export default function useTimeouts() {
  const timeoutsRef = useRef([]);

  const setTimeoutAndTrack = useCallback((fn, ms) => {
    const id = setTimeout(fn, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const push = useCallback((id) => {
    timeoutsRef.current.push(id);
  }, []);

  const clearAll = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  useEffect(() => () => clearAll(), [clearAll]);

  return { setTimeoutAndTrack, clearAll, push };
}
