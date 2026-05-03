// Astro configuration for the FBIde marketing site.
// Static-only build, no client JS frameworks. Bootstrap 5 is loaded via
// CDN from each page's head — see src/layouts/BaseLayout.astro.
import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://fbide.freebasic.net',
    // Switch to 'directory' if hosting wants pretty URLs (download/index.html
    // instead of download.html). Default 'file' keeps things flat for static
    // hosts.
    build: {
        format: 'file'
    }
});
