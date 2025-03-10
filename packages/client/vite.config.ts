import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Path from 'path';

/**
 * Vite configuration
 * https://vitejs.dev/config/
 */
export default defineConfig(() => {
  return {
    cacheDir: `./.cache`,
    css: {
      devSourcemap: true,
    },
    resolve: {
      alias: {
        '@': Path.resolve(__dirname, 'src'),
        '@core': Path.resolve(__dirname, '../../packages/core/src'),
      },
    },
    plugins: [
      // https://github.com/vitejs/vite/tree/main/packages/plugin-react
      react(),
    ],
  };
});
