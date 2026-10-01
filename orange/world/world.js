/* ORANGE world: one continuous camera over a volleyball gym seen from above (100 px = 1 m), plus a vertical "side" strip
   (the sky → the horizon = the net tape → the gym seen from the side → the floor close up) for the moments we tilt up.
   Everything is drawn in world coordinates; the camera (cam.js) decides what the frame shows. */

Ln = window.D.lines;                                                              // the camera keys in m1.js read lyric times when they load

// a plate pre-blurred once (canvas filters are too slow to run on big images every frame)
const BLURC = {};
function blurred(id, px, w, h) { const k = [id, px, w, h].join('|'); if (BLURC[k]) return BLURC[k]; const im = PL[id]; if (!im) return null; const c = document.createElement('canvas'); c.width = Math.round(w / 2); c.height = Math.round(h / 2); const x = c.getContext('2d'); x.filter = `blur(${px}px)`; x.drawImage(im, 0, 0, c.width, c.height); return BLURC[k] = c }

// ---------------------------------------------------------------- the gym from above
const CW2 = 450, CL2 = 900;                                              // half width / half length of the court
const WOOD = '#D89A58', WOODD = '#AE7645', FREEZ = '#5E4230', LINEC = '#FFF6EC', TILE = '#5E6470';
// light pools on the floor, grouped in banks that switch on in the intro and off in the drop: [x, y, bank]
const POOLS = [[-1650, 1750, 0], [-1150, 1450, 0], [-450, 1300, 1], [350, 1300, 1], [1000, 1350, 1], [-550, 560, 2], [80, 560, 2], [650, 560, 2],
  [-550, -160, 3], [80, -160, 3], [650, -160, 3], [1450, 0, 3], [-550, -820, 4], [80, -820, 4], [650, -820, 4], [-550, -1480, 5], [80, -1480, 5], [650, -1480, 5], [0, -1950, 5], [60, 2450, 1], [-700, 2900, 0], [800, 2850, 1]];
