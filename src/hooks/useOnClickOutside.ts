import { RefObject, useEffect } from 'react';

const useOnClickOutside = (
  ref: RefObject<HTMLElement>,
  handler: ((event: Event) => void) | undefined,
) => {
  useEffect(() => {
    const listener = (event: Event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      handler?.(event);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mousedown', listener);
      window.addEventListener('touchstart', listener);

      return () => {
        window.removeEventListener('mousedown', listener);
        window.removeEventListener('touchstart', listener);
      };
    }
  }, [ref, handler]); // Re-run if ref or handler changes
};

export default useOnClickOutside;
