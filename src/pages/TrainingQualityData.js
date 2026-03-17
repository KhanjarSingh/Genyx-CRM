// ─── Section 1: Facility Intelligence ───────────────────────────────────────
export const gymHealthKPIs = [
  {
    title: 'Facility Form Score',
    value: '67',
    unit: '/ 100',
    trend: '+4 vs Feb',
    positive: true,
    desc: 'Average rep quality across all movements',
    color: 'emerald',
  },
  {
    title: 'Coaching Impact Delta',
    value: '+14.2',
    unit: 'pts',
    trend: 'Coached vs solo members',
    positive: true,
    desc: 'Form improvement gap from trainer intervention',
    color: 'blue',
  },
  {
    title: 'Injury Risk Level',
    value: 'Low',
    unit: 'profile',
    trend: '-12% risk vs Feb',
    positive: true,
    desc: 'System-detected high-risk movements',
    color: 'green',
  },
  {
    title: 'Participation Rate',
    value: '82%',
    unit: 'active',
    trend: '+5% vs last week',
    positive: true,
    desc: 'Members with recent analyzed sessions',
    color: 'amber',
  },
  {
    title: 'Form Degradation (Fatigue)',
    value: '14%',
    unit: 'sets',
    trend: '+2% marginal increase',
    positive: false,
    desc: 'Sets showing significant form drop',
    color: 'orange',
  },
  {
    title: 'Urgent Interventions',
    value: '12',
    unit: 'members',
    trend: 'High priority alerts',
    positive: false,
    desc: 'Immediate form correction required',
    color: 'red',
  },
];

// ... (rest of the file stays same but I'll make sure to update component to use these keys)
export const progressTrendData = [
  { month: 'Oct', great: 27, improving: 38, needsHelp: 35 },
  { month: 'Nov', great: 29, improving: 39, needsHelp: 32 },
  { month: 'Dec', max: 80, current: 65, goal: 75, great: 30, improving: 40, needsHelp: 30 },
  { month: 'Jan', great: 32, improving: 40, needsHelp: 28 },
  { month: 'Feb', great: 34, improving: 41, needsHelp: 25 },
  { month: 'Mar', great: 37, improving: 41, needsHelp: 22 },
];

export const memberSegmentData = [
  { label: 'High Performers', value: 37, color: '#10b981' },
  { label: 'Progressing', value: 41, color: '#f59e0b' },
  { label: 'Static/At Risk', value: 22, color: '#f87171' },
];

export const memberProgressStats = {
  avgVelocity: '+6.4 pts/mo',
  velocityDesc: 'Average improvement speed per member',
  membersSlipping: 14,
  highCancelRisk: 6,
  trainingConsistency: '71%',
  coachedImpact: '+22%',
};

// ─── Section 3: Exercise Intelligence ────────────────────────────────────────
export const exerciseQualityData = [
  { rank: 1, name: 'Overhead Press', score: 78, members: 45, keyIssue: 'Minor shoulder path deviation', suggestion: 'Ideal standard maintained', status: 'good', riskScore: 18, trend6m: [72, 73, 74, 75, 77, 78] },
  { rank: 2, name: 'Bench Press',    score: 71, members: 89, keyIssue: 'Scapular instability 25% of sets', suggestion: 'Require shoulder warm-up', status: 'good', riskScore: 26, trend6m: [66, 67, 68, 69, 70, 71] },
  { rank: 3, name: 'Lunge',          score: 66, members: 62, keyIssue: 'Lateral balance issues', suggestion: 'Introduce stability drills', status: 'ok',   riskScore: 34, trend6m: [60, 62, 61, 63, 65, 66] },
  { rank: 4, name: 'Barbell Row',    score: 58, members: 34, keyIssue: 'Lumbar flexion 40% of sets', suggestion: 'Enforce core bracing', status: 'ok',   riskScore: 48, trend6m: [54, 55, 56, 57, 57, 58] },
  { rank: 5, name: 'Deadlift',       score: 55, members: 78, keyIssue: 'Hip hinge breakdown under fatigue', suggestion: 'Run hip hinge workshop', status: 'ok',   riskScore: 56, trend6m: [52, 52, 53, 54, 55, 55] },
  { rank: 6, name: 'Squat',          score: 45, members: 89, keyIssue: 'Knee valgus in 68% of reps', suggestion: 'Schedule mechanics clinic', status: 'bad', riskScore: 72, trend6m: [51, 49, 48, 47, 46, 45] },
  { rank: 7, name: 'Leg Press',      score: 42, members: 56, keyIssue: 'Partial ROM 72% of reps', suggestion: 'Standardize ROM targets', status: 'bad', riskScore: 68, trend6m: [47, 46, 45, 44, 43, 42] },
];

