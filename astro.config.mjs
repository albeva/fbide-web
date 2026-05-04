// Astro configuration for the FBIde marketing site.
// Static-only build, no client JS frameworks. Bootstrap 5 is loaded via
// CDN from each page's head — see src/layouts/BaseLayout.astro.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
    site: 'https://fbide.freebasic.net',
    // Switch to 'directory' if hosting wants pretty URLs (download/index.html
    // instead of download.html). Default 'file' keeps things flat for static
    // hosts.
    build: {
        format: 'file'
    },
    integrations: [
        // build.format: 'file' produces /foo.html on disk — append the
        // extension to non-root sitemap entries so search engines hit the
        // real URLs instead of 404ing on a directory-style /foo.
        sitemap({
            serialize(item) {
                const url = new URL(item.url);
                if (url.pathname !== '/' && !url.pathname.endsWith('.html')) {
                    url.pathname = `${url.pathname.replace(/\/$/, '')}.html`;
                    item.url = url.toString();
                }
                return item;
            },
        }),
    ]
});
