/* ORANGE: section table, the frame (shake, section, subtitle), debug HUD, preview player. */
const SECTIONS = [[0, 'PRE-GAME · lights, dribble, toss', A0], [13.777, 'PRE-GAME · ORANGE / court / score / serve', A1], [31.8, 'RALLY 1 · verse (the ball writes)', V1],
  [60.3, 'APPROACH · pre (look up)', P1], [70.3, 'HANG TIME · あと1秒 → きっと (spike)', C1A], [88.2, 'TBD', TBD]];
const DUR = 232.4, DEBUG = /debug=1/.test(location.search), RENDER = /render/.test(location.search);
function TBD(t) { fill(BK); txt('ACT 2 →', CX, CY, { size: 120, fam: EN, col: GREY, al: 'center' }) }
const sectionAt = t => { let s = SECTIONS[0]; for (const x of SECTIONS) if (t >= x[0]) s = x; return s };
function renderAt(t) {
  t = clamp(t, 0, DUR); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; setTrack(0); g.shadowBlur = 0;
  const sh = shakeAt(t); g.translate(CX + sh.x, CY + sh.y); g.rotate(sh.r); g.translate(-CX, -CY);
  const sec = sectionAt(t); sec[2](t);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.shadowBlur = 0;
  subtitle(t);
  if (DEBUG) { let li = -1; for (let i = 0; i < Ln.length; i++) if (t >= S(i) - .05) li = i;
    const rows = [`TIME   ${t.toFixed(2)}   beat ${beatN(t).toFixed(1)}`, `SECT   ${sec[1]}`, `LYRIC  ${li >= 0 ? 'L' + li + '  ' + Ln[li].t : '—'}`];
    rect(20, 20, 820, rows.length * 36 + 20, '#000', .7); g.font = `500 24px ${KR}`; g.letterSpacing = '0px'; g.fillStyle = '#9FF0C8'; g.textAlign = 'left'; g.textBaseline = 'top'; rows.forEach((r, i) => g.fillText(r, 34, 32 + i * 36)) }
}
Ln = window.D.lines;
HITS.push([B0, 46], [S(0), 16], [cT(1, 7), 22], [S(5), 34], [S(10), 70]);
const cv = document.getElementById('cv'); g = cv.getContext('2d');
function fit() { const k = Math.min(innerWidth / W, (innerHeight - (RENDER ? 0 : 56)) / H); cv.style.transform = RENDER ? 'none' : `translate(-50%,-50%) scale(${k})` }
fit(); addEventListener('resize', fit);
async function loadFonts() {
  await Promise.all([document.fonts.load(`400 60px ${JP}`, 'さよなら約束地平線汗声肩空羽秒今'), document.fonts.load(`400 60px ${EN}`, 'ORANGE 0123'), document.fonts.load(`400 60px ${MK}`, 'きっと'),
    document.fonts.load(`600 40px ${KR}`, '안녕은 말하지 않아')]);
  await document.fonts.ready;
  const c = document.createElement('canvas').getContext('2d'), wd = f => { c.font = f; return c.measureText('さよならORANGE 0123 안녕').width };
  const ok = [`400 40px ${JP}`, `400 40px ${EN}`, `600 40px ${KR}`].every(f => wd(f) !== wd('400 40px serif'));
  if (!ok) { console.warn('[orange] fonts did not load: READY is held.'); await new Promise(() => { }) }
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
