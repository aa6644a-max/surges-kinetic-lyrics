// Render kinetic.html to a 1080x1920 30fps MP4 with the song muxed in.
// usage: node work/render.mjs [out.mp4] [--page kinetic.html] [--audio song.m4a] [--from s] [--to s] [--workers n] [--stills t1,t2,... --dir d]
import { chromium } from 'playwright';
import { spawn, execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const out = args[0] && !args[0].startsWith('--') ? args[0] : 'surges_reels.mp4';
const FPS = 30;
const PAGE = opt('--page', 'kinetic.html'), AUDIO = opt('--audio', 'song.m4a');
const ffmpeg = process.env.FFMPEG || execSync('python3 -c "import imageio_ffmpeg as f;print(f.get_ffmpeg_exe())"').toString().trim();
const root = resolve('.');
const fontCache = new Map();

async function openPage() {
  const browser = await chromium.launch({ executablePath: process.env.CHROME || undefined });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => console.log('pageerror', e.message));
  // serve local files through routing (the outbound proxy only tunnels HTTPS)
  await page.route('http://local.test/**', r => {
    try { r.fulfill({ body: readFileSync(root + decodeURIComponent(new URL(r.request().url()).pathname)) }); } catch { r.fulfill({ status: 404 }); }
  });
  // Google Fonts go through curl (it trusts the proxy CA; Chromium does not)
  await page.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/, r => {
    const url = r.request().url();
    if (!fontCache.has(url)) fontCache.set(url, execSync(`curl -sSL --retry 3 ${JSON.stringify(url)}`, { maxBuffer: 1 << 26 }));
    const type = url.includes('googleapis') ? 'text/css' : 'font/woff2';
    r.fulfill({ body: fontCache.get(url), headers: { 'content-type': type, 'access-control-allow-origin': '*' } });
  });
  await page.goto(`http://local.test/${PAGE}?render`, { waitUntil: 'networkidle' });
  await page.evaluate(() => window.READY);
  return { browser, page };
}

const stills = opt('--stills');
if (stills) {
  const { browser, page } = await openPage();
  for (const t of stills.split(',').map(Number)) {
    await page.evaluate(t => window.renderAt(t), t);
    await page.screenshot({ path: `${opt('--dir', '.')}/still_${t}.png` });
  }
  await browser.close();
} else {
  const probe = await openPage();
  const dur = await probe.page.evaluate(() => window.DUR);
  await probe.browser.close();
  const from = +opt('--from', 0), to = +opt('--to', dur), workers = +opt('--workers', 4);
  const n = Math.round((to - from) * FPS), per = Math.ceil(n / workers);
  const tmp = mkdtempSync(join(tmpdir(), 'kinetic-'));
  const segs = [];
  // each worker renders a contiguous range of frames into its own segment
  await Promise.all([...Array(workers)].map(async (_, w) => {
    const f0 = w * per, f1 = Math.min(n, f0 + per);
    if (f0 >= f1) return;
    const { browser, page } = await openPage();
    const file = join(tmp, `seg${w}.mp4`); segs[w] = file;
    const ff = spawn(ffmpeg, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', '-threads', '2', file], { stdio: ['pipe', 'ignore', 'inherit'] });
    for (let f = f0; f < f1; f++) {
      await page.evaluate(t => window.renderAt(t), from + f / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((f - f0) % 300 === 0) console.log(`worker ${w}: ${f - f0}/${f1 - f0}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    await browser.close();
  }));
  writeFileSync(join(tmp, 'list.txt'), segs.filter(Boolean).map(f => `file '${f}'`).join('\n'));
  execSync(`"${ffmpeg}" -y -loglevel error -f concat -safe 0 -i "${join(tmp, 'list.txt')}" -ss ${from} -t ${to - from} -i "${AUDIO}" ` +
    `-map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -movflags +faststart -shortest "${out}"`, { stdio: 'inherit' });
  rmSync(tmp, { recursive: true });
  console.log('wrote', out);
}
