/* ORANGE M1 (0 - 60.5): the world journey, one take.
   In the dark on a phone in the locker corner (ORANGE.exe loads the match) → START: the lights come on bank by bank while the
   camera pulls back over the gym → ORANGE stamped on our half (the O is the ball) → the ticket at the entrance → the team chat
   on the bench phone → the serve. The rally writes verse 1 on the court (the serve's line, the receive, the pass, the spike
   with three seals). The dig sends the ball up into the camera — the side strip: the ball sets like the sun and the horizon
   (the net tape) bites it, the gym's sunset light blows out, sweat slides on the floor, a voice. Back on the court: the high
   five, an emoji flood from the stands, and the camera pulls back over everything written so far. */

const bb = n => onBeat(n);                                                       // (the Y2K act 1 already owns b)
const PA = [60, 1180], PB = [-200, -700], PS = [-150, -130], PC = [200, 650];   // server, receive, setter, our dig
const PHONE1 = { x: -1650, y: 1880, r: -.12, s: .34 }, PHONE2 = { x: 1290, y: 160, r: -.45, s: .34 }, TICKET = { x: -1180, y: 1060, r: .32, s: .62 };
const THS = Math.atan2(PB[1] - PA[1], PB[0] - PA[0]);                            // the serve's direction: the camera rolls to it
const pAB = u => [lerp(PA[0], PB[0], u), lerp(PA[1], PB[1], u)], pSC = u => [lerp(PS[0], PC[0], u), lerp(PS[1], PC[1], u)];

// ---------------------------------------------------------------- lights: dark until START, then bank by bank toward the court
// the drop (172.6 - 174.1) switches them off again, their side first; the last chorus (181.62) brings them all back at once
const LIGHTS_ON = 181.62;
function lightLv(t) { const on = [9.72, 10.95, 12.2, 12.2, 13.1, 13.1], off = [174.1, 173.6, 173.1, 173.1, 172.6, 172.6];
  return on.map((t0, k) => { if (t >= LIGHTS_ON) return eOut(seg(t, LIGHTS_ON, .1)); const v = t < t0 ? 0 : eOut(seg(t, t0, .15)) * (1 - .5 * Math.exp(-(t - t0) * 9) * (Math.sin((t - t0) * 80) > 0 ? 1 : 0));
    return v * (1 - seg(t, off[k], .12)) }) }

// ---------------------------------------------------------------- the ball's rally over the court
const US = Array.from({ length: 9 }, (_, k) => .07 + k * .08);                 // where each char of さよならは言わない sits on the serve
function serveU(t) { const C = chars(0); if (t <= C[0].t) return US[0] * clamp((t - (C[0].t - .15)) / .15);
  for (let k = 0; k < 8; k++) if (t < C[k + 1].t) return lerp(US[k], US[k + 1], (t - C[k].t) / (C[k + 1].t - C[k].t));
  return lerp(US[8], 1, eIn(clamp((t - C[8].t) / (34.85 - C[8].t)))) }
function topBall(t) {
  if (t < bb(24)) return null;
  if (t < bb(28)) { const ph = ((t - bb(24)) / BEAT) % 1; return { x: PA[0], y: PA[1], h: .9 * Math.abs(Math.sin(ph * Math.PI)) } }
  if (t < S(0) - .15) { const p = seg(t, bb(28), S(0) - .15 - bb(28)); return { x: PA[0], y: PA[1], h: 3.3 * eOut(p) } }
  if (t < 34.85) { const u = serveU(t), [x, y] = pAB(u); return { x, y, h: 3.2 + 2.4 * Math.sin(u * Math.PI) - 3.0 * u } }
  if (t < S(1)) { const p = seg(t, 34.85, S(1) - 34.85); return { x: PB[0] + 40 * p, y: PB[1] + 60 * p, h: .2 + 4.2 * Math.sin(Math.min(1, p * 1.6) * Math.PI / 2) } }
  if (t < 39.1) { const u = seg(t, S(1), 39.1 - S(1)); return { x: lerp(PB[0] + 40, PS[0], u), y: lerp(PB[1] + 60, PS[1], u), h: 4.4 - 1.5 * u + 1.4 * Math.sin(u * Math.PI) } }
  if (t < cT(1, 7)) { const p = seg(t, 39.1, cT(1, 7) - 39.1); return { x: PS[0], y: PS[1], h: 2.9 + 2.4 * Math.sin(p * Math.PI) } }
  if (t < 40.9) { const u = seg(t, cT(1, 7), 40.9 - cT(1, 7)), [x, y] = pSC(u); return { x, y, h: lerp(3.3, .25, u) } }
  if (t < 41.3) { const p = seg(t, 40.9, .4); return { x: PC[0], y: PC[1], h: .25 + 120 * p ** 2.4 } }
  return null }

