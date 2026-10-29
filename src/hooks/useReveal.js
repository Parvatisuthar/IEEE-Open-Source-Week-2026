import { useEffect, useRef, useState } from 'react';

/**
 * Returns [ref, inView]. Attach ref to an element and add the
 * "in" class when inView is true (see .osw-rv in osw-shared.css).
 * Fires once, then stops observing.
 */
export default function useReveal(threshold = 0.1) {
  const ref = useRef(null);
  // no IntersectionObserver (very old browsers): just show the content
  const [inView, setInView] = useState(() => !('IntersectionObserver' in window));

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return [ref, inView];
}
