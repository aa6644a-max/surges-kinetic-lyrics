/* ORANGE M4 (181.6 - 232.4): the last chorus and the outro.
   The lights come back on. At the far service line the 8-second serve clock runs down while we beg for one more second (the
   +1秒 button is locked this time); 行くよ — the serve, and from here the camera only goes forward: north over the whole gym,
   out through a corridor (限られた時間: a battery at 1% / ふいに恋しく: polaroids of everything so far and a "memories"
   notification / 立ち止まらないで 振り返らないで: arrows painted on the floor, NO U-TURN), NEXT STAGE, into the teal arena
   (君は進んで行けばいいんだよ). Match point; the final spike in slow motion (きっと) and the ball touches the floor for the first
   time: GAME SET. Then the whole world with every line lit again and the route drawn through it like a map, the last きっと
   written down the corridor, and up through the clouds into the dawn: credits. */

const SV = [60, 2500];                                                                   // the far service line of our gym
const COR = { x0: -560, x1: 560, y0: -6500, y1: -2200 };                                 // the corridor north out of the gym
const AR = { x: 0, y: -8200 }, ARB = { x0: -2000, x1: 2000, y0: -10400, y1: -6000 };    // the arena court (teal) and its hall
const SPK = [60, -8080], LAND = [-180, -8780], SET0 = [-160, -7760];                    // the final spike, where it lands, the setter
const TGO = cT(29, 9), GSET = 213.5, ARON = S(33), CLICKS4 = [cT(28, 6) - .02, cT(28, 8) - .02], DAWN0 = 224.5;

// ---------------------------------------------------------------- the ball
function corBall(t) { const c = camAt(t, TOPK4), ph = ((t - B0) / BEAT) % 1, k = seg(t, 191.5, .9);       // bouncing ahead of us down the corridor
  return { x: lerp(0, 260 * Math.sin((t - 191.5) * 1.2), k), y: lerp(-3350, c.y - 880, k), h: lerp(1, .3 + 1.3 * Math.abs(Math.sin(ph * Math.PI)), k) } }
let CB209 = null;
function ball4(t) {
  if (t < LIGHTS_ON || t > 217.5) return null;
  if (t < TGO - .45) { const ph = ((t - B0) / BEAT) % 1; return { x: SV[0], y: SV[1], h: .8 * Math.abs(Math.sin(ph * Math.PI)) } }   // dribbling on the beat
  if (t < TGO) return { x: SV[0], y: SV[1], h: 3.4 * eOut(seg(t, TGO - .45, .45)) };                                                  // the toss
  if (t < 191.5) { const u = seg(t, TGO, 191.5 - TGO), e = eIO(u); return { x: lerp(SV[0], 0, e), y: lerp(SV[1], -3350, e), h: 3.4 + 2.6 * Math.sin(u * Math.PI) - 2.4 * u } }
  if (t < 209.0) return corBall(t);
  if (t < 209.6) { const b0 = CB209 || (CB209 = corBall(209.0)), u = seg(t, 209.0, .6); return { x: lerp(b0.x, SET0[0], eIO(u)), y: lerp(b0.y, SET0[1], eIO(u)), h: lerp(b0.h, 1.2, u) + 3.2 * Math.sin(u * Math.PI) } }
  if (t < S(34)) { const u = seg(t, 209.6, S(34) - 209.6); return { x: lerp(SET0[0], SPK[0], eIO(u)), y: lerp(SET0[1], SPK[1], eIO(u)), h: lerp(1.2, 3.4, u) + 3.6 * Math.sin(u * Math.PI) } }
  if (t < GSET) { const u = seg(t, S(34), GSET - S(34)), e = u ** 1.25; return { x: lerp(SPK[0], LAND[0], e), y: lerp(SPK[1], LAND[1], e), h: 3.4 * (1 - e) } }   // the spike, in slow motion
  const d = t - GSET, q = eOut(clamp(d / 3)), h = d < .6 ? 1.8 * Math.sin(d / .6 * Math.PI) : d < .95 ? .6 * Math.sin((d - .6) / .35 * Math.PI) : 0;
  return { x: LAND[0] - 280 * q, y: LAND[1] - 340 * q, h } }

