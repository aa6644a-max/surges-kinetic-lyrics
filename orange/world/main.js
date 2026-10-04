/* ORANGE world page: picks the stage (the court from above, the side strip, the sky strip, the dawn), draws it through the
   camera, adds motion blur on fast camera moves (sub-frames averaged), screen shake, impact frames (two inverted frames on a
   hit), the fixed Korean subtitle and the debug HUD. */
const DUR = 232.4, DEBUG = /debug=1/.test(location.search), RENDER = /render/.test(location.search);
Ln = window.D.lines;
HITS.push([B0, 36], [S(0), 12], [cT(1, 7), 10], [cT(1, 8), 10], [cT(1, 9), 14], [40.9, 18], [cT(2, 7), 22], [S(5), 34],
  [S(10), 18], [80.6, 30], [cT(11, 6), 10], [S(12), 12], [cT(14, 7), 20], [cT(16, 10), 12], [cT(17, 10), 18], [S(21), 26], [S(22), 26], [cT(24, 5), 10],
  [LIGHTS_ON, 26], [TGO, 26], [ARON, 16], [S(34), 22], [GSET, 48], [S(35), 34], [cT(35, 1), 12], [cT(35, 2), 24]);
const STAGES = [[0, 'top'], [41.25, 'side'], [55.95, 'top'], [60.9, 'sky'], [80.55, 'top'], [DAWN0, 'dawn']];
function stageAt(t) { let s = 'top'; for (const [t0, n] of STAGES) if (t >= t0) s = n; return s }
// one key list for the court: each act's keys end where the next act's begin
const cutK = (K, t1) => K.filter(k => k[0] < t1);
const TOPALL = [...cutK(TOPK, TOPK2[0][0]), ...cutK(TOPK2, TOPK3[0][0]), ...cutK(TOPK3, TOPK4[0][0]), ...TOPK4];
const CAMS = { top: TOPALL, side: SIDEK, sky: SKYK, dawn: DAWNK };
const camFor = t => camAt(t, CAMS[stageAt(t)]);
const IMPACTS = [80.6, TGO, S(34), GSET, S(35)];
function drawStage(t) {
  g.save(); g.fillStyle = '#07080C'; g.fillRect(0, 0, W, H); const sh = shakeAt(t); g.translate(sh.x, sh.y);
  const st = stageAt(t), c = camFor(t), world = fn => { g.save(); applyCam(c); fn(); g.restore() };
  VIEW = st === 'top' ? { x: c.x, y: c.y, r: 1110 / (c.zoom * Math.cos(c.tilt || 0)) } : null;
  if (st === 'side') { world(() => sideWorld(t)); sideOverlay(t) }
  else if (st === 'sky') { world(() => skyBG(t)); skyClouds(t, c, false); world(() => skyLyrics(t)); skyOverlay(t, c) }
  else if (st === 'dawn') { world(() => dawnWorld(t)); dawnOverlay(t, c) }
  else { world(() => { topWorld(t); topM2(t); topM3(t); topM4(t) }); topOverlay(t); replayOverlay(t); m4Overlay(t, c) }
  VIEW = null; g.restore() }
// impact frames: the picture inverted for two frames on a hit, then a white flash
function postFX(t) { for (const t0 of IMPACTS) { const d = t - t0; if (d >= 0 && d < .034) { g.save(); g.globalCompositeOperation = 'difference'; g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, H); g.restore() }
  else if (d >= .034 && d < .2) rect(0, 0, W, H, '#FFFFFF', .45 * (1 - (d - .034) / .166)) } }
function renderAt(t) {
  t = clamp(t, 0, DUR); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; setTrack(0); GA = 1;
  const sp = stageAt(t) === stageAt(t - 1 / 60) ? camSpeed(camFor(t - 1 / 60), camFor(t)) : 0, n = Math.max(1, Math.min(8, Math.ceil(sp / 18)));
  if (n <= 1) drawStage(t);
  else { const acc = layer('mbAcc'), tmp = layer('mbTmp'), ax = acc.getContext('2d');
    for (let k = 0; k < n; k++) { const tk = t - k / (60 * n); drawOn(tmp, () => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, W, H); drawStage(tk) }); ax.globalAlpha = 1 / (k + 1); ax.drawImage(tmp, 0, 0) }
    ax.globalAlpha = 1; g.drawImage(acc, 0, 0) }
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; postFX(t); subtitle(t);
  if (DEBUG) { const c = camFor(t), rows = [`TIME ${t.toFixed(2)}  beat ${beatN(t).toFixed(1)}  ${stageAt(t)}  blur ${n}`, `CAM x ${c.x.toFixed(0)} y ${c.y.toFixed(0)} z ${c.zoom.toFixed(2)} r ${c.rot.toFixed(2)} tilt ${(c.tilt || 0).toFixed(2)}`];
    rect(20, 20, 900, rows.length * 36 + 20, '#000', .7); g.font = `500 24px ${KR}`; g.letterSpacing = '0px'; g.fillStyle = '#9FF0C8'; g.textAlign = 'left'; g.textBaseline = 'top'; rows.forEach((r, i) => g.fillText(r, 34, 32 + i * 36)) }
}
const cv = document.getElementById('cv'); g = cv.getContext('2d');
function fit() { const k = Math.min(innerWidth / W, (innerHeight - (RENDER ? 0 : 56)) / H); cv.style.transform = RENDER ? 'none' : `translate(-50%,-50%) scale(${k})` }
fit(); addEventListener('resize', fit);
async function loadFonts() {
  const need = [[`400 60px ${JP}`, 'さよなら約束'], [`400 60px ${EN}`, '0123'], [`900 60px ${UB}`, 'ORANGE'], [`800 60px ${RD}`, 'また会える'], [`500 60px ${RD}`, 'バレー部'],
    [`600 60px ${HW}`, '地平線'], [`400 60px ${PM}`, 'SPYAIR'], [`60px ${EMO}`, '🏐🍊'], [`700 40px ${KR}`, '안녕은'],
    [`400 60px ${MJ}`, '明日へ向かう空'], [`400 60px ${SFX}`, 'カシャッきっと'], [`400 60px ${BG}`, 'GAME SET 01'], [`400 60px ${MK}`, '確かな事']];
  await Promise.all(need.map(([f, s]) => document.fonts.load(f, s))); await document.fonts.ready;
  const miss = need.filter(([f, s]) => !document.fonts.check(f, s)); if (miss.length) { console.warn('[orange] fonts missing:', miss.map(m => m[0]).join(' | ')); await new Promise(() => { }) }
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
