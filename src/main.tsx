import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/themes.css'
import './styles/theme-variables.css'
import { checkCriticalEnvVars, checkAIProviders } from './lib/env-check'
import { AuthProvider } from './hooks/use-auth'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'

// Import Capacitor plugins initialization
import './capacitor-plugins'

// Import our new pages
import MarketSetupPage from '@/pages/MarketSetupPage';
import SetupFinderPage from '@/pages/SetupFinderPage';
import BestSetupsPage from '@/pages/BestSetupsPage';

// Check if critical environment variables are set
if (!checkCriticalEnvVars()) {
  console.error('Critical environment variables are missing. The app may not function correctly.')
}

// Log available AI providers
const availableProviders = checkAIProviders()
console.info('Available AI providers:', 
  Object.entries(availableProviders)
    .filter(([_, isAvailable]) => isAvailable)
    .map(([name]) => name)
    .join(', ') || 'None'
)

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </AuthProvider>
);

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
