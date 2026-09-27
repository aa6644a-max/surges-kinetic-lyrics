/* PURETYPE act 1 (0 - 70.4): OPENING, MARGIN, ROLE, CHORUS 1.
   The rule is taught in the first 15 s: size = narrative hierarchy. The main character's words are big, heavy and central;
   ME is a footnote, a margin note, something in parentheses. */

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

// ================= S1 MARGIN 15.2 - 31.0 (an editorial page: the big words own the column, ME lives in the margin) =================
const MARGIN_X = 64, COL_X = 340;
function S1(t) {
  fill(IVORY);
  for (let k = 1; k < 12; k++) line(k * 90, 0, k * 90, H, 1, NAVY, .06, 1);
  line(COL_X - 30, 120, COL_X - 30, H - 120, 2, NAVY, .25, 1);                    // the gutter between margin and column
  txt('SUB CHARACTER  —  P. 1', MARGIN_X, 110, { size: 20, w: 520, fam: EN, tr: .18, col: NAVY, alpha: .5 });
  const ink = eIO(seg(t, S(8) - .2, 1.6));                                     // "오염되어 가": every line gains weight like a spreading stain
  const heavy = w => lerp(w, 900, ink);
  // main column: a flow. Each new block pushes the ones below it (type reflow).
  const main = [
    { t0: S(3), h: 110, draw: (y, p) => lyr(t, 3, 0, null, COL_X, y + 70, { size: 60, w: heavy(ME[1].w), tr: ME[1].tr, col: NAVY, rev: 'fade', alpha: p }) },   // ME's thought slips in above
    { t0: S(1), h: 210, draw: (y, p) => { const L = lyr(t, 1, 0, 4, COL_X - 6, y + 170, { size: 165, w: 900, tr: YOU.tr, col: NAVY, rev: 'rise', alpha: p });
        lyr(t, 1, 4, 5, L.x0 + L.width + 10, y + 80, { size: 34, w: heavy(ME[1].w), tr: .1, col: NAVY, alpha: p }) } },                                   // 만: a superscript
    { t0: S(5), h: 330, draw: (y, p) => lyr(t, 5, 0, 3, COL_X - 10, y + 300, { size: 340, w: 900, tr: YOU.tr, col: NAVY, rev: 'rise', alpha: p }) },           // 너처럼: runs off the page (overscan)
    { t0: S(6), h: 130, draw: (y, p) => lyr(t, 6, 0, null, COL_X, y + 90, { size: 72, w: heavy(700), tr: -.02, col: NAVY, rev: 'fade', alpha: p,
        fx: G => G.k >= 7 ? { dy: eIn(seg(t, G.t + .2, .9)) * 260, al: 1 - seg(t, G.t + .6, .5) } : {} }) },                                            // 빠져: falls through the baseline
    { t0: S(8), h: 160, draw: (y, p) => lyr(t, 8, 0, null, COL_X, y + 125, { size: 120, w: 320, tr: .02, col: NAVY, rev: 'weight', from: 320, alpha: p,
        fx: (G, a) => ({ w: lerp(320, 900, eIO(seg(t, G.t, 1.1))) }) }) },                                                                                // 오염되어 가: thin -> black
  ];
  flow(t, main, 300);
  // the margin: footnotes. Small, light, wide.
  const mg = { size: 30, tr: ME[1].tr, col: NAVY };
  const note = (i, y, n) => { if (t < S(i) - .2) return; txt(String(n), MARGIN_X - 26, y - 14, { size: 16, w: 600, fam: EN, col: CORAL }); lyr(t, i, 0, null, MARGIN_X, y, { ...mg, w: heavy(ME[1].w), rev: 'fade' }) };
  note(0, 420, 1); note(2, 560, 2); note(4, 900, 3); note(7, 1500, 5);
  if (t > S(5) + .5) { txt('(', MARGIN_X - 12, 1190, { size: 30, w: 300, col: NAVY }); lyr(t, 5, 3, null, MARGIN_X + 4, 1190, { ...mg, w: heavy(ME[1].w), rev: 'fade' }); txt(')', MARGIN_X + 210, 1190, { size: 30, w: 300, col: NAVY, alpha: seg(t, E(5), .3) }) }
  // L2 "뚫어지게 쳐다보다": the gaze is a hairline from the margin note to the big word
  line(MARGIN_X + 250, 548, COL_X - 10, 460, 2, CORAL, .9, eOut(seg(t, S(2), E(2) - S(2))));
  // L9 "빠르게 식어 가": the page cools. A navy disc spreads from the last line and becomes the next page.
  if (t > S(9) - .3) {
    lyr(t, 9, 0, null, COL_X, 1820, { size: 60, w: ME[1].w, tr: ME[1].tr, col: NAVY, rev: 'fade' });
    disc(COL_X + 60, 1790, eIn(seg(t, S(9) + .2, E(9) - S(9) + .1)) * 2500, NAVY);
    if (t > S(9) + .2) lyr(t, 9, 0, null, COL_X, 1820, { size: 60, w: ME[1].w, tr: ME[1].tr, col: IVORY, alpha: seg(t, S(9) + .5, .4) });
  }
}