// ---------------------------------------------------------------- the camera: only forward
const dashCam = t => { const b = ball4(t), u = seg(t, TGO, 191.5 - TGO); return { x: b.x * .5, y: b.y + lerp(150, 520, u), z: .82 - .3 * Math.sin(u * Math.PI), r: 0 } };
const TOPK4 = camKeys([
  [LIGHTS_ON - .02, SV[0], SV[1] - 40, .85, 0, .16], [185.6, SV[0], SV[1] - 10, .9, 0, 2.5],          // the serve clock
  [TGO - .3, SV[0], SV[1] + 60, .8, 0, .2],                                                          // the toss
  ...followKeys(TGO, 191.45, dashCam, .05, .1),                                                      // 行くよ: the serve, north over the whole gym
  [S(30) + .1, 0, -3150, .95, 0, .4], [196.1, 0, -3350, 1.0, 0, 2.0],                                 // 限られた時間: the battery
  [S(31) - .1, 0, -4250, .95, 0, .3], [200.9, 0, -4450, 1.0, 0, 2.0],                                 // ふいに恋しく: polaroids
  [S(32) - .1, 0, -5250, .95, 0, .3], [205.9, 0, -5650, 1.0, 0, 1.4],                                 // 立ち止まらないで 振り返らないで
  [ARON - .05, 0, -6650, .9, 0, .25], [208.8, 0, -6900, .95, 0, 1.2],                                 // into the arena
  [209.3, 0, -8100, .5, 0, .45],                                                                      // match point: the whole court
  [S(34) - .1, SPK[0], SPK[1] - 50, 1.2, 0, .14], [211.4, -20, -8380, 1.25, 0, .8], [213.3, -150, -8700, 1.35, 0, .8],   // the final spike
  [GSET, LAND[0], LAND[1], 1.5, 0, .08], [GSET + .35, LAND[0], LAND[1] + 20, 1.2, 0, .5],             // GAME SET
  [REST, 0, -3350, .138, 0, 2.0],                                                                     // the whole world
  [S(35) - .05, 0, -4000, .155, 0, .2], [221.3, 0, -3800, .145, 0, 1.2],                              // the last きっと
  [223.1, 0, -3600, .07, 0, 1.4]]);                                                                   // up through the clouds

// ---------------------------------------------------------------- the corridor and the arena (floors)
function corridorFloor(t) { if (!vis(0, -4350, 2600)) return; const { x0, x1, y0, y1 } = COR, w = x1 - x0, h = y1 - y0;
  rect(x0 - 90, y0, w + 180, h, '#0A0D16'); rect(x0, y0, w, h, '#1B2236');
  g.save(); g.globalAlpha = .14 * GA; g.fillStyle = '#000'; for (let y = y0; y < y1; y += 140) g.fillRect(x0, y, w, 4); g.restore();
  line(x0 + 120, y0, x0 + 120, y1, 10, '#FFFFFF', .5); line(x1 - 120, y0, x1 - 120, y1, 10, '#FFFFFF', .5);
  g.save(); g.setLineDash([120, 100]); line(0, y1, 0, y0, 16, YEL, .55); g.restore();
  // lamps: a cascade switches on ahead of the serve
  const lit = []; for (let k = 0; k < 8; k++) { const y = y1 - 300 - k * 560, on = eOut(seg(t, 191.35 + k * .09, .12)); lit.push(on); for (const x of [x0 + 40, x1 - 40]) { disc(x, y, 24, on > .5 ? '#FFF3D0' : '#2A2F3E'); ring(x, y, 24, 5, '#000') } }
  const avg = lit.reduce((a, c) => a + c, 0) / 8; rect(x0 - 90, y0, w + 180, h, '#07080C', .6 * (1 - avg));
  if (avg > 0) { g.save(); g.globalCompositeOperation = 'screen'; for (let k = 0; k < 8; k++) { if (lit[k] <= 0) continue; const y = y1 - 300 - k * 560;
    for (const x of [x0 + 170, x1 - 170]) { const gr = g.createRadialGradient(x, y, 0, x, y, 460); gr.addColorStop(0, `rgba(255,236,205,${.26 * lit[k] * GA})`); gr.addColorStop(1, 'rgba(255,236,205,0)'); g.fillStyle = gr; g.fillRect(x - 460, y - 460, 920, 920) } } g.restore() } }
// a point in the arena stands (deterministic): north, south (beside the corridor), east, west
function standPt(k) { const s = Math.floor(R(k, 302) * 4), u = R(k, 303), v = R(k, 304);
  if (s === 0) return [lerp(-1950, 1950, u), lerp(-10370, -9930, v)];
  if (s === 1) return [lerp(640, 1950, u) * (R(k, 305) > .5 ? 1 : -1), lerp(-6470, -6030, v)];
  return [(s === 2 ? 1 : -1) * lerp(1530, 1970, v), lerp(-9930, -6470, u)] }
