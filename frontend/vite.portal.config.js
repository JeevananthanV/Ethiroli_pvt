import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve, dirname } from 'path'
import { existsSync } from 'fs'
import { fileURLToPath } from 'url'

// Root of the frontend package, derived from this file's location so the
// configs keep working regardless of the shell's working directory.
const FRONTEND_ROOT = dirname(fileURLToPath(import.meta.url))

// A portal dev server owns one role only. RolePortalShell routes on clean URLs
// (/app/intern/tasks, /auth/pm/login), so every extensionless path has to be
// answered with that role's html shell or a hard refresh lands on a 404.
const portalRewritePlugin = (slug, html) => ({
  name: `${slug}-portal-rewrite`,
  configureServer(server) {
    // req.url is resolved against the server root, so it must stay absolute.
    const shell = html.startsWith('/') ? html : `/${html}`
    server.middlewares.use((req, res, next) => {
      const url = req.url ? req.url.split('?')[0] : ''
      // This middleware is registered before Vite's proxy, so anything the
      // backend owns must be left alone. Without this guard every /api call
      // (login, demo accounts) returns the portal html instead of data.
      const passthrough = ['/api', '/node_modules', '/__vite', '/@fs', '/@id', '/socket.io']
      const ownedByProxy = passthrough.some(
        (prefix) => url === prefix || url.startsWith(`${prefix}/`) || url.startsWith(`${prefix}?`)
      )
      if (ownedByProxy) return next()
      // Open the portal straight on its own sign-in page. This must serve the
      // role's shell html, not the clean login URL: rewriting to /auth/<slug>/login
      // and calling next() leaves the request extensionless, so Vite's SPA
      // fallback answers it with index.html (the marketing site) instead.
      // RolePortalShell already has a "/" route that navigates to the login.
      if (url === '/') {
        req.url = shell
        return next()
      }
      if (!url.includes('.') && !url.startsWith('/@')) {
        req.url = shell
      }
      next()
    })
  },
})

// Kept identical to the main config: several portal modules import shared code
// through paths that do not resolve from their own directory.
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
          const canonical = resolve(FRONTEND_ROOT, `src/${target}`, match[2]);
          return this.resolve(canonical, importer, { skipSelf: true });
        }
      }
    }
    return null;
  },
})

/**
 * Build a single-port dev config for one role portal.
 * @param {{ slug: string, html: string, port: number }} portal
 */
export const createPortalConfig = ({ slug, html, port }) =>
  defineConfig({
    // Each dev server needs its OWN dep-optimizer cache.
    //
    // Vite keys optimized deps by a hash of the config, but every server in this
    // project would otherwise share the single default node_modules/.vite dir.
    // Two servers running at once then overwrite each other's cache: one
    // re-optimizes, the other's already-emitted ?v=<hash> URLs 504 with
    // "Outdated Optimize Dep", and the affected portal renders a blank page
    // because the failure happens before React mounts.
    cacheDir: `node_modules/.vite-${slug}`,
    plugins: [react(), portalRewritePlugin(slug, html), relativePathFallbackPlugin()],
    server: {
      port,
      strictPort: false,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path,
          ws: true,
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
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
          [slug]: resolve(FRONTEND_ROOT, html),
        },
      },
    },
  })

export default createPortalConfig;