// floorTop(t, lv): lv = light level per bank (0..1)
function floorTop(t, lv) {
  rect(-2600, -2900, 5200, 6600, FREEZ);
  g.save(); g.globalAlpha = .16; g.fillStyle = '#000'; for (let x = -2600; x < 2600; x += 64) g.fillRect(x, -2900, 3, 6600); g.restore();
  rect(-2300, 1250, 950, 1500, TILE); g.save(); g.globalAlpha = .25; g.strokeStyle = '#000'; g.lineWidth = 3; for (let x = -2300; x < -1350; x += 90) { g.beginPath(); g.moveTo(x, 1250); g.lineTo(x, 2750); g.stroke() } for (let y = 1250; y < 2750; y += 90) { g.beginPath(); g.moveTo(-2300, y); g.lineTo(-1350, y); g.stroke() } g.restore();
  rect(-CW2 - 320, -CL2 - 420, 2 * CW2 + 640, 2 * CL2 + 840, WOODD);
  rect(-CW2, -CL2, 2 * CW2, 2 * CL2, WOOD);
  const bc = blurred('court_top', 3, 1280, 2340); if (bc) { g.save(); g.globalAlpha = .25; g.drawImage(bc, -CW2 - 170, -CL2 - 270, 2 * CW2 + 340, 2 * CL2 + 540); g.restore() }
  g.save(); g.globalAlpha = .1; g.fillStyle = '#000'; for (let x = -CW2; x < CW2; x += 45) g.fillRect(x, -CL2, 2, 2 * CL2); g.restore();
  // lines
  g.save(); g.strokeStyle = LINEC; g.lineWidth = 10; g.strokeRect(-CW2, -CL2, 2 * CW2, 2 * CL2);
  for (const y of [-300, 300]) { g.beginPath(); g.moveTo(-CW2, y); g.lineTo(CW2, y); g.stroke() }
  for (const y of [CL2, -CL2]) for (const x of [-CW2, CW2]) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + Math.sign(y) * 150); g.stroke() }
  g.restore();
  // walls: windows (west), stands + scoreboard (north), bench (east)
  rect(-2600, -2900, 260, 6600, '#3B2A22'); for (let y = -2600; y < 3400; y += 420) rect(-2560, y, 180, 320, '#FFD7A0', .85);
  rect(-2600, -2900, 5200, 700, '#2C2F3A'); for (let k = 0; k < 6; k++) rect(-2400, -2850 + k * 110, 4800, 70, k % 2 ? '#3A3E4C' : '#343846');
  rect(-420, -2140, 840, 240, '#16171E'); g.save(); g.strokeStyle = '#000'; g.lineWidth = 8; g.strokeRect(-420, -2140, 840, 240); g.restore();
  rect(1480, -620, 170, 1240, '#8A5B34'); for (let y = -600; y < 600; y += 120) rect(1480, y, 170, 6, '#6E4626');
  // light: darkness where unlit, then the pools (additive)
  const avg = lv.reduce((a, c) => a + c, 0) / lv.length;
  rect(-2600, -2900, 5200, 6600, '#07080C', .9 * (1 - avg));
  g.save(); g.globalCompositeOperation = 'screen';
  for (const [x, y, k] of POOLS) { const a = lv[k]; if (a <= 0) continue; const gr = g.createRadialGradient(x, y, 0, x, y, 520); gr.addColorStop(0, `rgba(255,236,205,${.3 * a})`); gr.addColorStop(1, 'rgba(255,236,205,0)'); g.fillStyle = gr; g.fillRect(x - 520, y - 520, 1040, 1040) }
  g.restore();
}
// the net from above: shadow, posts, a mesh band and the tape; wob makes it ripple after a hit
function netTop2(t, wob = 0, a = 1) { g.save(); g.globalAlpha = a;
  g.globalAlpha = .3 * a; line(-600, 40, 600, 40, 26, '#000'); g.globalAlpha = a;
  g.fillStyle = 'rgba(25,25,30,.55)'; g.fillRect(-600, -16, 1200, 32);
  g.strokeStyle = LINEC; g.lineWidth = 12; g.beginPath(); for (let k = 0; k <= 40; k++) { const x = -600 + k * 30, y = wob * Math.sin(k / 40 * Math.PI) * 40 * Math.sin(t * 30); k ? g.lineTo(x, y) : g.moveTo(x, y) } g.stroke();
  for (const x of [-600, 600]) { disc(x, 0, 30, '#2A2B33'); ring(x, 0, 30, 6, LINEC) }
  g.restore() }

// ---------------------------------------------------------------- objects lying in the world
// a phone lying on the floor; screen(t) paints its 1080x1920 screen (any act-1 scene works)
function phoneObj(t, x, y, rot, s, screen, o = {}) {
  if (!vis(x, y, 1200 * s + (o.glow ? 1800 * s : 0))) return;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  if (o.glow) { const gr = g.createRadialGradient(0, 0, 200, 0, 0, 1800); gr.addColorStop(0, `rgba(170,210,255,${.35 * o.glow})`); gr.addColorStop(1, 'rgba(170,210,255,0)'); g.fillStyle = gr; g.fillRect(-1800, -1800, 3600, 3600) }
  rr(-W / 2 - 30, -H / 2 - 10, W + 120, H + 120, 150, 'rgba(0,0,0,.35)'); rr(-W / 2 - 60, -H / 2 - 60, W + 120, H + 120, 150, '#121217', { line: '#3A3A44', lw: 8 });
  g.save(); g.beginPath(); g.roundRect(-W / 2, -H / 2, W, H, 96); g.clip(); g.translate(-W / 2, -H / 2); screen(t); g.restore();
  rr(-150, -H / 2 + 24, 300, 60, 30, '#000');
  g.restore() }
