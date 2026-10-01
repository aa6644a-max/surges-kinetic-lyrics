/* ORANGE M3 (108 - 181.6): rally 2 on the court lines — the words run along the east sideline (息を切らし…), then along their
   baseline (胸の熱さ, a thermometer boiling); a locked CONTINUE? screen (もう一回のない瞬間); pass lines linking the six players
   (繋がって); a brush repainting the court (何を描こうか?); a thought bubble we dive into (想像); the broadcast REPLAY with the
   camera orbiting the tilted court (きっと × 2); the timeout whiteboard in marker (確かな事 … 間違っても良いよ … 君は君でいい oh);
   the drop: the lights go out bank by bank, one ball in a spotlight, 切なさ fading. */

const SIDEL = [450, 780], SIDET = [450, -780], BASEL = [700, -1010], BASER = [-900, -1010];
const pL15 = u => [lerp(SIDEL[0], SIDET[0], u), lerp(SIDEL[1], SIDET[1], u)], pL16 = u => [lerp(BASEL[0], BASER[0], u), lerp(BASEL[1], BASER[1], u)];
const CONT = { x: -1500, y: -1350, r: -Math.PI / 2 };
const DOTS = [[-320, 820], [-20, 600], [300, 800], [330, 380], [0, 230], [-310, 420]];
const BOARD = { x: 1900, y: -1500 };
// a follow camera along a line of lyric chars: the frame sits on the char being sung (until tEnd, when the next move starts)
function lineFollow(i, a, b2, pt, rot, z, tEnd, dt = .1, st = .3) { const C = chars(i), n = b2 - a; return followKeys(C[a].t - .25, Math.min(tEnd, C[b2 - 1].t + .4), t => { let k = 0; while (k < n - 1 && t > C[a + k + 1].t) k++; const u0 = k / (n - 1), u1 = Math.min(1, (k + 1) / (n - 1)), f = k < n - 1 ? clamp((t - C[a + k].t) / (C[a + k + 1].t - C[a + k].t)) : 0, [x, y] = pt(lerp(u0, u1, f)); return { x, y, z, r: rot } }, dt, st) }
const TOPK3 = camKeys([
  [S(15) - .3, ...pL15(0), 1.0, -Math.PI / 2, .14],
  ...lineFollow(15, 0, 11, pL15, -Math.PI / 2, 1.0, S(16) - .35),
  [S(16) - .3, ...pL16(0), 1.0, -Math.PI, .16],
  ...lineFollow(16, 0, 15, pL16, -Math.PI, 1.0, S(17) - .3),
  [S(17) - .25, CONT.x + 20, CONT.y, .95, -Math.PI / 2, .18], [121.5, CONT.x + 40, CONT.y, 1.02, -Math.PI / 2, 1.2],
  [S(18) - .25, 0, 540, .95, 0, .18], [126.2, 0, 520, 1.0, .02, 1.2],
  [S(19) - .25, 0, -560, .95, 0, .18], [131.2, 0, -560, 1.0, -.02, 1.2],
  [S(20) - .25, 0, 0, .85, 0, .2], [134.6, 0, 20, 1.3, 0, .8], [136.35, -40, 30, 3.2, 0, .3],
  [136.47, 0, 0, .42, 0, .01, .75], [137.0, 0, -300, .5, .9, 4.0, .8], [146.0, 0, -100, .46, 1.8, 4.0, .75],     // REPLAY: orbit the tilted court
  [156.3, BOARD.x, BOARD.y + 20, .8, 0, .16, 0], [166.3, BOARD.x, BOARD.y + 60, .84, 0, 3.0, 0], [171.8, BOARD.x, BOARD.y + 80, .86, 0, 1.0, 0],
  [172.4, 300, 300, .5, 0, .5, 0], [174.8, 0, 760, .52, 0, 1.2, 0], [181.3, 0, 800, .44, 0, 2.5, 0]]);             // the drop: high above the dark court
