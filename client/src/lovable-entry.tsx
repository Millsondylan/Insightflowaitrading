import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Ultra-simple component that will definitely render
const LovableApp = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#111',
      color: 'white',
      fontFamily: 'system-ui, sans-serif',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        InsightFlow AI Trading
      </h1>
      
      <div style={{ 
        backgroundColor: 'rgba(25, 25, 25, 0.8)',
        borderRadius: '8px',
        padding: '2rem',
        maxWidth: '800px',
        width: '100%', 
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Lovable Deployment Success
        </h2>
        
        <p style={{ marginBottom: '1rem' }}>
          The application has been successfully deployed to Lovable.
        </p>
        
        <p style={{ marginBottom: '1rem' }}>
          This is a simplified version to ensure proper rendering. The full application 
          requires additional configuration.
        </p>
        
        <div style={{ 
          backgroundColor: '#222', 
          padding: '1rem',
          borderRadius: '4px',
          marginTop: '2rem'
        }}>
          <p style={{ marginBottom: '0.5rem', color: '#66b2ff' }}>
            Next steps:
          </p>
          <ol style={{ paddingLeft: '1.5rem' }}>
            <li style={{ marginBottom: '0.5rem' }}>
              Check JavaScript console for any errors
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Verify all required environment variables are set
            </li>
            <li style={{ marginBottom: '0.5rem' }}>
              Ensure database connections are properly configured
            </li>
          </ol>
        </div>
      </div>
      
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a
          href="https://github.com/yourusername/insightflowaitrading"
          target="_blank"
          rel="noopener noreferrer"
          style={{ 
            color: '#66b2ff',
            textDecoration: 'none'
          }}
        >
          GitHub Repository
        </a>
        <span style={{ margin: '0 1rem', color: '#666' }}>|</span>
        <a
          href="#"
          onClick={() => { 
            console.log('Deployment Information:', {
              environment: import.meta.env.MODE,
              time: new Date().toISOString()
            });
            alert('Deployment information logged to console');
          }}
          style={{ 
            color: '#66b2ff',
            textDecoration: 'none',
            cursor: 'pointer'
          }}
        >
          View Deployment Info
        </a>
      </div>
    </div>
  );
};

// Render the app
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(<LovableApp />);
  
  console.log('Lovable entry point rendered successfully');
} catch (error) {
  console.error('Failed to render Lovable entry point:', error);
  
  // Emergency fallback rendering directly to body
  try {
    const emergencyRoot = document.createElement('div');
    document.body.appendChild(emergencyRoot);
    
    ReactDOM.createRoot(emergencyRoot).render(
      <div style={{ padding: '20px', color: 'white', backgroundColor: 'black' }}>
        <h1>Emergency Fallback Rendering</h1>
        <p>The application encountered an error while rendering.</p>
        <pre style={{ marginTop: '20px', padding: '10px', backgroundColor: '#222' }}>
          {error instanceof Error ? error.message : 'Unknown error'}
        </pre>
      </div>
    );
    
  } catch (fallbackError) {
    document.body.innerHTML = '<h1>Critical Rendering Error</h1><p>Please check the console.</p>';
  }
} 