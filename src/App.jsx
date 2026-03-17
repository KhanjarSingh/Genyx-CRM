import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardLayout } from './components/Layout/DashboardLayout';

// Pages
import { FacilityOverview } from './pages/FacilityOverview';
import { LiveActivity } from './pages/LiveActivity';
import { MemberAnalytics } from './pages/MemberAnalytics';
import { RevenueSales } from './pages/RevenueSales';
import { TrainingIntelligence } from './pages/TrainingQuality';
import { Reports } from './pages/Reports';
import { SystemHealth } from './pages/SystemHealth';
import { Settings } from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<FacilityOverview />} />
          <Route path="live-activity" element={<LiveActivity />} />
          <Route path="member-analytics" element={<MemberAnalytics />} />
          <Route path="training-quality" element={<TrainingIntelligence />} />
          <Route path="revenue-sales" element={<RevenueSales />} />
          <Route path="reports" element={<Reports />} />
          <Route path="health" element={<SystemHealth />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
