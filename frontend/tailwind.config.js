export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}", // Important: Added .ts and .tsx
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        colors: {
          'brand': {
            'primary': '#4f46e5',
            'secondary': '#10b981',
          },
          'dark': {
            '900': '#111827',
            '800': '#1f2937',
            '700': '#374151',
            '600': '#4b5563',
          }
        }
      },
    },
    plugins: [],
  }