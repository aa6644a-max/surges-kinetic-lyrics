/* FEED: section table, render, debug HUD, preview player. One take: every section hands its last object to the next. */
const SECTIONS = [[0, 'INTRO · the dot', I0], [15.2, 'VERSE 1 · the feed', V1], [31.0, 'PRE-CHORUS · tags / likes / heart', P1], [48.4, 'CHORUS 1 · hearts', C1]];
const DUR = 70.4, DEBUG = /debug=1/.test(location.search), RENDER = /render/.test(location.search);
const sectionAt = t => { let s = SECTIONS[0]; for (const x of SECTIONS) if (t >= x[0]) s = x; return s };
function renderAt(t) {
  t = clamp(t, 0, DUR); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; setTrack(0);
  const sec = sectionAt(t); sec[2](t); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
  if (DEBUG) { let li = -1; for (let i = 0; i < Ln.length; i++) if (t >= S(i) - .05) li = i;
    const rows = [`TIME   ${t.toFixed(2)}   beat ${beatN(t).toFixed(1)}`, `SECT   ${sec[1]}`, `LYRIC  ${li >= 0 ? 'L' + li + '  ' + Ln[li].t : '—'}`];
    rect(20, 20, 760, rows.length * 36 + 20, '#000', .7); g.font = `500 24px ${EN}`; g.letterSpacing = '0px'; g.fillStyle = '#9FF0C8'; g.textAlign = 'left'; g.textBaseline = 'top'; rows.forEach((r, i) => g.fillText(r, 34, 32 + i * 36)) }
}
Ln = window.D.lines;
const cv = document.getElementById('cv'); g = cv.getContext('2d');
function fit() { const k = Math.min(innerWidth / W, (innerHeight - (RENDER ? 0 : 56)) / H); cv.style.transform = RENDER ? 'none' : `translate(-50%,-50%) scale(${k})` }
fit(); addEventListener('resize', fit);
async function loadFonts() {
  await Promise.all([300, 500, 700, 900].map(w => document.fonts.load(`${w} 40px ${KR}`, '주인공 나 너')).concat([300, 800].map(w => document.fonts.load(`${w} 40px ${EN}`, 'SUB CHARACTER'))));
  await document.fonts.ready;
  const c = document.createElement('canvas').getContext('2d'), wd = f => { c.font = f; return c.measureText('주인공 나 SUB 0123').width };
  if (!(wd(`500 40px ${KR}`) !== wd('500 40px serif') && wd(`500 40px ${EN}`) !== wd('500 40px serif'))) { console.warn('[feed] fonts did not load: READY is held.'); await new Promise(() => { }) }
}
window.DUR = DUR;
window.READY = (async () => { await loadFonts(); window.renderAt = renderAt; renderAt(0); if (!RENDER) player() })();
function player() {
  const bar = document.getElementById('bar'), au = new Audio('../song.mp3'), rng = document.getElementById('rng'), btn = document.getElementById('play'), lab = document.getElementById('lab');
  bar.hidden = false; rng.min = 0; rng.max = DUR; rng.step = .01; rng.value = 0; let playing = false;
  const show = t => { renderAt(t); rng.value = t; lab.textContent = t.toFixed(2) };
  const loop = () => { if (!playing) return; show(au.currentTime); requestAnimationFrame(loop) };
  const toggle = () => { playing = !playing; btn.textContent = playing ? '❚❚' : '▶'; if (playing) { au.currentTime = +rng.value; au.play(); loop() } else au.pause() };
  btn.onclick = toggle; rng.oninput = () => { if (playing) au.currentTime = +rng.value; show(+rng.value) };
  addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); toggle() } });
}