// ================= S2 ROLE 31.0 - 48.4 (a vertical hierarchy; ME is pressed between the strokes) =================
function S2(t) {
  fill(NAVY);
  const press = eIn(seg(t, S(15), E(16) - S(15))), crash = eIn(seg(t, 47.7, .7));      // the giant words bear down on ME's line
  const dropY = press * 150 + crash * 120;
  // 주인공, set vertically down the right side, each glyph lands on its sung syllable. Cropped at top and bottom.
  for (let k = 0; k < 3; k++) {
    const G = chars(10)[9 + k], a = seg(t, G.t - .04, .28), y = 360 + k * 600 + dropY - (1 - eOutQ(a)) * 500;
    if (a > 0) txt(G.c, 1080 - 30, y, { size: 580, w: 900, tr: 0, col: IVORY, al: 'right', alpha: clamp(a * 2) });
  }
  // L10 "알고 있어, 난 아니야": small, wide, squeezed at the left edge
  lyr(t, 10, 0, 9, 64, 560, { size: 34, w: ME[1].w, tr: ME[1].tr, col: IVORY, rev: 'fade', keep: .5 });
  // L11 a ladder of rules: rank without a cast card. The last, shortest rung is ME's.
  const rungs = [340, 280, 220, 160, 110, 70, 40], la = seg(t, S(11) - .3, .6), ly = 760 + crash * 300;
  rungs.forEach((w, k) => line(64, ly + k * 44, 64 + w * eOut(seg(t, S(11) + k * .09, .4)), ly + k * 44, Math.max(1, 10 - k * 1.4), IVORY, .5 * la, 1));
  lyr(t, 11, 0, 5, 64, ly + 7 * 44 + 30, { size: 26, w: ME[1].w, tr: ME[1].tr, col: IVORY, rev: 'fade', keep: .6 });
  lyr(t, 11, 5, 10, 64, ly + 7 * 44 + 70, { size: 18, w: 500, fam: EN, tr: .3, col: CORAL, rev: 'type', keep: .8 });   // EXTRA
  lyr(t, 11, 10, null, 170, ly + 7 * 44 + 70, { size: 18, w: ME[1].w, tr: .1, col: IVORY, rev: 'fade', keep: .6 });
  // L12 "완벽해" crosses the vertical stack: a collision of two main-character words (acid)
  if (t > S(12)) {
    lyr(t, 12, 0, 7, 64, 1040 + dropY, { size: 30, w: ME[1].w, tr: ME[1].tr, col: IVORY, rev: 'fade', keep: .5 });
    const G0 = chars(12)[7], sl = eOutQ(seg(t, G0.t - .1, .5));
    const shove = eIn(seg(t, cT(13, 6) - .1, .45));
    lyr(t, 12, 7, 10, lerp(-900, 40, sl) + shove * 1300, 1330 + dropY, { size: 290, w: 900, tr: YOU.tr, col: ACID, rev: 'type' });
    lyr(t, 12, 10, null, 64, 1400 + dropY, { size: 30, w: ME[1].w, tr: ME[1].tr, col: IVORY, rev: 'fade', keep: .5 });
  }
  // L13 ME's line runs behind a giant 널: it is only readable in the gaps between the strokes
  if (t > S(13) - .2) {
    lyr(t, 13, 0, 6, 64, 1560 + dropY * .5, { size: 30, w: ME[1].w, tr: ME[1].tr, col: IVORY, rev: 'fade', keep: .5 });
    lyr(t, 13, 7, null, 40, 1500 + dropY * .3, { size: 120, w: 700, tr: .5, col: CORAL, rev: 'fade' });
    const G = chars(13)[6], a = eOutQ(seg(t, G.t - .05, .35));
    txt('널', lerp(-200, 24, a), 1640 + dropY * .3, { size: 470, w: 900, tr: 0, col: IVORY, alpha: clamp(a * 2) });
  }
  // L14 an aside in parentheses
  if (t > S(14) - .2) { txt('(', 400, 200, { size: 44, w: 300, col: CORAL }); lyr(t, 14, 0, null, 420, 200, { size: 30, w: ME[1].w, tr: .08, col: CORAL, rev: 'fade', keep: .6 }); txt(')', 1000, 200, { size: 44, w: 300, col: CORAL, al: 'right', alpha: seg(t, E(14), .3) }) }
  // L15-16 ME holds everything up: her line is the floor the giant words press on; it strains (weight) as they bear down
  if (t > S(15) - .2) {
    const by = 1840 - press * 30;
    line(0, by + 20, W, by + 20, 3 + press * 9 + crash * 30, CORAL, 1, 1);
    lyr(t, 15, 0, null, 64, by - 70, { size: 34, w: ME[1].w, tr: ME[1].tr, col: IVORY, rev: 'fade', keep: .6 });
    lyr(t, 16, 0, null, 64, by - 10, { size: 60, w: ME[1].w, tr: lerp(.12, .02, press), col: IVORY, rev: 'fade', fx: () => ({ w: lerp(320, 760, press) }) });
  }
  // the floor gives: a violet page rises from the strained line and becomes the chorus
  const up = eIn(seg(t, 47.9, .55)); if (up > 0) rect(0, H - up * H, W, up * H + 10, VIOLET);
}

