import React, { useState, useEffect } from 'react';

interface LovablePreviewProps {
  componentPath?: string;
  onSave?: (content: string) => void;
}

export const LovablePreview: React.FC<LovablePreviewProps> = ({ 
  componentPath = '', 
  onSave 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [componentContent, setComponentContent] = useState<string>('');
  const [editedContent, setEditedContent] = useState<string>('');
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now());
  const [selectedComponent, setSelectedComponent] = useState<string>(componentPath);
  const [availableComponents, setAvailableComponents] = useState<string[]>([]);

  // Mock function to load component content
  const loadComponentContent = async (path: string) => {
    setIsLoading(true);
    setPreviewError(null);
    
    try {
      // In a real app, this would fetch the component from the server
      // For demo purposes, we'll simulate a delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock content for demo
      let content = '';
      if (path.includes('LovableDemo')) {
        content = `import React from 'react';

export const LovableDemo = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1e1e2e',
      color: 'white',
      borderRadius: '8px'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
        InsightFlow AI Trading Demo
      </h1>
      <p style={{ fontSize: '16px' }}>
        Edit this component to see changes in real-time!
      </p>
    </div>
  );
};`;
      } else if (path.includes('github-sync')) {
        content = `import React from 'react';

export const GitHubSync = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1e1e2e',
      color: 'white',
      borderRadius: '8px'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
        GitHub Sync Module
      </h1>
      <button style={{
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px'
      }}>
        Sync Now
      </button>
    </div>
  );
};`;
      } else {
        content = `import React from 'react';

export const CustomComponent = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#1e1e2e',
      color: 'white',
      borderRadius: '8px'
    }}>
      <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>
        Custom Lovable Component
      </h1>
      <p style={{ fontSize: '16px' }}>
        This is a placeholder for ${path}
      </p>
    </div>
  );
};`;
      }
      
      setComponentContent(content);
      setEditedContent(content);
      setSelectedComponent(path);
    } catch (error) {
      setPreviewError(`Failed to load component: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock function to save component
  const saveComponent = async () => {
    setIsSaving(true);
    setPreviewError(null);
    
    try {
      // In a real app, this would save the component to the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(editedContent);
      }
      
      // Update the preview
      setComponentContent(editedContent);
      setPreviewKey(Date.now()); // Force re-render of preview
    } catch (error) {
      setPreviewError(`Failed to save component: ${error}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Load available components
  useEffect(() => {
    const loadAvailableComponents = async () => {
      // In a real app, this would fetch available components from the server
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAvailableComponents([
        'src/lovable-demo/LovableDemo-SelfContained.lovable.tsx',
        'src/modules/tech-compatibility/github-sync.lovable.tsx',
        'src/modules/tech-compatibility/lovable-converter.lovable.tsx',
        'src/modules/strategy-intelligence/vault-grid.lovable.tsx',
        'src/modules/mindset-journaling/journal-companion.lovable.tsx'
      ]);
    };
    
    loadAvailableComponents();
  }, []);

  // Load component content when path changes
  useEffect(() => {
    if (componentPath) {
      loadComponentContent(componentPath);
    }
  }, [componentPath]);

  // Create a dynamic component from the edited content
  const DynamicComponent = () => {
    if (previewError || !componentContent) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#2a0b0b',
          color: '#f87171',
          borderRadius: '8px'
        }}>
          {previewError || 'No component content available'}
        </div>
      );
    }

    try {
      // This is a simplified version for the demo
      // In a real app, you would use a safer approach to evaluate the component
      const Component = () => (
        <div style={{
          padding: '20px',
          backgroundColor: '#1e1e2e',
          color: 'white',
          borderRadius: '8px'
        }}>
          <p>Preview would render here in a real implementation</p>
          <pre style={{
            padding: '12px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            overflow: 'auto',
            fontSize: '12px',
            maxHeight: '200px'
          }}>
            {editedContent.substring(0, 200)}...
          </pre>
        </div>
      );
      
      return <Component />;
    } catch (error) {
      return (
        <div style={{
          padding: '20px',
          backgroundColor: '#2a0b0b',
          color: '#f87171',
          borderRadius: '8px'
        }}>
          Error rendering component: {String(error)}
        </div>
      );
    }
  };

  return (
    <div style={{
      backgroundColor: '#1e1e2e',
      borderRadius: '12px',
      padding: '24px',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        <span style={{fontSize: '24px'}}>👁️</span>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          margin: 0
        }}>Lovable Preview</h2>
      </div>
      
      <div style={{
        display: 'flex',
        gap: '16px'
      }}>
        <div style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <select
              value={selectedComponent}
              onChange={(e) => loadComponentContent(e.target.value)}
              style={{
                flex: '1',
                padding: '8px 12px',
                backgroundColor: '#2a2a3a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '14px'
              }}
            >
              <option value="">Select a component</option>
              {availableComponents.map((comp) => (
                <option key={comp} value={comp}>
                  {comp.split('/').pop()}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => loadComponentContent(selectedComponent)}
              style={{
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span style={{fontSize: '14px'}}>🔄</span>
              Reload
            </button>
          </div>
          
          <div style={{
            backgroundColor: '#2a2a3a',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            height: '400px',
            position: 'relative'
          }}>
            {isLoading ? (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid rgba(59, 130, 246, 0.3)',
                  borderTopColor: '#3b82f6',
                  animation: 'spin 1s linear infinite'
                }} />
              </div>
            ) : (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '12px',
                  backgroundColor: 'transparent',
                  color: 'white',
                  border: 'none',
                  resize: 'none',
                  fontFamily: 'monospace',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            )}
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '8px'
          }}>
            <button
              onClick={() => setEditedContent(componentContent)}
              style={{
                padding: '8px 16px',
                backgroundColor: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Reset
            </button>
            
            <button
              onClick={saveComponent}
              disabled={isSaving || isLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isSaving || isLoading ? 'not-allowed' : 'pointer',
                opacity: isSaving || isLoading ? 0.7 : 1,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {isSaving ? (
                <>
                  <div style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: 'white',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Saving...
                </>
              ) : (
                <>
                  <span style={{fontSize: '14px'}}>💾</span>
                  Save & Update Preview
                </>
              )}
            </button>
          </div>
        </div>
        
        <div style={{
          flex: '1',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '8px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              margin: 0
            }}>Live Preview</h3>
            
            <div style={{
              padding: '4px 8px',
              backgroundColor: 'rgba(59, 130, 246, 0.2)',
              color: '#3b82f6',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: '500'
            }}>
              Lovable
            </div>
          </div>
          
          <div style={{
            backgroundColor: '#0f0f1a',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '16px',
            flex: '1',
            overflow: 'auto'
          }}>
            <div key={previewKey}>
              {isLoading ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '200px'
                }}>
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '2px solid rgba(59, 130, 246, 0.3)',
                    borderTopColor: '#3b82f6',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
              ) : (
                <DynamicComponent />
              )}
            </div>
          </div>
          
          <div style={{
            backgroundColor: 'rgba(30, 41, 59, 0.4)',
            padding: '12px',
            borderRadius: '8px'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: '600',
              margin: '0 0 8px 0'
            }}>Editing Tips</h4>
            
            <ul style={{
              margin: '0',
              paddingLeft: '24px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: '1.5'
            }}>
              <li>Use inline styles instead of external CSS</li>
              <li>Replace icon components with emoji equivalents</li>
              <li>Keep all dependencies within the component file</li>
              <li>Test frequently to ensure compatibility</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LovablePreview; 