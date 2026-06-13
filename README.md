# FBIde website

Marketing site for [FBIde](https://github.com/albeva/fbide) — built with
[Astro](https://astro.build) and Bootstrap 5. Static, no JS framework, no
PHP, no jQuery. Bootstrap and its bundle script are pulled from a CDN
so the build has zero compiled JS of its own.

Replicates the look and feel of the original 2012-era PHP site.

## Layout

```
fbide_website/
├── astro.config.mjs       Astro config (static, single-output)
├── package.json
├── public/                Static assets served as-is
│   ├── favicon.ico        Icon set (+ PNG sizes, apple-touch, manifest)
│   ├── site.webmanifest
│   └── images/
│       ├── hero-banner.png Hero banner (horse + wordmark + reflection)
│       └── screenshots/   Gallery images (PNG)
└── src/
    ├── layouts/
    │   └── BaseLayout.astro   navbar + footer + Bootstrap scaffolding
    ├── components/
    │   ├── Hero.astro         home-page hero band
    │   └── Gallery.astro      modal-driven screenshot grid
    ├── pages/
    │   ├── index.astro        Overview / home
    │   ├── download.astro     Win64 + Win32 zip download cards
    │   └── changelog.astro    Release notes
    ├── data/
    │   ├── release.json       Single source of truth for current version
    │   └── gallery.json       List of screenshots shown on the home page
    └── styles/
        └── site.css           Custom overrides on top of Bootstrap 5
```

## Development

```bash
npm install
npm run dev       # dev server with hot-reload, http://localhost:4321
npm run build     # static output in dist/
npm run preview   # preview the built site locally
```

## Updating the current release

After cutting a new FBIde release, update `src/data/release.json`:

```json
{
  "version": "0.5.0.beta-2",
  "tag": "v0.5.0.beta-2",
  "isPrerelease": true,
  "downloads": {
    "win64": "https://github.com/albeva/fbide/releases/download/v0.5.0.beta-2/fbide-0.5.0.beta-2-win64.zip",
    "win32": "https://github.com/albeva/fbide/releases/download/v0.5.0.beta-2/fbide-0.5.0.beta-2-win32.zip"
  },
  "releasePage": "https://github.com/albeva/fbide/releases/tag/v0.5.0.beta-2",
  "releaseDate": "2026-MM-DD",
  "githubRepo": "https://github.com/albeva/fbide"
}
```

The home page hero, the download cards, and the changelog header all
read from this file — the version only needs to change in one place.
Add a new `<article>` to `src/pages/changelog.astro` per release.

## Adding screenshots

Drop full-size PNGs into `public/images/screenshots/` and reference
them in `src/data/gallery.json`. Each entry is `{ src, caption }`; an
optional `thumb` key lets you ship a smaller thumbnail separately.

## Future pages

The layout is set up to grow — new pages can be added under `src/pages/`
and will pick up the navigation by passing an `activeNav` prop. Likely
candidates: a Build From Source guide, a Getting Started walkthrough,
and a Contributing page.

## Analytics

Google Analytics 4 (`G-R2Q0EKY87R`) is wired into `BaseLayout`. The
gtag tag is emitted only on production builds (`npm run build`) — local
`npm run dev` skips it, so personal browsing never hits GA. To change
the measurement ID or remove analytics entirely, edit
`src/components/Analytics.astro`.

## Deploy

`npm run build` produces a fully static `dist/` directory. Drop it on
any static host. No server-side runtime required.

The current production deploy ships to the FreeBASIC FTP host via
`.github/workflows/deploy.yml` — every push to `main` rebuilds and
uploads only the changed files (`SamKirkland/FTP-Deploy-Action` keeps
a `.ftp-deploy-sync-state.json` on the remote for delta detection).

Required repository secrets (Settings → Secrets and variables →
Actions → Secrets):

| Name           | Value                          |
| -------------- | ------------------------------ |
| `FTP_HOST`     | hostname (no `ftp://` prefix)  |
| `FTP_USERNAME` | login user                     |
| `FTP_PASSWORD` | login password                 |

Optional **repo variables** (Variables tab):

| Name             | Default          | Notes                              |
| ---------------- | ---------------- | ---------------------------------- |
| `FTP_SERVER_DIR` | `/public_html/`  | Remote path to sync into.          |
| `FTP_PROTOCOL`   | `ftps`           | Set to `ftp` for plain FTP hosts.  |

Optional secret `FTP_PORT` (default `21`).

To trigger a deploy without pushing: Actions → Deploy → Run workflow.

## License

MIT — see [LICENSE](LICENSE). Same license as
[FBIde](https://github.com/albeva/fbide).
