// Smoke test against a running preview: `npm run build && npm run preview` then `npm run check:site`.
// Usage: node scripts/check.mjs [--url=http://localhost:4321] [--shots=dir]
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';

const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const BASE = args.url ?? 'http://localhost:4321';
const SHOTS = args.shots;
const failures = [];
const check = (ok, msg) => {
  console.log(`${ok ? '✓' : '✗'} ${msg}`);
  if (!ok) failures.push(msg);
};

const browser = await chromium.launch();
if (SHOTS) await mkdir(SHOTS, { recursive: true });

for (const lang of ['en', 'de']) {
  for (const theme of ['light', 'dark']) {
    for (const [device, viewport] of [['desktop', { width: 1366, height: 860 }], ['mobile', { width: 360, height: 780 }]]) {
      const ctx = await browser.newContext({ viewport, colorScheme: theme, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      const broken = [];
      page.on('response', (r) => { if (r.status() >= 400) broken.push(`${r.status()} ${r.url()}`); });

      const res = await page.goto(`${BASE}/${lang}/`, { waitUntil: 'networkidle' });
      const label = `${lang}/${theme}/${device}`;
      check(res?.status() === 200, `${label}: 200`);
      check((await page.getAttribute('html', 'data-theme')) === theme, `${label}: theme follows system`);
      check((await page.getAttribute('html', 'lang')) === lang, `${label}: html lang`);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      check(overflow <= 0, `${label}: no horizontal overflow (${overflow}px)`);

      // Scroll through so lazy images and videos load.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 500) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        for (const el of document.querySelectorAll('.reveal')) el.classList.add('in');
      });
      // Settle on each section with lazy media, as a reader would.
      for (const id of ['features', 'emergency', 'screens']) {
        await page.$eval(`#${id}`, (e) => e.scrollIntoView({ block: 'center' }));
        await page.waitForTimeout(400);
      }
      await page.waitForLoadState('networkidle');
      await page.waitForFunction(() => [...document.images].every((i) => !i.checkVisibility() || i.complete), null, { timeout: 8000 }).catch(() => {});

      const badImgs = await page.$$eval('img', (imgs) => imgs.filter((i) => i.checkVisibility() && !(i.complete && i.naturalWidth > 0)).map((i) => i.src));
      check(badImgs.length === 0, `${label}: visible images loaded ${badImgs.join(' ')}`);
      check(broken.length === 0, `${label}: no 4xx/5xx ${broken.join(' ')}`);
      check(errors.length === 0, `${label}: no JS errors ${errors.join(' ')}`);

      // Screen tour: next button switches the screen.
      const before = await page.$eval('[data-tour-tab][aria-selected="true"]', (b) => b.dataset.tourTab);
      await page.click('[data-tour-next]');
      const after = await page.$eval('[data-tour-tab][aria-selected="true"]', (b) => b.dataset.tourTab);
      check(before !== after, `${label}: tour next switches screen`);
      check(await page.$eval('footer', (f) => f.textContent.includes('Saimon Mahari')), `${label}: footer credit`);

      if (device === 'desktop') {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(1500);
        const playing = await page.$eval('video', (v) => v.currentSrc.endsWith('.mp4') && !v.paused && v.readyState >= 2);
        check(playing, `${label}: hero video playing`);
        const src = await page.$eval('video', (v) => v.currentSrc);
        check(src.includes(`-${theme}-${lang}.mp4`), `${label}: hero video matches theme/lang`);

        // Toggle flips the theme and swaps the video.
        await page.click('[data-theme-toggle]');
        const other = theme === 'light' ? 'dark' : 'light';
        check((await page.getAttribute('html', 'data-theme')) === other, `${label}: toggle switches theme`);
        await page.waitForTimeout(400);
        check((await page.$eval('video', (v) => v.currentSrc)).includes(`-${other}-`), `${label}: toggle swaps video`);
        await page.click('[data-theme-toggle]');
      }

      if (SHOTS) {
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(800);
        await page.screenshot({ path: path.join(SHOTS, `${lang}-${theme}-${device}.png`), fullPage: true });
      }
      await ctx.close();
    }
  }
}

// Root redirect picks the language.
for (const [locale, want] of [['de-CH', '/de/'], ['en-US', '/en/']]) {
  const ctx = await browser.newContext({ locale });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`);
  await page.waitForURL(`**${want}`);
  check(new URL(page.url()).pathname === want, `root redirect ${locale} → ${want}`);
  await ctx.close();
}

await browser.close();
console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nAll checks passed');
process.exit(failures.length ? 1 : 0);
