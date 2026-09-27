/* PURETYPE act 2 (70.4 - 137.5): DECOMPOSE, COPY / MIRROR, CORRECTION, CHORUS 2.
   ME's type moves to act 2 (weight 500-650, medium size). She starts to take space: copies, corrections, the reflow. */

// ================= S4 INTERLUDE 70.4 - 82.3: the letters come apart into strokes, dots and lines, then settle on new baselines =================
const PIECES = Array.from({ length: 84 }, (_, i) => {
  const kind = i % 6 === 0 ? 'dot' : i % 6 === 1 ? 'ring' : i % 3 === 0 ? 'v' : 'h';
  return { kind, len: 40 + 180 * R(i, 1), th: 10 + 26 * R(i, 2), ang: R(i, 3) * 6.28, dist: 200 + 900 * R(i, 4), col: [IVORY, IVORY, CORAL, ACID, VIOLET][Math.floor(R(i, 5) * 5)],
    row: Math.floor(R(i, 6) * 11), rx: 64 + R(i, 7) * 900 };
});
function S4(t) {
  fill(NAVY);
  const burst = eOutQ(seg(t, 70.35, 1.6)), settle = eIO(seg(t, 77.4, 4.2)), calm = 1 - settle;
  const bt = beatN(t), step = Math.floor(bt), fr = eOut(clamp((bt - step) / .35));      // the pieces take one small step on every beat
  PIECES.forEach((p, i) => {
    const a0 = p.ang + (step + fr) * .05 * (R(i, 8) - .5), d = p.dist * burst;
    const fx = CX + Math.cos(a0) * d + Math.sin(t * .4 + i) * 20 * calm, fy = CY + Math.sin(a0) * d * 1.5 + Math.cos(t * .33 + i) * 20 * calm;
    const tx = p.rx, ty = 330 + p.row * 130;                                  // the new ruled page
    const x = lerp(fx, tx, settle), y = lerp(fy, ty, settle), al = .9 * seg(t, 70.35, .3);
    g.save(); g.translate(x, y); g.rotate(lerp(p.kind === 'v' ? Math.PI / 2 : 0, 0, settle) + calm * (a0 * .15));
    if (p.kind === 'dot') disc(0, 0, p.th * .6 * calm + 2 * settle, p.col, al);
    else if (p.kind === 'ring') ring(0, 0, p.th * 1.4 * calm + 2 * settle, 6 * calm + 1, p.col, al);
    else rect(-p.len / 2, -lerp(p.th, 2, settle) / 2, p.len * lerp(1, 1.6, settle), lerp(p.th, 2, settle), p.col, al);
    g.restore();
  });
  // the settled pieces join into full-width rules: the page the next verse is written on
  for (let r = 0; r < 11; r++) line(64, 330 + r * 130, W - 64, 330 + r * 130, 2, IVORY, .4 * eIO(seg(t, 80.2 + r * .06, 1.2)), eOut(seg(t, 80.2 + r * .06, 1.4)));
}

