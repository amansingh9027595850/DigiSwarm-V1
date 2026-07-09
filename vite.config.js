import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Where the backend listens. Configure via VITE_API_TARGET if you change it.
  const apiTarget = env.VITE_API_TARGET || 'http://localhost:5000';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    server: {
      port: 5173,
      strictPort: false,
      open: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          ws: true,
        },
      },
    },
    build: {
      // Split heavy third-party libs into their own chunks so the first
      // page payload stays small and route chunks can stream in parallel.
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'data-vendor': ['@tanstack/react-query', '@reduxjs/toolkit', 'react-redux'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            'motion-vendor': ['framer-motion'],
            'icon-vendor': ['lucide-react'],
          },
        },
      },
      chunkSizeWarningLimit: 800,
    },
  };
});
