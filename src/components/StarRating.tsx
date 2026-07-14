export function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count: number;
  size?: "sm" | "md";
}) {
  const starSize = size === "md" ? "h-5 w-5" : "h-4 w-4";
  const textSize = size === "md" ? "text-base" : "text-sm";

  if (count === 0) {
    return (
      <div className="flex items-center gap-1.5">
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={`${starSize} text-line`} filled={false} />
          ))}
        </div>
        <span className={`${textSize} font-medium text-ink-faint`}>New</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon
            key={i}
            className={`${starSize} ${i < Math.round(rating) ? "text-amber-400" : "text-line"}`}
            filled={i < Math.round(rating)}
          />
        ))}
      </div>
      <span className={`${textSize} font-semibold text-ink`}>{rating.toFixed(1)}</span>
      <span className={`${textSize} text-ink-muted`}>
        ({count.toLocaleString()} review{count === 1 ? "" : "s"})
      </span>
    </div>
  );
}

function StarIcon({ className, filled }: { className?: string; filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.5} className={className}>
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L10 14.9l-5.2 2.73.99-5.8-4.21-4.1 5.82-.85L10 1.5z" />
    </svg>
  );
}
