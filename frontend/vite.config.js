import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { existsSync } from 'fs'

// Custom plugin to route /app/* and /admin/* requests to admin.html in dev mode
const multiPageRewritePlugin = () => ({
  name: 'multi-page-rewrite',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const url = req.url ? req.url.split('?')[0] : '';
      const rolePaths = ['/app', '/admin', '/auth', '/dashboard', '/intern'];
      if (rolePaths.some((path) => url.startsWith(path)) && !url.includes('.')) {
        req.url = '/admin.html';
      }
      next();
    });
  },
});

const relativePathFallbackPlugin = () => ({
  name: 'relative-path-fallback',
  resolveId(source, importer) {
    if (!importer) return null;
    const targets = ['common', 'services', 'modules', 'roles', 'store', 'components', 'styles', 'utils'];
    for (const target of targets) {
      const regex = new RegExp(`^(\\.\\.\\/)+${target}\\/(.*)`);
      const match = source.match(regex);
      if (match) {
        const directResolve = resolve(dirname(importer), source);
        const exists = existsSync(directResolve) ||
          existsSync(`${directResolve}.jsx`) ||
          existsSync(`${directResolve}.js`) ||
          existsSync(resolve(directResolve, 'index.jsx')) ||
          existsSync(resolve(directResolve, 'index.js'));
        if (!exists) {
          const canonical = resolve(process.cwd(), `src/${target}`, match[2]);
          return this.resolve(canonical, importer, { skipSelf: true });
        }
      }
    }
    return null;
  },
});

export default defineConfig({
  plugins: [react(), multiPageRewritePlugin(), relativePathFallbackPlugin()],
  server: {
    port: 3000,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        ws: true,  // WebSocket support
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Ensure credentials are sent
            proxyReq.setHeader('Access-Control-Allow-Credentials', 'true');
          });
        }
      }
    }
  },
  build: {
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        admin: resolve(process.cwd(), 'admin.html'),
        'super-admin': resolve(process.cwd(), 'super-admin.html'),
        'hr': resolve(process.cwd(), 'hr.html'),
        'tutor': resolve(process.cwd(), 'tutor.html'),
        'project-manager': resolve(process.cwd(), 'pm.html'),
        'finance': resolve(process.cwd(), 'finance.html'),
        'sales': resolve(process.cwd(), 'sales.html'),
        'reception': resolve(process.cwd(), 'reception.html'),
        'employee': resolve(process.cwd(), 'employee.html'),
        'student': resolve(process.cwd(), 'student.html'),
        'intern': resolve(process.cwd(), 'intern.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('react-router') || id.includes('react-router-dom')) {
              return 'vendor-router';
            }
            if (id.includes('@reduxjs/toolkit') || id.includes('react-redux')) {
              return 'vendor-redux';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('socket.io-client') || id.includes('axios')) {
              return 'vendor-network';
            }
          }
        },
      },
    },
  },
})
