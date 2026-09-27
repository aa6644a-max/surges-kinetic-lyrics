/* PURETYPE act 3 (137.5 - 214.4): BRIDGE, FINAL CHORUS, OWN LINE, END.
   ME's type reaches act 3 (weight 700-900, large, tight). At the end the two hierarchies share one baseline and one weight. */

// ================= S8 BRIDGE 137.5 - 156.6: almost nothing. One small line, wide space; the weight slowly rises =================
function S8(t) {
  fill(IVORY);
  const wBase = lerp(300, 620, seg(t, 138, 17.5));                             // across the bridge ME gets heavier, very slowly
  const m = (sz, extra) => ({ size: sz, w: wBase, tr: lerp(.14, .04, seg(t, 138, 17.5)), col: NAVY, al: 'center', rev: 'fade', ...extra });
  const only = (i, y, sz, o = {}) => { if (t > S(i) - .2 && t < (o.until ?? S(i + 1) - .1)) lyr(t, i, 0, null, CX, y, m(sz, { alpha: 1 - eIn(seg(t, (o.until ?? S(i + 1)) - .5, .4)), ...o })) };
  // L53: a whisper inside a closed pair of brackets
  if (t < S(54)) { only(53, 980, 40); const L = layout(53, 0, chars(53).length, m(40)); brackets(CX, 965, L.width + 50, 90, 2, CORAL, 0, seg(t, S(53), .8) * (1 - seg(t, S(54) - .5, .4))) }
  // L54-55: a balance. 너 heavy on the left, 날 light on the right; the beam tips toward 너, then levels as 너 loses weight
  if (t > S(54) - .2 && t < S(56)) {
    const out = eIn(seg(t, S(56) - .5, .4)), lighten = eIO(seg(t, S(55), E(55) - S(55)));
    const tilt = lerp(.12, 0, lighten) * seg(t, cT(54, 7), .8), bx = CX, by = 1120;
    lyr(t, 54, 0, 5, CX, 800, m(40, { alpha: 1 - out }));
    g.save(); g.translate(bx, by); g.rotate(-tilt); g.globalAlpha = 1 - out;
    line(-360, 0, 360, 0, 2, NAVY, 1 - out, eOut(seg(t, S(54), .8)));
    const wN = lerp(900, 520, lighten);
    lyr(t, 54, 5, 6, -360, -20, { size: 90, w: wN, tr: 0, col: NAVY, al: 'center', rev: 'fade', alpha: 1 - out });
    lyr(t, 54, 7, 8, 360, -20, { size: 90, w: wBase, tr: 0, col: NAVY, al: 'center', rev: 'fade', alpha: 1 - out });
    g.restore();
    disc(bx, by + 30, 8, CORAL, 1 - out);
    lyr(t, 54, 8, null, CX, 1320, m(40, { alpha: 1 - out }));
    if (t > S(55) - .2) lyr(t, 55, 0, null, CX, 1480, m(36, { alpha: 1 - out }));
  }
  // L56: an exhale: the tracking opens and the line thins out
  if (t > S(56) - .2 && t < S(57)) { const ex = eOut(seg(t, S(56) + .4, 2.2)); lyr(t, 56, 0, null, CX, 960, m(44, { tr: lerp(.1, .9, ex), alpha: 1 - ex * .8 })) }
  // L57-58: inside brackets; each attempt to "fix" it shuts the brackets and opens them again
  if (t > S(57) - .2 && t < S(59)) {
    const L = layout(57, 0, chars(57).length, m(52)), tries = beatN(t) - beatN(S(58));
    const shut = t > S(58) ? Math.abs(Math.sin(Math.max(0, tries) * Math.PI / 2)) : 0, out = eIn(seg(t, S(59) - .4, .4));
    lyr(t, 57, 0, null, CX, 940, m(52, { alpha: 1 - out }));
    brackets(CX, 920, L.width + 60, 120, 3, CORAL, .2 * (1 - shut), 1 - out);
    if (t > S(58) - .2) lyr(t, 58, 0, null, CX, 1160, m(52, { alpha: 1 - out, fx: G => ({ w: wBase + 200 * shut }) }));
  }
  // L59: 안 되더라. The brackets open wide and fall away as lines; the lines become the grid the final chorus breaks
  if (t > S(59) - .2) {
    const open = eIO(seg(t, S(59) + .2, 1.2)), grid = eIO(seg(t, 155.4, 1.0));
    lyr(t, 59, 0, null, CX, 1000, m(90, { w: lerp(wBase, 700, open), alpha: 1 - eIn(seg(t, 156.2, .4)) }));
    brackets(CX, 970, 320, 160, 3, CORAL, open * 2, 1 - grid);
    for (let k = 0; k < 7; k++) line(k * 180, 0, k * 180, H, 3, NAVY, .9 * grid, grid);
    for (let k = 0; k < 11; k++) line(0, k * 192, W, k * 192, 3, NAVY, .9 * grid, grid);
  }
}