// ---------------------------------------------------------------- the camera over the court
const L0B = wp(PB[0], PB[1], 30, 330, THS);                                        // the receive's lockup sits below the landing spot on screen
function serveCam(t) { const bl = topBall(t) || { x: PA[0], y: PA[1] }; return { x: bl.x + Math.cos(THS) * 170, y: bl.y + Math.sin(THS) * 170, z: 1.05, r: THS } }
const TOPK = camKeys([
  [0, PHONE1.x, PHONE1.y, 2.75, PHONE1.r, .3],
  [9.72, -1480, 1760, 1.2, -.05, .35],                                           // START: pull back over the locker corner
  [10.95, -950, 1300, .64, 0, .4],
  [12.2, -480, 650, .47, 0, .4],
  [13.1, 0, 0, .38, 0, .3],                                                      // the whole gym, lit
  [13.6, 0, 560, .95, -.06, .12],                                                // whip down onto our half: ORANGE
  [16.6, 0, 560, 1.02, .03, 1.2],
  [bb(8) - .12, TICKET.x, TICKET.y, 1.6, TICKET.r, .14],
  [bb(12), TICKET.x + 30, TICKET.y + 10, 1.7, TICKET.r, 1.0],
  [bb(16) - .12, PHONE2.x, PHONE2.y, 2.7, PHONE2.r, .14],                        // dive into the team chat on the bench
  [bb(24) - .12, PA[0], PA[1] + 140, 1.45, 0, .14],                              // the service zone
  [bb(28), PA[0], PA[1] + 60, 1.65, 0, .6],
  ...followKeys(S(0) - .1, 34.8, serveCam, .1, .25),                              // follow the serve, rolled to its direction
  [34.95, (PB[0] + L0B[0]) / 2, (PB[1] + L0B[1]) / 2, 1.15, THS, .35],             // the receive
  [S(1) - .25, -170, -320, 1.05, 0, .3],                                          // roll back: the pass to the setter
  [cT(1, 7) - .2, 0, 230, .92, 0, .25],                                           // the spike down to our side
  [40.85, PC[0], PC[1], 1.35, 0, .12],
  [41.15, PC[0], PC[1], 2.6, 0, .08],                                             // the dig rushes up into the camera
  [55.9, 0, 380, 2.6, .3, .01], [56.15, 0, 430, 1.35, .08, .12],                // back on the court for the high five
  [58.3, 0, 330, 1.3, .05, .8],
  [cT(5, 6) - .05, 0, -520, .62, 0, .45],                                         // pull back: the stands and every line so far
  [60.4, 0, -330, .52, -.03, .8]]);

