/* ORANGE manga page: page turns (the old page slides off to the right over the new one, with a shadow), hard cuts with a
   flash, impact frames, screen shake, the fixed Korean subtitle, the debug HUD and the player. */
const DUR = 232.4, DEBUG = /debug=1/.test(location.search), RENDER = /render/.test(location.search);
function postFX(t) { for (const t0 of IMPACTS) { const d = t - t0; if (d >= 0 && d < .034) { g.save(); g.globalCompositeOperation = 'difference'; g.fillStyle = '#FFFFFF'; g.fillRect(0, 0, W, H); g.restore() }
  else if (d >= .034 && d < .2) rect(0, 0, W, H, '#FFFFFF', .4 * (1 - (d - .034) / .166)) } }
function renderAt(t) {
  t = clamp(t, 0, DUR); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.filter = 'none'; setTrack(0); GA = 1;
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  const k = pageAt(t), P = BOOK[k], Q = k > 0 ? BOOK[k - 1] : null, u = Q ? (t - P.t0) / TURN : 1, sh = shakeAt(t);
  g.save(); g.translate(sh.x, sh.y);
  if (Q && Q.turn === 'slide' && u < 1) { drawPageAt(P, t, camOf(P, t)); const e = eIn(clamp(u)), dx = 1180 * e;
    const gr = g.createLinearGradient(dx - 180, 0, dx, 0); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, `rgba(0,0,0,${.5 * (1 - e)})`); g.fillStyle = gr; g.fillRect(dx - 180, 0, 180, H);
    g.save(); g.translate(dx, 0); g.rotate(.05 * e); drawPageAt(Q, t, { x: 540, y: 960, z: 1 }); rect(0, 0, 16, H, '#000', .22); g.restore() }
  else drawPageAt(P, t, camOf(P, t));
  g.restore();
  if (Q && Q.turn === 'cut') flash(t, P.t0, '#FFFFFF', .22, .85);
  if (t > 231.2) rect(0, 0, W, H, '#000', eIn(seg(t, 231.2, 1.2)));
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; postFX(t); subtitle(t);
  if (DEBUG) { const c = camOf(P, t), rows = [`TIME ${t.toFixed(2)}  page ${P.n}  beat ${beatN(t).toFixed(1)}`, `CAM x ${c.x.toFixed(0)} y ${c.y.toFixed(0)} z ${c.z.toFixed(2)}`];
    rect(20, 20, 760, rows.length * 36 + 20, '#000', .7); g.font = `500 24px ${KR}`; g.letterSpacing = '0px'; g.fillStyle = '#9FF0C8'; g.textAlign = 'left'; g.textBaseline = 'top'; rows.forEach((r, i) => g.fillText(r, 34, 32 + i * 36)) }
}
const cv = document.getElementById('cv'); g = cv.getContext('2d');
function fit() { const k = Math.min(innerWidth / W, (innerHeight - (RENDER ? 0 : 56)) / H); cv.style.transform = RENDER ? 'none' : `translate(-50%,-50%) scale(${k})` }
fit(); addEventListener('resize', fit);
async function loadFonts() {
  const need = [[`400 60px ${MJ}`, '明日へ向かう空'], [`400 60px ${SFX}`, 'カシャッきっと'], [`400 60px ${BG}`, 'GAME SET 01'], [`400 60px ${MK}`, '確かな事'], [`600 60px ${HW}`, '何を描こうか'],
    [`800 60px ${RD}`, 'あした勝つぞ'], [`500 60px ${RD}`, 'バレー部'], [`400 60px ${PM}`, 'SPYAIR'], [`700 40px ${KR}`, '안녕은']];
  await Promise.all(need.map(([f, s]) => document.fonts.load(f, s))); await document.fonts.ready;
  const miss = need.filter(([f, s]) => !document.fonts.check(f, s)); if (miss.length) { console.warn('[manga] fonts missing:', miss.map(m => m[0]).join(' | ')); await new Promise(() => { }) }
}
window.DUR = DUR;
window.READY = (async () => { await loadFonts(); await loadPanels([...new Set([...BOOK.flatMap(P => P.panels.map(p => p.id)), ...RECAP])]); window.renderAt = renderAt; renderAt(0); if (!RENDER) player() })();
function player() {
  const bar = document.getElementById('bar'), au = new Audio('../song.mp3'), rng = document.getElementById('rng'), btn = document.getElementById('play'), lab = document.getElementById('lab');
  bar.hidden = false; rng.min = 0; rng.max = DUR; rng.step = .01; rng.value = 0; let playing = false;
  const show = t => { renderAt(t); rng.value = t; lab.textContent = t.toFixed(2) };
  const loop = () => { if (!playing) return; show(au.currentTime); requestAnimationFrame(loop) };
  const toggle = () => { playing = !playing; btn.textContent = playing ? '❚❚' : '▶'; if (playing) { au.currentTime = +rng.value; au.play(); loop() } else au.pause() };
  btn.onclick = toggle; rng.oninput = () => { if (playing) au.currentTime = +rng.value; show(+rng.value) };
  addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); toggle() } });
}