// ================= S9 FINAL CHORUS 156.6 - 179.2: break the grid. ME is now as big as anything on screen =================
function S9(t) {
  const brk = eIn(seg(t, 156.5, 1.0));
  const cols = [ACID, VIOLET, CORAL, NAVY];
  const sec = [S(60), S(61), S(62), S(63), S(64), S(65), S(66), S(67), S(68), S(69), S(70)];
  let k = 0; for (let j = 0; j < sec.length; j++) if (t >= sec[j] - .12) k = j;
  const bgc = [ACID, VIOLET, CORAL, NAVY, IVORY, ACID, VIOLET, NAVY, VIOLET, IVORY, NAVY][k]; fill(bgc);
  const ink = bgc === NAVY || bgc === VIOLET ? IVORY : NAVY;
  const me3 = (sz, extra) => ({ size: sz, w: ME[3].w, tr: ME[3].tr, col: ink, ...extra });
  // the grid from the bridge breaks: its lines tilt and fall away
  if (brk < 1) for (let j = 0; j < 7; j++) { g.save(); g.translate(j * 180, H / 2 + brk * brk * 2400 * (.6 + R(j, 3))); g.rotate(brk * (R(j, 4) - .5) * 1.2); line(0, -H, 0, H, 3, NAVY, 1 - brk, 1); g.restore() }
  // L60 I'M A SUB CHARACTER: on a diagonal, bigger than the page
  if (k === 0) { g.save(); g.translate(CX, CY); g.rotate(-.2); lyr(t, 60, 0, 4, -620, -120, { size: 300, w: 850, fam: EN, tr: -.04, col: ink, rev: 'grow' }); lyr(t, 60, 4, null, -700, 180, { size: 300, w: 850, fam: EN, tr: -.04, col: ink, rev: 'grow' }); g.restore() }
  // L61 우린 / 안 비슷해: now the same size, colliding
  if (k === 1) { const hit = eOutQ(seg(t, cT(61, 2), .35)); lyr(t, 61, 0, 2, lerp(-400, 40, hit), 880, me3(330, { w: 900, rev: 'type' })); lyr(t, 61, 2, null, lerp(1480, 1040, hit), 1240, me3(250, { w: 900, al: 'right', rev: 'type' })) }
  // L62 빛나는지: vertical and too tall for the page; the rest in act-3 weight beside it
  if (k === 2) {
    g.save(); g.translate(760, CY); g.rotate(Math.PI / 2); lyr(t, 62, 8, null, -1100 + (t - S(62)) * 200, 170, { size: 520, w: 900, tr: -.03, col: ink, rev: 'grow' }); g.restore();
    lyr(t, 62, 0, 3, 64, 700, me3(120, { rev: 'rise' })); lyr(t, 62, 3, 4, 64, 900, me3(180, { rev: 'rise' })); lyr(t, 62, 4, 8, 64, 1060, me3(110, { rev: 'rise' }));
  }
  // L63 모두 널 좋아해: the crowd grid breaks apart; its cells turn and drop
  if (k === 3) {
    const fall = seg(t, cT(63, 3), 1.2);
    for (let r = 0; r < 14; r++) for (let c = 0; c < 4; c++) { const n = r * 4 + c, d = eIn(clamp(fall * 1.6 - R(n, 1) * .6)); g.save(); g.translate(150 + c * 260, 200 + r * 120 + d * 1600); g.rotate(d * (R(n, 2) - .5) * 3); txt('좋아해', 0, 0, { size: 56, w: 700, col: IVORY, al: 'center', alpha: .7 * (1 - d * .5) }); g.restore() }
    lyr(t, 63, 0, 2, 64, 700, me3(160, { rev: 'rise' })); lyr(t, 63, 2, 3, CX, 1300, { size: 640, w: 900, col: CORAL, al: 'center', rev: 'grow' });
  }
  // L64 모두의 인정받고: a heavy diagonal line of type
  if (k === 4) { g.save(); g.translate(CX, CY); g.rotate(.25); lyr(t, 64, 0, null, 0, 60, me3(190, { al: 'center', rev: 'rise' })); g.restore() }
  // L65 행복해: cropped by the page edge
  if (k === 5) { lyr(t, 65, 0, 3, -60, 1180, { size: 520, w: 900, tr: -.04, col: ink, rev: 'grow' }); lyr(t, 65, 3, null, 64, 1400, me3(160, { rev: 'rise' })) }
  // L66 I'M A SUB CHARACTER: one enormous line running past; the camera follows it (baseline travel)
  if (k === 6) { const run = (t - S(66)) / (E(66) - S(66) + .3); lyr(t, 66, 0, null, 100 - run * 3600, 1150, { size: 560, w: 850, fam: EN, tr: -.03, col: ink, rev: 'type' }); line(0, 1200, W, 1200, 6, ACID, 1, 1) }
  // L67 LOSER, then into the counter of its O (COUNTER PORTAL) -> L68 inside
  if (k === 7) {
    const size = 560, dive = eIn(seg(t, E(67) - .45, .6)), wL = measure('LOSER', 850, size, -.04, EN), x0 = CX - wL / 2;
    font(850, size, EN); setTrack(-.04 * size); const wLl = g.measureText('L').width, wO = g.measureText('O').width;
    const ox = x0 + wLl + wO / 2, oy = 1150 - size * .36;
    g.save(); const s = 1 + dive * 70; g.translate(ox, oy); g.scale(s, s); g.translate(-ox, -oy);
    fill(VIOLET); g.fillStyle = NAVY; g.beginPath(); g.rect(-3000, -3000, 7000, 7000); if (t > cT(67, 12)) g.ellipse(ox, oy, wO * .26, size * .26, 0, 0, 7); g.fill('evenodd');
    lyr(t, 67, 0, 11, CX, 700, { size: 70, w: 600, fam: EN, tr: .25, col: IVORY, rev: 'type', al: 'center' });
    lyr(t, 67, 11, null, CX, 1150, { size, w: 850, fam: EN, tr: -.04, col: IVORY, rev: 'grow', al: 'center' });
    g.restore();
  }
  if (k === 8) { const fillUp = seg(t, S(68), E(68) - S(68)); for (let r = 0; r < 12; r++) { const a = seg(fillUp, r / 12, .1); if (a > 0) txt('열등감으로 찬', r % 2 ? 1016 : 64, 180 + r * 150, { size: 130, w: 900, tr: -.03, col: r === 11 ? ACID : IVORY, al: r % 2 ? 'right' : 'left', alpha: a }) } }
  // L69 TELL ME / 내가 나쁜 맘일까: the English and the Korean now at the same weight
  if (k === 9) { lyr(t, 69, 0, 6, 64, 760, { size: 230, w: 850, fam: EN, tr: -.03, col: ink, rev: 'grow', upper: true }); lyr(t, 69, 6, 10, 64, 1060, me3(230, { w: 850, rev: 'grow' })); lyr(t, 69, 10, null, 64, 1330, me3(230, { w: 850, rev: 'grow' })) }
  // L70 I WANNA BE YOU: one line, one size; then the tracking closes to nothing (the page folds to navy)
  if (k === 10) { const close = eIn(seg(t, 178.4, .8)); lyr(t, 70, 0, null, CX, 1020, { size: 130, w: 850, fam: EN, tr: lerp(-.02, -.6, close), col: IVORY, al: 'center', rev: 'grow', alpha: 1 - close }) }
}