// ---------------------------------------------------------------- the court
function topWorld(t) {
  g.save(); g.fillStyle = '#0B0E15'; g.fillRect(-7000, -12500, 14000, 18000); g.fillStyle = dots('rgba(255,255,255,.07)', 300, 12); g.fillRect(-7000, -12500, 14000, 18000); g.restore();   // the map around the world
  floorTop(t, lightLv(t)); corridorFloor(t); arenaFloor(t); scoreboardObj(t, { until: 200 });
  // ORANGE painted on our half; it settles back to a floor logo once the ticket scene starts
  const ta0 = t < bb(8) ? 1 : 1 - seg(t, bb(8), .6), ta = t < REST ? ta0 : lerp(ta0, .85, eOut(seg(t, REST, 1.2)));
  [['O', -190, 250], ['R', 190, 250], ['A', -190, 560], ['N', 190, 560], ['G', -190, 870], ['E', 190, 870]].forEach(([c, x, y], k) =>
    stampIn(t, bb(k) - .02, x, y, (R(k, 8) - .5) * .2, () => { if (c === 'O') vball(0, 0, 270, (t - bb(0)) * 1.2, { alpha: ta }); else sticker(c, 0, 26, 380, { fam: BG, col: [null, ORG, '#FFFFFF', SKY, '#FFFFFF', ORG][k], line: INK, lwk: .1, alpha: ta }) }, { from: 2.6, dur: .1 }));
  if (t > bb(6) && t < bb(9)) stampIn(t, bb(6), 0, 1080, -.06, () => sticker('SPYAIR', 0, 0, 110, { fam: PM, col: '#FFFFFF', line: INK, lwk: .14, alpha: 1 - seg(t, bb(8), .5) }), { from: 1.8 });
  // the locker corner and the phone that loads the match
  prop('p_shoe', -1200, 1720, 420, .55); vball(-1380, 2080, 150, .4);
  phoneObj(t, PHONE1.x, PHONE1.y, PHONE1.r, PHONE1.s, loaderScreen, { glow: 1 - seg(t, 9.72, 2) });
  // the ticket dropped at the entrance
  if (t > bb(8) - .3) { const s = MO.springStep(t - bb(8) + .1, { damping: 11, stiffness: 220 }), k = TICKET.s * (2 - Math.min(1, s));
    g.save(); g.translate(TICKET.x, TICKET.y); g.rotate(TICKET.r); g.scale(k, k); ticketObj(t, eOut(seg(t, bb(14), .4)), eOut(seg(t, bb(10), .4)), () => hanko(t, bb(12), 250, 150, 80, '勝')); g.restore() }
  // the bench: a towel, the phone with the team chat
  rr(1500, -420, 150, 240, 16, '#FFFFFF'); rect(1500, -360, 150, 18, ORG);
  phoneObj(t, PHONE2.x, PHONE2.y, PHONE2.r, PHONE2.s, chatScreen2);
  if (t > bb(24) - .2) serveZone(t);
  rallyText(t);
  netTop2(t, (t > cT(1, 9) ? Math.exp(-(t - cT(1, 9)) * 5) : 0) + (t > 40.6 && t < 41.5 ? .6 : 0));
  if (t > 55.9) withA(fadeOld(61)(t), () => highFive(t));
  ballTop(t, topBall(t));
}
// the phone's screen in the intro: the desktop loads the match; START is clicked when the lights come on
function loaderScreen(t) {
  paper(t, { word: 'ORANGE' });
  FILES.slice(0, 4).forEach(([e, name, x, y], k) => { const s = MO.springStep(t - ACC[k], { damping: 8, stiffness: 300 }); if (s <= .01) return;
    g.save(); g.translate(x, y); g.scale(s, s); card(-80, -80, 160, 160, 34, '#FFFFFF', { sh: 8 }); fileIcon(k, t); rr(-95, 96, 190, 46, 23, '#FFFFFF', { line: INK, lw: 3 }); txt(name, 0, 128, { size: 24, w: 800, fam: RD, col: INK, al: 'center', upper: false }); g.restore() });
  const ws = MO.springStep(t - .6, { damping: 11, stiffness: 200 }), pr = clamp(ACC.slice(0, 4).reduce((a, t0) => a + eOut(seg(t, t0, .9)) / 4, 0) * .9 + .1 * seg(t, 8.2, .9));
  win(CX, 830, 760, 560, 'ORANGE.exe', { s: ws, rot: .015, draw: (w, h) => { vball(w / 2, 140 - 50 * Math.abs(Math.sin((t - .19) / BEAT * Math.PI)), 130, t * 2);
    txt('LOADING THE MATCH', w / 2, 290, { size: 30, w: 800, fam: UB, col: INK, al: 'center', tr: .06 }); progress(60, 320, w - 120, 58, pr, { t }); txt(Math.round(pr * 100) + '%', w - 60, 440, { size: 60, fam: EN, col: ORG, al: 'right', upper: false }) } });
  const click = 9.68, bs = MO.springStep(t - 8.5, { damping: 9, stiffness: 260 });
  if (bs > .01) { g.save(); g.translate(CX, 1210); const pz = t >= click ? .9 : 1; g.scale(bs * pz, bs * pz); card(-190, -58, 380, 116, 58, LIME); txt('START ▶', 0, 20, { size: 52, w: 900, fam: UB, col: INK, al: 'center' }); g.restore() }
  if (t > 8.7) { const p = eIO(seg(t, 8.7, click - 8.82)); cursor(t, lerp(960, CX + 40, p), lerp(1720, 1225, p), { click }) }
  if (t > click) { flash(t, click, '#FFFFFF', .3); stampIn(t, click + .05, CX, 1500, -.08, () => sticker("LET'S GO!", 0, 0, 150, { fam: BG, col: ORG, line: INK, lwk: .1 }), { from: 2 }) }
}
// the service zone: READY?, a count on the floor, the power meter painted behind the server, the toss and the hit
function serveZone(t) { const x0 = PA[0], y0 = PA[1], a = seg(t, bb(24) - .2, .3) * fadeOld(S(1) + .4)(t);
  const mx = x0 - 300, my = y0 + 300, mw = 600, u = (t - bb(30)) / BEAT + 1, tri = 1 - Math.abs(((u % 2) + 2) % 2 - 1);
  g.save(); g.globalAlpha = a; card(mx - 10, my - 10, mw + 20, 96, 48, '#FFFFFF', { sh: 8 }); g.beginPath(); g.roundRect(mx, my, mw, 76, 38); g.clip();
  const gr = g.createLinearGradient(mx, 0, mx + mw, 0); gr.addColorStop(0, LIME); gr.addColorStop(.6, YEL); gr.addColorStop(.9, ORG); gr.addColorStop(1, RED); g.fillStyle = gr; g.fillRect(mx, my, mw, 76); g.restore();
  const kx = mx + mw * (t < S(0) ? tri : 1); g.save(); g.globalAlpha = a; g.fillStyle = INK; g.beginPath(); g.moveTo(kx, my - 6); g.lineTo(kx - 26, my - 50); g.lineTo(kx + 26, my - 50); g.fill(); g.fillRect(kx - 4, my, 8, 76); g.restore();
  txt('POWER', mx, my - 26, { size: 46, fam: BG, col: '#FFFFFF', alpha: a, tr: .06 });
  const za = fadeOld(S(1))(t); if (t < S(0) + .6) stampIn(t, bb(24), x0, y0 - 330, -.06, () => sticker('READY?', 0, 0, 120, { fam: BG, col: YEL, line: INK, lwk: .1, alpha: 1 - seg(t, S(0), .5) }), { from: 1.8 });
  [3, 2, 1].forEach((n, k) => { const t0 = bb(27 + k); if (t < t0 || t > t0 + BEAT) return; stampIn(t, t0, x0 + 230, y0 - 120, 0, () => sticker(String(n), 0, 40, 300, { fam: BG, col: '#FFFFFF', line: INK, lwk: .08, alpha: 1 - seg(t, t0 + BEAT * .7, BEAT * .3) }), { from: 1.6, dur: .08 }) });
  if (t < S(0) + .25) { g.save(); g.globalAlpha = 1 - seg(t, S(0), .25); handVec(x0 - 10, y0 + 110, .42, 0, 'cup', { col: '#FFFFFF', line: INK }); g.restore() }
  if (t >= S(0) - .02 && t < S(0) + .35) burst(t, x0, y0, 220 * eOut(seg(t, S(0), .1)), '#FFFFFF', { n: 12, line: INK, lw: 6 });
  if (t >= S(0)) stampIn(t, S(0), x0 + 40, y0 + 230, .06, () => sticker('NICE SERVE!', 0, 0, 86, { fam: BG, col: ORG, line: INK, lwk: .1, alpha: za }), { from: 1.6 });
}
// verse 1 written by the rally; older lines settle back but stay where they were written (Maps). In the final reveal (REST)
// every line lights up again.
// A sung line fades out completely once its moment has passed. Two recaps bring every earlier line back on purpose:
// 全てが (RECAP, the first big reveal, where each line gets a tick) and the final map of the whole world (REST).
const REST = 214.6, RECAP = [cT(14, 7) - .35, 108.3];
const fadeOld = t0 => t => { const f = 1 - seg(t, t0, .5);
  if (t >= REST) return lerp(f, 1, eOut(seg(t, REST, 1.2)));
  if (t0 < RECAP[0] && t > RECAP[0]) return Math.max(f, eOut(seg(t, RECAP[0], .4)) * (1 - seg(t, RECAP[1], .5)));
  return f };
