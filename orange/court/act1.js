/* ORANGE act 1 (0 - 88.2): pre-game, the serve, rally 1 (verse), the approach (pre), hang time and the spike (chorus 1 A).
   The ball writes the lyric: every phrase is a hit, the ball passes each char when it is sung. */

// ================= A0 0 - 13.777: the gym lights come on bank by bank; a ball is dribbled toward us; the toss =================
const LB = [.4, 2.75, 4.75, 7.5, 9.75, 12.25];
function A0(t) {
  fill(BK);
  const on = LB.map(t0 => t < t0 ? 0 : eOut(seg(t, t0, .18)) * (1 - .45 * Math.exp(-(t - t0) * 10) * (Math.sin((t - t0) * 70) > 0 ? 1 : 0)));
  const lit = .06 + .94 * on.reduce((a, b) => a + b, 0) / LB.length, cam = { z0: lerp(6.5, 3.2, eIO(seg(t, 0, 13.6))), camH: lerp(1.2, 1.7, eIO(seg(t, 0, 13.6))) }, C = Object.assign({}, GYM, cam);
  gymPersp(t, lit, { cam });
  gymLights(t, on, C);
  // the dribble: bounces on the beats before the band comes in, the ball coming toward us; then the toss
  const bs = [], n0 = -10; for (let n = n0; n <= -2; n++) bs.push(onBeat(n));
  if (t > bs[0] - .5) {
    let x = .7, y, z; const tt = Math.min(t, bs[bs.length - 1]);
    if (t < bs[0]) { const p = seg(t, bs[0] - .5, .5); y = lerp(3.2, 0, p * p); z = 15 }
    else if (t < bs[bs.length - 1]) { let k = 0; while (t > bs[k + 1]) k++; const p = (t - bs[k]) / (bs[k + 1] - bs[k]); y = 1.0 * 4 * p * (1 - p); z = lerp(15, 4.5, (k + p) / (bs.length - 1)) }
    else { const p = seg(t, bs[bs.length - 1], B0 - bs[bs.length - 1]); y = 7 * p * (2 - p); z = lerp(4.5, 2.2, p); x = lerp(.7, 0, p) }
    const [sx, sy] = pj(x, y + .12, z, C), [hx, hy] = pj(x, 0, z, C), r = .12 * C.f / (z + C.z0);
    g.globalAlpha = .35 * lit; g.fillStyle = BK; g.beginPath(); g.ellipse(hx, hy, r * 1.2, r * .35, 0, 0, 7); g.fill(); g.globalAlpha = 1;
    const sq = bs.reduce((a, b) => a + MO.wiggle(1, 'easeOut')(clamp((t - b) / .25)) * .0, 0) + bs.reduce((a, b) => a + (t >= b && t < b + .08 ? .22 : 0), 0);
    ball(sx, sy, r, t * 5, { sq, ang: Math.PI / 2 });
  }
  // small HUD labels arrive with the lights
  const hud = (k, s, x, y, o = {}) => { const a = on[k]; if (a > 0) txt(s, x, y, Object.assign({ size: 30, fam: EN, col: WH, tr: .25, alpha: a * .9 }, o)) };
  hud(0, 'SPYAIR', 60, 110); hud(1, 'ORANGE', 60, 150, { col: OR }); hud(2, 'SET 1', W - 60, 110, { al: 'right' }); hud(3, 'HOME  0 — 0  AWAY', W - 60, 150, { al: 'right', size: 26 });
  hud(4, 'PRE-GAME', 60, 1700, { size: 24 }); hud(5, '00:00', W - 60, 1700, { al: 'right', size: 24 });
  impactFrame(t, B0 - .02);
}