// ================= S10 OWN LINE 179.2 - 204.2: the footnote now sets title-size lines. YOU is not erased: they share a baseline =================
function S10(t) {
  const flip = eIO(seg(t, S(77) - .25, .45));                                  // "I don't care": the page turns ivory
  fill(NAVY); if (flip > 0) rect(0, H * (1 - flip), W, H * flip + 2, IVORY);
  const ink = flip > .5 ? NAVY : IVORY, me3 = (sz, extra) => ({ size: sz, w: ME[3].w, tr: ME[3].tr, col: ink, ...extra });
  // L71: 내 이야기는 결국, set in title size; the weight arrives as it is sung (300 -> 860)
  if (t < S(73) - .1) {
    const up = eIO(seg(t, S(72) - .2, .6));
    lyr(t, 71, 0, 5, 64, lerp(900, 540, up), { size: 190, w: 860, tr: -.03, col: IVORY, rev: 'weight', from: 300, dur: .5 });
    lyr(t, 71, 5, null, 64, lerp(1110, 750, up), { size: 190, w: 860, tr: -.03, col: IVORY, rev: 'weight', from: 300, dur: .5 });
    if (t > S(72) - .2) lyr(t, 72, 0, null, 64, 960, { size: 76, w: 700, fam: EN, tr: -.01, col: ACID, rev: 'rise' });
  }
  // L73-76: a column of ME's lines at act-3 weight, each new line pushing the others up
  if (t > S(73) - .2 && t < S(77) + .2) {
    const out = eIn(seg(t, S(77) - .25, .4));
    const it = (i, a, b, sz, t0) => ({ t0: t0 ?? S(i), h: sz * 1.2, draw: (y, p) => lyr(t, i, a, b, 64, y + sz, me3(sz, { col: IVORY, rev: 'rise', alpha: p * (1 - out) })) });
    flow(t, [it(76, 0, null, 150), it(75, 6, null, 120, cT(75, 6)), it(75, 0, 6, 120), it(74, 7, null, 130, cT(74, 7)), it(74, 0, 7, 130), it(73, 0, null, 150)], 1700, { up: true });
  }
  // L77 I DON'T CARE / 그래도, the same size in both families
  if (t > S(77) - .2 && t < S(79) - .1) {
    lyr(t, 77, 0, 10, 64, 620, { size: 140, w: 850, fam: EN, tr: -.03, col: NAVY, rev: 'grow' });
    lyr(t, 77, 10, null, 64, 830, me3(170, { w: 880, rev: 'grow' }));
    if (t > S(78) - .1) lyr(t, 78, 0, null, 64, 1180, me3(240, { w: 900, col: CORAL, rev: 'grow' }));
  }
  // L79 매달릴 순 있잖아: each syllable hangs from a bar on its own thread, swinging a little
  if (t > S(79) - .2 && t < S(80) - .1) {
    const bar = eOut(seg(t, S(79) - .2, .4)); line(64, 520, W - 64, 520, 10, NAVY, 1, bar);
    const L = layout(79, 0, chars(79).length, me3(150, { w: 860 }));
    L.gl.forEach((G, j) => { const a = seg(t, G.t - .05, .3); if (a <= 0) return; const x = 64 + G.x + G.w / 2, len = 380 + (j % 3) * 90, sw = Math.sin(t * 2.2 + j) * .06 * (1 - a * .5);
      g.save(); g.translate(x, 520); g.rotate(sw); line(0, 0, 0, len * eOutQ(a), 2, NAVY, 1, 1); txt(G.c, 0, len * eOutQ(a) + 130, { size: 150, w: 860, col: NAVY, al: 'center', alpha: a }); g.restore() });
  }
  // L80-81: 내 손을 from the left, 잡아 줘 from the right, meeting on one baseline; 넌 주인공이니까 set right under it at the same weight
  if (t > S(80) - .2) {
    lyr(t, 80, 0, 7, 64, 620, { size: 110, w: 800, fam: EN, tr: -.02, col: NAVY, rev: 'type' });
    const meet = eOutQ(seg(t, cT(80, 7) - .1, .7));
    lyr(t, 80, 7, 10, lerp(-700, 64, meet), 1000, me3(140, { w: 880, rev: 'type' }));
    lyr(t, 80, 10, null, lerp(1780, 1016, meet), 1000, me3(140, { w: 880, al: 'right', rev: 'type' }));
    line(64, 1040, W - 64, 1040, 4, CORAL, 1, eOut(seg(t, cT(80, 10), .6)));
    if (t > S(81) - .2) lyr(t, 81, 0, null, 64, 1240, { size: 140, w: 880, tr: -.03, col: NAVY, rev: 'rise' });
  }
}

// ================= S11 END 204.2 - 214.4: everything clears; 서브 small and 캐릭터 big become one size; a period remains =================
function S11(t) {
  fill(IVORY);
  const clear = eIn(seg(t, 204.2, .8));                                       // the last lines slide out to the left, aligned
  if (clear < 1) { lyr(t, 80, 7, null, 64 - clear * 1300, 1000, { size: 140, w: 880, tr: -.03, col: NAVY }); lyr(t, 81, 0, null, 64 - clear * 1500, 1240, { size: 140, w: 880, tr: -.03, col: NAVY }) }
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
