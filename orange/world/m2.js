/* ORANGE M2 (60.5 - 108): up through the ceiling lights into the sky (明日へ向かう, 空へ, 羽ばたいていく), the hang at the top of the
   jump (a 1-second timer pressed +1秒 twice, 今 taken by a shutter), the dive down with きっと onto their court, the scoreboard,
   the jersey on the bench (a big dream copied onto a small back), set point, an おみくじ, and the big reveal: 楽しかったよね,
   全てが — every line written so far, ticked. Shared objects for later acts too: the scoreboard and the timer. */

// ---------------------------------------------------------------- shared objects
// the scoreboard on the north wall: two flip cards a side; SCORE = [time, home, away, label]
const SCORE = [[0, '00', '00', ''], [84.4, '01', '00', 'NICE KILL!'], [94.47, '24', '23', 'SET POINT'], [210.3, '24', '23', 'MATCH POINT'], [213.5, '25', '23', '']];   // GAME SET is stamped where the ball lands (m4)
const SB = ANIME ? { x: 6, y: -1904, s: .6 } : { x: 0, y: -2030, s: 1 };           // anime: over the painted scoreboard panel
const JER = ANIME ? { x: 760, y: -620 } : { x: 1560, y: 260 }, OMI = ANIME ? { x: -850, y: -420 } : { x: -1650, y: -430 };   // the jersey, the おみくじ
const KOKO = ANIME ? SB.y + 520 : SB.y + 560;                                       // ここまで来たんだよ, under the scoreboard
function scoreAt(t) { let k = 0; for (let j = 0; j < SCORE.length; j++) if (t >= SCORE[j][0]) k = j; return [SCORE[k], SCORE[Math.max(0, k - 1)]] }
// o: { dx, dy } to place another board (the arena's), until: freeze the score after that time
function scoreboardObj(t, o = {}) { const tt = Math.min(t, o.until ?? 1e9), [cur, prev] = scoreAt(tt), t0 = cur[0], x = SB.x + (o.dx ?? 0), y = SB.y + (o.dy ?? 0), sc = o.s ?? (o.dx || o.dy ? 1 : SB.s); if (!vis(x, y, 700 * sc)) return; g.save(); g.translate(x, y); g.scale(sc, sc); g.translate(-x, -y);
  rr(x - 560 + 16, y - 230 + 20, 1120, 440, 30, 'rgba(0,0,0,.4)'); rr(x - 560, y - 230, 1120, 440, 30, '#15161E', { line: '#000', lw: 10 });
  txt('HOME', x - 280, y - 150, { size: 64, fam: BG, col: ORG, al: 'center', tr: .1 }); txt('AWAY', x + 280, y - 150, { size: 64, fam: BG, col: '#FFFFFF', al: 'center', tr: .1 });
  for (let k = 0; k < 2; k++) { flipCard(x - 380 + k * 200, y + 40, 180, 250, prev[1][k], cur[1][k], t0 + k * .08, tt); flipCard(x + 180 + k * 200, y + 40, 180, 250, prev[2][k], cur[2][k], t0 + .16 + k * .08, tt) }
  txt(':', x, y + 110, { size: 200, fam: BG, col: '#FFFFFF', al: 'center', alpha: Math.floor((t - B0) / BEAT) % 2 ? 1 : .4 });
  if (cur[3] && tt > t0) stampIn(tt, t0 + .2, x, y + 300, -.04, () => sticker(cur[3], 0, 0, 120, { fam: BG, col: cur[3] === 'GAME SET' ? YEL : ORG, line: INK, lwk: .1 }), { from: 1.8 }); g.restore() }
