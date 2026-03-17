import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Notification, Severity } from '../types/notifications';

type NotificationContextValue = {
  notifications: Notification[];
  unreadCount: number;
  acknowledge: (id: string, byRole?: string) => void;
  dismiss: (id: string) => void;
  escalate: (id: string) => void;
  markAllRead: () => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

function bumpSeverity(s: Severity): Severity {
  if (s === 'LOW') return 'MEDIUM';
  if (s === 'MEDIUM') return 'HIGH';
  if (s === 'HIGH') return 'CRITICAL';
  return 'CRITICAL';
}

function isoMinutesAgo(mins: number) {
  const d = new Date(Date.now() - mins * 60 * 1000);
  return d.toISOString();
}

const SEED: Notification[] = [
  {
    id: 'N-1001',
    type: 'SYSTEM_HEALTH',
    severity: 'CRITICAL',
    title: 'System down: Camera feed lost',
    message: 'Cam 04 is offline (no heartbeat). Auto-escalation active.',
    source: { kind: 'camera', label: 'Cam 04 • Pod A' },
    timestamp: isoMinutesAgo(3),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'facility_manager',
  },
  {
    id: 'N-1002',
    type: 'INJURY_RISK',
    severity: 'CRITICAL',
    title: 'Injury risk detected',
    message: 'Deadlift: repeated lumbar flexion pattern across 6 sets.',
    source: { kind: 'zone', label: 'Free Weights • Platform A' },
    timestamp: isoMinutesAgo(6),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'head_coach',
  },
  {
    id: 'N-1003',
    type: 'ZONE_CONGESTION',
    severity: 'HIGH',
    title: 'Overcapacity: squat rack zone',
    message: 'Zone exceeded 100% capacity for 8 minutes.',
    source: { kind: 'zone', label: 'Squat Racks • Zone 2' },
    timestamp: isoMinutesAgo(11),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'front_desk',
  },
  {
    id: 'N-1004',
    type: 'FORM_CORRECTION',
    severity: 'HIGH',
    title: 'Form degradation spike',
    message: 'Squat: knee valgus detected in 68% of reps (last 15 min).',
    source: { kind: 'camera', label: 'Cam 02 • Squat Racks' },
    timestamp: isoMinutesAgo(18),
    isRead: true,
    isAcknowledged: false,
    assignedTo: 'head_coach',
  },
  {
    id: 'N-1005',
    type: 'PT_LEAD_IDENTIFIED',
    severity: 'MEDIUM',
    title: 'PT lead identified',
    message: 'Member shows consistent struggle patterns + high attendance.',
    source: { kind: 'member', label: 'Member: Rohan D.' },
    timestamp: isoMinutesAgo(26),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'facility_manager',
  },
  {
    id: 'N-1006',
    type: 'EQUIPMENT_ISSUE',
    severity: 'MEDIUM',
    title: 'Equipment issue reported',
    message: 'Treadmill 06 shows belt slip variance. Schedule inspection.',
    source: { kind: 'zone', label: 'Cardio Zone • Treadmill 06' },
    timestamp: isoMinutesAgo(45),
    isRead: true,
    isAcknowledged: true,
    assignedTo: 'facility_manager',
    acknowledgedBy: 'facility_manager',
    responseTimeMinutes: 9,
  },
  {
    id: 'N-1007',
    type: 'REVENUE_MILESTONE',
    severity: 'LOW',
    title: 'Revenue milestone',
    message: 'MRR crossed monthly target threshold.',
    source: { kind: 'revenue', label: 'Subscriptions' },
    timestamp: isoMinutesAgo(90),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'facility_manager',
  },
  {
    id: 'N-1008',
    type: 'INFO',
    severity: 'LOW',
    title: 'New camera calibration completed',
    message: 'Pose model recalibrated for Cam 01. Accuracy +2.1%.',
    source: { kind: 'camera', label: 'Cam 01 • Free Weights' },
    timestamp: isoMinutesAgo(120),
    isRead: true,
    isAcknowledged: true,
    assignedTo: 'facility_manager',
    acknowledgedBy: 'facility_manager',
    responseTimeMinutes: 3,
  },
  {
    id: 'N-1009',
    type: 'FORM_CORRECTION',
    severity: 'MEDIUM',
    title: 'Coaching opportunity',
    message: 'Bench press: scapular instability trending up this week.',
    source: { kind: 'zone', label: 'Bench Stations • Zone 3' },
    timestamp: isoMinutesAgo(65),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'trainer',
  },
  {
    id: 'N-1010',
    type: 'ZONE_CONGESTION',
    severity: 'MEDIUM',
    title: 'Queue building',
    message: 'Free weights utilization >85%. Monitor entry pacing.',
    source: { kind: 'zone', label: 'Free Weights • Zone A' },
    timestamp: isoMinutesAgo(33),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'front_desk',
  },
  {
    id: 'N-1011',
    type: 'SYSTEM_HEALTH',
    severity: 'HIGH',
    title: 'Pod temperature rising',
    message: 'Pod D4 temperature trend exceeded safe band.',
    source: { kind: 'system', label: 'Genyx Pod D4' },
    timestamp: isoMinutesAgo(14),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'facility_manager',
  },
  {
    id: 'N-1012',
    type: 'PT_LEAD_IDENTIFIED',
    severity: 'MEDIUM',
    title: 'Upsell trigger',
    message: 'Member hit 14 visits/30d with improving quality scores.',
    source: { kind: 'member', label: 'Member: Sneha R.' },
    timestamp: isoMinutesAgo(52),
    isRead: true,
    isAcknowledged: false,
    assignedTo: 'facility_manager',
  },
  {
    id: 'N-1013',
    type: 'INJURY_RISK',
    severity: 'HIGH',
    title: 'High injury exposure',
    message: 'Lunge: hip deviation >50% detected in last 20 minutes.',
    source: { kind: 'camera', label: 'Cam 05 • Functional' },
    timestamp: isoMinutesAgo(22),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'head_coach',
  },
  {
    id: 'N-1014',
    type: 'REVENUE_MILESTONE',
    severity: 'LOW',
    title: 'New conversion logged',
    message: 'AI outreach converted to PT Intro package.',
    source: { kind: 'revenue', label: 'Sales Log' },
    timestamp: isoMinutesAgo(170),
    isRead: true,
    isAcknowledged: true,
    assignedTo: 'facility_manager',
    acknowledgedBy: 'facility_manager',
    responseTimeMinutes: 12,
  },
  {
    id: 'N-1015',
    type: 'INFO',
    severity: 'LOW',
    title: 'Daily summary ready',
    message: 'Facility Intelligence Feed: daily digest generated.',
    source: { kind: 'system', label: 'Reporting Engine' },
    timestamp: isoMinutesAgo(240),
    isRead: false,
    isAcknowledged: false,
    assignedTo: 'executive',
  },
];

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(SEED);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const acknowledge = (id: string, byRole?: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              isAcknowledged: true,
              isRead: true,
              acknowledgedBy: (byRole as any) ?? n.acknowledgedBy,
              responseTimeMinutes: n.responseTimeMinutes ?? Math.max(1, Math.floor((Date.now() - new Date(n.timestamp).getTime()) / (1000 * 60))),
            }
          : n
      )
    );
  };

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const escalate = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, severity: bumpSeverity(n.severity), isRead: false }
          : n
      )
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const value = useMemo<NotificationContextValue>(
    () => ({ notifications, unreadCount, acknowledge, dismiss, escalate, markAllRead }),
    [notifications, unreadCount]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within a NotificationProvider');
  return ctx;
}