// ================= S5 COPY / MIRROR 82.3 - 107.8: filled, outline and ghost copies that never quite line up =================
function copies(s, x, y, o, spread, fillA = 1) {        // ghost + outline + filled copies of one word
  txt(s, x - spread * 1.6, y + spread * .4, { ...o, alpha: .14 * (o.alpha ?? 1) });
  txt(s, x + spread, y + spread * .6, { ...o, outline: true, lw: 3 });
  if (fillA > 0) txt(s, x, y, { ...o, alpha: fillA * (o.alpha ?? 1) });
}
function S5(t) {
  fill(NAVY);
  const rules = 1 - seg(t, 83.5, 2);
  for (let r = 0; r < 11; r++) line(64, 330 + r * 130, W - 64, 330 + r * 130, 2, IVORY, .4 * rules, 1);
  const me2 = (sz, extra) => ({ size: sz, w: ME[2].w, tr: ME[2].tr, col: IVORY, ...extra });
  // L28-29 내 자신: filled + outline + ghost; on "싫어져만 갔어" the copies drift apart and the fill drains out
  if (t < S(30) + .2) {
    const drift = eIO(seg(t, S(29), 2.0)), out = eIn(seg(t, S(30) - .2, .4));
    lyr(t, 28, 0, 5, 64, 560, me2(64, { rev: 'fade', alpha: 1 - out }));
    if (t > cT(28, 5) - .05) copies('내 자신이', 64 + drift * 40, 980, { size: 230, w: 800, tr: -.03, col: IVORY, alpha: seg(t, cT(28, 5) - .05, .3) * (1 - out) }, 20 + drift * 120, 1 - drift);
    lyr(t, 28, 9, null, 64, 1150, me2(64, { rev: 'fade', alpha: 1 - out }));
    if (t > S(29) - .1) lyr(t, 29, 0, null, 64, 1400, me2(80, { rev: 'rise', alpha: 1 - out }));
  }
  // L30-31 탓: a word and its reflection below a line
  if (t > S(30) - .2 && t < S(32)) {
    const out = eIn(seg(t, S(32) - .25, .3));
    lyr(t, 30, 0, null, CX, 600, me2(60, { rev: 'fade', al: 'center', alpha: 1 - out }));
    if (t > S(31) - .1) {
      lyr(t, 31, 0, 4, CX, 760, me2(60, { rev: 'fade', al: 'center', alpha: 1 - out }));
      const G = chars(31)[4], a = eOutQ(seg(t, G.t - .05, .35));
      line(120, 1180, 960, 1180, 2, CORAL, 1 - out, a);
      txt('탓', CX, 1170, { size: 420, w: 900, col: IVORY, al: 'center', alpha: a * (1 - out) });
      g.save(); g.translate(0, 2360); g.scale(1, -1); txt('탓', CX, 1170, { size: 420, w: 900, col: IVORY, al: 'center', alpha: .22 * a * (1 - out) }); g.restore();
      lyr(t, 31, 5, null, CX + 280, 1170, me2(60, { rev: 'fade', alpha: 1 - out }));
    }
  }
  // L32-33 너 and its mirror image: flipped, 너 turns into 나
  if (t > S(32) - .2 && t < S(34)) {
    const out = eIn(seg(t, S(34) - .2, .3)), G = chars(32)[3], a = eOutQ(seg(t, G.t - .05, .35)), flip = eIO(seg(t, G.t + .4, .8)), become = eIO(seg(t, S(33) - .2, .7));
    lyr(t, 32, 0, 3, CX, 520, me2(60, { rev: 'fade', al: 'center', alpha: 1 - out }));
    line(CX, 700, CX, 1500, 2, CORAL, (1 - out) * a, 1);                          // the mirror
    txt('너', CX - 30, 1300, { size: 480, w: 900, col: IVORY, al: 'right', alpha: a * (1 - out) });
    g.save(); g.translate(CX, 0); g.scale(lerp(1, -1, flip), 1); g.translate(-CX, 0);
    txt('너', CX - 30, 1300, { size: 480, w: 900, col: IVORY, al: 'right', outline: true, lw: 4, alpha: flip * (1 - become) * (1 - out) }); g.restore();
    txt('나', CX + 30, 1300, { size: 480, w: 900, col: IVORY, outline: true, lw: 4, alpha: become * (1 - out) });
    lyr(t, 32, 4, null, CX, 1480, me2(60, { rev: 'fade', al: 'center', alpha: 1 - out }));
    if (t > S(33) - .1) lyr(t, 33, 0, null, CX + 60, 1640, me2(60, { rev: 'fade', alpha: 1 - out }));
  }
  // L34 넌, outlined: the main character's word loses its fill
  if (t > S(34) - .2 && t < S(35)) {
    const out = eIn(seg(t, S(35) - .2, .3)), G = chars(34)[0], a = seg(t, G.t - .05, .3);
    txt('넌', 64, 1200, { size: 520, w: 900, col: IVORY, outline: true, lw: 5, alpha: a * (1 - out) });
    txt('넌', 64, 1200, { size: 520, w: 900, col: IVORY, alpha: (1 - eIO(seg(t, G.t + .2, .8))) * (1 - out) });
    lyr(t, 34, 1, null, 64, 1400, me2(80, { rev: 'rise', alpha: 1 - out }));
  }
  // L35 나, repeated inward: copies of the same syllable shrinking to a point
  if (t > S(35) - .2 && t < S(36)) {
    const out = eIn(seg(t, S(36) - .2, .3)), n = eOut(seg(t, S(35), E(35) - S(35)));
    for (let k = 0; k < 9; k++) { const a = clamp(n * 9 - k); if (a <= 0) continue; txt('나', CX, 1000, { size: 700 * Math.pow(.78, k), w: 900, col: k % 2 ? CORAL : IVORY, al: 'center', base: 'middle', outline: k > 0, lw: 3, alpha: a * (1 - out) }) }
    lyr(t, 35, 0, null, CX, 1640, me2(56, { rev: 'fade', al: 'center', alpha: 1 - out }));
  }
  // L36-37 주인공 hollow; 너도 hollow: the two sides now weigh the same
  if (t > S(36) - .2 && t < S(38)) {
    const out = eIn(seg(t, S(38) - .2, .3));
    lyr(t, 36, 0, 7, 64, 600, me2(80, { rev: 'rise', alpha: 1 - out }));
    lyr(t, 36, 7, null, 40, 980, { size: 330, w: 900, tr: YOU.tr, col: IVORY, rev: 'fade', outline: true, lw: 4, alpha: 1 - out });
    if (t > S(37) - .1) { lyr(t, 37, 0, 2, 64, 1250, me2(80, { rev: 'fade', alpha: 1 - out })); lyr(t, 37, 2, 4, 64, 1560, { size: 300, w: 900, tr: -.03, col: IVORY, rev: 'fade', outline: true, lw: 4, alpha: 1 - out }); lyr(t, 37, 4, null, 64, 1700, me2(80, { rev: 'fade', alpha: 1 - out })) }
  }
  // L38-39 two lines of text on crossing baselines, tangling; then pulled taut into horizontal lines
  if (t > S(38) - .2) {
    const taut = eIO(seg(t, E(39) - .6, .8)), tt = t;
    const rails = [[-.5, 700], [.45, 900], [-.3, 1250], [.35, 1450]];
    rails.forEach(([ang, y], k) => {
      const a = lerp(ang, 0, taut), yy = lerp(y, 700 + k * 260, taut), i = k < 2 ? 38 : 39;
      if (tt < S(i) - .1) return;
      g.save(); g.translate(CX, yy); g.rotate(a);
      line(-900, 0, 900, 0, 2 + taut * 4, CORAL, .9, eOut(seg(tt, S(i) - .1, .6)));
      const scroll = (tt - S(i)) * 60 * (k % 2 ? -1 : 1);
      lyr(tt, i, 0, null, -520 + scroll, -16, me2(62, { rev: 'fade', alpha: 1 - taut }));
      g.restore();
    });
  }
  const white = eIn(seg(t, 107.2, .6)); if (white > 0) for (let k = 0; k < 4; k++) rect(0, 700 + k * 260 - white * 700, W, white * 1400, IVORY);   // the taut lines widen into the next (ivory) page
}

