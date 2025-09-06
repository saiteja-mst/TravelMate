/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'ocean-deep': '#0B1426',
        'ocean-blue': '#1E3A8A',
        'sunset-orange': '#FF6B35',
        'coral': '#FF8E53',
        'tropical-turquoise': '#06D6A0',
        'mint': '#40E0D0',
        'warm-white': '#FEFEFE',
        'cloud-gray': '#F8FAFC',
        'charcoal': '#1F2937',
      },
      fontFamily: {
        'sans': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        'elegant': ['Dancing Script', 'cursive'],
        'modern': ['Montserrat', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '0 35px 60px -12px rgba(0, 0, 0, 0.25)',
        'glow': '0 0 20px rgba(6, 214, 160, 0.3)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.3)',
      },
      backdropBlur: {
        '2xl': '40px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(6, 214, 160, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(6, 214, 160, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
