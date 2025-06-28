import React, { useState } from 'react';
import { LovablePreview } from '../modules/tech-compatibility/lovable-preview.lovable';
import { GitHubSync } from '../modules/tech-compatibility/github-sync.lovable';

const LovableEditorPage = () => {
  const [activeComponent, setActiveComponent] = useState<string>('src/lovable-demo/LovableDemo-SelfContained.lovable.tsx');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  
  // Handle component save
  const handleSave = (content: string) => {
    // In a real app, this would save to the file system
    console.log('Saving component:', activeComponent);
    console.log('Content:', content);
    
    setLastSaved(new Date());
    showNotification('Component saved successfully!', 'success');
  };
  
  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // Handle GitHub sync
  const handleSync = () => {
    showNotification('Changes synced to GitHub!', 'success');
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f0f1a',
      color: 'white',
      padding: '32px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{fontSize: '32px'}}>🚀</span>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              margin: 0,
              background: 'linear-gradient(45deg, #60A5FA, #A78BFA)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              InsightFlow Lovable Editor
            </h1>
          </div>
          
          {lastSaved && (
            <div style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)'
            }}>
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
        
        {/* Notification */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: notification.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 
                            notification.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 
                            'rgba(59, 130, 246, 0.2)',
            color: notification.type === 'success' ? '#22c55e' : 
                   notification.type === 'error' ? '#ef4444' : 
                   '#3b82f6',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 100,
            animation: 'fadeIn 0.3s ease'
          }}>
            <span style={{fontSize: '18px'}}>
              {notification.type === 'success' ? '✅' : 
               notification.type === 'error' ? '❌' : 
               'ℹ️'}
            </span>
            {notification.message}
          </div>
        )}
        
        {/* Main content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '24px'
        }}>
          {/* Lovable Preview */}
          <LovablePreview 
            componentPath={activeComponent}
            onSave={handleSave}
          />
          
          {/* GitHub Sync */}
          <GitHubSync onSync={handleSync} />
        </div>
        
        {/* Footer */}
        <div style={{
          marginTop: '48px',
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '14px'
        }}>
          <p>
            InsightFlow AI Trading Platform - Lovable Integration
          </p>
        </div>
      </div>
    </div>
  );
};

export default LovableEditorPage; 