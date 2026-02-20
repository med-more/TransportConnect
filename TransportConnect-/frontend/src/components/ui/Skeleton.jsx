import clsx from "clsx"

/**
 * Skeleton placeholder for loading states.
 * @param {string} className - Additional Tailwind classes
 * @param {string} variant - "line" | "circle" | "rect" | "card" | "avatar" | "text"
 * @param {number} lines - For "text" variant, number of lines
 */
function Skeleton({ className, variant = "line", lines = 3, ...props }) {
  const base = "animate-pulse bg-muted rounded"

  if (variant === "circle") {
    return <div className={clsx(base, "rounded-full", className)} {...props} />
  }

  if (variant === "text") {
    return (
      <div className={clsx("space-y-2", className)} {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(base, "h-3", i === lines - 1 && lines > 1 ? "w-[85%]" : "w-full")}
          />
        ))}
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div className={clsx("rounded-xl border border-border p-4 sm:p-5 md:p-6 space-y-4", className)} {...props}>
        <div className="flex items-center justify-between">
          <div className={clsx(base, "h-5 w-24")} />
          <div className={clsx(base, "h-8 w-16")} />
        </div>
        <div className={clsx(base, "h-4 w-full")} />
        <div className={clsx(base, "h-4 w-3/4")} />
        <div className="flex gap-2">
          <div className={clsx(base, "h-9 flex-1")} />
          <div className={clsx(base, "h-9 flex-1")} />
        </div>
      </div>
    )
  }

  if (variant === "avatar") {
    return <div className={clsx(base, "rounded-full flex-shrink-0", className)} {...props} />
  }

  return <div className={clsx(base, "rounded-md", className)} {...props} />
}

export default Skeleton
