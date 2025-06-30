import React from 'react';
import ReactDOM from 'react-dom/client';

const Debug = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      padding: '20px',
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      zIndex: 9999,
      maxWidth: '80%',
      overflowY: 'auto',
      maxHeight: '80vh'
    }}>
      <h2>Debug Panel</h2>
      <p>App is rendering. If you see this, React is working.</p>
    </div>
  );
};

export default Debug;

// Function to inject debug panel
export const injectDebug = () => {
  const debugRoot = document.createElement('div');
  debugRoot.id = 'debug-root';
  document.body.appendChild(debugRoot);
  
  try {
    const root = ReactDOM.createRoot(debugRoot);
    root.render(<Debug />);
    console.log('Debug panel injected successfully');
  } catch (error) {
    console.error('Failed to inject debug panel:', error);
  }
}; 