// ================= S3 CHORUS 1 48.4 - 70.4 (collision: sentences push each other out of the way) =================
function S3(t) {
  fill(VIOLET);
  // L17 I'M A SUB CHARACTER: letters scattered across the width snap together (tracking), then get shoved to the top
  if (t < S(19)) {
    const conv = eOutQ(seg(t, S(17) - .2, 1.3)), shove = eIO(seg(t, S(18) - .1, .5));
    txt('I’M A SUB CHARACTER', CX, lerp(980, 230, shove), { size: lerp(64, 30, shove), w: 520, fam: EN, tr: lerp(1.6, .06, conv), col: IVORY, al: 'center', alpha: seg(t, S(17) - .3, .3) });
  }
  // L18 우린 / 안 비슷해: two words on different baselines, pushed apart
  if (t > S(18) - .1 && t < S(19) + .4) {
    const push = eOutQ(seg(t, cT(18, 2), .5)), out = eIn(seg(t, S(19) - .1, .45));
    lyr(t, 18, 0, 2, 64 - push * 40 - out * 900, 900, { size: 260, w: 900, tr: YOU.tr, col: IVORY, rev: 'grow' });
    lyr(t, 18, 2, null, 1016 + push * 40 + out * 900, 1180 + push * 60, { size: 140, w: 900, tr: -.03, col: CORAL, rev: 'grow', al: 'right' });
  }
  // L19 넌: a glyph too big for the page (overscan); "빛나는지" shines across it as spreading tracking + hairlines
  if (t > S(19) - .1 && t < S(20) + .3) {
    const G = chars(19)[3], a = eOutQ(seg(t, G.t - .06, .4)), out = eIn(seg(t, S(20) - .1, .4));
    txt('넌', CX + out * 1400, 1450, { size: lerp(1400, 1000, a), w: 900, tr: 0, col: ACID, al: 'center', alpha: clamp(a * 3) });
    lyr(t, 19, 0, 3, 64, 330, { size: 40, w: ME[1].w, tr: ME[1].tr, col: IVORY, rev: 'fade' });
    lyr(t, 19, 4, 8, 64, 400, { size: 40, w: ME[1].w, tr: ME[1].tr, col: IVORY, rev: 'fade' });
    const sh = eOutQ(seg(t, cT(19, 8), 1.2));
    lyr(t, 19, 8, null, CX, 1030, { size: 120, w: 800, tr: lerp(-.03, .5, sh), col: NAVY, rev: 'type', al: 'center' });
    for (let k = 0; k < 9; k++) { const y = 900 + k * 34; line(CX - 60 - sh * 560, y, CX + 60 + sh * 560, y, 2, NAVY, .35 * sh * (1 - Math.abs(k - 4) / 5), 1) }
  }
  // L20-21 모두 널 좋아해: a crowd typeset out of 좋아해; then the crowd reflows into a pyramid under 널
  if (t > S(20) - .15 && t < S(22) + .2) {
    const pyr = eIO(seg(t, S(21) - .1, 1.0)), cols = 5, rows = 16;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const n = r * cols + c, on = seg(t, S(20) + r * .05, .2); if (on <= 0) continue;
      const gx = 110 + c * 215, gy = 180 + r * 110;
      const pr = Math.floor(Math.sqrt(n)), pc = n - pr * pr, pw = 2 * pr + 1;      // pyramid slot: row pr holds 2pr+1 words
      const px = CX + (pc - (pw - 1) / 2) * 118, py = 980 + pr * 70;
      const x = lerp(gx, px, pyr), y = lerp(gy, py, pyr);
      txt('좋아해', x, y, { size: lerp(44, 30, pyr), w: 600, tr: 0, col: IVORY, al: 'center', alpha: on * (pr < 11 ? 1 : 1 - pyr) * .85 });
    }
    lyr(t, 20, 2, 3, CX, lerp(1060, 900, pyr), { size: 420, w: 900, tr: 0, col: NAVY, al: 'center', rev: 'grow' });
    if (t > S(21) - .1) lyr(t, 21, 0, null, CX, 260, { size: 90, w: 700, tr: -.02, col: IVORY, al: 'center', rev: 'rise' });
    const wipe = eIn(seg(t, S(22) - .25, .45)); if (wipe > 0) { g.save(); g.translate(CX, CY); g.rotate(-.35); rect(-1400, -1400 + (1 - wipe) * 2800, 2800, 2800, CORAL); g.restore() }
  }
  // L22 행복해: the coral block; L23 ME's line is pushed into the corner by it
  if (t > S(22) - .25 && t < S(24)) {
    if (t > S(22) + .2) fill(CORAL); const sl = eIO(seg(t, S(23), .6));
    lyr(t, 22, 0, 3, 64 - sl * 60, 1100, { size: 330, w: 900, tr: YOU.tr, col: IVORY, rev: 'rise' });
    lyr(t, 22, 3, null, 70, 1200, { size: 40, w: ME[1].w, tr: ME[1].tr, col: NAVY, rev: 'fade' });
    if (t > S(23) - .1) lyr(t, 23, 0, null, lerp(700, 64, sl), lerp(1500, 1830, sl), { size: lerp(40, 20, sl), w: 520, fam: EN, tr: .2, col: NAVY, rev: 'type' });
  }
  // L24 LOSER: a ghost, outlined, cropped
  if (t > S(24) - .1 && t < S(25) + .1) {
    fill(NAVY); lyr(t, 24, 0, 11, 64, 700, { size: 40, w: 520, fam: EN, tr: .2, col: IVORY, rev: 'type' });
    lyr(t, 24, 11, null, -40, 1260, { size: 520, w: 800, fam: EN, tr: -.04, col: IVORY, rev: 'type', outline: true, lw: 4 });
  }
  // L25 열등감으로 찬: a frame fills up with the line, row after row, until it is full
  if (t > S(25) - .1 && t < S(26) + .2) {
    fill(NAVY); const rows = 18, full = seg(t, S(25), E(25) - S(25) + .2);
    line(40, 40, W - 40, 40, 3, CORAL); line(40, H - 40, W - 40, H - 40, 3, CORAL); line(40, 40, 40, H - 40, 3, CORAL); line(W - 40, 40, W - 40, H - 40, 3, CORAL);
    for (let r = 0; r < rows; r++) { const a = seg(full, r / rows, 1 / rows); if (a <= 0) continue; txt('열등감으로 찬  열등감으로 찬', 70 - (r % 2) * 140, H - 90 - r * 100, { size: 72, w: 700, tr: -.02, col: r === 0 ? ACID : IVORY, alpha: a * (r === 0 ? 1 : .55) }) }
  }
  // L26 Tell me / 나쁜 맘: acid page; the words get heavier until they are almost solid
  if (t > S(26) - .15 && t < S(27)) {
    fill(ACID);
    lyr(t, 26, 0, 6, 64, 400, { size: 60, w: 400, fam: EN, tr: .3, col: NAVY, rev: 'type', upper: false });
    lyr(t, 26, 6, 8, 64, 560, { size: 60, w: ME[1].w, tr: ME[1].tr, col: NAVY, rev: 'fade' });
    lyr(t, 26, 8, 10, 40, 1120, { size: 440, w: 100, tr: -.02, col: NAVY, rev: 'weight', from: 100, fx: G => ({ w: lerp(100, 900, eIO(seg(t, G.t, 1.6))) }) });
    lyr(t, 26, 10, null, 64, 1400, { size: 150, w: 700, tr: -.02, col: NAVY, rev: 'rise' });
  }
  // L27 I WANNA BE / YOU, then the camera goes through the counter of the O (COUNTER PORTAL)
  if (t > S(27) - .1) {
    const dive = eIn(seg(t, 69.2, 1.2)), size = 460;
    const wYou = measure('YOU', 800, size, -.04, EN), x0 = CX - wYou / 2;
    font(800, size, EN); setTrack(-.04 * size); const wY = g.measureText('Y').width, wO = g.measureText('O').width;
    const ox = x0 + wY + wO / 2, oy = 1150 - size * .36;                        // centre of the O's counter
    g.save(); const s = 1 + dive * 60; g.translate(ox, oy); g.scale(s, s); g.translate(-ox, -oy);
    // the page with a hole where the counter is: behind it, the next section (navy) is already there
    fill(NAVY);
    g.fillStyle = ACID; g.beginPath(); g.rect(-3000, -3000, 7000, 7000); if (t > cT(27, 9)) g.ellipse(ox, oy, wO * .27, size * .27, 0, 0, 7); g.fill('evenodd');   // the counter opens once the O is there
    lyr(t, 27, 0, 8, CX, 700, { size: 64, w: 400, fam: EN, tr: .3, col: NAVY, rev: 'type', al: 'center' });
    lyr(t, 27, 8, null, CX, 1150, { size, w: 800, fam: EN, tr: -.04, col: NAVY, rev: 'grow', al: 'center' });
    g.restore();
  }
}
