import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import SimpleApp from './SimpleApp';
import './index.css';
import { injectDebug } from './debug';

// Check if we should use the simplified app (for debugging)
const useSimpleApp = import.meta.env.VITE_USE_SIMPLE_APP === 'true';
const AppComponent = useSimpleApp ? SimpleApp : App;

// Error handling
const renderApp = () => {
  try {
    const root = document.getElementById('root');
    
    if (!root) {
      console.error('Root element not found');
      return;
    }
    
    const reactRoot = ReactDOM.createRoot(root);
    
    reactRoot.render(
      <React.StrictMode>
        <AppComponent />
      </React.StrictMode>
    );
    
    console.log('App rendered successfully');
    
  } catch (error) {
    console.error('Failed to render app:', error);
    // Inject debug panel if app fails to render
    injectDebug();
  }
};

// Inject debug panel in development mode
if (import.meta.env.DEV) {
  injectDebug();
}

// Always use SimpleApp for now to diagnose issues
renderApp();
