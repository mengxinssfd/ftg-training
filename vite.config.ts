import { defineConfig } from 'vite';
import Path from 'path';

/**
 * Vite configuration
 * https://vitejs.dev/config/
 */
export default defineConfig(() => {
  return {
    cacheDir: `./.cache`,
    resolve: {
      alias: {
        '@': Path.resolve(__dirname, 'packages/client/src'),
        '@core': Path.resolve(__dirname, 'packages/core/src'),
      },
    },
  };
});
