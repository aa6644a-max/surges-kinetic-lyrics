/* PURETYPE frames without lyrics: the opening (0 - 15.2), the interlude (70.4 - 82.3) and the end card (204.2 - 214.4).
   The sung lines are all performed by perform.js. */

// ================= S0 OPENING 0 - 15.2 (navy page, one footnote, the title word pushes it aside) =================
function S0(t) {
  fill(NAVY);
  const hit = onBeat(16), inP = eOutQ(seg(t, hit, .55));                        // 7.98 s: the main word arrives
  const spread = eIn(seg(t, 13.6, 1.5));                                       // 13.6: tracking expansion carries it off
  // the footnote: alone in the middle of an empty page, then shoved into the margin by the big word
  const fx = lerp(CX, 70, inP), fy = lerp(1000, 1760, inP), fs = lerp(40, 28, inP);
  const fa = seg(t, .6, 1.2);
  txt('1', fx - (inP > .5 ? 0 : 22), fy - fs * .55, { size: fs * .55, w: 500, fam: EN, col: CORAL, al: inP > .5 ? 'left' : 'right', alpha: fa });
  txt('나', fx + (inP > .5 ? fs * .5 : 0), fy, { size: fs, w: 320, tr: .12, col: IVORY, al: inP > .5 ? 'left' : 'center', alpha: fa * .9 });
  // a hairline baseline under the footnote: the page's first line
  line(lerp(CX - 90, 70, inP), fy + 22, lerp(CX + 90, 380, inP), fy + 22, 1.5, IVORY, .35 * fa, seg(t, 2.2, 2.4));
  if (t >= hit - .1) {
    const tr = -.045 + spread * 2.2, x = lerp(W + 40, 64, inP);
    txt('주인공', x, 1180, { size: 330, w: 900, tr, col: IVORY });
    txt('1', x + measure('주인공', 900, 330, -.045) + 10, 930, { size: 44, w: 600, fam: EN, col: CORAL, alpha: seg(t, 9.9, .4) * (1 - spread) });   // the big word points to its footnote
  }
  // production credits and the grid it will be set on
  const ca = seg(t, 10.0, .8) * (1 - seg(t, 14.4, .6));
  txt('SUB CHARACTER', 64, 170, { size: 22, w: 520, fam: EN, tr: .18, col: IVORY, alpha: .75 * ca });
  txt('YOUNHA', 1016, 170, { size: 22, w: 520, fam: EN, tr: .18, col: IVORY, al: 'right', alpha: .75 * ca });
  for (let k = 1; k < 12; k++) line(k * 90, 0, k * 90, H, 1, IVORY, .07 * seg(t, 11.9 + k * .05, .6), 1);
  // the footnote's dot becomes the next page: an ivory disc grows from it
  const grow = eIn(seg(t, 14.3, .95)); disc(fx + fs * .9, fy - fs * .3, grow * 2400, IVORY);
}

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

// ================= S11 END 204.2 - 214.4: everything clears; 서브 small and 캐릭터 big become one size; a period remains =================
function S11(t) {
  fill(IVORY);
  const clear = eIn(seg(t, 204.2, .8));                                       // the last lines slide out to the left, aligned
  if (t < 205.2) renderScene(scene(81), t, PSECT[PSECT.length - 1]);           // the last sung line breaks apart as the end card begins
  const inA = eOut(seg(t, 205.0, .8)), eq = eIO(seg(t, 207.6, 2.6)), gone = eIn(seg(t, 211.2, 1.2));
  const sS = lerp(80, 200, eq), wS = lerp(320, 800, eq), sC = lerp(260, 200, eq), wC = lerp(900, 800, eq);
  const wSub = measure('서브', wS, sS, lerp(.12, -.03, eq)), wChar = measure('캐릭터', wC, sC, -.03), gap = lerp(20, 8, eq);
  const x0 = CX - (wSub + gap + wChar) / 2, y = 1030;
  if (gone < 1) {
    txt('서브', x0, y, { size: sS, w: wS, tr: lerp(.12, -.03, eq), col: NAVY, alpha: inA * (1 - gone) });
    txt('캐릭터', x0 + wSub + gap, y, { size: sC, w: wC, tr: -.03, col: NAVY, alpha: inA * (1 - gone) });
    txt('SUB CHARACTER  ·  YOUNHA', CX, y + 120, { size: 24, w: 520, fam: EN, tr: .2, col: NAVY, al: 'center', alpha: .7 * seg(t, 209.2, .8) * (1 - gone) });
  }
  const px = lerp(x0 + wSub + gap + wChar + 26, CX, gone);                      // the period stays
  disc(px, y - 12, 16, CORAL, seg(t, 209.8, .4));
}
