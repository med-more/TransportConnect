import { forwardRef } from "react"
import clsx from "clsx"

const Textarea = forwardRef(({ label, error, helperText, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        className={clsx(
          "input-field min-h-[100px] resize-y",
          error && "border-destructive focus:ring-destructive",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
})

Textarea.displayName = "Textarea"

export default Textarea

