import type { Role } from '../config/rolePermissions';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type NotificationSource = {
  kind: 'zone' | 'camera' | 'system' | 'revenue' | 'member';
  label: string; // e.g. "Free Weights Zone A" or "Cam 04"
};

export type NotificationType =
  | 'FORM_CORRECTION'
  | 'ZONE_CONGESTION'
  | 'SYSTEM_HEALTH'
  | 'REVENUE_MILESTONE'
  | 'PT_LEAD_IDENTIFIED'
  | 'EQUIPMENT_ISSUE'
  | 'INJURY_RISK'
  | 'INFO';

export type Notification = {
  id: string;
  type: NotificationType;
  severity: Severity;
  title: string;
  message: string;
  source: NotificationSource;
  timestamp: string; // ISO
  isRead: boolean;
  isAcknowledged: boolean;
  assignedTo: Role;
  acknowledgedBy?: Role;
  responseTimeMinutes?: number;
};

export const SeverityConfig: Record<
  Severity,
  {
    label: Severity;
    pillClass: string;
    escalateAfterMinutes: number;
  }
> = {
  CRITICAL: {
    label: 'CRITICAL',
    pillClass: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 border-red-100 dark:border-red-900/40',
    escalateAfterMinutes: 5,
  },
  HIGH: {
    label: 'HIGH',
    pillClass: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 border-orange-100 dark:border-orange-900/40',
    escalateAfterMinutes: 15,
  },
  MEDIUM: {
    label: 'MEDIUM',
    pillClass: 'bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300 border-amber-100 dark:border-amber-900/40',
    escalateAfterMinutes: 60,
  },
  LOW: {
    label: 'LOW',
    pillClass: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-900/40',
    escalateAfterMinutes: 240,
  },
};

export function minutesAgo(iso: string, now = new Date()) {
  const t = new Date(iso).getTime();
  return Math.max(0, Math.floor((now.getTime() - t) / (1000 * 60)));
}