// ================= S6 CORRECTION 107.8 - 115.3: strikethrough, caret, brackets; ME's line goes on top for the first time =================
function S6(t) {
  fill(IVORY);
  const erase = eIO(seg(t, S(42) + .3, 1.6));
  // L40: 미워하기만 is struck through; 미안해 is inserted above it with a caret
  const G = chars(40)[4];
  g.save(); g.beginPath(); g.rect(erase * W, 0, W, H); g.clip();                 // the eraser (L42) clears it from the left
  lyr(t, 40, 4, 9, 64, 980, { size: 170, w: 800, tr: -.03, col: NAVY, rev: 'fade' });
  const strike = eOut(seg(t, E(40) - .4, .5)); line(50, 920, 1030, 920, 14, CORAL, 1, strike);
  lyr(t, 40, 9, null, 64, 1130, { size: 60, w: ME[2].w, tr: ME[2].tr, col: NAVY, rev: 'fade' });
  g.restore();
  const ins = eOutQ(seg(t, S(40), .6));
  lyr(t, 40, 0, 4, 64, lerp(760, 740, ins), { size: lerp(60, 110, eIO(seg(t, E(40) - .3, .6))), w: ME[2].w, tr: ME[2].tr, col: CORAL, rev: 'fade' });
  line(120, 800, 150, 770, 5, CORAL, ins, 1); line(150, 770, 180, 800, 5, CORAL, ins, 1);   // caret
  // L41: brackets close in around 그래도 어려워
  if (t > S(41) - .2) {
    const close = eOut(seg(t, S(41), 1.2)), L = layout(41, 0, chars(41).length, { size: 90, w: ME[2].w, tr: ME[2].tr });
    lyr(t, 41, 0, null, CX, 1400, { size: 90, w: ME[2].w, tr: ME[2].tr, col: NAVY, rev: 'fade', al: 'center' });
    brackets(CX, 1370, L.width + 40, 150, 6, CORAL, (1 - close) * 1.2, seg(t, S(41) - .2, .3) * (1 - erase));
  }
  // L42: ME's line, set larger, sits over what is being erased
  if (t > S(42) - .2) {
    lyr(t, 42, 0, null, 64, 1000, { size: 118, w: 650, tr: -.01, col: NAVY, rev: 'rise' });
    rect(erase * W - 40, 780, 40, 480, NAVY, erase > 0 && erase < 1 ? 1 : 0);   // the eraser's edge
  }
  const flood = eIn(seg(t, 114.6, .7)); if (flood > 0) rect(0, 0, W * flood, H, CORAL);   // the eraser keeps going: a coral page
}

