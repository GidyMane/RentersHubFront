import type { Config } from "tailwindcss";

const config = {
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
		fontFamily: {
			sans: ["Georgia", "serif"],},
  		colors: {
  			border: '#153726',
  			input: '#153726',
  			ring: '#153726',
  			background: '#ffffff',
  			foreground: '#153726',
  			primary: {
  				DEFAULT: '#153726',
  				foreground: '#ffffff'
  			},
  			secondary: {
  				DEFAULT: '#1E3A8A',
  				foreground: '#ffffff'
  			},
  			destructive: {
  				DEFAULT: '#E3342F',
  				foreground: '#ffffff'
  			},
  			muted: {
  				DEFAULT: '#6B7280',
  				foreground: '#ffffff'
  			},
  			accent: {
  				DEFAULT: '#2563EB',
  				foreground: '#ffffff'
  			},
  			popover: {
  				DEFAULT: '#1E3A8A',
  				foreground: '#ffffff'
  			},
  			card: {
  				DEFAULT: '#ffffff',
  				foreground: '#153726'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontSize: {
  			displayLarge: [
  				'57px',
  				'64px'
  			],
  			displayMedium: [
  				'45px',
  				'52px'
  			],
  			displaySmall: [
  				'36px',
  				'44px'
  			],
  			headlineLarge: [
  				'32px',
  				'40px'
  			],
  			headlineMedium: [
  				'28px',
  				'36px'
  			],
  			headlineSmall: [
  				'24px',
  				'32px'
  			],
  			titleLarge: [
  				'22px',
  				'28px'
  			],
  			titleMedium: [
  				'16px',
  				'24px'
  			],
  			titleSmall: [
  				'14px',
  				'20px'
  			],
  			labelLarge: [
  				'16px',
  				'20px'
  			],
  			labelMedium: [
  				'12px',
  				'16px'
  			],
  			labelSmall: [
  				'11px',
  				'16px'
  			],
  			bodyLarge: [
  				'16px',
  				'24px'
  			],
  			bodyMedium: [
  				'14px',
  				'20px'
  			],
  			bodySmall: [
  				'12px',
  				'16px'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
			'caret-blink': {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			"caret-blink": "caret-blink 1.25s ease-out infinite"
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
