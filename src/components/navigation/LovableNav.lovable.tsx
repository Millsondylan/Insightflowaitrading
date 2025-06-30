import React from 'react';

interface LovableNavProps {
  onNavigate?: (path: string) => void;
}

export const LovableNav: React.FC<LovableNavProps> = ({ onNavigate }) => {
  const navItems = [
    { label: 'Editor', path: '/lovable/editor', icon: '✏️' },
    { label: 'Components', path: '/lovable/components', icon: '🧩' },
    { label: 'Demo', path: '/lovable/demo', icon: '🚀' },
    { label: 'Settings', path: '/lovable/settings', icon: '⚙️' },
  ];

  const handleNavClick = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      // In a real app, this would use router navigation
      console.log('Navigate to:', path);
    }
  };

  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '12px',
      padding: '16px',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '16px'
      }}>
        <span style={{ fontSize: '20px' }}>💙</span>
        <h2 style={{
          fontSize: '18px',
          fontWeight: '600',
          margin: 0,
          color: '#60A5FA'
        }}>
          Lovable
        </h2>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavClick(item.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span style={{ fontSize: '16px' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '8px',
        fontSize: '12px',
        color: 'rgba(255, 255, 255, 0.7)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '14px' }}>💡</span>
          <span style={{ fontWeight: '500', color: 'white' }}>Pro Tip</span>
        </div>
        <p style={{ margin: 0, lineHeight: '1.5' }}>
          Use the Lovable Editor to make changes to your components and see them in real-time. All edits are automatically synced with GitHub.
        </p>
      </div>
    </div>
  );
};

export default LovableNav; 
// Add Lovable.dev compatibility
export const lovable = {
  editableComponents: true,
  visualEditing: true,
  supportsTailwind: true
};