let ARTEX = null;
function arenaTex() { if (ARTEX) return ARTEX; const k = .5, c = document.createElement('canvas'); c.width = 4000 * k; c.height = 4400 * k;
  drawOn(c, () => { const ga = GA; GA = 1; g.setTransform(k, 0, 0, k, -ARB.x0 * k, -ARB.y0 * k); g.globalAlpha = 1; rect(ARB.x0, ARB.y0, 4000, 4400, '#151B2C');
    for (let r = 0; r < 8; r++) { const m = 70 + r * 55; g.strokeStyle = r % 2 ? '#1E2740' : '#26304C'; g.lineWidth = 26; g.strokeRect(-1500 - m, -9900 - m, 3000 + 2 * m, 3400 + 2 * m) }
    for (let j = 0; j < 3200; j++) { const [x, y] = standPt(j + 1000); disc(x, y, 10 + R(j, 203) * 8, [ORG, '#FFFFFF', SKY, YEL, '#E8E1D6', TEAL, '#F58FB0'][j % 7], .8) } GA = ga });
  return ARTEX = c }
const arenaLv = t => t < ARON - .02 ? 0 : eOut(seg(t, ARON - .02, .25));
function arenaFloor(t) { if (!vis(0, -8200, 3100)) return; const lv = arenaLv(t);
  g.drawImage(arenaTex(), ARB.x0, ARB.y0, 4000, 4400);
  rect(-1500, -9900, 3000, 3400, '#C96A2E'); g.save(); g.globalAlpha = .1 * GA; g.fillStyle = '#000'; for (let x = -1500; x < 1500; x += 50) g.fillRect(x, -9900, 3, 3400); g.restore();
  rect(-450, -9100, 900, 1800, '#159A8E'); g.save(); g.globalAlpha = .08 * GA; g.fillStyle = '#FFFFFF'; for (let x = -450; x < 450; x += 45) g.fillRect(x, -9100, 2, 1800); g.restore();
  g.save(); g.strokeStyle = LINEC; g.lineWidth = 10; g.strokeRect(-450, -9100, 900, 1800); for (const y of [-8500, -7900]) { g.beginPath(); g.moveTo(-450, y); g.lineTo(450, y); g.stroke() } g.restore();
  rr(-1480, -6440, 760, 130, 14, ORG, { line: INK, lw: 6 }); txt('全力', -1100, -6342, { size: 96, fam: MJ, col: '#FFFFFF', al: 'center', upper: false });
  rr(720, -6440, 760, 130, 14, '#FFFFFF', { line: INK, lw: 6 }); txt('ONE MORE', 1100, -6340, { size: 92, fam: BG, col: INK, al: 'center' });
  rr(-700, -10330, 1400, 150, 14, ORG, { line: INK, lw: 6 }); txt('ORANGE', 0, -10218, { size: 110, fam: BG, col: '#FFFFFF', al: 'center', tr: .08 });
  rect(ARB.x0, ARB.y0, 4000, 4400, '#07080C', .88 * (1 - lv));
  if (lv > 0) { g.save(); g.globalCompositeOperation = 'screen'; for (const [x, y] of [[-300, -8750], [300, -8750], [-300, -7650], [300, -7650], [0, -8200], [0, -6900], [-950, -8200], [950, -8200]]) {
    const gr = g.createRadialGradient(x, y, 0, x, y, 620); gr.addColorStop(0, `rgba(255,240,215,${.26 * lv})`); gr.addColorStop(1, 'rgba(255,240,215,0)'); g.fillStyle = gr; g.fillRect(x - 620, y - 620, 1240, 1240) } g.restore() }
  scoreboardObj(t, { dy: -9650 - SB.y });
  g.save(); g.translate(AR.x, AR.y); netTop2(t, t > S(34) && t < S(34) + 1 ? Math.exp(-(t - S(34)) * 4) : 0); g.restore();
  if (lv > 0) { const nf = t < 210.3 ? 16 : t < GSET ? 40 : 90; for (let k = 0; k < nf; k++) { const ph = (t * 1.7 + R(k, 301)) % 1; if (ph > .1) continue; const [x, y] = standPt(k); sparkle(x, y, 70 * Math.sin(ph / .1 * Math.PI), 0, '#FFFFFF', lv) } } }