function rallyText(t) {
  pathText(t, 0, 0, 9, pAB(US[0]), pAB(US[8]), 130, { rot: THS, fade: fadeOld(S(1) + .4) });
  lockup(t, { x: L0B[0], y: L0B[1], rot: THS, alpha: fadeOld(S(1) + .4), rows: [{ i: 0, a: 9, b: 11, size: 280, st: 'boil', ent: 'type' }, { i: 0, a: 11, b: 14, size: 150, st: 'heavyO', ent: 'stamp' }] });
  { const x0 = cT(0, 12), q = (a, c) => wp(L0B[0], L0B[1], a, c, THS), fa = fadeOld(S(1) + .4)(t);   // 約束 crossed out in red
    sketch([q(-300, -230), q(300, 20)], t, { col: RED, lw: 24, p: eOut(seg(t, x0, .2)), jit: 4, alpha: fa }); sketch([q(300, -230), q(-300, 20)], t, { col: RED, lw: 24, p: eOut(seg(t, x0 + .15, .2)), jit: 4, alpha: fa }) }
  lockup(t, { x: -170, y: -330, rot: 0, alpha: fadeOld(41.0), rows: [{ i: 1, a: 0, b: 2, size: 110, st: 'thin', ent: 'rise' }, { i: 1, a: 2, b: 7, size: 175, st: 'heavy', ent: 'fly' }] });
  withA(fadeOld(41.6)(t), () => { const C = chars(1); [.2, .5, .8].forEach((u, k) => { const [x, y] = pSC(u); hanko(t, C[7 + k].t - .02, x + (k % 2 ? 80 : -80), y, 95, C[7 + k].c, { rot: (k - 1) * .15, fam: MJ }) }) });
}
// the high five at the centre, the flood from the stands
function highFive(t) { const hit = S(5), a = eIn(seg(t, hit - .3, .3)), back = t > hit ? .05 * Math.exp(-(t - hit) * 6) * Math.sin((t - hit) * 30) : 0, cy = 420;
  if (t > hit) { burst(t, 0, cy, 300 * eOut(seg(t, hit, .12)), '#FFFFFF', { n: 12, line: INK, lw: 6 }); const d = t - hit; if (d < .5) for (let k = 0; k < 10; k++) { const an = k / 10 * 6.28; sketch([[Math.cos(an) * (330 + d * 300), cy + Math.sin(an) * (330 + d * 300)], [Math.cos(an) * (430 + d * 300), cy + Math.sin(an) * (430 + d * 300)]], t, { lw: 10, alpha: 1 - d * 2 }) } }
  handVec(lerp(-1000, -150, a) - back * 400, cy + 40, .9, .55, 'open', { col: ORG, line: INK, band: '#FFFFFF' }); handVec(lerp(1000, 150, a) + back * 400, cy + 40, .9, -.55, 'open', { col: '#FFFFFF', line: INK, band: ORG });
  if (t > hit) stampIn(t, hit, 0, 180, -.1, () => sticker('パチン!!', 0, 0, 170, { fam: SFX, col: ORG, line: INK, lwk: .1 }), { from: 2 });
  lockup(t, { x: 0, y: 780, rows: [{ i: 5, a: 0, b: 5, size: 150, st: 'heavy', ent: 'stamp' }, { i: 5, a: 5, b: 6, size: 220, st: 'heavyO', ent: 'stamp', gap: 10 }] });
  const laugh = cT(5, 6), cry = cT(5, 11);
  for (let k = 0; k < 14; k++) sparkPop(t, laugh + k * .06, (R(k, 31) - .5) * 1700, -1900 + R(k, 32) * 1700, 70 + R(k, 33) * 70, R(k, 34), [YEL, '#FFFFFF', ORG][k % 3]);
  [[-560, -980, -.2], [520, -1250, .18], [-380, -1500, .1]].forEach(([x, y, r], k) => { if (t > laugh + k * .2) stampIn(t, laugh + k * .2, x, y, r, () => sticker('ハハッ', 0, 0, 150, { fam: SFX, col: YEL, line: INK, lwk: .1 }), { from: 1.8 }) });
  for (let k = 0; k < 10; k++) { const t0 = cry + k * .07; if (t > t0) dropMark(-500 + k * 110, -120 + (t - t0) * (300 + R(k, 41) * 300), .8, 0, { alpha: 1 - seg(t, t0 + .9, .3) }) }
  lockup(t, { x: 0, y: -600, rows: [{ i: 5, a: 6, b: 11, size: 230, st: 'round', ent: 'fly' }] });
  lockup(t, { x: 0, y: -260, rows: [{ i: 5, a: 11, b: 14, size: 270, st: 'heavyS', ent: 'stamp' }] });
}

