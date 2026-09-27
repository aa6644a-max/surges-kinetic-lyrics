/* Sub character v4 prototype: camera path, frame render, debug HUD, preview player.
   v4.1. Range: 40.84 (L14 "미안해, but 어쩔 수 없었어") -> 70.10 (end of L27 "I wanna be you"). */
const T0 = 40.84, T1 = 70.10;
const DEBUG = /debug=1/.test(location.search), RENDER = /render/.test(location.search);   // render.mjs appends ?render

// SEE -> NOTICE -> FOLLOW -> ARRIVE. Every departure is on a beat; the spring does the rest.
function buildCamera() {
  const spotCam = t => ({ x: spotX(t) - 20, y: CIRCLE.y - 150, s: 1.05, r: 0 });
  // v4.1: every move keeps the OLD landmark in frame while the TARGET arrives and the NEXT clue shows at an edge
  CAMERA.keys = [
    { at: 0, to: { x: 6440, y: 5060, s: 1.12, r: 0 }, name: 'CAST: 주인공 (curtain edge at right)' },
    { at: qb(41.3), dur: 2.1, to: { x: 6500, y: 5790, s: 1.32, r: 0 }, name: 'CAST: down to 행인 7 · extra' },
    { at: qb(43.45), dur: 1.3, to: { x: 6680, y: 5860, s: 1.28, r: .8 }, name: 'NOTICE: light from the slit' },
    { at: qb(45.12), dur: 2.3, to: { x: 7020, y: 5660, s: 1.25, r: -.6 }, name: 'FOLLOW: along the brace 버티고' },
    { at: qb(47.4), dur: .7, to: { x: 7292, y: 5690, s: 1.75, r: 0 }, name: 'ARRIVE: curtain slit', os: .023 },
    { at: 48.45, dur: .6, to: { x: 7300, y: 5680, s: 1.95, r: 0 }, name: 'THROUGH: between the curtains', ease: eIn },
    { at: 49.05, dur: 1.9, to: { x: 8190, y: 5560, s: .72, r: 0 }, name: 'STAGE: 주인공 pillar passes, YOU in the spot', ease: eOut, w: 5.4 },
    { at: qb(50.41), dur: 1.6, to: { x: 8320, y: 5500, s: .76, r: 0 }, name: 'YOU: 완벽해 lit behind him' },
    { at: qb(51.85), dur: 2.5, to: { x: 9500, y: 4950, s: .62, r: -1.5 }, name: 'FOLLOW: the beam, MAIN CHARACTER above' },
    { at: qb(54.38), dur: 1.75, to: { x: 10150, y: 5750, s: .8, r: 0 }, name: 'AUDIENCE: rows of 좋아해, booth post' },
    { at: qb(55.71), dur: 1.5, to: { x: 10300, y: 5050, s: .95, r: 0 }, name: 'AUDIENCE: up the rake, lamp glow above' },
    { at: qb(57.15), dur: 1.1, to: { x: 10470, y: 4420, s: 1.35, r: 0 }, name: 'FIXTURE: the lamp' },
    { at: qb(57.6), dur: .6, to: { x: 10620, y: 4380, s: 1.42, r: 0 }, name: 'BOOTH EDGE → ME (silhouette)', os: .05 },
    { at: qb(58.5), dur: 1.1, to: { x: 10700, y: 4400, s: 1.5, r: -.5 }, name: 'ME: the face is lit' },
    { at: qb(59.5), dur: 2.4, to: { x: 10745, y: 4410, s: 1.58, r: -.6 }, name: 'ME: slow drift, observing', ease: eSm },
    { at: qb(61.93), dur: 2.2, to: { x: 10680, y: 4430, s: 1.36, r: 0 }, name: 'GLASS: 열등감으로 찬 (easing back)', ease: eSm },
    { at: qb(64.18), dur: 2.4, fn: spotCam, name: 'FOLLOW: the spot leaves YOU', w: 5.6 },
    { at: 68.04, dur: .55, to: { x: CIRCLE.x, y: CIRCLE.y - 40, s: 2.3, r: 0 }, name: 'APPROACH: the pool of light', os: .024 },
    { at: 69.15, dur: .95, to: { x: CIRCLE.x, y: CIRCLE.y, s: 6.5, r: 0 }, name: 'INTO: the light', ease: eIn, w: 9 },
  ];
  camBuild(T0, T1);
}

const lineAt = t => { let k = -1; for (let i = 0; i < Ln.length; i++) if (t >= Ln[i].s - .05 && t < (Ln[i + 1] ? Ln[i + 1].s - .05 : Ln[i].e + 1)) k = i; return k };
const hx = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16)), mixA = (a, b, x) => a.map((v, i) => lerp(v, b[i], x)), css = c => `rgb(${c.map(Math.round).join(',')})`;

// backstage cool / muted purple, stage warm ivory-amber, audience warm but darker, booth neutral-cool
const TINT = {
  bs: { top: '#0B0B1E', bot: '#05050E', tint: '#6A6FC0', mul: '#D6D6F0' }, st: { top: '#22151C', bot: '#120A0E', tint: '#FFD49A', mul: '#FFFFFF' },
  au: { top: '#150C0B', bot: '#080506', tint: '#C07A48', mul: '#D8C8BC' }, bo: { top: '#0C1018', bot: '#06080D', tint: '#A9C0DA', mul: '#E6EAF0' } };
