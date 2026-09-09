import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Custom plugin to route /app/* and /admin/* requests to admin.html in dev mode
const multiPageRewritePlugin = () => ({
  name: 'multi-page-rewrite',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url ? req.url.split('?')[0] : '';
      if ((url.startsWith('/app') || url.startsWith('/admin')) && !url.includes('.')) {
        req.url = '/admin.html';
      }
      next();
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), multiPageRewritePlugin()],
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        admin: resolve(process.cwd(), 'admin.html'),
      },
    },
  },
})
