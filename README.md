# Mahadev Properties — GitHub Pages Production Build

This repository is arranged so GitHub Pages **does not publish the source tree directly**.
GitHub Actions builds a separate `dist/` directory and deploys only that artifact.

## What this fixes

The live domain will no longer contain these original URLs/files:

- `/style.css`
- `/script.js`
- `/config.js`
- `/lead-capture.gs`
- source maps (`*.map`)
- setup/readme/private helper files

CSS and JavaScript receive content-hashed production names. CSS is Base64-wrapped and JavaScript is encoded/obfuscated for casual source inspection. The original readable source files remain outside the Pages artifact.

> Important: No browser-based website can make client-side HTML/CSS/JavaScript completely secret. A browser must receive the code needed to render and operate the page. This setup prevents publishing your original readable source files and makes the production JavaScript substantially harder to read/copy, but it is not cryptographic protection.

## First-time GitHub setup

1. Create a GitHub repository and upload **the contents of this folder**.
2. Prefer a **private repository** if your GitHub plan supports Pages for private repositories and you do not want visitors to see the source repository on GitHub.
3. In the repository open **Settings > Secrets and variables > Actions**.
4. Create a repository secret named exactly `LEAD_ENDPOINT`.
5. Put your Google Apps Script Web App URL ending in `/exec` in that secret.
6. Open **Settings > Pages**.
7. Under **Build and deployment**, select **GitHub Actions** as the source.
8. Push/merge to the `main` branch. The included workflow builds and deploys the production artifact.

## GoDaddy DNS

Keep the DNS records that already point `delhipropertybuyandsale.in` to GitHub Pages. The production build generates a `CNAME` file containing:

`delhipropertybuyandsale.in`

DNS does not hide website source; the build/deployment structure is what prevents your original files from being directly published.

## How publishing works

`src/` -> GitHub Actions build -> `dist/` -> GitHub Pages

Only `dist/` is uploaded to Pages. `dist/` is generated during the Action and is ignored by Git.

### Production transformation

- `src/style.css` becomes a hashed production stylesheet whose rules are Base64-wrapped
- `src/script.js` + runtime lead configuration become a hashed encoded/obfuscated production script
- HTML references those generated filenames with integrity hashes
- no `.map` files are generated
- private Google Apps Script source stays under `private/` and is not deployed

## Updating the website

Edit files under `src/`, commit, and push to `main`. Do **not** manually create or upload `dist/`.

## Google Apps Script endpoint

The endpoint is injected from the GitHub Actions secret during the build. This keeps it out of the repository and removes the public `/config.js` file.

The endpoint itself cannot be treated as a true browser secret: visitors' browsers must ultimately send form submissions to it, so a determined user can discover the network destination. Authentication credentials, passwords, service-account keys, private API keys, and database secrets must never be placed in frontend code.

## Local build

No third-party build dependencies are required. Node.js 22 is sufficient.

macOS/Linux:

```bash
LEAD_ENDPOINT='https://script.google.com/macros/s/YOUR_ID/exec' npm run build
```

PowerShell:

```powershell
$env:LEAD_ENDPOINT='https://script.google.com/macros/s/YOUR_ID/exec'
npm run build
```

The generated site will be in `dist/`.