// the 1-second timer: a ring around whatever sits inside it; p = remaining (0..1); the +1秒 button pressed on `clicks`
function timerObj(t, x, y, s, p, o = {}) { g.save(); g.translate(x, y); g.scale(s, s);
  g.save(); g.lineCap = 'round'; ring(0, 0, 360, 40, 'rgba(30,30,40,.55)'); g.strokeStyle = o.col ?? ORG; g.lineWidth = 40; g.beginPath(); g.arc(0, 0, 360, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clamp(p)); g.stroke(); g.restore();
  for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; line(Math.cos(a) * 410, Math.sin(a) * 410, Math.cos(a) * 440, Math.sin(a) * 440, 10, '#FFFFFF', .8) }
  const v = (Math.max(0, p) * (o.max ?? 1)).toFixed(2); sticker(v, 0, 560, 170, { fam: BG, col: '#FFFFFF', line: INK, lwk: .08 }); txt('SEC', 260, 600, { size: 60, fam: BG, col: YEL });
  if (o.button) { const pz = (o.clicks ?? []).some(c => t >= c && t < c + .15) ? .88 : 1; g.save(); g.translate(430, 820); g.scale(pz, pz); disc(0, 0, 120, o.dead ? GREY : ORG); ring(0, 0, 120, 8, INK); txt('+1秒', 0, 22, { size: 70, fam: BGJ, col: '#FFFFFF', al: 'center', upper: false }); g.restore() }
  g.restore() }

// ---------------------------------------------------------------- the sky strip (60.9 - 80.55): y = 0 is the gym ceiling, up is negative
const SKYK = camKeys([[60.85, 0, 250, .9, 0, .01], [61.6, 0, -900, 1.0, 0, .55], [63.3, 0, -1500, 1.0, 0, .9], [65.2, 0, -2800, 1.0, .03, .9], [67.1, 0, -3700, 1.0, -.03, .7],
  [69.4, 0, -4700, 1.0, 0, .7], [70.45, 0, -5600, .95, 0, .35], [75.2, 0, -5640, 1.02, 0, 1.5], [79.4, 0, -5700, 1.12, 0, 1.0], [79.95, 0, -5900, 1.2, 0, .2], [80.4, 0, -2200, .8, 0, .12]]);
