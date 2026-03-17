export type Role = 'executive' | 'facility_manager' | 'head_coach' | 'trainer' | 'front_desk';

export type RolePermissions = {
  allowedRoutes: string[];
  defaultRoute: string;
  hiddenSidebarItems: string[];
};

export const rolePermissions: Record<Role, RolePermissions> = {
  executive: {
    allowedRoutes: ['/corporate', '/revenue-sales', '/reports', '/health', '/settings'],
    defaultRoute: '/corporate',
    hiddenSidebarItems: [
      'Facility Overview',
      'Live Activity',
      'Member Analytics',
      'Training Intelligence',
    ],
  },
  facility_manager: {
    allowedRoutes: [
      '/',
      '/live-activity',
      '/member-analytics',
      '/training-quality',
      '/revenue-sales',
      '/reports',
      '/health',
      '/settings',
      '/corporate',
    ],
    defaultRoute: '/',
    hiddenSidebarItems: [],
  },
  head_coach: {
    allowedRoutes: ['/training-quality', '/member-analytics', '/live-activity', '/settings'],
    defaultRoute: '/training-quality',
    hiddenSidebarItems: ['Facility Overview', 'Revenue & Sales', 'Reports', 'System Health', 'Corporate Overview'],
  },
  trainer: {
    allowedRoutes: ['/member-analytics', '/settings'],
    defaultRoute: '/member-analytics',
    hiddenSidebarItems: [
      'Facility Overview',
      'Live Activity',
      'Training Intelligence',
      'Revenue & Sales',
      'Reports',
      'System Health',
      'Corporate Overview',
    ],
  },
  front_desk: {
    allowedRoutes: ['/live-activity', '/member-analytics', '/settings'],
    defaultRoute: '/live-activity',
    hiddenSidebarItems: [
      'Facility Overview',
      'Training Intelligence',
      'Revenue & Sales',
      'Reports',
      'System Health',
      'Corporate Overview',
    ],
  },
};

export function isRouteAllowed(role: Role, path: string) {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return rolePermissions[role].allowedRoutes.includes(normalized);
}