// ================= S7 CHORUS 2 115.3 - 137.5: the whole canvas is a typesetting engine; every new line pushes the rest =================
function lineItem(t, i, segs, h, o = {}) {       // one flowed line made of several styled runs on a shared baseline
  return { t0: o.t0 ?? S(i), t1: o.t1, h, draw: (y, p, pin, pout) => {
    let x = o.x ?? 64; const drop = pout ? eIn(pout) * 400 : 0;
    for (const s of segs) {
      const by = y + h * .8 + drop * (1 + s.a * .1), L = lyr(t, i, s.a, s.b, x, by, { rev: 'rise', alpha: pin * (1 - (pout || 0)), ...s.o });
      if (s.o.box) { const b = eOut(seg(t, cT(i, s.b - 1) + .25, .4)), sz = s.o.size; g.globalAlpha = b; g.strokeStyle = IVORY; g.lineWidth = 8; g.strokeRect(x - 16, by - sz * .92, (L.width + 32) * b, sz * 1.12); g.globalAlpha = 1 }   // "결말": locked in a frame
      x += L.width + (s.gap ?? s.o.size * .3);
    }
  } };
}
function S7(t) {
  const pageDrop = eIn(seg(t, E(52) - 1.0, .8));                                // "버려지는 걸까": the whole coral page falls away
  fill(IVORY);
  g.save(); g.translate(0, pageDrop * H * 1.05); g.rotate(pageDrop * .08);
  fill(CORAL);
  const m2 = sz => ({ size: sz, w: ME[2].w, tr: ME[2].tr, col: IVORY }), m2b = sz => ({ size: sz, w: 650, tr: -.01, col: NAVY }), you = sz => ({ size: sz, w: 900, tr: YOU.tr, col: NAVY });
  const endA = E(52) - .5;
  const items = [
    lineItem(t, 43, [{ a: 0, b: 16, o: { size: 76, w: 700, fam: EN, tr: .02, col: NAVY } }], 110),
    lineItem(t, 44, [{ a: 0, b: 6, o: m2(110) }], 150),
    lineItem(t, 45, [{ a: 0, b: 3, o: m2(100) }, { a: 3, b: 4, o: you(170) }], 190),
    lineItem(t, 45, [{ a: 4, b: 11, o: m2(100) }], 140, { t0: cT(45, 4) }),
    lineItem(t, 46, [{ a: 0, b: 6, o: m2b(110) }], 150),
    lineItem(t, 47, [{ a: 0, b: 3, o: { ...you(170), box: true } }, { a: 3, b: 8, o: m2(90) }], 200),
    lineItem(t, 48, [{ a: 0, b: 16, o: { size: 76, w: 700, fam: EN, tr: .02, col: NAVY } }], 110),
    lineItem(t, 49, [{ a: 0, b: 16, o: { size: 76, w: 700, fam: EN, tr: .02, col: IVORY } }], 110),
    lineItem(t, 50, [{ a: 0, b: 7, o: { ...m2b(130), fx: G => { const d = [[-1, 0], [0, -1], [1, 0], [0, 1]][G.k % 4], q = eIn(seg(t, E(50) - .1, .9)); return { dx: d[0] * q * 1300, dy: d[1] * q * 1300 } } } }], 170),
    lineItem(t, 51, [{ a: 0, b: 6, o: { size: 70, w: 400, fam: EN, tr: .2, col: NAVY, upper: false } }], 100),
    lineItem(t, 51, [{ a: 6, b: 11, o: { size: 150, w: 650, tr: -.02, col: IVORY } }, { a: 11, b: 13, o: m2(90) }], 200, { t0: cT(51, 6) }),
    lineItem(t, 52, [{ a: 0, b: 6, o: m2b(130) }], 170),
  ];
  // keep the newest line on the page: when the flow runs past the bottom, the whole column scrolls up with it
  let total = 0; for (const it of items) total += it.h * eOutQ(seg(t, it.t0 - .12, .45));
  const scroll = Math.max(0, total + 180 - (H - 140));
  const montage = t > cT(46, 6) - .05 && t < S(47) - .05;
  if (!montage) {
    flow(t, items, 180 - scroll);
  }
  if (montage) {                                                               // "패배자의 montage": four hard cuts on the beat, four ways to set one word
    const k = Math.floor((t - (cT(46, 6) - .05)) / BEAT) % 4;
    fill([NAVY, IVORY, ACID, NAVY][k]); const c = [IVORY, NAVY, NAVY, CORAL][k];
    if (k === 0) txt('패배자', -80, 1300, { size: 700, w: 900, col: c });
    if (k === 1) for (let j = 0; j < 3; j++) txt('패배자'[j], CX, 560 + j * 480, { size: 460, w: 900, col: c, al: 'center' });
    if (k === 2) txt('패배자', CX, 990, { size: 60, w: 320, tr: .4, col: c, al: 'center' });
    if (k === 3) { txt('패배자', CX, 1100, { size: 330, w: 900, col: c, al: 'center', outline: true, lw: 4 }); txt('MONTAGE', CX, 1300, { size: 60, w: 600, fam: EN, tr: .4, col: c, al: 'center' }) }
  }
  g.restore();
}
