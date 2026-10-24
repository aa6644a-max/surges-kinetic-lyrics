const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const dir = __dirname, out = path.join(dir, 'frames');
const FPS = 30, DUR = 22.2, only = process.argv[2] ? process.argv[2].split(',').map(Number) : null;
(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(dir, 'reel.html'));
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