const CLOUDS_SKY = Array.from({ length: 16 }, (_, k) => ({ id: ['cl_far', 'cl_mid', 'cl_puff', 'cl_near'][k % 4], x: (R(k, 91) - .5) * 1800, y: -300 - k * 420 - R(k, 92) * 200, w: 1300 + R(k, 93) * 900, d: [.55, .8, 1.1, 1.5][k % 4], a: [.65, .8, .85, .55][k % 4] }));
function skyBG(t) {
  const gr = g.createLinearGradient(0, 600, 0, -7000); gr.addColorStop(0, '#FFB27A'); gr.addColorStop(.25, '#F58FB0'); gr.addColorStop(.55, '#B9A3F0'); gr.addColorStop(.8, '#6F8FE6'); gr.addColorStop(1, '#3E5BB8'); g.fillStyle = gr; g.fillRect(-1600, -7600, 3200, 9300);
  cover('sky_clean', -1600, -7600, 3200, 2400, { alpha: .35 });
  // the gym ceiling we rise out of: lights, then their bloom
  g.save(); g.beginPath(); g.rect(-1600, -200, 3200, 1900); g.clip(); cover('gym_ceiling', -1600, -200, 3200, 1900, { fy: .5 }); g.restore();
  const gr2 = g.createLinearGradient(0, -260, 0, 60); gr2.addColorStop(0, 'rgba(255,240,215,0)'); gr2.addColorStop(1, 'rgba(255,240,215,.95)'); g.fillStyle = gr2; g.fillRect(-1600, -260, 3200, 320);
}
// clouds in front of and behind the lyrics, with parallax (screen space, from the camera)
function skyClouds(t, c, front) { for (const C of CLOUDS_SKY) { if ((C.d > 1) !== front) continue; const im = PL[C.id]; if (!im) continue;
  const sy = CY + (C.y - c.y) * c.zoom * C.d, sx = CX + (((C.x + t * 40 * C.d) % 2400 + 3600) % 2400 - 1200) * c.zoom * C.d, w = C.w * c.zoom * C.d, h = w * im.height / im.width; if (sy < -h || sy > H + h) continue;
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = C.a; if (front) g.filter = 'blur(4px)'; g.drawImage(im, sx - w / 2, sy - h / 2, w, h); g.restore() } }
function skyLyrics(t) {
  // 明日へ向かう — with a small weather card for tomorrow
  lockup(t, { x: -40, y: -1480, rows: [{ i: 6, a: 0, b: 2, size: 330, st: 'heavy', ent: 'fly' }, { i: 6, a: 2, b: 6, size: 120, st: 'thin', ent: 'rise', gap: 10 }] });
  if (t > S(6) - .2) { const s = MO.springStep(t - S(6) - .3, { damping: 11, stiffness: 220 }); g.save(); g.translate(330, -1150); g.rotate(.08); g.scale(s, s); card(-170, -120, 340, 240, 30, '#FFFFFF', { sh: 10 });
    txt('TOMORROW', 0, -62, { size: 40, fam: BG, col: INK, al: 'center', tr: .08 }); disc(-80, 20, 44, YEL); ring(-80, 20, 44, 5, INK); for (let k = 0; k < 8; k++) { const a = k / 8 * 6.28 + t; line(-80 + Math.cos(a) * 58, 20 + Math.sin(a) * 58, -80 + Math.cos(a) * 76, 20 + Math.sin(a) * 76, 6, ORG) }
    txt('26°', 70, 52, { size: 80, fam: BG, col: ORG, al: 'center' }); g.restore() }
  // オレンジ色の空へ
  lockup(t, { x: 0, y: -2780, rows: [{ i: 6, a: 6, b: 12, size: 160, st: 'round', ent: 'fly' }] });
  lockup(t, { x: 40, y: -3110, rot: -.05, rows: [{ i: 6, a: 12, b: 14, size: 380, st: 'heavyO', ent: 'stamp' }] });
  // 羽ばたいていく: the chars flap and fly up with birds and a paper plane
  const C = chars(7); for (let k = 0; k < 7; k++) { const G = C[k]; if (t < G.t - .03) continue; const d = Math.max(0, t - G.t - .35), x = -450 + k * 150 + (k - 3) * 60 * d, y = -4250 - d * d * 220 - d * 160;
    const flap = .55 + .45 * Math.abs(Math.cos((t - G.t) * 11)); stampIn(t, G.t - .03, x, y, (R(k, 2) - .5) * .2, () => { g.scale(1, flap); sticker(G.c, 0, 0, 170, { fam: MJ, col: '#FFFFFF', line: INK, lwk: .14 }) }, { from: 1.5 }) }
  for (let k = 0; k < 6; k++) { const t0 = S(7) + k * .35, d = t - t0; if (d > 0 && d < 4) birdV(-600 + d * (260 + k * 30), -3900 - d * (240 + k * 20) - k * 60, .9 + k * .08, Math.sin((t + k) * 9)) }
  const pl = seg(t, 68.6, 1.8); if (pl > 0 && pl < 1) paperPlane(lerp(-700, 700, pl), lerp(-3800, -4900, pl), 1.6, -.6);
  // the hang: the ball at the top inside the 1-second timer; +1秒 pressed twice
  if (t > 69.6) { const tt = MO.posterize(t, 12), clicks = [cT(8, 6) - .02, cT(8, 8) - .02], last = clicks.filter(c => c <= t).pop() ?? S(8) - .1, p = clamp(1 - (tt - last) / 2.1);
    const s = MO.springStep(t - 69.8, { damping: 10, stiffness: 180 }); vball(0, -5700 + 8 * Math.sin(tt * 2), 520 * Math.min(1, s), tt * .5);
    if (t > S(8) - .3) timerObj(t, 0, -5700, .95 * Math.min(1, MO.springStep(t - S(8) + .3, { damping: 11, stiffness: 220 })), t > S(9) - .3 ? .02 : p, { button: t < S(9) - .2, clicks });
    if (t > S(8) - .2 && t < S(9) - .1) { lockup(t, { x: 0, y: -6280, rows: [{ i: 8, a: 0, b: 6, size: 150, st: 'heavy', ent: 'stamp' }] }); lockup(t, { x: -100, y: -4960, rows: [{ i: 8, a: 6, b: 12, size: 140, st: 'heavyY', ent: 'stamp' }] });
      if (t < S(9) - .2) { const cp = eIO(seg(t, S(8) + .7, clicks[0] - S(8) - .85)); cursor(t, lerp(700, 420, cp), lerp(-4400, -4890, cp), { click: t < clicks[1] - .2 ? clicks[0] : clicks[1], s: 2.6 }) } }
    // なんて 惜しむような 今が — 今 framed by the focus brackets, the shutter keeps it
    if (t > S(9) - .1) { lockup(t, { x: -330, y: -6330, al: 'left', rows: [{ i: 9, a: 0, b: 3, size: 110, st: 'handW', ent: 'type' }] }); lockup(t, { x: 0, y: -6180, rows: [{ i: 9, a: 3, b: 9, size: 150, st: 'heavy', ent: 'rise' }] });
      const shot = cT(9, 9); if (t > shot - .6) { const af = 1 + .12 * Math.exp(-(t - shot + .6) * 5); g.save(); g.translate(0, -5700); g.scale(af, af); g.strokeStyle = YEL; g.lineWidth = 12; for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(sx * 330, sy * 230); g.lineTo(sx * 330, sy * 330); g.lineTo(sx * 230, sy * 330); g.stroke() } g.restore() }
      lockup(t, { x: 0, y: -5700, rows: [{ i: 9, a: 9, b: 10, size: 420, st: 'heavy', ent: 'stamp' }] }); lockup(t, { x: 300, y: -5380, rows: [{ i: 9, a: 10, b: 11, size: 160, st: 'handW', ent: 'type' }] });
      if (t > shot) stampIn(t, shot, 260, -6050, .15, () => sticker('カシャッ', 0, 0, 130, { fam: SFX, col: YEL, line: INK, lwk: .12 }), { from: 1.8 }) }
    // きっと: き stamped at the top as the spike begins
    if (t > S(10) - .05) lockup(t, { x: 0, y: -5980, rows: [{ i: 10, a: 0, b: 1, size: 420, st: 'heavyO', ent: 'stamp' }] });
  }
}
function skyOverlay(t, c) { skyClouds(t, c, true); flash(t, cT(9, 9), '#FFFFFF', .3, 1); flash(t, 60.88, '#FFF6E6', .45, 1);
  if (t > 79.95) streaks2(t, Math.PI / 2, { a: .7, n: 50, speed: 5200 }) }

