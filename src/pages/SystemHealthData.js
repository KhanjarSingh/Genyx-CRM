export const systemHealthKPIs = [
  { label: 'Pods Online', value: '18/20', status: 'warning', trend: '-2 vs yesterday' },
  { label: 'Avg Network Latency', value: '14ms', status: 'optimal', trend: '+1ms stdev' },
  { label: 'AI Inference Delay', value: '42ms', status: 'optimal', trend: 'Stable' },
  { label: 'Total Active Cameras', value: '48', status: 'optimal', trend: 'Full coverage' },
];

export const aiProcessingStats = [
  { label: 'Rep Events / Sec', value: '124', desc: 'Real-time gesture analysis load' },
  { label: 'Dropped Frame %', value: '0.4%', desc: 'Camera-to-Pod ingestion loss' },
  { label: 'Avg Inference Latency', value: '18ms', desc: 'Neural network execution time' },
];

export const genyxPods = [
  { 
    id: 'POD-A1', 
    name: 'Genyx Pod Alpha', 
    zone: 'Strength Floor 1', 
    status: 'Online', 
    cpu: '42%', 
    temp: '62°C', 
    memory: '4.2GB / 8GB', 
    uptime: '14d 6h', 
    lastHeartbeat: '2s ago' 
  },
  { 
    id: 'POD-B2', 
    name: 'Genyx Pod Beta', 
    zone: 'Cardio Zone', 
    status: 'Warning', 
    cpu: '88%', 
    temp: '78°C', 
    memory: '7.1GB / 8GB', 
    uptime: '3d 12h', 
    lastHeartbeat: '5s ago' 
  },
  { 
    id: 'POD-C3', 
    name: 'Genyx Pod Gamma', 
    zone: 'Free Weights', 
    status: 'Online', 
    cpu: '35%', 
    temp: '58°C', 
    memory: '3.8GB / 8GB', 
    uptime: '22d 2h', 
    lastHeartbeat: '1s ago' 
  },
  { 
    id: 'POD-D4', 
    name: 'Genyx Pod Delta', 
    zone: 'Functional Area', 
    status: 'Offline', 
    cpu: '0%', 
    temp: '24°C', 
    memory: '0GB', 
    uptime: '0h', 
    lastHeartbeat: '14m ago' 
  },
];

export const zoneCoverage = [
  { zone: 'Strength Floor 1', pods: 2, status: 'Active', devices: ['POD-A1', 'POD-A2'] },
  { zone: 'Cardio Zone', pods: 1, status: 'Degraded', devices: ['POD-B2'] },
  { zone: 'Free Weights', pods: 3, status: 'Active', devices: ['POD-C1', 'POD-C2', 'POD-C3'] },
  { zone: 'Functional Area', pods: 1, status: 'Inactive', devices: ['POD-D4'] },
  { zone: 'Check-in Desk', pods: 0, status: 'No Coverage', devices: [] },
];

export const systemAlerts = [
  { id: 1, type: 'critical', msg: 'Pod Beta: CPU Temperature High (78°C)', time: '4 mins ago' },
  { id: 2, type: 'warning', msg: 'Pod Delta: Connection dropped', time: '14 mins ago' },
  { id: 3, type: 'info', msg: 'Pod Gamma: Calibration completed', time: '1 hour ago' },
  { id: 4, type: 'warning', msg: 'Zone: Cardio Zone — Degraded coverage', time: '4 hours ago' },
];

export const diagnosticTests = [
  { id: 'conn', label: 'Connectivity Test', icon: 'Wifi', desc: 'Ping all active pods and cameras' },
  { id: 'inf', label: 'Inference Test', icon: 'Zap', desc: 'Validate neural network performance' },
  { id: 'cal', label: 'Camera Calibration', icon: 'Video', desc: 'Recalibrate 3D spatial positioning' },
  { id: 'log', label: 'Log Analysis', icon: 'FileText', desc: 'Fetch latest system error logs' },
];
