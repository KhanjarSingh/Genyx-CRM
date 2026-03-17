import { demoProfiles } from './demoProfiles';

// Deterministic RNG so switching profiles is stable
function mulberry32(seed) {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Normal via Box–Muller
function normal(rng, mean, sd) {
  let u = 0, v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mean + z * sd;
}

function clamp(n, lo, hi) {
  return Math.max(lo, Math.min(hi, n));
}

export const AI_LEAD_REVENUE = {
  squat_mechanics: { INR: 45000, USD: 600, GBP: 480, label: 'Squat mechanics → 12-session PT pack' },
  deadlift_form: { INR: 30000, USD: 400, GBP: 320, label: 'Deadlift form → 8-session pack' },
  recovery_plan: { INR: 12000, USD: 150, GBP: 130, label: 'Recovery plan consultation' },
  premium_upgrade: { INR: 90000, USD: 1200, GBP: 950, label: 'Premium coaching tier upgrade' },
  single_correction: { INR: 5000, USD: 75, GBP: 65, label: 'Single form correction session' },
  nutrition_combo: { INR: 36000, USD: 450, GBP: 375, label: 'Nutrition + training combo' },
};

export const REVENUE_SEASONALITY = {
  Jan: 1.22,
  Feb: 1.05,
  Mar: 1.00,
  Apr: 1.00,
  May: 0.98,
  Jun: 0.88,
  Jul: 0.85,
  Aug: 0.88,
  Sep: 1.08,
  Oct: 1.10,
  Nov: 1.00,
  Dec: 0.95,
};

export const ZONE_CAPACITIES = [
  { id: 'free_weights', name: 'Free Weights', capacity: 45 },
  { id: 'cardio', name: 'Cardio', capacity: 50 },
  { id: 'functional', name: 'Functional', capacity: 30 },
  { id: 'studio_a', name: 'Studio A', capacity: 20 },
];

function localeFromCountry(country) {
  if (country === 'India') return 'IN';
  if (country === 'United States') return 'US';
  if (country === 'United Kingdom') return 'UK';
  return 'IN';
}

function currencyFromLocale(locale) {
  if (locale === 'US') return 'USD';
  if (locale === 'UK') return 'GBP';
  return 'INR';
}

function currencySymbol(currency) {
  if (currency === 'USD') return '$';
  if (currency === 'GBP') return '£';
  return '₹';
}

function namePools(locale) {
  if (locale === 'IN') {
    return {
      first: ['Aarav', 'Vivaan', 'Aditya', 'Rahul', 'Rohan', 'Kunal', 'Amit', 'Sanjay', 'Vikram', 'Arjun', 'Priya', 'Sneha', 'Anjali', 'Pooja', 'Meera', 'Kavya', 'Neha', 'Ritu'],
      last: ['Sharma', 'Patel', 'Kumar', 'Singh', 'Gupta', 'Joshi', 'Reddy', 'Desai', 'Menon', 'Iyer', 'Chopra'],
    };
  }
  return {
    first: ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Jamie', 'Riley', 'Cameron', 'Avery', 'Chris', 'Jess'],
    last: ['Miller', 'Smith', 'Johnson', 'Brown', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'],
  };
}

function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function formatEmail(name, locale) {
  const base = name.toLowerCase().replace(/[^a-z]/g, '.');
  const domain = locale === 'IN' ? 'example.in' : locale === 'UK' ? 'example.co.uk' : 'example.com';
  return `${base}@${domain}`;
}

function churnProbabilityFromSignals({ visitDeclineRatePct, formScoreTrendDelta6m, status }) {
  const decline = clamp(visitDeclineRatePct, 0, 100);
  const formPenalty = formScoreTrendDelta6m < 0 ? Math.min(40, Math.abs(formScoreTrendDelta6m) * 20) : 0;
  const statusPenalty = status === 'Inactive' ? 25 : status === 'At Risk' ? 12 : 0;
  return clamp(15 + decline * 0.7 + formPenalty + statusPenalty, 0, 100);
}

function isWeekend(d) {
  const day = d.getDay();
  return day === 0 || day === 6;
}

function pctForTimeSlot(date, rng) {
  const h = date.getHours() + date.getMinutes() / 60;
  const weekend = isWeekend(date);
  const jitter = (rng() * 0.06) - 0.03; // +-3%

  if (!weekend) {
    if (h >= 6 && h < 8) return clamp(0.72 + jitter, 0.65, 0.80);
    if (h >= 8 && h < 12) return clamp(0.38 + jitter, 0.30, 0.45);
    if (h >= 12 && h < 14) return clamp(0.48 + jitter, 0.40, 0.55);
    if (h >= 14 && h < 17) return clamp(0.30 + jitter, 0.25, 0.35);
    if (h >= 17 && h < 20) return clamp(0.82 + jitter, 0.70, 0.90);
    if (h >= 20 && h < 22) return clamp(0.25 + jitter, 0.20, 0.30);
    return clamp(0.18 + jitter, 0.10, 0.25);
  }

  if (h >= 8 && h < 10) return clamp(0.35 + jitter, 0.30, 0.40);
  if (h >= 10 && h < 13) return clamp(0.72 + jitter, 0.65, 0.80);
  if (h >= 13 && h < 16) return clamp(0.48 + jitter, 0.40, 0.55);
  if (h >= 16 && h < 20) return clamp(0.30 + jitter, 0.25, 0.35);
  return clamp(0.18 + jitter, 0.10, 0.25);
}

function buildZonesCurrent({ rng, now, locale }) {
  const totalCapacity = ZONE_CAPACITIES.reduce((s, z) => s + z.capacity, 0);
  const pct = pctForTimeSlot(now, rng);
  let totalOcc = Math.round(totalCapacity * pct);

  // split across zones with realistic bias (free weights + cardio dominate)
  const weights = [0.34, 0.30, 0.22, 0.14];
  const raw = weights.map(w => w + (rng() * 0.05 - 0.025));
  const sum = raw.reduce((a, b) => a + b, 0);
  let alloc = raw.map(r => r / sum);

  const zones = ZONE_CAPACITIES.map((z, i) => {
    const current = i === ZONE_CAPACITIES.length - 1
      ? 0
      : Math.min(z.capacity, Math.round(totalOcc * alloc[i]));
    totalOcc -= current;
    return {
      id: z.id,
      name: z.name,
      capacity: z.capacity,
      current,
      cameras: z.id === 'free_weights' ? 4 : z.id === 'cardio' ? 6 : z.id === 'functional' ? 3 : 2,
    };
  });

  // push any remaining into the biggest zone while respecting capacity
  let remaining = totalOcc;
  while (remaining > 0) {
    const idx = zones.reduce((best, z, i) => ((z.capacity - z.current) > (zones[best].capacity - zones[best].current) ? i : best), 0);
    if (zones[idx].current >= zones[idx].capacity) break;
    zones[idx].current += 1;
    remaining -= 1;
  }

  return zones.map(z => {
    const ratio = z.current / z.capacity;
    const status = ratio > 1 ? 'destructive' : ratio > 0.85 ? 'warning' : z.current === 0 ? 'default' : 'success';
    return { ...z, status };
  });
}

function buildOccupancySeries({ rng, date }) {
  // 6 AM to 10 PM hourly points; members = total occupancy (sum zones) per time
  const totalCapacity = ZONE_CAPACITIES.reduce((s, z) => s + z.capacity, 0);
  const points = [];
  for (let hour = 6; hour <= 22; hour++) {
    const d = new Date(date);
    d.setHours(hour, 0, 0, 0);
    const pct = pctForTimeSlot(d, rng);
    points.push({
      time: `${hour === 12 ? 12 : (hour % 12)} ${hour < 12 ? 'AM' : 'PM'}`,
      members: Math.round(totalCapacity * pct),
    });
  }
  return points;
}

function buildRevenueTrend({ profile, locale, rng }) {
  // Monthly trend Jan-Jun as in existing UI; apply seasonality multipliers
  const currency = currencyFromLocale(locale);
  // convert INR baseline to locale
  const fx = currency === 'INR' ? 1 : currency === 'USD' ? 0.012 : 0.0095; // rough demo FX
  const base = profile.monthlyRevenueINR * fx;

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = months.map(m => {
    const mult = REVENUE_SEASONALITY[m] ?? 1.0;
    const noise = 1 + (rng() * 0.06 - 0.03);
    const revenue = Math.round(base * mult * noise);
    const target = Math.round(base * mult);
    return { month: m, revenue, target };
  });
  return data;
}

function buildMembers({ rng, locale, count = 50 }) {
  const pool = namePools(locale);
  const members = [];

  for (let i = 0; i < count; i++) {
    const first = pick(rng, pool.first);
    const last = pick(rng, pool.last);
    const name = `${first} ${last}`;

    // Form score distribution: mean 6.8 sd 1.4, clamp to [3.2, 9.8]
    const form = clamp(normal(rng, 6.8, 1.4), 3.2, 9.8);
    const formScore = `${form.toFixed(1)} / 10`;

    const statusRoll = rng();
    const status = statusRoll < 0.10 ? 'Inactive' : statusRoll < 0.28 ? 'At Risk' : 'Active';

    const visitDeclineRatePct = Math.round(clamp(normal(rng, status === 'At Risk' ? 55 : 20, 18), 0, 95));
    const formScoreTrendDelta6m = Number(clamp(normal(rng, status === 'At Risk' ? -0.9 : 0.2, 0.6), -2.5, 1.8).toFixed(1));

    const churnProbability = churnProbabilityFromSignals({ visitDeclineRatePct, formScoreTrendDelta6m, status });

    // Visit cadence and last visit
    const cadence = Math.max(1, Math.round(clamp(normal(rng, status === 'Active' ? 3 : 7, 2), 1, 14)));
    const daysAgo = status === 'Inactive' ? Math.round(clamp(normal(rng, 32, 10), 15, 70)) : status === 'At Risk' ? Math.round(clamp(normal(rng, 12, 6), 4, 35)) : Math.round(clamp(normal(rng, 2, 2), 0, 10));
    const lastVisitDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const visits30d = status === 'Inactive' ? 0 : Math.round(clamp(normal(rng, status === 'At Risk' ? 6 : 14, 6), 0, 28));
    const lifetimeVisits = Math.round(clamp(normal(rng, 220, 160), 8, 1200));

    const monthlyPlanValueINR = status === 'Active' ? 6500 : status === 'At Risk' ? 4500 : 3500;
    const currency = currencyFromLocale(locale);
    const fx = currency === 'INR' ? 1 : currency === 'USD' ? 0.012 : 0.0095;

    members.push({
      id: i + 1,
      name,
      email: formatEmail(name, locale),
      phone: locale === 'IN' ? '+91 9XXXX XXXXX' : locale === 'UK' ? '+44 7XXXX XXXXX' : '+1 (555) 010-XXXX',
      dob: '—',
      joinDate: '—',
      emergencyContact: '—',
      status,
      formScore,
      visits30d,
      lifetimeVisits,
      lastVisit: `${daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}`,
      lastVisitDate: lastVisitDate.toISOString(),
      avgVisitCadenceDays: cadence,
      visitDeclineRatePct,
      formScoreTrendDelta6m,
      monthlyPlanValue: Math.round(monthlyPlanValueINR * fx),
      churnProbability,
      consistency: status === 'Active' ? 'Medium' : status === 'At Risk' ? 'Low' : 'None',
      preferredTrainer: status === 'Active' ? 'Assigned' : 'Unassigned',
      goal: 'General Fitness',
      biomechanics: [],
      recentWorkouts: [],
    });
  }

  // Ensure "At Risk count" rule uses churnProbability > 60 (regardless of status string)
  // Nothing to mutate; counts will be derived from churnProbability.
  return members;
}

export function generateMockData({
  profileId = 'midMarket',
  country = 'India',
  seed = 'genyx',
} = {}) {
  const profile = demoProfiles[profileId] || demoProfiles.midMarket;
  const locale = localeFromCountry(country);
  const currency = currencyFromLocale(locale);
  const rng = mulberry32(hashString(`${seed}:${profileId}:${locale}`));

  const now = new Date();
  const zones = buildZonesCurrent({ rng, now, locale });
  const currentOccupancy = zones.reduce((s, z) => s + z.current, 0);

  const occupancySeries = buildOccupancySeries({ rng, date: now });

  const members = buildMembers({ rng, locale, count: 50 });
  const activeMembers = members.filter(m => m.status === 'Active').length;
  const atRiskCount = members.filter(m => (m.churnProbability ?? 0) > 60).length;

  const revenueTrend = buildRevenueTrend({ profile, locale, rng });
  const mrr = Math.round((revenueTrend.find(x => x.month === 'Mar')?.revenue ?? revenueTrend[2]?.revenue ?? 0) * (currency === 'INR' ? 100 : 1)); // keep legacy INR scale feel

  const facility = {
    id: 'loc-1',
    name: locale === 'IN' ? 'Genyx Mumbai Flagship' : locale === 'UK' ? 'Genyx Manchester' : 'Genyx Austin',
    region: locale === 'IN' ? 'West' : 'North',
    country,
    locale,
    currency,
    // reconciliation-backed numbers:
    currentOccupancy,
    memberCount: members.length,
    activeMembers,
    atRiskCount,
    // profile-scaled metadata:
    staffCount: profile.trainers,
    squareFootage: locale === 'IN' ? 30000 : 24000,
    avgMembershipDurationMonths: 18,
    mrr,
    healthScore: Math.round(clamp(normal(rng, 88, 6), 60, 99)),
    zones: ZONE_CAPACITIES.map(z => z.name),
  };

  return {
    profileId: profile.id,
    locale,
    currency,
    currencySymbol: currencySymbol(currency),
    facility,
    zones,
    occupancySeries,
    members,
    revenueTrend,
    aiLeadRevenue: AI_LEAD_REVENUE,
  };
}