// ---------------------------------------------------------------- back on the court (80.55 - 108)
const PK = [80, -520];                                                               // where our spike lands: their libero digs it
const TOPK2 = camKeys([
  [80.45, PK[0], PK[1] - 200, 2.0, -.12, .01], [80.85, PK[0], PK[1] - 260, 1.05, -.05, .25],
  ...(ANIME ? [[82.75, SB.x, SB.y + 400, 1.15, 0, .16], [86.6, SB.x, SB.y + 420, 1.2, 0, 1.0]] : [[82.75, SB.x, SB.y + 100, .82, 0, .16], [86.6, SB.x, SB.y + 120, .86, 0, 1.0]]),   // the scoreboard: 01 - 00
  [87.95, JER.x - 80, JER.y - 230, 1.0, 0, .16], [93.9, JER.x - 80, JER.y - 240, 1.08, 0, 1.2],         // the bench: the jersey
  ...(ANIME ? [[S(12) - .14, SB.x, SB.y + 480, 1.05, 0, .15], [97.6, SB.x, SB.y + 500, 1.1, 0, 1.0]] : [[S(12) - .14, SB.x, SB.y + 200, .8, 0, .15], [97.6, SB.x, SB.y + 230, .86, 0, 1.0]]),   // set point
  [S(13) - .14, OMI.x, OMI.y, 1.05, .12, .16], [102.9, OMI.x, OMI.y, 1.12, .12, 1.0],                   // the おみくじ
  ...(ANIME ? [[S(14) - .1, -62, 100, .6, 0, .35], [S(14) + 1.6, -62, 120, .44, -.02, .6], [cT(14, 7) - .1, -62, 180, .4, 0, .5]]
    : [[S(14) - .1, 0, -350, .5, 0, .35], [S(14) + 1.6, 0, -350, .3, -.02, .6], [cT(14, 7) - .1, 0, -300, .22, 0, .5]])]);   // the reveal
