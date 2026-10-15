import { createPortalConfig } from './vite.portal.config.js'

// Intern portal (IMS) on its own port, so it can be worked on without the
// Project Manager portal or the shared admin console competing for the same
// dev server. Start it with: npm run dev:intern
export default createPortalConfig({ slug: 'intern', html: 'intern.html', port: 3100 })
