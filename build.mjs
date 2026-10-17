import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';

const root = process.cwd();
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const domain = 'delhipropertybuyandsale.in';
const leadEndpoint = process.env.LEAD_ENDPOINT || '';

function sha(value, length = 12) {
  return crypto.createHash('sha256').update(value).digest('hex').slice(0, length);
}
function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function copyDir(from, to) {
  ensureDir(to);
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, entry.name), b = path.join(to, entry.name);
    entry.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}
function fail(message) {
  console.error(`BUILD ERROR: ${message}`);
  process.exit(1);
}
function integrity(value) {
  return 'sha384-' + crypto.createHash('sha384').update(value).digest('base64');
}

// Light production encoding. This is deterrence/obfuscation, not cryptographic secrecy.
function encodeJs(source) {
  const key = crypto.createHash('sha256').update('mahadev-pages:' + source).digest().subarray(0, 16);
  const bytes = Buffer.from(source, 'utf8');
  const encoded = Buffer.alloc(bytes.length);
  for (let i = 0; i < bytes.length; i++) encoded[i] = bytes[i] ^ key[i % key.length];
  const payload = encoded.toString('base64');
  const keyArray = JSON.stringify([...key]);
  return `(()=>{const p='${payload}',k=${keyArray},b=Uint8Array.from(atob(p),c=>c.charCodeAt(0));for(let i=0;i<b.length;i++)b[i]^=k[i%k.length];Function(new TextDecoder().decode(b))();})();`;
}

if (!fs.existsSync(src)) fail('src directory is missing.');
if (!leadEndpoint) fail('GitHub Actions secret LEAD_ENDPOINT is not configured.');
if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(leadEndpoint)) {
  fail('LEAD_ENDPOINT is not a valid Google Apps Script Web App /exec URL.');
}

if (fs.existsSync(dist)) fs.rmSync(dist, { recursive: true, force: true });
ensureDir(path.join(dist, 'assets'));

// CSS source is wrapped as a Base64 data stylesheet, so the deployed CSS file does not contain readable source rules.
const cssSource = fs.readFileSync(path.join(src, 'style.css'), 'utf8');
if (/url\s*\(/i.test(cssSource)) {
  fail('style.css contains url(...). The Base64 stylesheet wrapper must be reviewed before deployment.');
}
const cssPayload = Buffer.from(cssSource, 'utf8').toString('base64');
const cssBuilt = `@import url("data:text/css;charset=utf-8;base64,${cssPayload}");`;
const cssName = `site.${sha(cssBuilt)}.css`;
fs.writeFileSync(path.join(dist, 'assets', cssName), cssBuilt);
const cssIntegrity = integrity(cssBuilt);

// Runtime configuration is injected at build time. config.js is not deployed.
const appSource = fs.readFileSync(path.join(src, 'script.js'), 'utf8');
const runtimeConfig = `window.MAHADEV_CONFIG={leadEndpoint:${JSON.stringify(leadEndpoint)},siteUrl:${JSON.stringify(`https://${domain}`)}};\n`;
const jsBuilt = encodeJs(runtimeConfig + appSource);
const jsName = `app.${sha(jsBuilt)}.js`;
fs.writeFileSync(path.join(dist, 'assets', jsName), jsBuilt);
const jsIntegrity = integrity(jsBuilt);

// Copy images/media only. Original JS/CSS/private files are never copied.
copyDir(path.join(src, 'assets'), path.join(dist, 'assets'));

const htmlFiles = fs.readdirSync(src).filter(name => name.endsWith('.html'));
for (const file of htmlFiles) {
  let html = fs.readFileSync(path.join(src, file), 'utf8');
  html = html.replace(
    /<link\s+rel=["']stylesheet["']\s+href=["']style\.css["']\s*\/?>/i,
    `<link rel="stylesheet" href="assets/${cssName}" integrity="${cssIntegrity}" crossorigin="anonymous">`
  );
  html = html.replace(/<script\s+src=["']config\.js["']\s+defer>\s*<\/script>\s*/i, '');
  html = html.replace(
    /<script\s+src=["']script\.js["']\s+defer>\s*<\/script>/i,
    `<script src="assets/${jsName}" integrity="${jsIntegrity}" crossorigin="anonymous" defer></script>`
  );

  if (/style\.css|script\.js|config\.js/.test(html)) fail(`${file} still references a source asset.`);
  fs.writeFileSync(path.join(dist, file), html);
}

for (const file of ['robots.txt', 'sitemap.xml']) {
  fs.copyFileSync(path.join(src, file), path.join(dist, file));
}
fs.writeFileSync(path.join(dist, 'CNAME'), `${domain}\n`);
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

// Deployment safety checks.
const forbiddenNames = new Set([
  'style.css', 'script.js', 'config.js', 'lead-capture.gs',
  'CONNECT-GOOGLE-SHEET.txt', 'CONNECTION-STATUS.txt', 'README.txt', 'START-HERE.txt'
]);
const forbiddenFound = [];
const maps = [];
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(p);
    else {
      if (forbiddenNames.has(entry.name)) forbiddenFound.push(p);
      if (entry.name.endsWith('.map')) maps.push(p);
    }
  }
}
scan(dist);
if (forbiddenFound.length) fail(`Private/source files found in dist: ${forbiddenFound.join(', ')}`);
if (maps.length) fail(`Source maps found in dist: ${maps.join(', ')}`);

console.log(`Built ${htmlFiles.length} HTML pages for https://${domain}`);
console.log(`CSS production asset: assets/${cssName}`);
console.log(`JS production asset:  assets/${jsName}`);
console.log('Verified absent: style.css, script.js, config.js, lead-capture.gs, setup docs, and *.map files.');
