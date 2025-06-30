import React from 'react';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  "aria-label"?: string;
}

/**
 * Reusable circular loading spinner that respects Tailwind dark/light themes
 * and is keyboard-accessible via aria-label.
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  className = '',
  size = 24,
  "aria-label": ariaLabel = 'Loading…',
}) => (
  <svg className={`animate-spin text-blue-500 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    role="status"
    aria-label={ariaLabel}>
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"/>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
  </svg>
);

export default LoadingSpinner;

export const lovable = { 
  component: true,
  supportsTailwind: true,
  editableComponents: true,
  visualEditing: true
}; 