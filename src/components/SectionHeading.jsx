export default function SectionHeading({ eyebrow, title, description, className = "" }) {
  return (
    <div className={`max-w-[640px] mb-14 ${className}`}>
      <span className="font-poppins font-semibold tracking-[3px] uppercase text-[12.5px] text-gold">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-[clamp(34px,4.5vw,54px)]">{title}</h2>
      {description && (
        <p className="mt-4 text-creamDim text-[16px] leading-relaxed">{description}</p>
      )}
    </div>
  );
}

