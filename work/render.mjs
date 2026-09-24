// Render kinetic.html to a 1080x1920 30fps MP4 with the song muxed in.
// usage: node work/render.mjs [out.mp4] [--from s] [--to s] [--stills t1,t2,...]
import { chromium } from 'playwright';
import { spawn, execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const out = args[0] && !args[0].startsWith('--') ? args[0] : 'surges_reels.mp4';
const FPS = 30;
const ffmpeg = process.env.FFMPEG || execSync('python3 -c "import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())"').toString().trim();

const root = resolve('.');

const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, ignoreHTTPSErrors: true });
page.on('pageerror', e => console.log('pageerror', e.message));
page.on('requestfailed', r => console.log('requestfailed', r.url().slice(0, 90), r.failure()?.errorText));
// serve local files through routing (the outbound proxy only tunnels HTTPS)
await page.route('http://local.test/**', r => {
  try { r.fulfill({ body: readFileSync(root + decodeURIComponent(new URL(r.request().url()).pathname)) }); } catch { r.fulfill({ status: 404 }); }
});
// Google Fonts go through curl (it trusts the proxy CA; Chromium does not)
const fontCache = new Map();
await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, r => {
  const url = r.request().url();
  if (!fontCache.has(url)) fontCache.set(url, execSync(`curl -sSL --retry 3 ${JSON.stringify(url)}`, { maxBuffer: 1 << 26 }));
  const type = url.includes('googleapis') ? 'text/css' : 'font/woff2';
  r.fulfill({ body: fontCache.get(url), headers: { 'content-type': type, 'access-control-allow-origin': '*' } });
});
await page.goto('http://local.test/kinetic.html?render', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const dur = await page.evaluate(() => window.DUR);

const stills = opt('--stills');
if (stills) {
  for (const t of stills.split(',').map(Number)) {
    await page.evaluate(t => window.renderAt(t), t);
    await page.screenshot({ path: `${opt('--dir', '.')}/still_${t}.png` });
  }
} else {
  const from = +opt('--from', 0), to = +opt('--to', dur);
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-ss', String(from), '-t', String(to - from), '-i', 'song.m4a',
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', out], { stdio: ['pipe', 'ignore', 'inherit'] });
  const n = Math.round((to - from) * FPS);
  for (let f = 0; f < n; f++) {
    await page.evaluate(t => window.renderAt(t), from + f / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 150 === 0) console.log(`frame ${f}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('wrote', out);
}
await browser.close();
