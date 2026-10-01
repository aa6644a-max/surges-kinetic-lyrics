/* ORANGE Y2K: section table, the frame (shake, section, subtitle), debug HUD, preview player. */
const DUR = 232.4, DEBUG = /debug=1/.test(location.search), RENDER = /render/.test(location.search);
function TBD(t) { paper(t, { word: 'NEXT', rows: ['NE', 'XT'] }); sticker('TO BE CONTINUED', CX, CY, 70, { fam: UB, w: 900, col: ORG, line: INK }) }
Ln = window.D.lines;
const SECTIONS = [[0, 'INTRO · desktop / ORANGE.exe', I0], [B0, 'TITLE · ORANGE stamped', T1], [onBeat(8), 'TICKET · FINAL', T2], [onBeat(16), 'CHAT · バレー部', T3], [onBeat(24), 'SERVE · power meter', T4],
  [onBeat(30) - .01, 'L0 · typed & deleted / pinky promise', V0], [S(1) - .1, 'L1 · round trip + seals', V1], [S(2) - .12, 'L2 · orange on the horizon', V2], [S(3) - .1, 'L3 · camera blown out', V3],
  [S(4) - .1, 'L4 · sweat / voice memo', V4], [S(5) - .35, 'L5 · high five / emoji flood', V5], [S(6) - .3, 'L6 · weather card → sky', P0], [S(7) - .1, 'L7 · words fly off', P1],
  [S(8) - .25, 'L8 · timer +1秒', C0], [S(9) - .1, 'L9 · shutter keeps 今', C1], [S(10) - .1, 'L10 · きっと ーーー / spike', C2], [88.2, 'TBD', TBD]];
HITS.push([B0, 40], [cT(0, 5), 16], [S(5), 30], [S(10), 44], [83.0, 60]);
const sectionAt = t => { let s = SECTIONS[0]; for (const x of SECTIONS) if (t >= x[0]) s = x; return s };
function renderAt(t) {
  t = clamp(t, 0, DUR); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; setTrack(0); g.shadowBlur = 0;
  const sh = shakeAt(t); g.translate(CX + sh.x, CY + sh.y); g.rotate(sh.r); g.translate(-CX, -CY);
  const sec = sectionAt(t); sec[2](t);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.shadowBlur = 0; g.filter = 'none';
  subtitle(t);
  if (DEBUG) { let li = -1; for (let i = 0; i < Ln.length; i++) if (t >= S(i) - .05) li = i;
    const rows = [`TIME   ${t.toFixed(2)}   beat ${beatN(t).toFixed(1)}`, `SECT   ${sec[1]}`, `LYRIC  ${li >= 0 ? 'L' + li + '  ' + Ln[li].t : '—'}`];
    rect(20, 20, 860, rows.length * 36 + 20, '#000', .7); g.font = `500 24px ${KR}`; g.letterSpacing = '0px'; g.fillStyle = '#9FF0C8'; g.textAlign = 'left'; g.textBaseline = 'top'; rows.forEach((r, i) => g.fillText(r, 34, 32 + i * 36)) }
}
const cv = document.getElementById('cv'); g = cv.getContext('2d');
function fit() { const k = Math.min(innerWidth / W, (innerHeight - (RENDER ? 0 : 56)) / H); cv.style.transform = RENDER ? 'none' : `translate(-50%,-50%) scale(${k})` }
fit(); addEventListener('resize', fit);
async function loadFonts() {
  const need = [[`400 60px ${JP}`, 'さよなら約束'], [`400 60px ${EN}`, '0123'], [`900 60px ${UB}`, 'ORANGE'], [`800 60px ${RD}`, 'また会える'], [`500 60px ${RD}`, 'バレー部'],
    [`600 60px ${HW}`, '地平線'], [`400 60px ${PM}`, 'SPYAIR'], [`60px ${EMO}`, '🏐🍊'], [`700 40px ${KR}`, '안녕은'], [`400 60px ${MK}`, 'きっと']];
  await Promise.all(need.map(([f, s]) => document.fonts.load(f, s))); await document.fonts.ready;
  const miss = need.filter(([f, s]) => !document.fonts.check(f, s)); if (miss.length) { console.warn('[orange] fonts missing:', miss.map(m => m[0]).join(' | '), '— READY is held.'); await new Promise(() => { }) }
}
window.DUR = DUR;
window.READY = (async () => { await loadFonts(); await loadPlates(); window.renderAt = renderAt; renderAt(0); if (!RENDER) player() })();
function player() {
  const bar = document.getElementById('bar'), au = new Audio('../song.mp3'), rng = document.getElementById('rng'), btn = document.getElementById('play'), lab = document.getElementById('lab');
  bar.hidden = false; rng.min = 0; rng.max = DUR; rng.step = .01; rng.value = 0; let playing = false;
  const show = t => { renderAt(t); rng.value = t; lab.textContent = t.toFixed(2) };
  const loop = () => { if (!playing) return; show(au.currentTime); requestAnimationFrame(loop) };
  const toggle = () => { playing = !playing; btn.textContent = playing ? '❚❚' : '▶'; if (playing) { au.currentTime = +rng.value; au.play(); loop() } else au.pause() };
  btn.onclick = toggle; rng.oninput = () => { if (playing) au.currentTime = +rng.value; show(+rng.value) };
  addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); toggle() } });
}