// ================= A1 13.777 - 31.9: the band hits. ORANGE drops in letter by letter (the O is the ball), the court draws itself,
// the scoreboard wakes, the server bounces the ball twice and tosses it =================
function A1(t) {
  const b = n => onBeat(n);                                   // beat 0 = 13.777
  if (t < b(8)) return A1title(t, b);
  if (t < b(16)) return A1court(t, b);
  if (t < b(24)) return A1score(t, b);
  return A1serve(t, b);
}
function A1title(t, b) {
  fill(BK); const hitA = 1 - seg(t, B0, .5); if (hitA > 0) rect(0, 0, W, H, OR, hitA);
  streaks(t, -.35, { a: .18, n: 30, col: OR });
  const word = 'ORANGE', size = 250; font(400, size, EN); setTrack(0);
  const ws = [...word].map(c => g.measureText(c).width), gap = 6, tw = ws.reduce((a, c) => a + c, 0) + gap * 5; let x = CX - tw / 2;
  // outline echoes of the whole word sliding sideways above and below
  for (const [d, dir] of [[-1, 1], [1, -1], [-2, -1], [2, 1]]) { const a = seg(t, b(Math.abs(d) + 1), .4) * (Math.abs(d) === 2 ? .22 : .38);
    if (a > 0) txt(word, CX + dir * ((t - B0) * 40 % 200), CY + 120 + d * 300, { size, fam: EN, col: WH, outline: true, lw: 3, al: 'center', alpha: a }) }
  [...word].forEach((c, k) => { const tl = b(k) + .0, land = t - tl, y0 = CY + 120, cx = x + ws[k] / 2; x += ws[k] + gap; if (t < tl - .35) return;
    const y = land < 0 ? lerp(-300, y0, 1 - (land / -.35) ** 2) : y0, sq = land >= 0 ? .3 * Math.exp(-land * 9) * Math.cos(land * 30) : 0, jump = t > b(6) ? MO.springStep(t - b(6), { damping: 7, stiffness: 300 }) : 0;
    g.save(); g.translate(cx, y - 18 * Math.sin(clamp(t - b(6)) * Math.PI) * (t > b(6) && t < b(7) ? 3 : 0)); g.scale(1 + sq, 1 - sq);
    if (c === 'O') ball(0, -size * .37, size * .36, (t - tl) * 4, {});
    else { txt(c, 8, 12, { size, fam: EN, col: BK, al: 'center', alpha: .5 }); txt(c, 0, 0, { size, fam: EN, col: k % 2 ? WH : OR, al: 'center' }) }
    g.restore(); if (land >= 0 && land < .05) HITS.length });
  const sp = seg(t, b(7), .3); if (sp > 0) txt('SPYAIR', CX, CY + 300, { size: 64, fam: EN, col: WH, tr: .5, al: 'center', alpha: sp });
  lettering(CX, CY - 330, () => txt('オレンジ', 0, 0, { size: 90, fam: JP, col: OR, al: 'center', alpha: seg(t, b(6), .3) }));
}
function A1court(t, b) {
  fill(BK); const p = eIO(seg(t, b(8), b(12) - b(8))), rot = lerp(-.5, 0, eIO(seg(t, b(8), b(14) - b(8)))), sc = lerp(1.35, 1, eIO(seg(t, b(8), b(14) - b(8))));
  g.save(); g.translate(CX, CY); g.rotate(rot); g.scale(sc, sc); g.translate(-CX, -CY);
  courtTop(CX, CY, 88, { p, floorA: .9 * seg(t, b(8), .6) });
  // positions: six dots a side pop in on the beats (rotation 1..6), ours orange, theirs white
  const POS = [[-3, 6], [0, 6.5], [3, 6], [3, 1.8], [0, 1.8], [-3, 1.8]];
  POS.forEach(([x, y], k) => { for (const side of [1, -1]) { const t0 = b(10) + k * BEAT / 2 + (side < 0 ? BEAT / 4 : 0), s = MO.springStep(t - t0, { damping: 9, stiffness: 240 }); if (s <= 0) continue;
    const X = CX + x * 88 * side, Y = CY + y * 88 * side; disc(X, Y, 34 * s, side > 0 ? OR : WH); txt(String(k + 1), X, Y + 13 * s, { size: 36 * s, fam: EN, col: side > 0 ? BK : NAVY, al: 'center', upper: false }) } });
  g.restore();
  const a = seg(t, b(12), .3); txt('SET 1', CX, 170, { size: 110, fam: EN, col: WH, al: 'center', alpha: a, tr: .08 }); txt('HOME', CX, 1830, { size: 40, fam: EN, col: OR, al: 'center', tr: .4, alpha: a }); txt('AWAY', CX, 120, { size: 40, fam: EN, col: WH, al: 'center', tr: .4, alpha: a * 0 });
}
function A1score(t, b) {
  fill(BK); streaks(t, 0, { a: .08, n: 26 });
  const a = seg(t, b(16), .25);
  // the scoreboard: two flip cards per team, flipping to 0 on the beats
  const card = (x, y, d, k) => flipCard(x, y, 190, 270, ' ', d, b(17) + k * BEAT / 2, t);
  g.globalAlpha = a; rect(90, 620, 900, 560, '#15161E'); g.globalAlpha = 1; ring(CX, 900, 0, 0, WH);
  txt('HOME', 300, 700, { size: 54, fam: EN, col: OR, al: 'center', tr: .3, alpha: a }); txt('AWAY', 780, 700, { size: 54, fam: EN, col: WH, al: 'center', tr: .3, alpha: a });
  card(200, 900, 0, 0); card(400, 900, 0, 1); card(680, 900, 0, 2); card(880, 900, 0, 3);
  txt(':', CX, 950, { size: 200, fam: EN, col: WH, al: 'center', alpha: a * (Math.floor((t - B0) / BEAT) % 2 ? 1 : .4) });
  txt('SET  1', CX, 1130, { size: 44, fam: EN, col: GREY, al: 'center', tr: .4, alpha: a });
  // the whistle on the last bar: PI—
  const w = seg(t, b(22), .15); if (w > 0) { const s = MO.springStep(t - b(22), { damping: 8, stiffness: 300 }); lettering(CX, 1480, () => txt('ピーッ', 0, 0, { size: 170 * s, fam: JP, col: OR, al: 'center' }));
    for (let k = 0; k < 3; k++) ring(CX, 1420, 120 + ((t - b(22)) * 500 + k * 110) % 330, 6, WH, .6 * (1 - ((t - b(22)) * 500 + k * 110) % 330 / 330)) }
}
function A1serve(t, b) {
  fill(BK); const floor = g.createLinearGradient(0, 1100, 0, H); floor.addColorStop(0, BK); floor.addColorStop(1, AMB2); g.fillStyle = floor; g.fillRect(0, 1100, W, H - 1100);
  // far net across the frame
  rect(0, 640, W, 10, WH, .8); for (let x = 0; x < W; x += 22) line(x, 650, x, 780, 1.5, WH, .25); rect(0, 780, W, 4, WH, .5);
  // hand holds the ball; three bounces on the beats, the toss, the ball hangs as the voice comes in
  const hx = CX, hy = 1560, bounces = [b(25), b(26), b(27)], toss = b(28), hitT = S(0);
  let by = hy - 170, r = 120;
  for (const t0 of bounces) if (t >= t0 - BEAT / 2 && t < t0 + BEAT / 2) { const p = (t - (t0 - BEAT / 2)) / BEAT; by = hy - 170 + 420 * Math.sin(p * Math.PI) }
  if (t >= toss) { const p = seg(t, toss, hitT - toss); by = lerp(hy - 170, 360, eOut(p)); r = lerp(120, 95, p) }
  const handY = hy + (t >= toss ? 60 * eOut(seg(t, toss, .3)) : 0) + 30 * bounces.reduce((a, t0) => a + Math.exp(-Math.abs(t - t0) * 12), 0);
  ball(hx, by, r, t * (t >= toss ? 2 : 6), {});
  hand(hx, handY, 1.15, 0, 'cup');
  const lab = seg(t, b(24), .3) * (1 - seg(t, hitT - .1, .15)); txt('SERVE', 70, 200, { size: 90, fam: EN, col: OR, alpha: lab, tr: .08 }); txt('#01', W - 70, 200, { size: 90, fam: EN, col: WH, al: 'right', alpha: lab, outline: true, lw: 3 });
}

