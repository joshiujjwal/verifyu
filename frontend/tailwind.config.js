export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        serif: ['Crimson Text', 'Georgia', 'serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.025em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.05em' }],
      },
      colors: {
        // Pure black and white foundation
        'black': '#000000',
        'white': '#ffffff',
        
        // Grayscale spectrum for minimal palette
        'gray': {
          '50': '#fafafa',   // near white
          '100': '#f5f5f5',  // very light gray
          '200': '#e5e5e5',  // light gray
          '300': '#d4d4d4',  // medium-light gray
          '400': '#a3a3a3',  // medium gray
          '500': '#737373',  // true gray
          '600': '#525252',  // medium-dark gray
          '700': '#404040',  // dark gray
          '800': '#262626',  // very dark gray
          '850': '#1a1a1a',  // near black
          '900': '#171717',  // almost black
          '950': '#0a0a0a',  // deepest gray
        },

        // Background colors - pure black foundation
        'bg': {
          'primary': '#000000',    // pure black
          'secondary': '#0a0a0a',  // slight lift from black
          'tertiary': '#171717',   // subtle surface
          'elevated': '#262626',   // elevated surfaces
          'overlay': '#000000e6',  // black with opacity
        },

        // Text colors - white foundation with gray variants
        'text': {
          'primary': '#ffffff',    // pure white
          'secondary': '#f5f5f5',  // slightly dimmed white
          'tertiary': '#d4d4d4',   // medium-light for less emphasis
          'muted': '#a3a3a3',      // muted for subtle text
          'disabled': '#525252',   // disabled state
        },

        // Border colors - subtle grays
        'border': {
          'primary': '#262626',    // primary borders
          'secondary': '#404040',  // slightly more visible
          'subtle': '#171717',     // very subtle borders
          'emphasis': '#737373',   // emphasized borders
        },

        // Minimal accent colors (optional, can be removed for pure B&W)
        'accent': {
          'white': '#ffffff',
          'gray': '#737373',
        }
      },
      
      // Enhanced typography settings
      letterSpacing: {
        'tightest': '-0.075em',
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
      
      // Line height variations
      lineHeight: {
        'none': '1',
        'tight': '1.25',
        'snug': '1.375',
        'normal': '1.5',
        'relaxed': '1.625',
        'loose': '2',
      },

      // Font weights for better typography control
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      }
    },
  },
  plugins: [],
}