function topM3(t) {
  if (t < 107.6) return;
  // 息を切らし ただ走り続け, running up the east sideline
  pathText(t, 15, 0, 11, pL15(0), pL15(1), 150, { rot: -Math.PI / 2, fade: fadeOld(S(16) + .4) });
  if (t > cT(15, 7)) stampIn(t, cT(15, 7), 660, -150, -Math.PI / 2 + .1, () => sticker('DASH!!', 0, 0, 120, { fam: BG, col: YEL, line: INK, lwk: .1, alpha: fadeOld(S(16))(t) }), { from: 1.8 });
  // 追いかけてたのは 胸の熱さだろう, along their baseline; 熱 boils a thermometer
  pathText(t, 16, 0, 15, pL16(0), pL16(1), 128, { rot: -Math.PI, fade: fadeOld(S(17) + .4) });
  if (t > cT(16, 8) - .2) withA(fadeOld(S(17) + .4)(t), () => { g.save(); g.translate(-250, -1300); g.rotate(Math.PI); thermo(0, 0, .9, eOut(seg(t, cT(16, 8), 1.6))); g.restore();
    if (t > cT(16, 10)) stampIn(t, cT(16, 10), -250, -1700, -Math.PI + .1, () => sticker('アツッ!!', 0, 0, 150, { fam: SFX, col: RED, line: INK, lwk: .1 }), { from: 2 }) });
  // もう一回のない そんな瞬間が — a CONTINUE? screen with the button locked
  if (t > S(17) - .35) { const s = MO.springStep(t - S(17) + .3, { damping: 11, stiffness: 210 }), fa = fadeOld(S(18) + .2);
    withA(fa(t), () => { g.save(); g.translate(CONT.x, CONT.y); g.rotate(CONT.r); g.scale(s, s);
      card(-430, -300, 860, 600, 30, '#141522', { sh: 16, line: '#000' }); txt('CONTINUE?', 0, -150, { size: 130, fam: BG, col: YEL, al: 'center', tr: .04 });
      rr(-260, -40, 520, 130, 65, '#3A3B4A', { line: '#000', lw: 6 }); txt('もう一回', -30, 48, { size: 70, fam: MJ, col: '#9A98A8', al: 'center', upper: false }); padlock(190, 18, .7);
      txt('0', 0, 250, { size: 140, fam: BG, col: RED, al: 'center' }); g.restore() });
    lockup(t, { x: CONT.x - 480, y: CONT.y, rot: CONT.r, alpha: fa, rows: [{ i: 17, a: 0, b: 7, size: 120, st: 'thin', ent: 'rise' }, { i: 17, a: 7, b: 10, size: 110, st: 'thin', ent: 'rise', gap: 6 }] });
    lockup(t, { x: CONT.x + 520, y: CONT.y, rot: CONT.r, alpha: fa, rows: [{ i: 17, a: 10, b: 13, size: 300, st: 'heavyO', ent: 'stamp' }] }) }
  // ずっと繋がってくように — pass lines link the six players; the chars ride the lines
  if (t > S(18) - .3) { const C = chars(18), segT = k => C[Math.min(C.length - 1, k * 2)].t, fa = fadeOld(S(19) + .3);
    withA(fa(t), () => { DOTS.forEach(([x, y], k) => { const s = MO.springStep(t - (S(18) - .25 + k * .05), { damping: 9, stiffness: 260 }); disc(x, y, 50 * s, k % 2 ? '#FFFFFF' : ORG); ring(x, y, 50 * s, 6, INK); txt(String(k + 1), x, y + 18 * s, { size: 50 * s, fam: BG, col: INK, al: 'center', upper: false }) });
      for (let k = 0; k < 5; k++) { const a = DOTS[k], b2 = DOTS[k + 1], p = eOut(seg(t, segT(k) - .1, .4)); if (p <= 0) continue; g.save(); g.setLineDash([26, 18]); line(a[0], a[1], b2[0], b2[1], 12, YEL, 1, p); g.restore() } });
    for (let k = 0; k < 5; k++) { const a = DOTS[k], b2 = DOTS[k + 1]; if (t < segT(k) - .2) continue;
      pathText(t, 18, Math.min(10, k * 2), Math.min(11, k * 2 + 2), [lerp(a[0], b2[0], .3), lerp(a[1], b2[1], .3) - 70], [lerp(a[0], b2[0], .7), lerp(a[1], b2[1], .7) - 70], 120, { rot: 0, wob: .2, fade: fa }) }
    const u = clamp((t - S(18)) / (E(18) - S(18))) * 5, k0 = Math.min(4, Math.floor(u)), f = u - k0; if (t < E(18) + .3) ballTop(t, { x: lerp(DOTS[k0][0], DOTS[k0 + 1][0], f), y: lerp(DOTS[k0][1], DOTS[k0 + 1][1], f), h: 1.5 + 2 * Math.sin(f * Math.PI) }) }
  // 何を描こうか? 何をしようか? — a brush repaints their court
  if (t > S(19) - .2) { const P = [[-450, -300], [450, -300], [450, -900], [-450, -900], [-450, -300]], p = eIO(seg(t, S(19), E(19) - S(19)));
    sketch(P, t, { col: ORG, lw: 30, p, jit: 5, alpha: fadeOld(S(20) + 1)(t) }); if (p < 1) { const L = 2900 * p; let acc = 0, bx = P[0][0], by = P[0][1]; for (let k = 1; k < P.length; k++) { const d = Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]); if (acc + d >= L) { const q = (L - acc) / d; bx = lerp(P[k - 1][0], P[k][0], q); by = lerp(P[k - 1][1], P[k][1], q); break } acc += d }
      g.save(); g.translate(bx, by); g.rotate(-.6); rr(-14, -160, 28, 150, 10, '#8A5B34', { line: INK, lw: 5 }); rr(-20, -20, 40, 50, 12, ORG, { line: INK, lw: 5 }); g.restore() }
    lockup(t, { x: 0, y: -720, alpha: fadeOld(S(20) + 1), rows: [{ i: 19, a: 0, b: 7, size: 170, st: 'heavy', ent: 'fly' }] });
    lockup(t, { x: 0, y: -460, alpha: fadeOld(S(20) + 1), rows: [{ i: 19, a: 7, b: 14, size: 170, st: 'heavy', ent: 'fly' }] }) }
  // なんて 想像してみるけど — a thought bubble over the net, we dive into it
  if (t > S(20) - .3) { const s = MO.springStep(t - S(20) + .2, { damping: 10, stiffness: 180 }), fa = fadeOld(136.6);
    withA(fa(t), () => thoughtBubble(0, 0, 900, 560, Math.min(1.05, s)));
    lockup(t, { x: -250, y: -150, alpha: fa, rows: [{ i: 20, a: 0, b: 3, size: 100, st: 'hand', ent: 'type' }] }); lockup(t, { x: 0, y: 10, alpha: fa, rows: [{ i: 20, a: 3, b: 5, size: 270, st: 'dark', ent: 'stamp' }] });
    lockup(t, { x: 40, y: 190, alpha: fa, rows: [{ i: 20, a: 5, b: 11, size: 100, st: 'thinD', ent: 'rise' }] }) }
  // REPLAY: the spike again in slow motion; きっと twice in brush lettering; the stands chant
  if (t > 136.3 && t < 156.4) { const ph = ((t - 136.5) / 4.8) % 1, u = eIO(clamp(ph * 1.25)); ballTop(t, { x: lerp(-650, PK[0], u), y: lerp(-1600, PK[1], u), h: lerp(9, .3, u) + 3 * Math.sin(u * Math.PI) });
    for (let k = 0; k < 6; k++) { const tb = onBeat(Math.floor(beatN(t)) - k); if (t - tb < .5 && tb > 136.5) stampIn(t, tb, (R(Math.round(beatN(tb)), 3) - .5) * 1800, -2350 + R(Math.round(beatN(tb)), 4) * 300, (R(Math.round(beatN(tb)), 5) - .5) * .3, () => sticker('KITTO!!', 0, 0, 120, { fam: BG, col: k % 2 ? YEL : '#FFFFFF', line: INK, lwk: .1, alpha: 1 - (t - tb) / .5 }), { from: 1.6 }) } }
  lockup(t, { x: 0, y: 330, rot: -.12, alpha: fadeOld(146), rows: [{ i: 21, a: 0, b: 3, size: 420, st: 'heavyO', ent: 'stamp' }] });
  lockup(t, { x: 0, y: -1250, rot: .95, alpha: fadeOld(156), rows: [{ i: 22, a: 0, b: 3, size: 420, st: 'heavyY', ent: 'stamp' }] });
  // TIMEOUT: the whiteboard in marker
  if (t > 155.6) { const s = MO.springStep(t - 155.7, { damping: 11, stiffness: 200 }); g.save(); g.translate(BOARD.x, BOARD.y); g.scale(Math.min(1.04, s), Math.min(1.04, s)); boardObj(t); g.restore() }
  // the drop: one ball in a spotlight; the lines thin and small. The lights come back on for the last chorus.
  if (t > 172) { const sp = seg(t, 172.6, 1.4) * (1 - seg(t, LIGHTS_ON, .3)), fa = fadeOld(LIGHTS_ON + .2);
    if (sp > 0) { g.save(); g.globalCompositeOperation = 'screen'; const gr = g.createRadialGradient(0, 430, 0, 0, 430, 620); gr.addColorStop(0, `rgba(255,236,205,${.6 * sp})`); gr.addColorStop(1, 'rgba(255,236,205,0)'); g.fillStyle = gr; g.fillRect(-620, -190, 1240, 1240); g.restore() }
    if (t < LIGHTS_ON) vball(0, 430, 130, .4);
    lockup(t, { x: 0, y: 740, alpha: fa, rows: [{ i: 26, a: 0, b: 4, size: 140, st: 'thin', ent: 'rise' }, { i: 26, a: 4, b: 11, size: 190, st: 'heavy', ent: 'rise', gap: 8 }] });
    lockup(t, { x: 0, y: 1080, alpha: fa, rows: [{ i: 27, a: 0, b: 5, size: 130, st: 'thin', ent: 'rise' }] });
    const C = chars(27); for (let k = 5; k < 8; k++) { const G = C[k]; if (t < G.t - .03) continue; const a = 1 - seg(t, G.t + 1.1 + (k - 5) * .25, .6) * .85; sticker(G.c, -250 + (k - 5) * 250, 1320, 230, { fam: MJ, col: '#FFFFFF', line: INK, lwk: .12, alpha: a * clamp((t - G.t + .03) / .3) }) } }
}
// the whiteboard: a court diagram, magnets, marker writing; red ✕, a flower circle (花丸), a ring for oh
const MARK = { fam: MK, col: INK, outline: false, shadow: false };
function boardObj(t) {
  rr(-640 + 18, -470 + 22, 1280, 940, 20, 'rgba(0,0,0,.35)'); rr(-660, -490, 1320, 980, 26, '#B9BEC8', { line: INK, lw: 8 }); rr(-620, -450, 1240, 900, 14, '#FBFBF8');
  g.save(); g.globalAlpha = .35 * GA; g.strokeStyle = '#7A8090'; g.lineWidth = 5; g.strokeRect(-580, -410, 1160, 380); g.restore(); line(0, -410, 0, -30, 5, '#7A8090', .35);
  [[-420, -300, ORG], [-260, -160, '#FFFFFF'], [220, -320, ORG], [420, -150, '#FFFFFF']].forEach(([x, y, c]) => { disc(x, y, 26, c); ring(x, y, 26, 5, INK) });
  if (t > 155.7 && t < 158) stampIn(t, 155.7, 0, -250, -.06, () => sticker('TIME OUT', 0, 0, 150, { fam: BG, col: ORG, line: INK, lwk: .1, alpha: 1 - seg(t, 157.2, .5) }), { from: 1.8 });
  lockup(t, { x: -560, y: -340, al: 'left', rows: [{ i: 23, a: 0, b: 7, size: 100, st: MARK, ent: 'type' }] });
  lockup(t, { x: -560, y: -210, al: 'left', rows: [{ i: 23, a: 7, b: 15, size: 100, st: MARK, ent: 'type' }] });
  lockup(t, { x: -560, y: -40, al: 'left', rows: [{ i: 24, a: 0, b: 5, size: 110, st: MARK, ent: 'type' }] });
  [0, 1, 2].forEach(k => { const t0 = cT(24, 1 + k) + .05; if (t > t0) { const x = -20 + k * 70, y = -70; sketch([[x - 26, y - 26], [x + 26, y + 26]], t, { col: RED, lw: 12, p: eOut(seg(t, t0, .12)) }); sketch([[x + 26, y - 26], [x - 26, y + 26]], t, { col: RED, lw: 12, p: eOut(seg(t, t0 + .08, .12)) }) } });
  lockup(t, { x: 340, y: -40, rows: [{ i: 24, a: 5, b: 8, size: 130, st: Object.assign({}, MARK, { col: RED }), ent: 'type' }] });
  if (t > cT(24, 7)) { const P = []; for (let k = 0; k <= 70; k++) { const a = k / 70 * Math.PI * 2 * 1.6 - 1, r = 150 - k * 1.2 + 14 * Math.sin(k * 1.3); P.push([340 + Math.cos(a) * r * 1.25, -70 + Math.sin(a) * r * .75]) } sketch(P, t, { col: RED, lw: 9, p: eOut(seg(t, cT(24, 7), .5)), jit: 2 }) }
  lockup(t, { x: -560, y: 110, al: 'left', rows: [{ i: 24, a: 8, b: 14, size: 100, st: MARK, ent: 'type' }] });
  lockup(t, { x: -160, y: 300, rows: [{ i: 25, a: 0, b: 6, size: 150, st: MARK, ent: 'type' }] });
  if (t > cT(25, 5)) sketch(ellPts(-160, 290, 300, 95, 1.06, -2.8), t, { col: ORG, lw: 11, p: eOut(seg(t, cT(25, 5), .4)), jit: 2 });
  if (t > cT(25, 6) - .05) { const s = MO.springStep(t - cT(25, 6), { damping: 8, stiffness: 260 }); g.save(); g.translate(400, 290); g.scale(s, s); ring(0, 0, 120, 26, ORG); txt('oh', 0, 40, { size: 120, fam: BG, col: INK, al: 'center', upper: false }); g.restore() }
}
// REPLAY overlay (screen space)
function replayOverlay(t) { flash(t, 136.47, '#FFFFFF', .3, .9); if (t < 136.5 || t > 156.3) return; const a = seg(t, 136.5, .2) * (1 - seg(t, 156.0, .3));
  g.save(); g.globalAlpha = .1 * a; g.fillStyle = '#000'; for (let y = 0; y < H; y += 6) g.fillRect(0, y, W, 2); g.restore();
  rr(40, 230, 330, 92, 18, '#E8322B', { alpha: a }); txt('REPLAY', 205, 296, { size: 70, fam: BG, col: '#FFFFFF', al: 'center', alpha: a, tr: .06 });
  disc(420, 276, 16, '#E8322B', a * (Math.floor(t * 2) % 2 ? 1 : .3)); txt('x0.25', W - 60, 296, { size: 64, fam: BG, col: '#FFFFFF', al: 'right', alpha: a });
  const tc = (t - 136.5) / 4; txt(`00:0${Math.floor(tc) % 10}:${String(Math.floor((tc % 1) * 30)).padStart(2, '0')}`, W - 60, 380, { size: 44, fam: BG, col: '#FFFFFF', al: 'right', alpha: a * .8 }) }
