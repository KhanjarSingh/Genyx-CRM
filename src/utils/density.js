export function getDensityClasses(density) {
  switch (density) {
    case 'compact':
      return 'p-3 gap-2 text-xs';
    case 'spacious':
      return 'p-8 gap-6 text-base';
    case 'comfortable':
    default:
      return 'p-5 gap-4 text-sm';
  }
}
