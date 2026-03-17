import * as React from "react"
import { cn } from "../../lib/utils"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "border-transparent bg-[#059669]/20 text-emerald-800 dark:bg-[#059669]/30 dark:text-emerald-300 hover:bg-[#059669]/30 dark:hover:bg-[#059669]/40",
    secondary: "border-transparent bg-gray-100 text-gray-900 dark:bg-dark-elevated dark:text-dark-text-secondary hover:bg-gray-200 dark:hover:bg-dark-hover",
    destructive: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/40",
    outline: "text-gray-950 dark:text-dark-text border border-gray-200 dark:border-dark-border",
    success: "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/40",
    warning: "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/40",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export { Badge }
