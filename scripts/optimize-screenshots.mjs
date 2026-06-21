// Regenerate the gallery screenshot set from a source directory.
//
//   node scripts/optimize-screenshots.mjs <sourceDir>
//
// For every PNG in <sourceDir> (processed in filename order) this writes:
//   public/images/screenshots/<name>.png         full-size, lossless re-compress
//   public/images/screenshots/thumbs/<name>.png   downscaled strip/teaser thumb
//
// The output directory is wiped first so removed source images don't linger.
// Captions live in src/data/gallery.json and are curated by hand — this
// script never touches that file.
import sharp from 'sharp';
import { readdir, mkdir, rm } from 'node:fs/promises';
import { statSync } from 'node:fs';
import path from 'node:path';

const srcDir = process.argv[2];
if (!srcDir) {
    console.error('usage: node scripts/optimize-screenshots.mjs <sourceDir>');
    process.exit(1);
}

const outDir = path.join('public', 'images', 'screenshots');
const thumbDir = path.join(outDir, 'thumbs');
const THUMB_WIDTH = 480; // crisp at strip (~70px) and teaser (~340px) sizes

await rm(outDir, { recursive: true, force: true });
await mkdir(thumbDir, { recursive: true });

const files = (await readdir(srcDir))
    .filter((f) => /\.png$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

let srcTotal = 0;
let outTotal = 0;

for (const file of files) {
    const inPath = path.join(srcDir, file);
    const outPath = path.join(outDir, file);
    const thumbPath = path.join(thumbDir, file);

    // Full-size: lossless — re-encode with maximum zlib effort only.
    await sharp(inPath)
        .png({ compressionLevel: 9, effort: 10, palette: false })
        .toFile(outPath);

    // Thumbnail: downscaled, palette-quantised (visually lossless on UI
    // screenshots, a fraction of the bytes).
    await sharp(inPath)
        .resize({ width: THUMB_WIDTH })
        .png({ compressionLevel: 9, effort: 10, palette: true, quality: 90 })
        .toFile(thumbPath);

    const srcBytes = statSync(inPath).size;
    const outBytes = statSync(outPath).size;
    const thumbBytes = statSync(thumbPath).size;
    srcTotal += srcBytes;
    outTotal += outBytes + thumbBytes;
    console.log(
        `${file.padEnd(32)} ${(srcBytes / 1024).toFixed(0).padStart(5)}K ` +
        `-> ${(outBytes / 1024).toFixed(0).padStart(5)}K full ` +
        `+ ${(thumbBytes / 1024).toFixed(0).padStart(4)}K thumb`,
    );
}

console.log(
    `\n${files.length} images: ${(srcTotal / 1024).toFixed(0)}K source ` +
    `-> ${(outTotal / 1024).toFixed(0)}K total (full + thumbs)`,
);
