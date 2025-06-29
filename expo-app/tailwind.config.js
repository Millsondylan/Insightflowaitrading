/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#3B82F6',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#6366F1',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF'
        },
        muted: {
          DEFAULT: '#9CA3AF',
          foreground: '#374151'
        },
        accent: {
          DEFAULT: '#8B5CF6',
          foreground: '#FFFFFF'
        },
        'brand-primary': '#3B82F6',
        'brand-secondary': '#6366F1',
        'brand-accent': '#8B5CF6',
        'background-primary': '#121212',
        'background-secondary': '#1E1E1E',
        'background-tertiary': '#2D2D2D',
        'background-interactive': '#333333',
        'background-interactive-hover': '#3F3F3F',
        'text-primary': '#FFFFFF',
        'text-secondary': '#E5E5E5',
        'text-muted': '#9CA3AF',
        'text-accent': '#8B5CF6',
        'border-primary': '#333333',
        'border-secondary': '#4B4B4B',
        'status-success': '#10B981',
        'status-warning': '#F59E0B',
        'status-error': '#EF4444',
        'status-info': '#3B82F6',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      },
    },
  },
  plugins: [],
}; 