import React from 'react';
import { createRoot } from 'react-dom/client';
import { LovableDemo } from './LovableDemo-SelfContained';

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <react  >
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '24px'
      }}>
        <lovabledemo  >
      </div>
    </React.StrictMode>
  );
} 

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
};
