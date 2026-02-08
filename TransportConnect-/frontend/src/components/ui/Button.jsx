import { forwardRef } from "react"
import clsx from "clsx"
import LoadingSpinner from "./LoadingSpinner"

const Button = forwardRef(
  ({ children, className, variant = "primary", size = "medium", loading = false, disabled = false, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
      outline: "border border-border bg-transparent hover:bg-accent hover:text-accent-foreground focus:ring-primary",
      ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-primary",
      danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive shadow-sm",
      link: "text-primary underline-offset-4 hover:underline focus:ring-primary",
    }

    const sizes = {
      small: "h-8 px-2 sm:px-3 text-xs sm:text-sm",
      medium: "h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm",
      large: "h-10 sm:h-11 px-6 sm:px-8 text-sm sm:text-base",
      icon: "h-9 sm:h-10 w-9 sm:w-10",
    }

    return (
      <button
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          (disabled || loading) && "opacity-50 cursor-not-allowed",
          className,
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <LoadingSpinner className="mr-2" />}
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"

export default Button