// ================= V1 31.9 - 60.55: rally 1. The court from above, our side below the net, theirs above. Each phrase is a hit =================
const RALLY = () => [
  { i: 0, ca: 0, cb: 9, p0: [110, 1330], p1: [960, 820], h: 230, size: 108, tilt: .25, hide: S(1) + .05 },                                   // serve
  { i: 0, ca: 9, cb: 14, p0: [900, 620], p1: [220, 520], h: 200, size: 124, outline: true, tilt: .25, hide: S(1) + .6 },                     // receive: 約束 not made (outline)
  { i: 1, ca: 0, cb: 7, p0: [220, 330], p1: [860, 300], h: 180, size: 112, hide: S(2) - .1 },                                     // set
  { i: 1, ca: 7, cb: 10, p0: [820, 250], p1: [420, 1440], h: 0, size: 170, col: OR, tilt: .15, hide: S(2) - .1 },                   // spike across the net
];
function V1(t) {
  if (t >= S(2) - .35 && t < S(4) - .2) return V1sun(t);
  if (t >= S(4) - .2) return V1gym(t);
  fill(BK); const drift = (t - S(0)) * 4;
  g.save(); g.translate(CX, CY); g.rotate(-.02 + drift * .0012); g.scale(1.02, 1.02); g.translate(-CX, -CY);
  courtTop(CX, CY, 96, { floorA: .55, netWob: [S(1) + 2.46].reduce((a, t0) => a + (t > t0 ? Math.exp(-(t - t0) * 6) * Math.sin((t - t0) * 30) : 0), 0) });
  g.restore();
  rect(0, 0, W, H, BK, .25);
  for (const a of RALLY()) writeArc(t, a.i, a);
  // the serve's hit (flash) and the spike's impact
  impactFrame(t, S(0) - .02); flash(t, cT(1, 9) + .2, OR, .2, .5);
}
// the sun is an orange sitting on the net tape (the horizon), and a bite is taken on かじる
function V1sun(t) {
  const up = eIO(seg(t, S(2) - .35, .7)), hor = 1000;
  const sky = g.createLinearGradient(0, 0, 0, hor); sky.addColorStop(0, LILAC); sky.addColorStop(.55, PINK); sky.addColorStop(1, PEACH); g.fillStyle = sky; g.fillRect(0, 0, W, hor);
  const fl = g.createLinearGradient(0, hor, 0, H); fl.addColorStop(0, AMB); fl.addColorStop(1, AMB2); g.fillStyle = fl; g.fillRect(0, hor, W, H - hor);
  // the sun (an orange) rises behind the horizon
  const sr = 300, sy = hor + lerp(sr * 1.1, sr * .15, eOut(seg(t, S(2) - .2, 1.6))), bite = seg(t, cT(2, 7), .12);
  g.save(); g.beginPath(); g.rect(0, 0, W, hor); g.clip();
  const gl = g.createRadialGradient(CX, sy, sr * .6, CX, sy, sr * 2.6); gl.addColorStop(0, 'rgba(255,200,120,.7)'); gl.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = gl; g.fillRect(0, 0, W, hor);
  g.beginPath(); g.arc(CX, sy, sr, 0, 7);
  const og = g.createRadialGradient(CX - sr * .3, sy - sr * .35, sr * .1, CX, sy, sr); og.addColorStop(0, OR2); og.addColorStop(1, OR); g.fillStyle = og; g.fill();
  g.fillStyle = 'rgba(255,255,255,.18)'; for (let k = 0; k < 90; k++) { const a = R(k, 1) * 6.28, rr = Math.sqrt(R(k, 2)) * sr * .95; g.beginPath(); g.arc(CX + Math.cos(a) * rr, sy + Math.sin(a) * rr, 3, 0, 7); g.fill() }
  if (bite > 0) { g.fillStyle = sky; g.beginPath(); for (const [bx, by, br] of [[CX + sr * .78, sy - sr * .55, sr * .32], [CX + sr * .55, sy - sr * .82, sr * .3], [CX + sr * .93, sy - sr * .2, sr * .26]]) { g.moveTo(bx + br * bite, by); g.arc(bx, by, br * bite, 0, 7) } g.fill() }   // the bite
  // rays on 光 / 眩しくて
  const ray = seg(t, cT(3, 5) - .1, .6); if (ray > 0) { g.save(); g.translate(CX, sy); g.rotate(t * .12); g.fillStyle = `rgba(255,246,236,${.28 * ray})`; for (let k = 0; k < 14; k++) { g.rotate(Math.PI * 2 / 14); g.beginPath(); g.moveTo(sr * 1.05, -18); g.lineTo(sr * 3.2, -70); g.lineTo(sr * 3.2, 70); g.lineTo(sr * 1.05, 18); g.fill() } g.restore() }
  g.restore();
  rect(0, hor - 7, W, 14, WH);                                                              // the net tape = the horizon
  for (let x = 0; x < W; x += 24) line(x, hor + 7, x, hor + 150, 1.5, WH, .3); rect(0, hor + 150, W, 5, WH, .6);
  writeArc(t, 2, { ca: 0, cb: 7, p0: [150, 560], p1: [930, 560], h: 200, size: 116, hide: S(3) - .15 }, { ball: false });
  writeArc(t, 2, { ca: 7, cb: 13, p0: [170, hor - 70], p1: [910, hor - 70], h: 0, size: 128, col: BK, hide: S(3) - .15 }, { ball: false });
  writeArc(t, 3, { ca: 0, cb: 6, p0: [170, 1230], p1: [900, 1180], h: 70, size: 124, col: WH, hide: S(4) - .3 }, { ball: false });
  const bl = seg(t, cT(3, 6) - .1, .5); if (bl > 0) { g.save(); g.shadowColor = WH; g.shadowBlur = 60 * bl; jline(t, 3, 6, 10, CX, 1520, 190, { col: WH, rev: 'grow', hide: S(4) - .3 }); g.restore() }
  if (up < 1) rect(0, 0, W, H, BK, 1 - up);
}
// back in the gym: sweat, voices, shoulders slapped, laughing and crying
function V1gym(t) {
  fill(NAVY); const tin = eOut(seg(t, S(4) - .2, .5)); g.save(); g.translate(0, (1 - tin) * -H);
  courtTop(CX, 1900, 110, { floorA: .5, net: false });
  // L4 sweat: each char drops in and then slides down slowly like a drop
  if (t < S(5) - .1) { const C = chars(4);
    for (let k = 0; k < 7; k++) { const G = C[k], x = 150 + k * 128, yl = 560 + k * 14; if (t < G.t - .3) continue;
      const y = t < G.t ? fall(t, G.t - .3, G.t, 200, yl) : yl + 30 * (t - G.t); lettering(x, y, () => { txt(G.c, 8, 10, { size: 130, fam: JP, col: BK, al: 'center', alpha: .5 }); txt(G.c, 0, 0, { size: 130, fam: JP, col: k === 5 ? OR : WH, al: 'center' }) });
      if (k === 5) for (let d = 0; d < 3; d++) { const dt = (t - G.t - d * .5); if (dt < 0) continue; const dy = yl + 40 + dt * dt * 900; if (dy > H) continue; g.fillStyle = WH; g.globalAlpha = .8; g.beginPath(); g.arc(x, dy, 14, 0, Math.PI); g.lineTo(x, dy - 34); g.closePath(); g.fill(); g.globalAlpha = 1 } }
    const v = cT(4, 10); for (let k = 0; k < 4; k++) { const d = t - v - k * .18; if (d > 0 && d < 1.4) ring(CX, 1220, 90 + d * 520, 10 * (1 - d / 1.4), OR, 1 - d / 1.4) }
    jline(t, 4, 7, 11, CX, 1260, 150, { col: WH }) }
  // L5 two hands slap on 叩 (impact), then 笑いあって / 泣いて
  else { const hit = S(5), s = eOut(seg(t, hit - .35, .35)), rec = t > hit ? MO.springStep(t - hit, { damping: 7, stiffness: 200 }) : 0, off = t < hit ? 1 - s : .12 * (1 - rec) * 0 + .03 * Math.sin((t - hit) * 20) * Math.exp(-(t - hit) * 5);
    hand(lerp(-200, 430, s) - off * 40, 820, 1.25, .5, 'open', { col: OR, line: BK }); hand(lerp(1280, 650, s) + off * 40, 820, 1.25, -.5, 'open', { col: WH, line: BK });
    if (t > hit) { const d = t - hit; if (d < .5) for (let k = 0; k < 12; k++) { const a = k / 12 * 6.28, r0 = 70 + d * 700; line(CX + Math.cos(a) * r0, 640 + Math.sin(a) * r0, CX + Math.cos(a) * (r0 + 60), 640 + Math.sin(a) * (r0 + 60), 8, WH, 1 - d * 2) } }
    jline(t, 5, 0, 6, CX, 1240, 150, { col: WH });
    jline(t, 5, 6, 11, 380, 1500, 120, { col: OR }); jline(t, 5, 11, 14, 780, 1640, 120, { col: WH }) }
  g.restore();
  impactFrame(t, S(5));
}

