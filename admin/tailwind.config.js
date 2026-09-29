export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cocoa: '#3B1F0F',
        cream: '#FFF3D6',
        coral: '#FF6B6B',
        mint: '#8BC6A0',
        ink: '#0B0B0F',
        card: '#1E1611',
      },
      fontFamily: {
        script: ['Caveat', 'cursive'],
        display: ['"Playfair Display"', 'serif'],
        body: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
