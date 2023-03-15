import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import chokidar from 'chokidar';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  server: {
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