// the tournament ticket (from the Y2K act 1), drawn at its own centre
function ticketObj(t, tear, circle, seal) {
  const L = -450, T = -220, BW = 680, SW = 220, H2 = 440;
  card(L, T, BW, H2, 26, '#FFF8EC', { sh: 14 }); g.save(); g.beginPath(); g.roundRect(L, T, BW, H2, 26); g.clip(); rect(L, T, 96, H2, ORG); g.fillStyle = dots('rgba(255,106,19,.18)', 10, 2); g.fillRect(L + 96, T, BW, H2); g.restore();
  g.save(); g.translate(L + 50, 0); g.rotate(-Math.PI / 2); txt('ADMIT ONE', 0, 12, { size: 34, w: 900, fam: UB, col: '#FFFFFF', al: 'center', tr: .1 }); g.restore();
  txt('SPRING TOURNAMENT', L + 130, T + 80, { size: 34, w: 700, fam: UB, col: INK, tr: .04 });
  txt('FINAL', L + 124, T + 240, { size: 128, w: 900, fam: UB, col: INK });
  txt('COURT A · SET 1–3 · 16:30', L + 132, T + 320, { size: 32, w: 800, fam: RD, col: INK, upper: false });
  for (let k = 0; k < 46; k++) rect(L + 132 + k * 11, T + 350, R(k, 3) > .5 ? 6 : 3, 60, INK);
  g.save(); g.translate(tear * 260, tear * 120); g.rotate(tear * .35);
  card(L + BW, T, SW, H2, 26, '#FFF8EC', { sh: 14 }); for (let y = T + 16; y < T + H2 - 10; y += 26) rect(L + BW - 3, y, 6, 14, INK, .8);
  g.save(); g.translate(L + BW + SW / 2, 0); g.rotate(-Math.PI / 2); txt('No. 010', 0, -30, { size: 40, w: 900, fam: UB, col: INK, al: 'center' }); g.restore(); vball(L + BW + SW / 2 + 40, 120, 80, t);
  g.restore();
  if (circle > 0) sketch(ellPts(L + 290, T + 200, 250, 100, 1.1, -2.6), t, { col: RED, lw: 9, p: circle, jit: 2.5 });
  if (seal) seal();
}
// the ball seen from above: height h (metres) shows as size and as the shadow's offset
function ballTop(t, bl, o = {}) { if (!bl) return; const s = 1 + bl.h * .16, d = (o.d ?? 64) * s;
  if (bl.h < 40) { g.save(); g.globalAlpha = .38 / (1 + bl.h * .25); g.fillStyle = '#000'; g.beginPath(); g.ellipse(bl.x + bl.h * 22, bl.y + bl.h * 34, 34 * (1 + bl.h * .05), 22 * (1 + bl.h * .05), .5, 0, 7); g.fill(); g.restore() }
  vball(bl.x, bl.y, d, o.rot ?? t * 6) }
// lyric chars laid along a straight path (a court line, a ball's flight); each char is upright for a camera at angle `rot`
function pathText(t, i, a, b2, p0, p1, size, o = {}) { const C = chars(i), n = b2 - a, ang = Math.atan2(p1[1] - p0[1], p1[0] - p0[0]);
  for (let k = 0; k < n; k++) { const G = C[a + k], u = n === 1 ? .5 : k / (n - 1), x = lerp(p0[0], p1[0], u), y = lerp(p0[1], p1[1], u);
    if (t < G.t - .03) continue; const al = o.fade ? o.fade(t) : 1; if (al <= .002) continue;
    stampIn(t, G.t - .03, x, y, (o.rot ?? ang) + (R(k, 7) - .5) * (o.wob ?? .12), () => sticker(G.c, 0, 0, size, Object.assign({ fam: MJ, col: '#FFFFFF', line: INK, lwk: .14 }, o.st, { alpha: al })), { from: o.from ?? 1.8, dur: .1 }) } }
// a point offset from (x0, y0) along the screen axes of a camera rolled by `rot` (dx right, dy down on screen)
const wp = (x0, y0, dx, dy, rot) => [x0 + dx * Math.cos(rot) - dy * Math.sin(rot), y0 + dx * Math.sin(rot) + dy * Math.cos(rot)];
