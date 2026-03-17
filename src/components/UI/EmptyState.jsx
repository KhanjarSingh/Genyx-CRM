import { Button } from './Button';

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  background,
}) {
  return (
    <div className={`relative w-full rounded-2xl border border-gray-100 dark:border-dark-border bg-white dark:bg-dark-surface p-8 overflow-hidden ${background ? 'min-h-[260px]' : ''}`}>
      {background && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={background} />
      )}
      <div className="relative flex flex-col items-center justify-center text-center max-w-xl mx-auto gap-3">
        <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-dark-elevated border border-gray-100 dark:border-dark-border flex items-center justify-center text-gray-400 dark:text-dark-text-muted">
          {icon}
        </div>
        <h3 className="text-lg font-black text-gray-900 dark:text-dark-text tracking-tight">{title}</h3>
        <p className="text-sm font-bold text-gray-500 dark:text-dark-text-secondary leading-relaxed">{description}</p>
        <div className="mt-4 flex items-center gap-3 flex-wrap justify-center">
          {primaryAction && (
            <Button onClick={primaryAction.onClick} className="h-10 px-5 text-[11px] font-black uppercase tracking-widest">
              {primaryAction.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick} className="h-10 px-5 text-[11px] font-black uppercase tracking-widest">
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

