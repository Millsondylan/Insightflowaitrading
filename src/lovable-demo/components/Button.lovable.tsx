import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
};

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  fullWidth = false 
}: ButtonProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#3B82F6',
          color: 'white',
          border: '1px solid #3B82F6'
        };
      case 'secondary':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'white',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        };
      case 'danger':
        return {
          backgroundColor: '#EF4444',
          color: 'white',
          border: '1px solid #EF4444'
        };
      default:
        return {
          backgroundColor: '#3B82F6',
          color: 'white',
          border: '1px solid #3B82F6'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: '6px 12px',
          fontSize: '14px'
        };
      case 'md':
        return {
          padding: '8px 16px',
          fontSize: '16px'
        };
      case 'lg':
        return {
          padding: '12px 24px',
          fontSize: '18px'
        };
      default:
        return {
          padding: '8px 16px',
          fontSize: '16px'
        };
    }
  };

  const baseStyles = {
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontWeight: '500',
    outline: 'none',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.6 : 1,
    ...getSizeStyles(),
    ...getVariantStyles()
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      if (variant === 'outline') {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
      } else {
        e.currentTarget.style.opacity = '0.9';
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      if (variant === 'outline') {
        e.currentTarget.style.backgroundColor = 'transparent';
      } else {
        e.currentTarget.style.opacity = '1';
      }
    }
  };

  return (
    <button
      style={baseStyles}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={disabled}
    >
      {children}
    </button>
  );
}; 
export const lovable = { component: true };
