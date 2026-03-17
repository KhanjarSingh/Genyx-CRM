// ─── Section 1: Revenue Health KPIs ─────────────────────────────────────────
export const revenueHealthKPIs = [
  { title: 'Monthly Recurring Revenue', value: '$65,240', trend: '+12.5%', positive: true, color: 'emerald' },
  { title: 'CAC (Customer Acquisition Cost)', value: '$180', trend: '-$12', positive: true, color: 'amber' },
  { title: 'Personal Training Revenue', value: '$12,400', trend: '+18.0%', positive: true, color: 'blue' },
  { title: 'ARPM (Avg Revenue Per Member)', value: '$42.50', trend: '+$1.20', positive: true, color: 'green' },
  { title: 'MRR Growth Rate (MoM)', value: '6.2%', trend: '+1.1%', positive: true, color: 'emerald' },
  { title: 'Predicted Next Month', value: '$68,100', trend: '+4.3%', positive: true, color: 'amber' },
];

// ─── Section 2: Revenue Trend ────────────────────────────────────────────────
export const revenueTrendData = [
  { month: 'Jan', revenue: 45000, target: 43000 },
  { month: 'Feb', revenue: 52000, target: 48000 },
  { month: 'Mar', revenue: 48000, target: 51000 },
  { month: 'Apr', revenue: 61000, target: 55000 },
  { month: 'May', revenue: 59000, target: 58000 },
  { month: 'Jun', revenue: 65240, target: 62000 },
];

// ─── Section 3: Genyx Revenue Impact ────────────────────────────────────────
export const genyxImpactStats = [
  { label: 'Genyx Magic ROI', value: '4.0x', desc: 'PT Revenue from AI leads / Genyx sub', positive: true },
  { label: 'Impact Revenue', value: '$8,420', desc: 'Direct revenue from Genyx signals', positive: true },
  { label: 'AI Generated Leads', value: '142', desc: 'Coaching opportunities detected', positive: true },
  { label: 'Conversion Rate', value: '24%', desc: 'AI leads converted to sales', positive: true },
];

// ─── Section 4: Upsell Pipeline ──────────────────────────────────────────────
export const pipelineLeads = [
  { id: 'l1', name: 'Rajesh Kumar', status: 'Identified', priority: 'High', score: 34, avatar: 'RK', issue: 'Squat mechanics failure', action: 'Offer Squat Mechanics Clinic' },
  { id: 'l2', name: 'Sarah Chen', status: 'Identified', priority: 'Medium', score: 52, avatar: 'SC', issue: 'Fatigue on HIIT sets', action: 'Suggest recovery plan' },
  { id: 'l3', name: 'Neha Kapoor', status: 'Identified', priority: 'Medium', score: 52, avatar: 'NK', issue: 'Early fatigue on Deadlift', action: 'Recommend PT intro' },
  { id: 'l4', name: 'Priya Sharma', status: 'Contacted', priority: 'High', score: 41, avatar: 'PS', issue: 'Knee valgus detected', action: 'Immediate coach outreach' },
  { id: 'l5', name: 'Karthik Menon', status: 'Contacted', priority: 'High', score: 38, avatar: 'KM', issue: 'Lumbar flexion on rows', action: 'Correction required' },
  { id: 'l6', name: 'Kavya Reddy', status: 'Follow Up', priority: 'Medium', score: 64, avatar: 'KR', issue: 'Shoulder path instability', action: 'Review accessory work' },
  { id: 'l7', name: 'Vikram Singh', status: 'Converted', priority: 'Low', score: 82, avatar: 'VS', issue: 'Improving form', action: 'Maintain progress' },
  { id: 'l8', name: 'Rohan Deshmukh', status: 'Converted', priority: 'Low', score: 88, avatar: 'RD', issue: 'Consistent high scores', action: 'Advanced programming' },
];

// ─── Section 5: Revenue Intelligence Analytics ──────────────────────────────
export const revenueBreakdownData = [
  { name: 'Membership', value: 52840, fill: '#10b981' },
  { name: 'Personal Training', value: 8400, fill: '#3b82f6' },
  { name: 'Workshops', value: 2500, fill: '#f59e0b' },
  { name: 'AI-driven Upsell', value: 1500, fill: '#8b5cf6' },
];

export const leadFunnelData = [
  { stage: 'AI Leads Generated', count: 142, pct: '100%' },
  { stage: 'Contacted', count: 48, pct: '34%' },
  { stage: 'Follow Up', count: 19, pct: '40%' },
  { stage: 'Converted', count: 23, pct: '16%' },
];

// ─── Section 6: Staff Sales Leaderboard ──────────────────────────────────────
export const trainerDetailedLeaderboard = [
  { name: 'Coach Priya', sales: 8, revenue: '$12,000', convRate: '33%', leads: 24, improvement: '+26', color: '#10b981', isTop: true },
  { name: 'Coach Raj', sales: 6, revenue: '$9,800', convRate: '27%', leads: 22, improvement: '+17', color: '#3b82f6', isTop: false },
  { name: 'Coach Amit', sales: 2, revenue: '$2,400', convRate: '11%', leads: 18, improvement: '+7', color: '#f59e0b', isTop: false },
];

// ─── Section 7: Upgrade Opportunities ────────────────────────────────────────
export const upgradeOpportunities = [
  { name: 'Kavita Menon', reason: 'Form score improving rapidly (+15 pts)', probability: '85%', signals: 'Frequent Visits, High Intensity' },
  { name: 'Manish J.', reason: 'Hitting 100% rep completion & low fatigue', probability: '92%', signals: 'Form Score +15 this month' },
  { name: 'Ankita S.', reason: 'Hitting 100% rep completion & low fatigue', probability: '88%', signals: 'Strength Gain, High Volume' },
];

// ─── Section 8: Churn Risk Revenue ───────────────────────────────────────────
export const churnRiskStats = {
  inactiveMembers: 28,
  revenueAtRisk: '$7,400',
  mrrAtRiskPct: '4.2%',
  criticalLead: 'Meera Joshi (22d inactive)',
};

// ─── Section 9: Recent Conversions ───────────────────────────────────────────
export const recentConversions = [
  { member: 'Vikram Singh', pkg: 'PT 12-Pack', value: '$500', method: 'AI Form Alert Outreach', date: '2 hrs ago' },
  { member: 'Rohan Gupta', pkg: 'Coaching Upgrade', value: '$300', method: 'Performance Index Report', date: '5 hrs ago' },
  { member: 'Sneha Rao', pkg: 'PT Intro', value: '$150', method: 'Fatigue Pattern Alert', date: '1 day ago' },
  { member: 'Amit K.', pkg: 'Workshop', value: '$450', method: 'Squat Recovery Signal', date: '2 days ago' },
];
