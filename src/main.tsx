import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Ensure the root element exists
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create React root and render the app
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add Lovable.dev compatibility
export const lovable = {
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true,
  entryPoint: true
}; 