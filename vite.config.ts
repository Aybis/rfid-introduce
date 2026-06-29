import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['three', 'gsap', '@studio-freight/lenis'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
          vendor: ['react', 'react-dom', '@studio-freight/lenis', '@phosphor-icons/react'],
        },
      },
    },
  },
});
