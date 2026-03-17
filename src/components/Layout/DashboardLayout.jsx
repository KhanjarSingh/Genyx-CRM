import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SetupChecklist } from '../onboarding/SetupChecklist';
import { SetupWizard, getResumeStep, shouldShowSetupWizard } from '../onboarding/SetupWizard';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  useEffect(() => {
    const forceOpen = localStorage.getItem('openSetupWizard') === 'true';
    if (forceOpen) localStorage.removeItem('openSetupWizard');

    if (forceOpen || shouldShowSetupWizard()) {
      setWizardStep(getResumeStep());
      setWizardOpen(true);
    }
  }, []);

  useEffect(() => {
    // Prevent underlying dashboard scroll/interaction when wizard is open.
    const cls = 'overflow-hidden';
    if (wizardOpen) {
      document.documentElement.classList.add(cls);
      document.body.classList.add(cls);
    } else {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    }
    return () => {
      document.documentElement.classList.remove(cls);
      document.body.classList.remove(cls);
    };
  }, [wizardOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg transition-colors">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 flex-col overflow-hidden w-full">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-bg p-4 sm:p-6 w-full transition-colors">
          <Outlet />
        </main>
      </div>

      <SetupWizard
        open={wizardOpen}
        initialStep={wizardStep}
        onClose={() => setWizardOpen(false)}
      />
      <SetupChecklist
        onResume={() => {
          setWizardStep(getResumeStep());
          setWizardOpen(true);
        }}
      />
    </div>
  );
}
