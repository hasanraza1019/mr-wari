import { useEffect, useRef, useState } from "react";

/**
 * useReveal — IntersectionObserver based scroll reveal hook.
 * Returns a ref to attach to any element, and a boolean that flips
 * to true once the element scrolls into view (fires only once).
 */
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, inView];
}