// ---------------------------------------------------------------- the side strip: sky → horizon (the net tape) → gym → floor
const SIDEK = camKeys([[41.2, 0, -1250, 3.2, 0, .1], [41.75, 0, -760, 1.0, 0, .45], [44.0, 0, -560, 1.06, 0, 1.2], [46.3, 0, -500, 1.08, 0, .5],
  [46.85, 0, 860, 1.0, 0, .32], [48.3, 0, 880, 1.12, 0, .9], [50.9, 0, 900, 1.15, 0, .3], [51.3, 0, 2750, 1.0, 0, .32], [53.9, 0, 3350, 1.0, 0, .6], [55.55, 0, 3450, 2.8, .2, .14]]);
const SKYCL = [['cl_far', 0, -2300, 1700, 30, .7], ['cl_mid', 600, -1700, 1500, 45, .85], ['cl_puff', -500, -1150, 1300, 60, .8], ['cl_near', 300, -650, 1900, 90, .55], ['cl_mid', -900, -2700, 1400, 25, .6]];
function sideWorld(t) {
  const band = (y0, h, fn) => { g.save(); g.beginPath(); g.rect(-1000, y0, 2000, h); g.clip(); fn(); g.restore() };
  rect(-1000, -3400, 2000, 3500, '#7FB6E6'); band(-3400, 3400, () => cover('sky_clean', -1000, -3400, 2000, 3400, { fy: .8 }));
  SKYCL.forEach(([id, x, y, w, sp, a]) => { const im = PL[id]; if (!im) return; const h = w * im.height / im.width, xx = (((x + t * sp) % 2600) + 2600) % 2600 - 1300;
    g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = a; g.drawImage(im, xx - w / 2, y - h / 2, w, h); g.restore() });
  sunBall(t);
  rect(-1000, 0, 2000, 180, 'rgba(25,25,30,.55)'); for (let x = -1000; x < 1000; x += 26) line(x, 0, x, 180, 2, LINEC, .25); rect(-1000, -11, 2000, 22, LINEC);
  band(180, 1940, () => cover('gym_sunset', -1000, 180, 2000, 1940, { fy: .55 }));
  band(2100, 2100, () => cover('floor_close', -1000, 2100, 2000, 2100, { fy: .45 })); const gr = g.createLinearGradient(0, 2000, 0, 2300); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(.5, 'rgba(20,12,6,.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(-1000, 2000, 2000, 300);
  sideLyrics(t);
}
// the ball sets like the sun; on かじる the horizon bites into it (the line climbs over its lower part with teeth)
function sunBall(t) { const kt = cT(2, 7), sy = lerp(-1250, -150, eIO(seg(t, 41.3, kt - 41.3))), bt = t > kt ? MO.springStep(t - kt, { damping: 7, stiffness: 300 }) : 0, cut = -70 * bt;
  const gl = g.createRadialGradient(0, sy, 80, 0, sy, 700); gl.addColorStop(0, 'rgba(255,230,150,.6)'); gl.addColorStop(1, 'rgba(255,230,150,0)'); g.fillStyle = gl; g.fillRect(-1000, sy - 700, 2000, 1400);
  const edge = () => Array.from({ length: 33 }, (_, k) => { const x = 1000 - k * 2000 / 32, dip = Math.max(0, 1 - Math.abs(x) / 330); return [x, lerp(0, cut + (k % 2 ? 18 : -18) * bt, dip)] });
  g.save(); g.beginPath(); g.moveTo(-1000, -3400); g.lineTo(1000, -3400); edge().forEach(([x, y]) => g.lineTo(x, y)); g.closePath(); g.clip(); vball(0, sy, 430, -.15 + (t - 41.3) * .3); g.restore();
  if (bt > 0) { sketch(edge(), t, { col: LINEC, lw: 10, jit: 2 }); stampIn(t, kt, 300, -560, .18, () => sticker('ガブッ', 0, 0, 170, { fam: SFX, col: ORG, line: INK, lwk: .1 }), { from: 2 }) } }
function sideLyrics(t) {
  lockup(t, { x: 0, y: -1000, rows: [{ i: 2, a: 0, b: 5, size: 170, st: 'roundO', ent: 'fly' }] });
  if (t > cT(2, 5) - .05) { txt(lstr(2, 5, 7), 300, -820, { size: 110, fam: HW, w: 600, col: '#FFFFFF', upper: false, alpha: seg(t, cT(2, 5) - .05, .15) }); sketch([[290, -790], [520, -800]], t, { col: '#FFFFFF', lw: 8, p: seg(t, cT(2, 6), .25) }) }
  lockup(t, { x: -250, y: -420, rot: -.1, rows: [{ i: 2, a: 7, b: 10, size: 170, st: 'heavy', ent: 'stamp' }] });
  pathText(t, 2, 10, 13, [-300, 95], [300, 95], 140, { rot: 0, wob: .05 });
  lockup(t, { x: 0, y: 640, rows: [{ i: 3, a: 0, b: 5, size: 150, st: 'round', ent: 'rise' }] });
  if (t > cT(3, 5) - .05) { g.save(); g.shadowColor = '#FFF2B0'; g.shadowBlur = 60 * eOut(seg(t, cT(3, 5), .5)); lockup(t, { x: 0, y: 960, rows: [{ i: 3, a: 5, b: 6, size: 320, st: 'heavyY', ent: 'stamp' }] }); g.restore() }
  // sweat: the chars slide down the floor like drops; 汗と stamped
  const C = chars(4); for (let k = 0; k < 5; k++) { const G = C[k]; if (t < G.t - .03) continue; const x = -400 + k * 200, y0 = 2380 + k * 30, d = t - G.t, y = y0 + 380 * eOut(clamp(d / 1.4)) + 40 * d;
    g.save(); g.globalAlpha = .35; g.strokeStyle = '#FFFFFF'; g.lineWidth = 26; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y0 - 60); g.lineTo(x, y - 90); g.stroke(); g.restore();
    stampIn(t, G.t - .03, x, y, (R(k, 6) - .5) * .15, () => sticker(G.c, 0, 0, 170, { fam: MJ, col: SKY, line: INK, lwk: .14 }), { from: 1.6 }); dropPop(t, G.t + .1, x + 80, y + 110, .9, .15, { fall: 120 }) }
  lockup(t, { x: -60, y: 3000, rows: [{ i: 4, a: 5, b: 6, size: 300, st: 'heavyO', ent: 'stamp' }] }); lockup(t, { x: 230, y: 3060, rows: [{ i: 4, a: 6, b: 7, size: 150, st: 'dark', ent: 'stamp' }] });
  for (let k = 0; k < 5; k++) dropPop(t, cT(4, 5) + k * .1, -360 + k * 180, 2830 - (k % 2) * 70, 1.1, (k - 2) * .35);
  // the voice: 響いた typed, 声 with rings spreading over the floor
  lockup(t, { x: 0, y: 3330, rows: [{ i: 4, a: 7, b: 10, size: 130, st: 'round', ent: 'type' }] });
  const vt = cT(4, 10); if (t > vt - .03) { for (let k = 0; k < 4; k++) { const d = t - vt - k * .22; if (d > 0 && d < 1.3) sketch(ellPts(0, 3620, 170 + d * 360, 160 + d * 330, 1.02, -1, 40), t, { col: '#FFFFFF', lw: 9 * (1 - d / 1.3), alpha: 1 - d / 1.3 }) }
    lockup(t, { x: 0, y: 3620, rows: [{ i: 4, a: 10, b: 11, size: 340, st: 'heavyO', ent: 'stamp' }] }) }
}
// screen-space moments in the side strip: the exposure blows out on 眩しくて
function sideOverlay(t) { const blow = eIn(seg(t, cT(3, 6) - .15, .35)) * (1 - seg(t, 50.95, .35)); if (blow <= 0) return;
  rect(0, 0, W, H, '#FFFFFF', blow); if (blow > .95) { rays(t, CX, 900, { col: 'rgba(255,216,58,.35)', n: 30 });
    stampChars(t, 3, 6, 10, k => [200 + k * 225, 900 + (k % 2) * 60, (R(k, 7) - .5) * .25], 250, { fam: SFX, col: INK, line: '#FFFFFF', lwk: .1 }); for (let k = 0; k < 6; k++) sparkPop(t, cT(3, 6) + k * .12, 160 + R(k, 51) * 760, 500 + R(k, 52) * 900, 60 + R(k, 53) * 50, R(k, 54), YEL) } }
function topOverlay(t) { flash(t, B0 - .02, '#FFFFFF', .2); flash(t, 55.95, '#FFFFFF', .25) }
