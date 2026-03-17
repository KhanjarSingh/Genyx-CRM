import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppConfigContext = createContext(null);

const DEFAULT_BRANDING = {
  logoDataUrl: null,
  appName: 'Genyx CRM',
  accentColor: '#0D9488',
  emailSenderName: 'Genyx',
};

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function loadBranding() {
  const stored = safeJsonParse(localStorage.getItem('branding'), null);
  return { ...DEFAULT_BRANDING, ...(stored || {}) };
}

function saveBranding(next) {
  localStorage.setItem('branding', JSON.stringify(next));
}

function loadCompliance() {
  return {
    gdprMode: localStorage.getItem('compliance.gdpr') === 'true',
    dpdpaMode: localStorage.getItem('compliance.dpdpa') === 'true',
    retention: localStorage.getItem('data.retention') || '90_days',
  };
}

function saveCompliance(next) {
  localStorage.setItem('compliance.gdpr', String(!!next.gdprMode));
  localStorage.setItem('compliance.dpdpa', String(!!next.dpdpaMode));
  localStorage.setItem('data.retention', next.retention || '90_days');
}

export function AppConfigProvider({ children }) {
  const [branding, setBrandingState] = useState(() => loadBranding());
  const [compliance, setComplianceState] = useState(() => loadCompliance());

  useEffect(() => {
    // apply accent color globally as CSS variable
    document.documentElement.style.setProperty('--color-brand', branding.accentColor || DEFAULT_BRANDING.accentColor);
    document.title = branding.appName || DEFAULT_BRANDING.appName;
    saveBranding(branding);
  }, [branding]);

  useEffect(() => {
    saveCompliance(compliance);
  }, [compliance]);

  const value = useMemo(() => {
    const anonymize = compliance.gdprMode || compliance.dpdpaMode;
    const memberDisplayName = (member) => {
      if (!anonymize) return member?.name || '—';
      const idPart = String(member?.id || '').replace(/\D/g, '').slice(-4) || String(Math.floor(Math.random() * 9000) + 1000);
      return `Member #${idPart}`;
    };

    const getIntegrations = () => safeJsonParse(localStorage.getItem('integrations'), {});
    const setIntegration = (id, payload) => {
      const all = getIntegrations();
      all[id] = payload;
      localStorage.setItem('integrations', JSON.stringify(all));
    };

    const getWebhooks = () => safeJsonParse(localStorage.getItem('webhooks'), []);
    const setWebhooks = (list) => localStorage.setItem('webhooks', JSON.stringify(list));

    return {
      branding,
      setBranding: setBrandingState,
      resetBranding: () => {
        localStorage.removeItem('branding');
        setBrandingState({ ...DEFAULT_BRANDING });
      },
      compliance,
      setCompliance: setComplianceState,
      memberDisplayName,
      getIntegrations,
      setIntegration,
      getWebhooks,
      setWebhooks,
    };
  }, [branding, compliance]);

  return <AppConfigContext.Provider value={value}>{children}</AppConfigContext.Provider>;
}

export function useAppConfig() {
  const ctx = useContext(AppConfigContext);
  if (!ctx) throw new Error('useAppConfig must be used within AppConfigProvider');
  return ctx;
}

