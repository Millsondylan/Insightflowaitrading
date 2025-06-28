import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				'brand-primary': 'var(--brand-primary)',
				'brand-secondary': 'var(--brand-secondary)',
				'brand-accent': 'var(--brand-accent)',
				'background-primary': 'var(--background-primary)',
				'background-secondary': 'var(--background-secondary)',
				'background-tertiary': 'var(--background-tertiary)',
				'background-interactive': 'var(--background-interactive)',
				'background-interactive-hover': 'var(--background-interactive-hover)',
				'text-primary': 'var(--text-primary)',
				'text-secondary': 'var(--text-secondary)',
				'text-muted': 'var(--text-muted)',
				'text-accent': 'var(--text-accent)',
				'border-primary': 'var(--border-primary)',
				'border-secondary': 'var(--border-secondary)',
				'status-success': 'var(--status-success)',
				'status-warning': 'var(--status-warning)',
				'status-error': 'var(--status-error)',
				'status-info': 'var(--status-info)',
			},
			borderRadius: {
				lg: 'var(--radius-lg)',
				md: 'var(--radius-md)',
				sm: 'var(--radius-sm)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'tag-slide-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'ping-slow': {
					'75%, 100%': {
						transform: 'scale(1.1)',
						opacity: '0'
					}
				},
				'button-glow': {
					'0%, 100%': {
						boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
					},
					'50%': {
						boxShadow: '0 4px 25px rgba(59, 130, 246, 0.5), 0 0 15px rgba(147, 51, 234, 0.2)'
					}
				},
				'pulse-glow': {
					'0%, 100%': {
						boxShadow: '0 0 10px rgba(74, 222, 128, 0.6)',
						transform: 'scale(1)'
					},
					'50%': {
						boxShadow: '0 0 20px rgba(74, 222, 128, 1)',
						transform: 'scale(1.1)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in-up': 'fade-in-up 0.6s ease-out',
				'tag-slide-in': 'tag-slide-in 0.4s ease-out',
				'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
				'button-glow': 'button-glow 2s ease-in-out infinite',
				'pulse-glow': 'pulse-glow 2s infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