// ... the rest (biomechanics, trainerPerformance, weeklyActionPlan, supplementalStats) are already good.
export const biomechanicsData = [
  { exercise: 'Squat',          lKnee: 73, rKnee: 68, lHip: 22, rHip: 25, lShoulder: 5,  rShoulder: 5  },
  { exercise: 'Deadlift',       lKnee: 12, rKnee: 15, lHip: 65, rHip: 68, lShoulder: 12, rShoulder: 14 },
  { exercise: 'Bench Press',    lKnee: 0,  rKnee: 0,  lHip: 5,  rHip: 5,  lShoulder: 42, rShoulder: 45 },
  { exercise: 'Overhead Press', lKnee: 0,  rKnee: 0,  lHip: 15, rHip: 15, lShoulder: 25, rShoulder: 22 },
  { exercise: 'Lunge',          lKnee: 55, rKnee: 58, lHip: 35, rHip: 32, lShoulder: 0,  rShoulder: 0  },
];

export const membersAtRiskData = [
  { name: 'Rahul S.',   issue: 'Knee cave on every rep', exercise: 'Squat',    score: 38, risk: 'High',   trainer: 'Coach Priya' },
  { name: 'Aditya K.',  issue: 'Form breaks after set 3', exercise: 'Deadlift', score: 42, risk: 'High',   trainer: 'Coach Raj'   },
  { name: 'Vikram M.',  issue: 'Shoulder internal rotation', exercise: 'Bench Press', score: 45, risk: 'Medium', trainer: 'Unassigned' },
  { name: 'Priya D.',   issue: 'Shallow depth (40% of reps)', exercise: 'Squat',  score: 48, risk: 'Medium', trainer: 'Coach Amit'  },
  { name: 'Meera J.',   issue: 'Lumbar flexion under load',  exercise: 'Row',     score: 51, risk: 'Medium', trainer: 'Coach Priya' },
];

export const trainerPerformanceData = [
  { name: 'Coach Priya', members: 24, improvement: 26, specialty: 'Lower body',  score: 92 },
  { name: 'Coach Raj',   members: 22, improvement: 17, specialty: 'Upper back',  score: 74 },
  { name: 'Coach Amit',  members: 18, improvement: 7,  specialty: 'Movement foundations', score: 42 },
];

export const ptVsSoloData = [
  { label: 'With Coaching (4 weeks)', improvement: 17, fill: '#10b981' },
  { label: 'Solo Training (4 weeks)', improvement: 3, fill: '#cbd5e1' },
];

export const weeklyActionPlan = [
  {
    priority: 1,
    level: 'critical',
    title: 'Squat Mechanics Clinic',
    reason: '89 members tracked. Avg score 45/100. Knee cave in 68% of reps.',
    actions: [
      'Run Squat Fundamentals clinic Thursday 6 PM',
      'Enforce 5-min trainer rotation at squat racks',
      'Place form-cue cards at all squat stations',
    ],
    impact: '+15 form score in 4 weeks',
    owner: 'Coach Priya',
  },
  {
    priority: 2,
    level: 'warning',
    title: 'Deadlift Fatigue Protocol',
    reason: '78 members tracked. 41% of sets show form breakdown after rep 3.',
    actions: [
      'Standardize 10–15% load reduction for heavy sets',
      'Add hip hinge warm-up drills to class openings',
    ],
    impact: 'Reduce fatigue sets by ~30%',
    owner: 'Coach Raj',
  },
  {
    priority: 3,
    level: 'warning',
    title: 'Leg Press ROM Correction',
    reason: '56 members. 72% show partial range of motion. Lumbar lift at 35%.',
    actions: [
      'Place instructional signage at all leg press machines',
      'Coach Amit to monitor and correct during floor walks',
    ],
    impact: '+8 form score in 3 weeks',
    owner: 'Coach Amit',
  },
  {
    priority: 4,
    level: 'positive',
    title: 'Overhead Press Maintain Standards',
    reason: 'Best performing exercise at 78/100 avg. 45 members executing well.',
    actions: [
      'Document successful coaching cues and replicate',
      'Use OHP technique as a model for other compounds',
    ],
    impact: 'Sustain top-tier performance',
    owner: 'All coaches',
  },
];

export const supplementalStats = {
  avgRepsPerSession: 63,
  injuryRiskScore: 63,
  injuryRiskLevel: 'Moderate',
  skillDistribution: [
    { label: 'Beginner',     pct: 42 },
    { label: 'Intermediate', pct: 38 },
    { label: 'Advanced',     pct: 20 },
  ],
  exercisePopularity: [
    { exercise: 'Squat',    sessions: 1204 },
    { exercise: 'Bench',    sessions: 1058 },
    { exercise: 'Deadlift', sessions: 876  },
    { exercise: 'Row',      sessions: 654  },
    { exercise: 'OHP',      sessions: 540  },
  ],
};
