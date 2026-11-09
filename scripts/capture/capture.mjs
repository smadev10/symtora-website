// Captures screenshots and short screen recordings of the Symtora app for the website.
//
// Prerequisite: the app's web dev server running from the symtora repo:
//   cd ../symtora/src/frontend && npx expo start --web --port 8081
// The Symtora API is mocked here, so no backend is needed.
//
// Usage: node scripts/capture/capture.mjs [--only=shots|videos] [--app=http://localhost:8081]

import { mkdir, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import { entriesFor, caseText } from './fixtures.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')));
const APP = args.app ?? 'http://localhost:8081';
const API = 'http://localhost:8080';
const OUT = path.join(root, 'public', 'media');
const TMP = path.join(root, '.capture-tmp');

const VIEWPORT = { width: 390, height: 844 };
const LANGS = ['en', 'de'];
const THEMES = ['light', 'dark'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Wires the fake API and the persisted app state (settings + session) into a page. */
async function prepare(context, { lang, theme, signedIn = true, consent = true, analysisDelayMs = 0 }) {
  const entries = entriesFor(lang);
  const created = new Map();

  await context.addInitScript(
    ({ lang, theme, signedIn, consent }) => {
      if (sessionStorage.getItem('capture-init')) return;
      sessionStorage.setItem('capture-init', '1');
      localStorage.clear();
      localStorage.setItem(
        'symtora.settings.v1',
        JSON.stringify({ lang, theme, retention: 30, localOnly: true, consentAccepted: consent }),
      );
      if (signedIn) {
        localStorage.setItem(
          'symtora.session.v1',
          JSON.stringify({
            token: 'demo-token',
            expiresAt: new Date(Date.now() + 30 * 86_400_000).toISOString(),
            user: { email: 'lena.meier@example.ch', name: 'Lena' },
          }),
        );
      }
    },
    { lang, theme, signedIn, consent },
  );

  await context.route(`${API}/**`, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const json = (body, status = 200) =>
      route.fulfill({
        status,
        contentType: 'application/json',
        headers: { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' },
        body: JSON.stringify(body),
      });

    if (req.method() === 'OPTIONS') return json({}, 204);
    const p = url.pathname;

    if (p === '/auth/login' || p === '/auth/register') {
      return json({ token: 'demo-token', expiresAt: new Date(Date.now() + 864e5).toISOString(), name: 'Lena' });
    }
    if (p === '/entries' && req.method() === 'GET') {
      return json([...created.values(), ...entries].map((e) => resolveEntry(e)));
    }
    if (p === '/entries' && req.method() === 'POST') {
      const body = req.postDataJSON();
      const id = `new-${created.size + 1}`;
      const template = entries[0];
      created.set(id, {
        ...template,
        id,
        rawText: body.text,
        bodyRegion: body.bodyRegion ?? 'head',
        createdAt: new Date().toISOString(),
        readyAt: Date.now() + analysisDelayMs,
      });
      return json({ id, status: 'Pending' }, 202);
    }
    const m = p.match(/^\/entries\/(.+)$/);
    if (m) {
      const id = decodeURIComponent(m[1]);
      const e = created.get(id) ?? entries.find((x) => x.id === id);
      return e ? json(resolveEntry(e)) : json({}, 404);
    }
    if (p === '/transcriptions') return json({ text: caseText(lang, 'headache') });
    if (p === '/me/export') return json({ exportedAt: new Date().toISOString(), profile: {}, entries });
    return json({});
  });
}

function resolveEntry(e) {
  const { readyAt, ...rest } = e;
  if (readyAt && Date.now() < readyAt) return { ...rest, status: 'Pending', assessment: null };
  return rest;
}

async function newContext(browser, opts, video) {
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: video ? 2 : 3,
    colorScheme: opts.theme,
    locale: opts.lang === 'de' ? 'de-CH' : 'en-GB',
    permissions: ['microphone'],
  });
  await prepare(context, opts);
  return context;
}

async function settle(page, ms = 900) {
  await page.waitForLoadState('networkidle').catch(() => {});
  await page.evaluate(() => document.fonts.ready);
  await sleep(ms);
}

async function shot(page, lang, theme, name) {
  const dir = path.join(OUT, theme, lang);
  await mkdir(dir, { recursive: true });
  const png = await page.screenshot({ type: 'png' });
  await sharp(png).resize({ width: 780 }).webp({ quality: 86 }).toFile(path.join(dir, `${name}.webp`));
  console.log(`  ✓ ${theme}/${lang}/${name}.webp`);
}

const clickText = (page, text) => page.getByText(text, { exact: true }).first().click();