// ---------------------------------------------------------------- objects
// the serve clock: 8 seconds in a ring around the ball, a shot-clock display, and the +1秒 button (locked this time)
function serveClock(t) { if (t < LIGHTS_ON - .05) return; const a = 1 - seg(t, TGO + .05, .35); if (a <= 0) return;
  const [x, y] = SV, s = Math.min(1, MO.springStep(t - LIGHTS_ON - .1, { damping: 11, stiffness: 200 })), rem = clamp((TGO - t) / 8), sec = rem * 8;
  withA(a, () => { g.save(); g.translate(x, y); g.scale(s, s);
    ring(0, 0, 300, 34, 'rgba(20,20,30,.6)'); g.save(); g.lineCap = 'round'; g.strokeStyle = sec < 3 ? RED : ORG; g.lineWidth = 34; g.beginPath(); g.arc(0, 0, 300, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * rem); g.stroke(); g.restore();
    for (let k = 0; k < 8; k++) { const an = -Math.PI / 2 + k / 8 * Math.PI * 2; line(Math.cos(an) * 340, Math.sin(an) * 340, Math.cos(an) * 384, Math.sin(an) * 384, 12, k < Math.ceil(sec - 1e-6) ? '#FFFFFF' : '#5A5A66') }
    rr(-230, -660, 460, 230, 36, '#15161E', { line: '#000', lw: 10 }); txt('SERVE', 0, -598, { size: 46, fam: BG, col: '#FFFFFF', al: 'center', tr: .14 });
    txt(sec.toFixed(2), 0, -452, { size: 150, fam: BG, col: sec < 3 ? RED : YEL, al: 'center', alpha: sec < 3 && Math.floor(t * 4) % 2 ? .45 : 1 });
    const c0 = CLICKS4[0], dead = t > c0, pz = CLICKS4.some(c => t >= c && t < c + .15) ? .88 : 1, sh = CLICKS4.reduce((acc, c) => acc + (t > c ? 16 * Math.sin((t - c) * 70) * Math.exp(-(t - c) * 9) : 0), 0);
    g.save(); g.translate(430 + sh, 0); g.scale(pz, pz); disc(0, 0, 96, dead ? '#6A6A74' : ORG); ring(0, 0, 96, 8, INK); txt('+1秒', 0, 22, { size: 62, fam: BGJ, col: dead ? '#B9B9C2' : '#FFFFFF', al: 'center' }); g.restore();
    if (dead) { const ps = MO.springStep(t - c0, { damping: 8, stiffness: 300 }); g.save(); g.translate(500 + sh, -80); g.scale(ps, ps); padlock(0, 0, .75); g.restore();
      stampIn(t, c0 + .05, 430, 150, -.12, () => sticker('LOCKED', 0, 0, 64, { fam: BG, col: RED, line: INK, lwk: .1 }), { from: 1.6 }) }
    g.restore() });
  if (t > 182.25 && t < 183.6) stampIn(t, 182.3, x - 300, y - 380, -.15, () => sticker('ピッ!', 0, 0, 110, { fam: SFX, col: '#FFFFFF', line: INK, lwk: .1, alpha: 1 - seg(t, 183.2, .4) }), { from: 1.8 });
  if (t > 183.2 && t < 186.6) { const p = eIO(seg(t, 183.3, CLICKS4[0] - 183.4)), q = eIO(seg(t, 185.6, .9)); cursor(t, lerp(lerp(x + 760, x + 450, p), x + 900, q), lerp(lerp(y + 560, y + 30, p), y - 520, q), { click: t < CLICKS4[1] - .2 ? CLICKS4[0] : CLICKS4[1], s: 2.4 }) } }
// a "memories" notification (it suggests looking back; the next line says don't)
function memoryNote(x, y, a, dx) { g.save(); g.translate(x + dx, y); withA(a, () => { card(-410, -95, 820, 190, 36, '#FFFFFF', { sh: 10 }); disc(-322, 0, 58, ORG); vball(-322, 0, 84, .3);
  txt('思い出', -236, -16, { size: 46, w: 800, fam: RD, col: INK, upper: false }); txt('1年前の今日を振り返ってみませんか?', -236, 46, { size: 32, w: 500, fam: RD, col: GREY, upper: false }); txt('今', 380, -30, { size: 30, w: 500, fam: RD, col: GREY, al: 'right', upper: false }) }); g.restore() }
const POLS4 = [[-400, -4730, -.18, 'gym_lit', 'はじめて'], [400, -4680, .14, 'gym_sunset', '夕焼け'], [-390, -3930, .12, 'sky_clean', 'あの空'], [400, -3900, -.1, 'bench_orange', 'ベンチ']];
// a NO U-TURN road sign painted in the corridor
function noUturn(x, y, s) { if (s <= .01) return; g.save(); g.translate(x, y); g.scale(s, s); disc(0, 0, 150, '#FFFFFF'); ring(0, 0, 150, 30, RED);
  g.save(); g.globalAlpha = GA; g.strokeStyle = INK; g.lineWidth = 26; g.lineCap = 'round'; g.beginPath(); g.moveTo(40, 70); g.lineTo(40, -10); g.arc(-5, -10, 45, 0, Math.PI, true); g.lineTo(-50, 30); g.stroke();
  g.fillStyle = INK; g.beginPath(); g.moveTo(-88, 24); g.lineTo(-12, 24); g.lineTo(-50, 84); g.closePath(); g.fill(); g.restore(); line(-104, -104, 104, 104, 28, RED); g.restore() }