function topM2(t) {
  if (t < 80.4) return;
  // the spike lands where their libero digs it; きっと stamped; the long vowel multiplies as shock rings
  const hit = 80.6;
  if (t < hit + .05) { const p = eIn(seg(t, 80.35, hit - 80.35)); ballTop(t, { x: lerp(-600, PK[0], p), y: lerp(-1500, PK[1], p), h: lerp(14, .2, p) }) }
  else { const d = t - hit; burst(t, PK[0], PK[1], 300 * eOut(clamp(d / .12)) * (1 - seg(d, 1.2, .4)), '#FFFFFF', { n: 14, line: INK, lw: 8 }); if (d < 1.2) ballTop(t, { x: PK[0] - d * 300, y: PK[1] + d * 200, h: .2 + 9 * d - 4 * d * d }) }
  if (t > hit) stampIn(t, hit, PK[0] + 260, PK[1] + 260, .1, () => sticker('DIG!!', 0, 0, 150, { fam: BG, col: SKY, line: INK, lwk: .1, alpha: fadeOld(83)(t) }), { from: 2 });
  lockup(t, { x: 0, y: -900, alpha: fadeOld(87), rows: [{ i: 10, a: 0, b: 3, size: 330, st: 'heavyO', ent: 'stamp' }] });
  const t0 = cT(10, 2) + .25; if (t > t0) { const n = Math.min(14, Math.floor((t - t0) / .11) + 1), fa = fadeOld(87)(t); for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (k - 6.5) * .26, r = 560 + (k % 2) * 120, s = MO.springStep(t - t0 - k * .11, { damping: 9, stiffness: 400 });
      g.save(); g.translate(Math.cos(a) * r, -900 + Math.sin(a) * r * .55 + 260); g.rotate(a + Math.PI / 2); g.scale(s, s); sticker('ー', 0, 0, 180, { fam: SFX, col: INK, line: '#FFFFFF', lwk: .1, alpha: fa }); g.restore() } }
  // the jersey on the bench: a big dream copied onto a small back
  if (t > 87.6) { const s = MO.springStep(t - 87.8, { damping: 11, stiffness: 200 }); jerseyObj(JER.x, JER.y, .95 * Math.min(1.05, s), -.06, 1);
    lockup(t, { x: JER.x, y: JER.y - 100, alpha: fadeOld(S(12) - .1), rows: [{ i: 11, a: 0, b: 6, size: 70, st: 'thin', ent: 'type' }] });
    lockup(t, { x: JER.x - 70, y: JER.y - 590, rot: -.04, alpha: fadeOld(S(12) - .1), rows: [{ i: 11, a: 6, b: 11, size: 230, st: 'heavyO', ent: 'stamp' }, { i: 11, a: 11, b: 14, size: 110, st: 'thin', ent: 'rise', gap: 10 }] });
    const wsS = MO.springStep(t - (cT(11, 6) + .1), { damping: 10, stiffness: 220 }), pr = eIO(seg(t, cT(11, 9), cT(11, 13) - cT(11, 9) + .3));
    if (wsS > .01) win(JER.x, JER.y - 1020, 620, 300, 'COPY', { s: wsS, rot: .03, draw: (w, h) => { txt('大きな夢.zip  999 GB', 40, 70, { size: 34, w: 800, fam: RD, col: INK, upper: false }); txt('→ 小さな背中', 40, 120, { size: 30, w: 500, fam: RD, col: GREY, upper: false }); progress(40, 150, w - 80, 46, pr, { t }); txt(pr >= 1 ? 'DONE!' : Math.round(pr * 100) + '%', w - 40, 70, { size: 40, fam: BG, col: ORG, al: 'right' }) } }) }
  // ここまで来たんだよ — under the scoreboard
  lockup(t, { x: SB.x, y: KOKO, alpha: fadeOld(S(13) - .1), rows: [{ i: 12, a: 0, b: 4, size: 200, st: 'heavy', ent: 'fly' }, { i: 12, a: 4, b: 9, size: 120, st: 'thin', ent: 'rise', gap: 8 }] });
  // the おみくじ: a slip unrolls — 未来, small luck
  if (t > S(13) - .3) { const u = eOut(seg(t, S(13) - .1, .9)); g.save(); g.translate(OMI.x, OMI.y); g.rotate(.12);
    rr(-150, -520, 300, 1040 * u, 10, '#FFFDF6', { line: INK, lw: 6 }); if (u > .1) { rect(-150, -520, 300, 90, RED); txt('おみくじ', 0, -460, { size: 44, w: 800, fam: RD, col: '#FFFFFF', al: 'center', upper: false }) }
    if (u > .6) { txt('小吉', 0, -260, { size: 150, fam: MJ, col: INK, al: 'center', upper: false }); for (let k = 0; k < 6; k++) line(-110, -120 + k * 60, 110, -120 + k * 60, 4, GREY, .6) } g.restore();
    lockup(t, { x: OMI.x, y: OMI.y - 620, rot: .12, alpha: fadeOld(S(14)), rows: [{ i: 13, a: 0, b: 5, size: 120, st: 'thin', ent: 'rise' }, { i: 13, a: 5, b: 7, size: 260, st: 'heavyS', ent: 'stamp' }] });
    lockup(t, { x: OMI.x + 50, y: OMI.y + 690, rot: .12, alpha: fadeOld(S(14)), rows: [{ i: 13, a: 7, b: 15, size: 110, st: 'hand', col: '#FFFFFF', ent: 'type' }] }) }
  // 楽しかったよね, written across the whole court; 全てが — every line so far gets a tick
  lockup(t, { x: 0, y: -60, rot: -.32, alpha: fadeOld(108.3), rows: [{ i: 14, a: 0, b: 7, size: 320, st: 'heavy', ent: 'fly' }] });
  if (t > cT(14, 7) - .05) withA(fadeOld(108.3)(t), () => { CHECKS.forEach(([x, y], k) => { const t0 = cT(14, 7) + k * .07; if (t > t0) sketch([[x - 60, y], [x - 10, y + 60], [x + 90, y - 80]], t, { col: k % 2 ? YEL : RED, lw: 26, p: eOut(seg(t, t0, .2)), jit: 4 }) });
    lockup(t, { x: 0, y: 650, rows: [{ i: 14, a: 7, b: 10, size: 520, st: 'heavyY', ent: 'stamp' }] }) })
}
// where every earlier line sits (ticked on 全てが)
const CHECKS = [[200, 560], [TICKET.x, TICKET.y], [PHONE1.x, PHONE1.y], [PHONE2.x, PHONE2.y], [60, 1500], [-80, 300], [-30, -760], [-170, -330], [100, 230], [0, 780], [0, -600], [0, -900], [JER.x, JER.y], [SB.x, KOKO], [OMI.x, OMI.y]];