// ================= P1 60.55 - 70.5: the approach. The camera tilts up to the sky; vertical lines climb; 羽ばたいていく lifts off =================
function P1(t) {
  const up = t - 60.3, sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, NAVY); sky.addColorStop(.45, LILAC); sky.addColorStop(.75, PINK); sky.addColorStop(1, OR); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  // the court drops away below as we look up
  const drop = eIn(seg(t, 60.3, .9)); if (drop < 1) { g.save(); g.translate(0, drop * 1400); rect(0, 1000, W, 920, AMB); rect(0, 993, W, 14, WH); g.restore() }
  // passing cloud streaks = rising
  g.save(); g.fillStyle = 'rgba(255,246,236,.28)'; for (let k = 0; k < 16; k++) { const y = ((R(k, 1) * 2400 + up * (240 + R(k, 2) * 300)) % 2400) - 240, x = R(k, 3) * W; g.beginPath(); g.ellipse(x, y, 160 + R(k, 4) * 200, 14 + R(k, 5) * 16, 0, 0, 7); g.fill() } g.restore();
  // vertical lines (Japanese is written top to bottom): 明日へ向かう right, オレンジ色の空へ left
  const col = (i, a, b, x, y0, step, size, c, hide) => { const C = chars(i); for (let k = a; k < b; k++) { const G = C[k], p = seg(t, G.t - .05, .25); if (p <= 0) continue; const out = hide ? 1 - seg(t, hide, .4) : 1, y = y0 + (k - a) * step + (1 - eOut(p)) * 80 - (t - G.t) * 22;
    lettering(x, y, () => { txt(G.c, 8, 10, { size, fam: JP, col: BK, al: 'center', alpha: .35 * p * out }); txt(G.c, 0, 0, { size, fam: JP, col: c, al: 'center', alpha: p * out }) }) } };
  if (t < S(7) - .1) { col(6, 0, 6, 770, 380, 150, 140, WH, S(7) - .3); col(6, 6, 14, 330, 520, 150, 140, OR, S(7) - .3) }
  // 羽ばたいていく: each char lifts off and sways upward like a feather; the ball rises (the jump)
  if (t > S(7) - .2) { const C = chars(7); for (let k = 0; k < 7; k++) { const G = C[k], p = seg(t, G.t - .05, .25); if (p <= 0) continue; const f = Math.max(0, t - G.t - .5), x = 150 + k * 130 + Math.sin(f * 3 + k) * 40 * f, y = 1100 - f * f * 90 - f * 60;
      lettering(x, y, () => { g.rotate(Math.sin(f * 2.5 + k) * .3 * Math.min(1, f)); txt(G.c, 0, 0, { size: 136, fam: JP, col: WH, al: 'center', alpha: p }) }) }
    const bp = seg(t, S(7), 70.5 - S(7)); ball(CX, lerp(1700, 430, eOut(bp)), lerp(70, 140, bp), t * 3, { sq: .1 * (1 - bp), ang: -Math.PI / 2 }) }
}

