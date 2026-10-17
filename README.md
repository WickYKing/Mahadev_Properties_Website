# Mahadev Properties — Production GitHub Pages setup

This repository is configured to build the existing multi-page static website with Vite and deploy **only the generated `dist/` directory** to GitHub Pages.

## What this changes

The live domain no longer publishes these original filenames:

- `style.css`
- `script.js`
- `config.js`
- `lead-capture.gs`
- setup/documentation files
- source maps

The browser receives hashed/minified production files such as:

- `assets/app-<hash>.js`
- `assets/site-<hash>.css`

Frontend code can never be made completely secret because a browser must download the code it executes. This setup prevents the original readable files from being served under their old predictable URLs and removes source maps.

## Required GitHub setting

Create a repository Actions secret:

`LEAD_ENDPOINT`

Value: your Google Apps Script Web App `/exec` URL.

**Important:** the endpoint is compiled into the browser bundle and can be discovered by a determined visitor. It is not a password. Validation/anti-abuse controls must remain server-side in Apps Script.

## GitHub Pages

In GitHub:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Keep the custom domain as `delhipropertybuyandsale.in`.
4. Enable **Enforce HTTPS** after DNS is valid.

Your existing GoDaddy DNS can remain unchanged if the domain already resolves correctly to GitHub Pages.

## Local test

```bash
npm ci
LEAD_ENDPOINT="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec" npm run build
npm run preview
```

The build automatically fails if original source filenames or source maps appear in `dist/`.

## Do not publish Apps Script source here

Keep `lead-capture.gs`, spreadsheet IDs, internal notes, and setup files in a private repository or secure local storage. They are not needed by GitHub Pages.

## If this GitHub repository is public

The **repository source itself is still publicly readable on github.com**. GitHub Actions only controls what is served on your domain. To keep source code private as well, use a private source repository (with a Pages-capable plan) or a private-source/public-build two-repository workflow.
