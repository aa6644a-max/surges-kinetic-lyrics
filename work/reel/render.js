const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const dir = __dirname; let out;
const PAGE = process.argv[2] || 'reel.html', FRAMES = process.argv[3] || 'frames', FPS = 30, DUR = 22.2, only = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
(async () => {
  out = path.join(dir, FRAMES); fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(dir, PAGE));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForFunction(() => [...document.images].every(i => i.complete));
  const N = Math.round(FPS * DUR);
  for (let i = 0; i < N; i++) {
    const t = i / FPS;
    if (only && !only.some(s => Math.abs(s - t) < 1 / FPS / 2)) continue;
    await p.evaluate(t => window.render(t), t);
    await p.screenshot({ path: path.join(out, only ? `p_${t.toFixed(2)}.jpg` : `f${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92 });
  }
  await b.close();
  console.log('done', N);
})();
