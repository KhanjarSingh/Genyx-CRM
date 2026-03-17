export const facilityInitialInfo = {
  name: 'Genyx Flagship Gym',
  location: 'Manchester, UK',
  adminEmail: 'admin@genyx.com',
  phone: '+44 161 123 4567',
  operatingHours: '06:00 - 23:00',
  maxCapacity: 250
};

export const zoneConfigurations = [
  { id: 1, name: 'Strength Floor 1', pod: 'POD-A1', capacity: 45, camera: 'CAM-S1, CAM-S2' },
  { id: 2, name: 'Cardio Zone', pod: 'POD-B2', capacity: 30, camera: 'CAM-C1' },
  { id: 3, name: 'Free Weights', pod: 'POD-C3', capacity: 25, camera: 'CAM-F1, CAM-F2, CAM-F3' },
  { id: 4, name: 'Functional Area', pod: 'POD-D4', capacity: 20, camera: 'CAM-X1' },
];

export const aiThresholds = [
  { id: 'congestion', label: 'Congestion Alerts', desc: 'Trigger when zone exceeds 85% capacity', value: 85, type: 'range' },
  { id: 'form', label: 'Form Correction Urgency', desc: 'Only alert on high/critical deviations', value: 'High', type: 'select', options: ['Low', 'Medium', 'High'] },
  { id: 'lead', label: 'Sales Lead Detection', desc: 'Identify members struggling for >3 sessions', value: 3, type: 'number' },
  { id: 'injury', label: 'Injury Risk Level', desc: 'Critical alert threshold for fatigue patterns', value: 90, type: 'range' },
  { id: 'inactive', label: 'Inactive Member Alerts', desc: 'Notify staff if member misses 2+ expected sessions', value: 2, type: 'number' },
];

export const staffAccounts = [
  { id: 1, name: 'Marcus Chen', role: 'Owner', email: 'marcus@genyx.com', status: 'Active' },
  { id: 2, name: 'Sarah Miller', role: 'Manager', email: 'sarah@genyx.com', status: 'Active' },
  { id: 3, name: 'Coach Dave', role: 'Trainer', email: 'dave@genyx.com', status: 'Active' },
  { id: 4, name: 'Sales Team', role: 'Sales Staff', email: 'sales@genyx.com', status: 'Active' },
  { id: 5, name: 'IT Support', role: 'IT Administrator', email: 'it@genyx.com', status: 'Active' },
];

export const notificationPreferences = [
  { id: 'critical', label: 'Critical System Alerts', channels: ['email', 'push', 'sms'] },
  { id: 'leads', label: 'New AI Sales Leads', channels: ['push'] },
  { id: 'form', label: 'Urgent Form Interventions', channels: ['push', 'email'] },
  { id: 'daily', label: 'Daily Intelligence Summary', channels: ['email'] },
];

export const integrationList = [
  { id: 'razorpay', name: 'Razorpay', type: 'Payment', status: 'Connected', desc: 'Manage member billing & subscriptions' },
  { id: 'whatsapp', name: 'WhatsApp Business', type: 'Messaging', status: 'Connected', desc: 'Automated AI lead messaging' },
  { id: 'slack', name: 'Slack', type: 'Automation', status: 'Disconnected', desc: 'Staff alerts & daily reports' },
  { id: 'stripe', name: 'Stripe', type: 'Payment', status: 'Disconnected', desc: 'Alternative payments & payouts' },
];

export const securitySettings = [
  { id: 'mfa', label: 'Multi-Factor Authentication', desc: 'Require 2FA for all administrator accounts', enabled: true },
  { id: 'timeout', label: 'Session Timeout', desc: 'Auto-logout after 30 mins of inactivity', enabled: true },
  { id: 'privacy', label: 'Privacy anonymization', desc: 'Blur member faces in dash previews', enabled: true },
];
