import useReveal from "../hooks/useReveal";

/**
 * <Reveal> wraps any block of content and fades/slides it in
 * once it scrolls into the viewport. Pass a `className` for layout,
 * and optionally `as` to change the wrapping element tag.
 */
export default function Reveal({ children, className = "", as: Tag = "div" }) {
  const [ref, inView] = useReveal();

  return (
    <Tag ref={ref} className={`reveal ${inView ? "in" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
