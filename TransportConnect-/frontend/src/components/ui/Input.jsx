import { forwardRef } from "react"
import clsx from "clsx"

const Input = forwardRef(({ label, error, helperText, className, ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          "input-field",
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

Input.displayName = "Input"

export default Input
