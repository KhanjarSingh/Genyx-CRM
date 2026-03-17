import * as React from "react"
import { cn } from "../../lib/utils"
import { useThemeContext } from "../../context/ThemeContext"
import { getDensityClasses } from "../../utils/density"

const Card = React.forwardRef(({ className, title, subtitle, actions, children, ...props }, ref) => {
  const { density } = useThemeContext();
  const densityClasses = getDensityClasses(density);

  // Custom parsing to split padding vs gap vs text for content area
  const padClass = densityClasses.split(' ').find(c => c.startsWith('p-'));

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border shadow-sm transition-shadow duration-200 hover:shadow-lg",
        "bg-white border-gray-200 text-gray-950",
        "dark:bg-dark-card dark:border-dark-border dark:text-dark-text dark:shadow-black/10 dark:hover:shadow-black/20",
        className
      )}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className={cn("flex flex-col space-y-1.5 border-b border-gray-100 dark:border-dark-border", padClass)}>
          <div className="flex items-start justify-between">
            <div>
              {title && <h3 className="font-bold leading-tight tracking-tight text-gray-900 dark:text-dark-text">{title}</h3>}
              {subtitle && <p className="text-sm font-light text-gray-500 dark:text-dark-text-secondary mt-1">{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      {children}
    </div>
  )
})
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => {
  const { density } = useThemeContext();
  const padClass = getDensityClasses(density).split(' ').find(c => c.startsWith('p-'));
  return (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5", padClass, className)}
      {...props}
    />
  );
})
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-bold leading-tight tracking-tight text-gray-900 dark:text-dark-text",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-light text-gray-500 dark:text-dark-text-secondary", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => {
  const { density } = useThemeContext();
  const classes = getDensityClasses(density).split(' ');
  const padClass = classes.find(c => c.startsWith('p-'));
  const textClass = classes.find(c => c.startsWith('text-'));
  return (
    <div ref={ref} className={cn(padClass, "pt-0", textClass, className)} {...props} />
  );
})
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => {
  const { density } = useThemeContext();
  const padClass = getDensityClasses(density).split(' ').find(c => c.startsWith('p-'));
  return (
    <div
      ref={ref}
      className={cn("flex items-center pt-0", padClass, className)}
      {...props}
    />
  );
})
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