async function captureShots(browser) {
  for (const lang of LANGS) {
    for (const theme of THEMES) {
      console.log(`Screens ${lang}/${theme}`);
      const T = lang === 'en' ? STR.en : STR.de;

      // Signed-out screens.
      {
        const ctx = await newContext(browser, { lang, theme, signedIn: false });
        const page = await ctx.newPage();
        await page.goto(`${APP}/login`);
        await settle(page);
        await shot(page, lang, theme, 'login');
        await ctx.close();
      }
      // Onboarding (signed in, consent not yet given).
      {
        const ctx = await newContext(browser, { lang, theme, consent: false });
        const page = await ctx.newPage();
        await page.goto(`${APP}/onboarding`);
        await settle(page);
        await shot(page, lang, theme, 'onboarding');
        await ctx.close();
      }
      // Main app.
      const ctx = await newContext(browser, { lang, theme, analysisDelayMs: 60_000 });
      const page = await ctx.newPage();
      for (const [name, route] of [
        ['home', '/start'],
        ['emergency', '/emergency'],
        ['settings', '/data'],
        ['profile', '/profile'],
        ['assessment', '/assessment/demo-1'],
      ]) {
        await page.goto(`${APP}${route}`);
        await settle(page, 1400);
        await shot(page, lang, theme, name);
      }

      // Assessment scrolled to causes and next steps.
      await page.mouse.move(195, 500);
      await page.mouse.wheel(0, 520);
      await sleep(700);
      await shot(page, lang, theme, 'assessment-causes');

      // New entry with a chip picked.
      await page.goto(`${APP}/new`);
      await settle(page);
      await clickText(page, T.chip);
      await sleep(400);
      await shot(page, lang, theme, 'new');

      // Analysing state (the mock keeps the entry pending).
      await clickText(page, T.analyze);
      await sleep(1600);
      await shot(page, lang, theme, 'analysing');

      // Voice recording with the fake microphone.
      await page.goto(`${APP}/record`);
      await settle(page, 2600);
      await shot(page, lang, theme, 'record');
      await ctx.close();
    }
  }
}

/**
 * Records a flow via the Chrome screencast (full device-pixel resolution, unlike
 * Playwright's recordVideo), then encodes an MP4 + poster under public/media/video.
 * The flow calls `start()` once the first screen has settled, so boot frames are skipped.
 */
async function recordFlow(browser, opts, name, flow) {
  await rm(TMP, { recursive: true, force: true });
  await mkdir(TMP, { recursive: true });
  const ctx = await newContext(browser, opts, true);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    frames.push({ data, t: metadata.timestamp });
    await cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });
  const start = () =>
    cdp.send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: 780, maxHeight: 1688, everyNthFrame: 1 });
  await flow(page, start);
  const endT = Date.now() / 1000;
  await cdp.send('Page.stopScreencast').catch(() => {});
  await ctx.close();

  // Frames arrive only when the screen changes: hold each until the next one.
  const framePath = (i) => path.join(TMP, `f${String(i).padStart(5, '0')}.jpg`).replaceAll('\\', '/');
  let list = '';
  for (let i = 0; i < frames.length; i++) {
    await writeFile(framePath(i), Buffer.from(frames[i].data, 'base64'));
    const next = i + 1 < frames.length ? frames[i + 1].t : Math.max(frames[i].t + 0.5, endT);
    list += `file '${framePath(i)}'\nduration ${Math.max(next - frames[i].t, 0.02).toFixed(3)}\n`;
  }
  // The concat demuxer ignores the last duration unless the file is repeated.
  list += `file '${framePath(frames.length - 1)}'\n`;
  const listFile = path.join(TMP, 'frames.txt');
  await writeFile(listFile, list);

  const dir = path.join(OUT, 'video');
  await mkdir(dir, { recursive: true });
  const base = path.join(dir, `${name}-${opts.theme}-${opts.lang}`);
  execFileSync(ffmpegPath, ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', listFile,
    '-vf', 'fps=30,scale=780:-2:flags=lanczos', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'slow',
    '-movflags', '+faststart', '-an', `${base}.mp4`]);
  await sharp(Buffer.from(frames[0].data, 'base64')).resize({ width: 780 }).webp({ quality: 80 }).toFile(`${base}.webp`);
  console.log(`  ✓ video/${path.basename(base)}.mp4 (${frames.length} frames)`);
}

async function typeSlowly(page, text) {
  for (const ch of text) {
    await page.keyboard.type(ch);
    await sleep(ch === ' ' ? 45 : 28);
  }
}

async function captureVideos(browser) {
  for (const lang of LANGS) {
    for (const theme of THEMES) {
      const T = STR[lang];
      console.log(`Videos ${lang}/${theme}`);

      // Hero: home → describe → analyse → assessment.
      await recordFlow(browser, { lang, theme, analysisDelayMs: 2200 }, 'flow', async (page, start) => {
        await page.goto(`${APP}/start`);
        await settle(page, 600);
        await start();
        await sleep(1400);
        await page.mouse.move(195, 500);
        for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 90); await sleep(60); }
        await sleep(900);
        await page.goto(`${APP}/new`);
        await settle(page, 600);
        await page.locator('textarea').first().click();
        await typeSlowly(page, caseText(lang, 'headache'));
        await sleep(700);
        await clickText(page, T.analyze);
        await sleep(4600);
        await page.mouse.move(195, 500);
        for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, 70); await sleep(90); }
        await sleep(1800);
      });

      // Voice: the recording screen with the live waveform.
      await recordFlow(browser, { lang, theme }, 'voice', async (page, start) => {
        await page.goto(`${APP}/record`);
        await settle(page, 300);
        await start();
        await sleep(6500);
      });
    }
  }
}

const STR = {
  en: { chip: 'Headache', analyze: 'Analyze' },
  de: { chip: 'Kopfschmerz', analyze: 'Analysieren' },
};

const browser = await chromium.launch({
  args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream', '--autoplay-policy=no-user-gesture-required'],
});
try {
  if (args.only !== 'videos') await captureShots(browser);
  if (args.only !== 'shots') await captureVideos(browser);
} finally {
  await browser.close();
  await rm(TMP, { recursive: true, force: true });
}