// the NEXT STAGE bar at the end of the corridor
function nextStage(t) { const t0 = 204.9, s = MO.springStep(t - t0, { damping: 11, stiffness: 220 }); if (s <= .01 || !vis(0, -6290, 600)) return; const p = eIO(seg(t, t0 + .25, ARON - t0 - .3));
  g.save(); g.translate(0, -6290); g.scale(Math.min(1.05, s), Math.min(1.05, s)); card(-400, -110, 800, 220, 30, '#15161E', { sh: 12, line: '#000' });
  txt('NEXT STAGE', -350, -38, { size: 66, fam: BG, col: YEL, tr: .04 }); txt(p >= 1 ? 'GO!' : Math.round(p * 100) + '%', 350, -38, { size: 60, fam: BG, col: '#FFFFFF', al: 'right' });
  progress(-350, 4, 700, 62, p, { t, col: TEAL }); g.restore() }
// the route of the whole song, drawn over the world like a map, with pins at every scene
const ROUTE = [[-1650, 1880], [0, 560], [-1180, 1060], [1290, 160], [60, 1180], [-200, -700], [-150, -130], [200, 650], [0, 420], [80, -520], [0, -1800], [1560, 260], [-1650, -430],
  [450, 780], [450, -780], [700, -1010], [-900, -1010], [-1500, -1350], [-20, 600], [0, -560], [0, 0], [1900, -1500], [0, 430], [60, 2500], [0, -2400], [0, -6300], [60, -8080], [-180, -8780]];
