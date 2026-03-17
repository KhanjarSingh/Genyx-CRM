import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { CorporateOverview } from './pages/CorporateOverview';
import { Integrations } from './pages/Integrations';
import { ApiDocs } from './pages/ApiDocs';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { useAuth } from './context/AuthContext';

function App() {
  const { currentUser, permissionsByRole } = useAuth();
  const defaultRoute = permissionsByRole[currentUser.role].defaultRoute;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          {/* Role-based default dashboard */}
          <Route
            index
            element={
              defaultRoute === '/'
                ? <FacilityOverview />
                : <Navigate to={defaultRoute} replace />
            }
          />

          <Route path="live-activity" element={<ProtectedRoute><LiveActivity /></ProtectedRoute>} />
          <Route path="member-analytics" element={<ProtectedRoute><MemberAnalytics /></ProtectedRoute>} />
          <Route path="training-quality" element={<ProtectedRoute><TrainingIntelligence /></ProtectedRoute>} />
          <Route path="revenue-sales" element={<ProtectedRoute><RevenueSales /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="health" element={<ProtectedRoute><SystemHealth /></ProtectedRoute>} />
          <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} />
          <Route path="api-docs" element={<ProtectedRoute><ApiDocs /></ProtectedRoute>} />
          <Route path="corporate" element={<ProtectedRoute><CorporateOverview /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
