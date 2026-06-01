import { Routes, Route, Navigate } from 'react-router';
import PageLayout from './components/PageLayout';
import Home from './pages/Home';
import About from './pages/About';
import Nodes from './pages/Nodes';
import Technology from './pages/Technology';
import Dashboard from './pages/Dashboard';
import Research from './pages/Research';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import AuthPage from './pages/AuthPage';
import CheckoutPage from './pages/CheckoutPage';
import PortalLayout from './components/PortalLayout';
import PortalDashboard from './pages/portal/PortalDashboard';
import PortalMap from './pages/portal/PortalMap';
import PortalReports from './pages/portal/PortalReports';
import PortalMaintenance from './pages/portal/PortalMaintenance';
import PortalAnalysis from './pages/portal/PortalAnalysis';
import PortalPayments from './pages/portal/PortalPayments';
import { useAuth } from './hooks/useAuth';

function ProtectedPortal({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />

      {/* Customer portal */}
      <Route path="/portal" element={
        <ProtectedPortal><PortalLayout /></ProtectedPortal>
      }>
        <Route index element={<Navigate to="/portal/dashboard" replace />} />
        <Route path="dashboard" element={<PortalDashboard />} />
        <Route path="map" element={<PortalMap />} />
        <Route path="reports" element={<PortalReports />} />
        <Route path="maintenance" element={<PortalMaintenance />} />
        <Route path="analysis"    element={<PortalAnalysis />} />
        <Route path="payments" element={<PortalPayments />} />
        <Route path="subscription" element={<Pricing />} />
        <Route path="checkout/:plan" element={<CheckoutPage />} />
      </Route>

      {/* Public website */}
      <Route path="/" element={<PageLayout><Home /></PageLayout>} />
      <Route path="/about" element={<PageLayout><About /></PageLayout>} />
      <Route path="/nodes" element={<PageLayout><Nodes /></PageLayout>} />
      <Route path="/technology" element={<PageLayout><Technology /></PageLayout>} />
      <Route path="/dashboard" element={<PageLayout><Dashboard /></PageLayout>} />
      <Route path="/research" element={<PageLayout><Research /></PageLayout>} />
      <Route path="/contact" element={<PageLayout><Contact /></PageLayout>} />
      <Route path="/pricing" element={<PageLayout><Pricing /></PageLayout>} />
    </Routes>
  );
}
