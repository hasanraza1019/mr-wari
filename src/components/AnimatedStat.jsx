import { useEffect, useRef, useState } from "react";
import useReveal from "../hooks/useReveal";

/**
 * Renders a stat value like "4+", "30+", "4.8★" and animates the numeric
 * part counting up from 0 once it scrolls into view. Non-numeric prefix/suffix
 * characters are preserved as-is.
 */
export default function AnimatedStat({ value, duration = 1200 }) {
  const [ref, inView] = useReveal(0.4);
  const [display, setDisplay] = useState(value.replace(/[0-9.]/g, (c) => (c === "." ? "." : "0")));
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;

    const match = value.match(/[0-9]+(\.[0-9]+)?/);
    if (!match) {
      setDisplay(value);
      return;
    }
    const target = parseFloat(match[0]);
    const prefix = value.slice(0, match.index);
    const suffix = value.slice(match.index + match[0].length);
    const isDecimal = match[0].includes(".");
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      setDisplay(`${prefix}${isDecimal ? current.toFixed(1) : Math.round(current)}${suffix}`);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

