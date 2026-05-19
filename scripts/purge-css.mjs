// Post-build CSS purge.
//
// The minimal Bootstrap Sass build still emits the full utilities API —
// ~1800 utility classes, of which the site uses fewer than 100.
// PurgeCSS scans the rendered HTML and drops every selector whose
// classes never appear.
//
// Runs against dist/ AFTER `astro build` so the content is the final
// HTML (server-rendered classes included). The PurgeCSS Node API is
// used rather than the CLI: the CLI fails to load a config file on
// Windows (it import()s a raw `c:\...` path, which the ESM loader
// rejects).
import { PurgeCSS } from 'purgecss';
import { writeFileSync, statSync } from 'node:fs';

const results = await new PurgeCSS().purge({
    content: ['dist/**/*.html'],
    css: ['dist/_astro/*.css'],
    safelist: [
        // Toggled by the inline navbar script — `.collapse:not(.show)`
        // is the rule that hides the mobile menu, so it must survive.
        'show',
        // Toggled by the gallery script on the active strip thumbnail.
        'active',
        // Download-page release badges. Which colour renders depends on
        // the release type, so a prerelease build never emits the green
        // `Recommended` variant — keep all three the template can use.
        'text-bg-success',
        'text-bg-warning',
        'text-bg-secondary',
    ],
});

for (const result of results) {
    if (!result.file) continue;
    const before = statSync(result.file).size;
    writeFileSync(result.file, result.css);
    const after = Buffer.byteLength(result.css);
    console.log(
        `purged ${result.file}: ` +
        `${(before / 1024).toFixed(1)} KiB -> ${(after / 1024).toFixed(1)} KiB`,
    );
}
