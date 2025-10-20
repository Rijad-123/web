tailwind.config = {
  theme: {
    extend: {
      fontFamily: { inter: ['Inter', 'ui-sans-serif', 'system-ui'] },
      colors: {
        brand: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#ef4444',   /* core red */
          600: '#dc2626',   /* darker red for hover */
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        }
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(239, 68, 68, 0.35)',
      },
      backgroundImage: {
        'red-glow': 'radial-gradient(1200px 600px at 10% -10%, rgba(239,68,68,0.12), transparent 60%), radial-gradient(800px 500px at 110% 10%, rgba(239,68,68,0.10), transparent 60%)',
      }
    }
  }
}