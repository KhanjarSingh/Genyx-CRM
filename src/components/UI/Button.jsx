import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-[#059669] text-emerald-950 hover:bg-[#10b981] shadow-sm",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
    outline: "border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface hover:bg-gray-50 dark:hover:bg-dark-elevated text-gray-900 dark:text-dark-text shadow-sm",
    secondary: "bg-gray-100 dark:bg-dark-elevated text-gray-900 dark:text-dark-text hover:bg-gray-200 dark:hover:bg-dark-hover",
    ghost: "hover:bg-gray-100 dark:hover:bg-dark-elevated hover:text-gray-900 dark:hover:text-dark-text text-gray-600 dark:text-dark-text-secondary",
    link: "text-[#059669] underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white dark:ring-offset-dark-bg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
