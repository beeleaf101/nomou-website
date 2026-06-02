import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/arduino': {
        target: ' https://sacrifice-substance-homeland-released.trycloudflare.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/arduino/, ''),
      },
      '/api': {
        target: 'https://allowance-famous-colored-modes.trycloudflare.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
