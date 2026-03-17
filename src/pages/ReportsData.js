// ─── Section 1: Data for Report Generator ───────────────────────────────────
export const reportCategories = [
  { id: 'facility', label: 'Facility Overview', desc: 'Occupancy, utilization & energy' },
  { id: 'revenue',  label: 'Revenue & Sales',   desc: 'ROI, MRR & upsell pipeline' },
  { id: 'training', label: 'Coaching IQ',       desc: 'Form scores & injury risk' },
  { id: 'members',  label: 'Member Analytics',  desc: 'Retention, churn & segments' },
  { id: 'system',   label: 'System Health',     desc: 'Camera uptime & AI precision' },
];

export const deliveryChannels = [
  { id: 'email', label: 'Email', icon: 'Mail' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'MessageSquare' },
  { id: 'push', label: 'App Push', icon: 'Bell' },
];

// ─── Section 2: Recent Exports ──────────────────────────────────────────────
export const recentReports = [
  { 
    id: 'REP-7721', 
    name: 'Executive Performance Summary', 
    category: 'Revenue',
    date: 'Mar 16, 2026', 
    size: '2.4 MB',
    type: 'PDF',
    status: 'Ready',
    recipients: ['Manager', 'Owner']
  },
  { 
    id: 'REP-7719', 
    name: 'Training Intelligence Monthly', 
    category: 'Training',
    date: 'Mar 12, 2026', 
    size: '1.8 MB',
    type: 'PDF',
    status: 'Sent',
    recipients: ['Head Coach', 'Staff']
  },
  { 
    id: 'REP-7715', 
    name: 'Member Retention Data Raw', 
    category: 'Members',
    date: 'Mar 10, 2026', 
    size: '12 KB',
    type: 'CSV',
    status: 'Ready',
    recipients: ['Admin']
  },
  { 
    id: 'REP-7712', 
    name: 'Facility Intelligence ROI', 
    category: 'Facility',
    date: 'Mar 05, 2026', 
    size: '3.1 MB',
    type: 'PDF',
    status: 'Archived',
    recipients: ['Owner']
  },
];

// ─── Section 3: Scheduled Deliveries ────────────────────────────────────────
export const scheduledReports = [
  {
    id: 1,
    name: 'Weekly Revenue Impact',
    frequency: 'Weekly',
    time: 'Mon, 8:00 AM',
    channels: ['email', 'whatsapp'],
    active: true
  },
  {
    id: 2,
    name: 'Daily Injury Risk Alerts',
    frequency: 'Daily',
    time: '9:00 PM',
    channels: ['push', 'email'],
    active: true
  },
  {
    id: 3,
    name: 'Monthly Staff Performance',
    frequency: 'Monthly',
    time: '1st Day, 10:00 AM',
    channels: ['email'],
    active: false
  }
];

// ─── Section 4: Preview Data for Trends ─────────────────────────────────────
export const reportPreviewStats = [
  { month: 'Jan', revenue: 42000, impact: 8400, form: 62 },
  { month: 'Feb', revenue: 45000, impact: 9800, form: 65 },
  { month: 'Mar', revenue: 48500, impact: 12400, form: 67 },
];