const ROUTE_L = (() => { const L = [0]; for (let k = 1; k < ROUTE.length; k++) L.push(L[k - 1] + Math.hypot(ROUTE[k][0] - ROUTE[k - 1][0], ROUTE[k][1] - ROUTE[k - 1][1])); return L })();
function mapPin(x, y, r, col) { g.save(); g.translate(x, y); g.beginPath(); g.moveTo(0, 0); g.lineTo(-r * .62, -r * 1.25); g.arc(0, -r * 1.6, r * .75, Math.PI * .8, Math.PI * .2); g.closePath(); g.globalAlpha = GA; g.fillStyle = col; g.fill(); g.lineWidth = r * .16; g.strokeStyle = '#FFFFFF'; g.stroke(); disc(0, -r * 1.6, r * .3, '#FFFFFF'); g.restore() }
function routeLine(t) { const p = eIO(seg(t, REST + .3, 4.2)); if (p <= 0) return; const tot = ROUTE_L[ROUTE_L.length - 1] * p;
  const path = () => { g.beginPath(); g.moveTo(ROUTE[0][0], ROUTE[0][1]); for (let k = 1; k < ROUTE.length; k++) { if (ROUTE_L[k] <= tot) g.lineTo(ROUTE[k][0], ROUTE[k][1]); else { const u = (tot - ROUTE_L[k - 1]) / (ROUTE_L[k] - ROUTE_L[k - 1]); g.lineTo(lerp(ROUTE[k - 1][0], ROUTE[k][0], u), lerp(ROUTE[k - 1][1], ROUTE[k][1], u)); break } } };
  g.save(); g.lineJoin = 'round'; g.lineCap = 'round'; g.globalAlpha = .95; path(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 80; g.stroke(); path(); g.strokeStyle = ORG; g.lineWidth = 46; g.setLineDash([110, 70]); g.stroke(); g.restore();
  ROUTE.forEach(([x, y], k) => { const s = clamp((tot - ROUTE_L[k]) / 500); if (s > 0 && k < ROUTE.length - 1) mapPin(x, y, 120 * eOut(s), ORG) });
  if (p >= 1) { const ph = ((t - REST) * 1.2) % 1; ring(LAND[0], LAND[1], 140 + ph * 420, 34 * (1 - ph), SKY, 1 - ph); disc(LAND[0], LAND[1], 115, SKY); ring(LAND[0], LAND[1], 115, 28, '#FFFFFF') } }

// ---------------------------------------------------------------- the court and the corridor: everything sung in M4
function topM4(t) {
  if (t < LIGHTS_ON - .1) return;
  // あと1秒だけ もう1秒だけ: the clock above, the plea below; なんて 惜しみながら 行くよ — it runs out and we serve
  serveClock(t);
  lockup(t, { x: SV[0], y: SV[1] - 900, alpha: fadeOld(TGO + .6), rows: [{ i: 28, a: 0, b: 6, size: 150, st: 'heavy', ent: 'stamp' }] });
  lockup(t, { x: SV[0], y: SV[1] + 470, alpha: fadeOld(TGO + .6), rows: [{ i: 28, a: 6, b: 12, size: 150, st: 'heavyY', ent: 'stamp' }] });
  lockup(t, { x: SV[0] - 20, y: SV[1] + 690, alpha: fadeOld(TGO + .6), rows: [{ i: 29, a: 0, b: 3, size: 96, st: 'handW', ent: 'type' }, { i: 29, a: 3, b: 9, size: 110, st: 'thin', ent: 'rise', gap: 4 }] });
  if (t > TGO && t < TGO + .5) { const d = t - TGO; burst(t, SV[0], SV[1], 380 * eOut(clamp(d / .1)) * (1 - seg(d, .3, .2)), '#FFFFFF', { n: 14, line: INK, lw: 8 }) }
  lockup(t, { x: SV[0], y: SV[1], rot: -.06, alpha: fadeOld(192), rows: [{ i: 29, a: 9, b: 12, size: 270, st: 'heavyO', ent: 'stamp' }] });
  if (t > TGO) stampIn(t, TGO + .02, SV[0] + 300, SV[1] - 380, .1, () => sticker('GO!!', 0, 0, 200, { fam: BG, col: ORG, line: INK, lwk: .1, alpha: fadeOld(TGO + .8)(t) }), { from: 2.2 });
  // 限られた時間がいつか — a battery on the corridor floor drains to 1%
  if (t > S(30) - .3) { const fa = fadeOld(S(31) + .2); lockup(t, { x: 0, y: -3330, alpha: fa, rows: [{ i: 30, a: 0, b: 4, size: 120, st: 'thin', ent: 'rise' }] });
    lockup(t, { x: 0, y: -3075, alpha: fa, rows: [{ i: 30, a: 4, b: 6, size: 330, st: 'heavy', ent: 'stamp' }] });
    lockup(t, { x: 0, y: -2835, alpha: fa, rows: [{ i: 30, a: 6, b: 10, size: 120, st: 'thin', ent: 'rise' }] });
    const bt = cT(30, 4) - .1; if (t > bt) { const s = Math.min(1.04, MO.springStep(t - bt, { damping: 10, stiffness: 220 })), p = lerp(1, .01, eIn(seg(t, cT(30, 6), cT(30, 9) - cT(30, 6) + .05)));
      battery(0, -3800, s, p, t); if (p < .02) stampIn(t, cT(30, 9) + .1, 300, -3960, .12, () => sticker('LOW!', 0, 0, 90, { fam: BG, col: RED, line: INK, lwk: .1, alpha: fa(t) }), { from: 1.8 }) } }
  // ふいに恋しくなっても — memories fall onto the floor; a notification suggests looking back
  if (t > S(31) - .3) { POLS4.forEach(([x, y, r, id, cap], k) => { const t0 = cT(31, k * 2) - .05; if (t < t0) return; const s = MO.springStep(t - t0, { damping: 11, stiffness: 200 }), q = Math.min(1, s);
      polaroid(x, y, 300, r + (1 - q) * .5, id, { s: lerp(1.7, 1, q), cap, alpha: clamp((t - t0) / .12) }) });
    const ns = eOut(seg(t, S(31) - .1, .4)), out = eIn(seg(t, S(32) - .05, .45)); if (ns > 0 && out < 1) memoryNote(0, -4990 - (1 - ns) * 300, 1 - out, out * 1300);
    const fb = fadeOld(S(32) + .2); lockup(t, { x: 0, y: -4520, alpha: fb, rows: [{ i: 31, a: 0, b: 3, size: 110, st: 'handW', ent: 'type' }] });
    lockup(t, { x: 0, y: -4300, alpha: fb, rows: [{ i: 31, a: 3, b: 6, size: 300, st: 'heavyO', ent: 'stamp' }] });
    lockup(t, { x: 0, y: -4075, alpha: fb, rows: [{ i: 31, a: 6, b: 10, size: 120, st: 'thin', ent: 'rise' }] }) }
  // 立ち止まらないで 振り返らないで — arrows painted on the floor, GO STRAIGHT, no U-turn
  if (t > S(32) - .3) { const fc = fadeOld(S(33) + .2), pa = eOut(seg(t, S(32), .35)); if (pa > 0) withA(.6 * pa * fc(t), () => arrowFloor(0, -4800 + (1 - pa) * 120, 380, -Math.PI / 2, '#FFFFFF', 1));
    const gs = eOut(seg(t, cT(32, 4), .4)); if (gs > 0) txt('GO STRAIGHT', 0, -5330, { size: 150, fam: BG, col: '#FFFFFF', al: 'center', base: 'middle', alpha: .45 * gs * fc(t), tr: .06 });
    lockup(t, { x: 0, y: -5100, alpha: fc, rows: [{ i: 32, a: 0, b: 8, size: 120, st: 'heavy', ent: 'stamp' }] });
    lockup(t, { x: 0, y: -5580, alpha: fc, rows: [{ i: 32, a: 8, b: 15, size: 130, st: 'heavyO', ent: 'stamp' }] });
    const ut = cT(32, 8) - .05; if (t > ut) { const s = Math.min(1.05, MO.springStep(t - ut, { damping: 9, stiffness: 260 })); noUturn(0, -5860, .9 * s);
      [-330, 330].forEach((x, k) => { const p = eOut(seg(t, ut + .15 + k * .1, .3)); if (p > 0) withA(.6 * p * fc(t), () => arrowFloor(x, -5860 + (1 - p) * 80, 300, -Math.PI / 2, '#FFFFFF', 1)) }) } }
  // NEXT STAGE, then the arena: 君は進んで行けばいいんだよ
  nextStage(t);
  lockup(t, { x: 0, y: -6905, alpha: fadeOld(210.6), rows: [{ i: 33, a: 0, b: 2, size: 110, st: 'thin', ent: 'rise' }, { i: 33, a: 2, b: 5, size: 280, st: 'heavyS', ent: 'stamp', gap: 4 }, { i: 33, a: 5, b: 13, size: 120, st: 'round', ent: 'fly', gap: 6 }] });
  // the final spike in slow motion: きっと, the long vowel trailing the ball as ーーー
  lockup(t, { x: 40, y: -8440, rot: -.05, alpha: fadeOld(GSET + .6), rows: [{ i: 34, a: 0, b: 3, size: 240, st: 'heavyO', ent: 'stamp' }] });
  const t0 = cT(34, 2) + .15; if (t > t0) { const dx = LAND[0] - SPK[0], dy = LAND[1] - SPK[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, ang = Math.atan2(dy, dx);
    for (let k = 0; k < 10; k++) { const tk = t0 + k * .11; if (t < tk) break; const u = .16 + k * .075, sd = k % 2 ? 1 : -1, s = MO.springStep(t - tk, { damping: 9, stiffness: 400 });
      g.save(); g.translate(SPK[0] + dx * u + nx * sd * 250, SPK[1] + dy * u + ny * sd * 250); g.rotate(ang); g.scale(s, s); sticker('ー', 0, 0, 150, { fam: SFX, col: INK, line: '#FFFFFF', lwk: .1, alpha: fadeOld(GSET + .5)(t) }); g.restore() } }
  // GAME SET: the ball touches the floor for the first time
  if (t > GSET) { const d = t - GSET; if (d < .7) { burst(t, LAND[0], LAND[1], 460 * eOut(clamp(d / .1)) * (1 - seg(d, .45, .25)), '#FFFFFF', { n: 16, line: INK, lw: 10 });
      for (let k = 0; k < 3; k++) { const e = d - k * .12; if (e > 0 && e < .9) sketch(ellPts(LAND[0], LAND[1], 120 + e * 700, 80 + e * 460, 1.02, -1, 40), t, { col: '#FFFFFF', lw: 14 * (1 - e / .9), alpha: 1 - e / .9 }) } }
    stampIn(t, GSET + .03, LAND[0] + 300, LAND[1] + 180, .12, () => sticker('ドンッ', 0, 0, 150, { fam: SFX, col: '#FFFFFF', line: INK, lwk: .1, alpha: fadeOld(GSET + 1.2)(t) }), { from: 2.2 });
    stampIn(t, GSET + .25, LAND[0] + 20, LAND[1] - 360, -.06, () => sticker('GAME SET', 0, 0, 190, { fam: BG, col: YEL, line: INK, lwk: .1 }), { from: 2.4 });
    if (d < 4) confetti(t, GSET + .1, LAND[0], LAND[1] - 120, { n: 150, spread: 1.6 }) }
  // the whole world: the route, then the last きっと written down the corridor between the two halls
  routeLine(t);
  chars(35).forEach((G, k) => { if (t < G.t - .03) return; stampIn(t, G.t - .03, 0, -6100 + k * 2000, (R(k, 9) - .5) * .1, () => sticker(G.c, 0, 0, 1900, { fam: SFX, col: k === 1 ? '#FFFFFF' : ORG, line: INK, lwk: .07 }), { from: 1.7, dur: .14 }) });
  ballTop(t, ball4(t), { d: 150 });
}
// screen space: flashes, the dash streaks, focus lines on the slow spike, the clouds we rise through
function m4Overlay(t, c) {
  flash(t, LIGHTS_ON, '#FFFFFF', .3, .85); flash(t, ARON - .02, '#FFFFFF', .35, .75);
  if (t > TGO && t < 191.6) streaks2(t, Math.PI / 2, { a: .5 * (1 - seg(t, 191.2, .4)), n: 46, speed: 4200 });
  if (t > S(34) && t < GSET + .05) { const b = ball4(t); if (b) { const [x, y] = toScreen(c, b.x, b.y); focusLines(t, x, y, { a: .45, n: 64, r0: 240, speed: 1.4 }) } }
  if (t > 222.6) { const k = seg(t, 222.6, 1.6); cloudField(t, { alpha: .95 * k, n: 10, speed: .5 }); rect(0, 0, W, H, '#FFFFFF', eIn(seg(t, 223.5, 1.0))) } }

// ---------------------------------------------------------------- the dawn (224.5 - 232.4): out of the clouds, the ball rises like the sun
const DAWNK = camKeys([[DAWN0 - .1, 0, -980, 1.12, 0, .01], [DAWN0 + .2, 0, -1050, 1.0, 0, 2.2], [227, 0, -1080, 1.05, 0, 4.0]]);
function dawnWorld(t) { cover('dawn', -1000, -3000, 2000, 3000);
  const p = eOut(seg(t, DAWN0, 6.5)), sx = -330, sy = lerp(-450, -760, p);
  g.save(); g.globalCompositeOperation = 'screen'; const gr = g.createRadialGradient(sx, sy, 80, sx, sy, 950); gr.addColorStop(0, 'rgba(255,214,160,.8)'); gr.addColorStop(1, 'rgba(255,214,160,0)'); g.fillStyle = gr; g.fillRect(sx - 950, sy - 950, 1900, 1900); g.restore();
  rays(t, sx, sy, { col: 'rgba(255,226,170,.10)', n: 22, spin: .03 }); vball(sx, sy, 270, (t - DAWN0) * .35);
  for (let k = 0; k < 5; k++) { const d = t - DAWN0 - .8 - k * .3; if (d > 0) birdV(-700 + d * (150 + k * 20), -1450 - k * 70 - d * 40, .8 + k * .1, Math.sin((t + k) * 8)) } }
const fmtT = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
function dawnOverlay(t, c) { const wh = 1 - seg(t, DAWN0, 1.0); if (wh > 0) { cloudField(t, { alpha: .9 * wh, n: 8, speed: .5, haze: false }); rect(0, 0, W, H, '#FFFFFF', wh) }
  [...'オレンジ'].forEach((ch, k) => { const t0 = 225.9 + k * .13; if (t > t0 - .02) stampIn(t, t0, CX + (k - 1.5) * 205, 720, (R(k, 3) - .5) * .12, () => sticker(ch, 0, 0, 200, { fam: MJ, col: '#FFFFFF', line: INK, lwk: .14 }), { from: 2 }) });
  if (t > 226.75) stampIn(t, 226.75, CX, 935, -.03, () => sticker('SPYAIR', 0, 0, 130, { fam: BG, col: ORG, line: INK, lwk: .1, tr: .06 }), { from: 1.8 });
  const ps = MO.springStep(t - 227.4, { damping: 12, stiffness: 180 }); if (ps > .01) { g.save(); g.translate(CX, 330 - (1 - Math.min(1, ps)) * 420);
    card(-440, -120, 880, 240, 40, '#FFFFFF', { sh: 10 }); disc(-330, 0, 82, ORG); vball(-330, 0, 130, t * .8);
    txt('オレンジ', -220, -24, { size: 60, fam: MJ, col: INK, upper: false }); txt('SPYAIR', -220, 36, { size: 44, fam: BG, col: GREY, tr: .04 });
    const p = clamp(t / DUR); rr(-220, 62, 600, 14, 7, '#E2E2E8'); rr(-220, 62, 600 * p, 14, 7, ORG); disc(-220 + 600 * p, 69, 15, ORG);
    txt(fmtT(t), -220, 112, { size: 30, fam: BG, col: GREY }); txt(fmtT(DUR), 380, 112, { size: 30, fam: BG, col: GREY, al: 'right' });
    rect(330, -48, 16, 58, INK); rect(362, -48, 16, 58, INK); g.restore() }
  rect(0, 0, W, H, '#000', eIn(seg(t, 231.2, 1.2))) }