function zoneTint() {
  const bs = 1 - clamp((CAM.x - 6950) / 600), bo = clamp((CAM.x - 10150) / 400) * (1 - clamp((CAM.y - 4700) / 500)), au = clamp((CAM.x - 9600) / 500) * (1 - bo);
  const st = Math.max(0, 1 - bs - au - bo), sum = bs + st + au + bo;
  return [['bs', bs], ['st', st], ['au', au], ['bo', bo]].map(([n, w]) => ({ n, w: w / sum }));
}

function renderAt(t) {
  t = clamp(t, T0 - 1, T1 + 1); camAt(t);
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.filter = 'none'; g.globalCompositeOperation = 'source-over';
  const Wt = zoneTint(), mixc = key => css([0, 1, 2].map(c => Wt.reduce((v, z) => v + z.w * hx(TINT[z.n][key])[c], 0)));
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, mixc('top')); bg.addColorStop(1, mixc('bot')); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  drawWorld(t);
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'soft-light'; g.globalAlpha = .42; g.fillStyle = mixc('tint'); g.fillRect(0, 0, W, H);   // light temperature of the space
  g.globalCompositeOperation = 'multiply'; g.globalAlpha = 1; g.fillStyle = mixc('mul'); g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
  const vg = g.createRadialGradient(CX, CY, 500, CX, CY, 1250); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
  if (DEBUG) hud(t);
}

function hud(t) {
  const T = camTarget(t), li = lineAt(t);
  const q = proj(1, T.x, T.y); g.strokeStyle = 'rgba(255,80,120,.9)'; g.lineWidth = 2; g.beginPath(); g.moveTo(q.x - 20, q.y); g.lineTo(q.x + 20, q.y); g.moveTo(q.x, q.y - 20); g.lineTo(q.x, q.y + 20); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.strokeRect(CX - 6, CY - 6, 12, 12);
  const rows = [`TIME     ${t.toFixed(2)}   beat ${((t - B0) / BEAT).toFixed(1)}`, `CAM X    ${CAM.x.toFixed(0)}`, `CAM Y    ${CAM.y.toFixed(0)}`, `SCALE    ${CAM.s.toFixed(3)}`,
    `ROTATION ${CAM.r.toFixed(2)}°`, `VEL      ${Math.hypot(CAM.vx, CAM.vy).toFixed(0)} px/s`, `TARGET   ${T.name}`, `         (${T.x.toFixed(0)}, ${T.y.toFixed(0)}, ${T.s.toFixed(2)}, ${T.r.toFixed(1)}°)`,
    `LYRIC    ${li >= 0 ? `L${li}  ${Ln[li].t}` : '—'}`, `ZONE     ${zoneAt(CAM.x)}`];
  g.fillStyle = 'rgba(0,0,0,.72)'; g.fillRect(20, 20, 760, rows.length * 34 + 24);
  g.font = '500 24px "IBM Plex Mono"'; g.fillStyle = '#9FF0C8'; g.textAlign = 'left'; g.textBaseline = 'top';
  rows.forEach((r, i) => g.fillText(r, 36, 34 + i * 34));
}

// ---------- boot ----------
const DATA = window.D;
Ln = DATA.lines;
const cv = document.getElementById('cv'); g = cv.getContext('2d');
function fit() { const k = Math.min(innerWidth / W, (innerHeight - (RENDER ? 0 : 56)) / H); cv.style.transform = `translate(-50%,-50%) scale(${RENDER ? 1 : k})`; if (!RENDER) cv.style.top = `calc(50% - 28px)` }
fit(); addEventListener('resize', fit);
const loadImg = id => new Promise(r => { const im = new Image(); im.onload = () => { IMG[id] = im; r() }; im.onerror = () => r(); im.src = `art/${id}.png` });
window.DUR = T1;
window.READY = (async () => {
  await Promise.all(['you_sing_side', 'you_back', 'me_profile', ...MEM].map(loadImg));
  try { await Promise.all([TK(100), TE(100), CK(40, 300), CK(40, 400), CK(40, 500), MK(40, 500), MK(40, 700), MK(40, 800), CE(30, 400), CE(30, 500)].map(f => document.fonts.load(f, '주인공 완벽해 좋아해 행인 MAIN CHARACTER abc 0'))) } catch (e) { }
  buildCamera(); window.renderAt = renderAt; renderAt(T0);
  if (!RENDER) player();
})();

// preview: play with the song, or scrub (not used by the renderer)
function player() {
  const bar = document.getElementById('bar'), au = new Audio('song.mp3'), rng = document.getElementById('rng'), btn = document.getElementById('play'), lab = document.getElementById('lab');
  bar.hidden = false; rng.min = T0; rng.max = T1; rng.step = .01; rng.value = T0;
  let playing = false;
  const show = t => { renderAt(t); rng.value = t; lab.textContent = t.toFixed(2) };
  const loop = () => { if (!playing) return; if (au.currentTime >= T1) { au.pause(); playing = false; btn.textContent = '▶' } show(au.currentTime); requestAnimationFrame(loop) };
  const toggle = () => { playing = !playing; btn.textContent = playing ? '❚❚' : '▶'; if (playing) { if (+rng.value >= T1 - .05) rng.value = T0; au.currentTime = +rng.value; au.play(); loop() } else au.pause() };
  btn.onclick = toggle; rng.oninput = () => { if (playing) au.currentTime = +rng.value; show(+rng.value) };
  addEventListener('keydown', e => { if (e.code === 'Space') { e.preventDefault(); toggle() } });
}
