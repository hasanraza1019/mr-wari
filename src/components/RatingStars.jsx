export default function RatingStars({ rating = 5, reviews = 0 }) {
  const safeRating = Number(rating) || 5;

  return (
    <div className="flex items-center gap-2">
      <div className="flex text-gold text-sm">
        {"★★★★★".split("").map((star, index) => (
          <span key={index}>{star}</span>
        ))}
      </div>

      <span className="text-creamDim text-xs font-poppins">
        {safeRating.toFixed(1)}
        {reviews > 0 && ` (${reviews})`}
      </span>
    </div>
  );
}