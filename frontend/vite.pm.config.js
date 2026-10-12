import { createPortalConfig } from './vite.portal.config.js'

// Project Manager portal on its own port, running alongside the Intern portal.
// Start it with: npm run dev:pm
export default createPortalConfig({ slug: 'pm', html: 'pm.html', port: 3200 })