// ================= C1A 70.5 - 88.2: hang time (あと1秒だけ), 今 circled, then the spike: きっと =================
function C1A(t) {
  if (t >= S(10) - .05) return C1spike(t);
  const tt = MO.posterize(t, 8);                                                               // the held, anime "hang" frames
  const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, OR); sky.addColorStop(1, PEACH); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  focusLines(tt, CX, 430, { a: .35, col: WH, speed: 1.2, r0: 220 });
  // the ball hangs at the top; sweat drops frozen around it
  ball(CX, 430 + Math.sin(tt * 2) * 6, 150, tt * .6, {});
  for (let k = 0; k < 14; k++) { const a = R(k, 1) * 6.28, r = 260 + R(k, 2) * 260, x = CX + Math.cos(a) * r, y = 430 + Math.sin(a) * r * .8 + Math.sin(tt * 2 + k) * 4; g.fillStyle = WH; g.globalAlpha = .75; g.beginPath(); g.arc(x, y, 10, 0, Math.PI); g.lineTo(x, y - 24); g.closePath(); g.fill(); g.globalAlpha = 1 }
  if (t < S(9) - .1) {
    // the clock: 1.00 counts down, snaps back to 1.00 on もう (one more second)
    const back = cT(8, 6), c0 = t < back ? 1 - .5 * seg(tt, S(8), back - S(8)) : 1 - .7 * seg(tt, back, E(8) - back), v = c0.toFixed(2);
    const pop = MO.springStep(t - (t < back ? S(8) : back), { damping: 8, stiffness: 280 });
    for (const d of [-1, 1]) txt(v, CX, 1180 + d * 330, { size: 360, fam: EN, col: WH, outline: true, lw: 3, al: 'center', alpha: .35 });
    g.save(); g.translate(CX, 1180); g.scale(pop, pop); txt(v, 10, 12, { size: 360, fam: EN, col: BK, al: 'center', alpha: .4 }); txt(v, 0, 0, { size: 360, fam: EN, col: WH, al: 'center' }); g.restore();
    txt('SEC', CX + 330, 1180, { size: 60, fam: EN, col: BK, tr: .2 });
    jline(tt, 8, 0, 6, CX, 760, 130, { col: BK, shadow: false }); jline(tt, 8, 6, 12, CX, 1530, 130, { col: BK, shadow: false });
  } else {
    jline(tt, 9, 0, 3, CX, 820, 90, { col: BK, shadow: false }); jline(tt, 9, 3, 9, CX, 990, 120, { col: WH });
    jline(tt, 9, 9, 11, CX, 1410, 330, { col: BK, shadow: false, rev: 'grow' });
    // a marker circle drawn around 今
    const cp = eOut(seg(t, cT(9, 9) + .1, .5)); if (cp > 0) { const P = []; for (let k = 0; k <= 60; k++) { const a = -2.2 + k / 60 * 6.28 * 1.12, rr = 1 + .06 * Math.sin(k * .7); P.push([CX - 110 + Math.cos(a) * 190 * rr, 1290 + Math.sin(a) * 170 * rr]) }
      const pt = MO.path(P, { tension: .5 }); g.save(); g.strokeStyle = WH; g.lineWidth = 16; g.lineCap = 'round'; pt.draw(g, 0, cp); g.stroke(); g.restore() }
  }
}
function C1spike(t) {
  const hit = S(10), d = t - hit;
  fill(BK); if (d < .45) rect(0, 0, W, H, OR, 1 - d / .45);
  streaks(t, -.62, { a: .35, n: 50, speed: 3600 });
  // KITTO in outline, huge, behind; きっと slammed diagonally from the top right
  g.save(); g.translate(CX, CY); g.rotate(-.3);
  for (let k = -2; k <= 2; k++) txt('KITTO', ((t - hit) * 160 * (k % 2 ? 1 : -1)) % 300, k * 300 + 110, { size: 330, fam: EN, col: k ? WH : OR, outline: !!k, lw: 3, al: 'center', alpha: k ? .25 : .9 * seg(t, hit, .2) });
  const s = t < hit ? 0 : MO.springStep(d, { damping: 11, stiffness: 420 }), sx = lerp(900, 0, eOut(clamp(d / .12))), sy = lerp(-900, 0, eOut(clamp(d / .12)));
  lettering(sx, sy - 40, () => { const C = chars(10); C.forEach((G, k) => { const p = seg(t, G.t - .05, .12); if (p <= 0) return; txt(G.c, -300 + k * 300 + 14, 16, { size: 300, fam: JP, col: BK, al: 'center', alpha: .6 }); txt(G.c, -300 + k * 300, 0, { size: 300 * (0.7 + .3 * s), fam: JP, col: WH, al: 'center' }) }) });
  g.restore();
  // the ball smashed down the diagonal
  if (d > -.2 && d < .6) { const p = clamp((d + .2) / .8); ballTrail(t, tt => { const q = clamp((tt - hit + .2) / .8); return [lerp(1100, -100, q), lerp(-100, 1500, q)] }, 120, { n: 8, dt: .012 }) }
  // after the shout: the instrumental; the court from above with the spike's line drawn, a dig sends the ball back up
  if (t > 82.9) { const a = seg(t, 82.9, .4); g.globalAlpha = a; courtTop(CX, CY, 88, { floorA: .8 }); g.globalAlpha = 1;
    const arr = eOut(seg(t, 83.2, .6)); g.save(); g.strokeStyle = OR; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(CX + 200, CY - 500); g.lineTo(lerp(CX + 200, CX - 180, arr), lerp(CY - 500, CY + 560, arr)); g.stroke(); g.restore();
    txt('SPIKE', 70, 200, { size: 120, fam: EN, col: OR, alpha: a });
    const dig = onBeat(Math.ceil(beatN(85.8))), dd = t - dig; if (dd > 0) { txt('DIG!', CX - 180, CY + 760, { size: 140 * MO.springStep(dd, { damping: 8, stiffness: 300 }), fam: EN, col: WH, al: 'center' });
      ball(CX - 180 + dd * 60, CY + 560 - dd * 900 + dd * dd * 120, 70, t * 8, {}) } else if (arr > 0) ball(lerp(CX + 200, CX - 180, arr), lerp(CY - 500, CY + 560, arr), 70, t * 8, {}) }
  impactFrame(t, hit - .01);
}
