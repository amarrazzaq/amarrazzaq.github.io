// Checks the built site in _site/ before it is deployed.
// Fails (exit code 1) if:
//   - a file GitHub Pages or Google needs is missing (CNAME, robots.txt, sitemap.xml, verification file)
//   - an address listed in sitemap.xml has no page
//   - an internal link, image, script or stylesheet points to a file that does not exist
// External links are not checked (they would make the check depend on other websites).

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, posix } from 'node:path';

const SITE = '_site';
const DOMAIN = 'amarrazzaq.com';
const errors = [];

// Problems accepted for now: reported but do not fail the build.
// Add a line only as a short-term exception; fix the problem and delete the line.
const KNOWN_ISSUES = [];
const isKnown = (msg) => KNOWN_ISSUES.some((k) => msg.startsWith(k));

// Files that must never be published.
const MUST_NOT_PUBLISH = [
  'cv.pdf', // the CV is private; /cv/ and /cv.htm only redirect to the home page
  'insights/article-template.html', // authoring template, kept in docs/
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

// Map a site address (/research, /research/, /x.html) to a built file, or null.
function resolve(urlPath) {
  let p = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  if (!p.startsWith('/')) p = '/' + p;
  const candidates = p.endsWith('/')
    ? [p + 'index.html']
    : [p, p + '.html', p + '/index.html'];
  return candidates.map((c) => join(SITE, c)).find((f) => existsSync(f) && statSync(f).isFile()) ?? null;
}

const rel = (file) => posix.relative(SITE, file.split('\\').join('/'));

// 1. Required files
for (const f of ['CNAME', 'robots.txt', 'sitemap.xml', 'google39ba595f50221b08.html', 'index.html']) {
  if (!existsSync(join(SITE, f))) errors.push(`missing required file: ${f}`);
}
for (const f of MUST_NOT_PUBLISH) {
  if (existsSync(join(SITE, f))) errors.push(`must not be published: ${f}`);
}
for (const f of walk(SITE)) {
  if (f.toLowerCase().endsWith('.pdf')) errors.push(`PDF found in site, check it is meant to be public: ${rel(f)}`);
}
if (existsSync(join(SITE, 'CNAME')) && readFileSync(join(SITE, 'CNAME'), 'utf8').trim() !== DOMAIN) {
  errors.push(`CNAME does not contain ${DOMAIN}`);
}

// 2. Every sitemap address has a page
const sitemap = existsSync(join(SITE, 'sitemap.xml')) ? readFileSync(join(SITE, 'sitemap.xml'), 'utf8') : '';
const sitemapUrls = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
for (const loc of sitemapUrls) {
  const u = new URL(loc);
  if (u.hostname !== DOMAIN) errors.push(`sitemap: unexpected host in ${loc}`);
  else if (!resolve(u.pathname)) errors.push(`sitemap: no page for ${loc}`);
}

// 3. Internal links and assets resolve
const htmlFiles = walk(SITE).filter((f) => f.endsWith('.html') || f.endsWith('.htm'));
const attr = /\s(?:href|src)\s*=\s*(["'])(.*?)\1/gi;
let linkCount = 0;
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '');
  const pageDir = posix.dirname('/' + rel(file));
  for (const match of html.matchAll(attr)) {
    const ref = match[2].trim();
    if (!ref || /^(#|mailto:|tel:|javascript:|data:)/i.test(ref)) continue;
    let path;
    if (/^https?:\/\//i.test(ref) || ref.startsWith('//')) {
      const u = new URL(ref, 'https://x');
      if (u.hostname !== DOMAIN && u.hostname !== 'www.' + DOMAIN) continue; // external
      path = u.pathname;
    } else if (ref.startsWith('/')) {
      path = ref;
    } else {
      path = posix.join(pageDir, ref);
    }
    linkCount++;
    if (!resolve(path)) errors.push(`${rel(file)}: broken link ${ref}`);
  }
}

console.log(`Checked ${htmlFiles.length} pages, ${sitemapUrls.length} sitemap addresses, ${linkCount} internal links.`);
const known = errors.filter(isKnown);
const real = errors.filter((e) => !isKnown(e));
if (known.length) console.warn(`\n${known.length} known issue(s), not failing the build:\n  ` + known.join('\n  '));
if (real.length) {
  console.error(`\n${real.length} problem(s):\n  ` + real.join('\n  '));
  process.exit(1);
}
console.log('All checks passed.');
