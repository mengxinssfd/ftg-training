import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Path from 'path';

/**
 * Vite configuration
 * https://vitejs.dev/config/
 */
export default defineConfig((c) => {
  const base = c.mode === 'deploy' ? '/ftg-training/' : '';
  return {
    cacheDir: `./.cache`,
    css: {
      devSourcemap: true,
    },
    base,
    define: {
      'import.meta.env.VITE_BASE': JSON.stringify(base),
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
