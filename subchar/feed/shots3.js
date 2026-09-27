/* FEED act 3 (137.5 - 214.4): the quiet (lock screen, the scale, a breath, saves that fail), the final chorus (the UI
   breaks, the type is huge and ME's is as big as YOU's), ME's own post (picked, captioned, uploaded, the words hanging from
   the progress bar), YOU's hand in the DM, one like, and the title whose period is the dot from the first second. */

// ================= BRIDGE 137.5 - 156.6 =================
function BR(t) {
  fill(DEEP); blurBg('mem_rain', DEEP, .84);
  const lockA = seg(t, 137.5, .6) * (1 - seg(t, S(57) - .4, .5));
  // lock screen: the time, airplane mode, no notifications
  if (lockA > 0) {
    const cs = spr(t, [[0, .6], [137.55, 1, 1.6, .5]]);
    g.save(); g.translate(CX, 520); g.scale(cs, cs); txt('02:14', 0, 0, { size: 230, w: 200, fam: EN, col: WHITE, al: 'center', alpha: lockA, upper: false }); g.restore();
    blob(CX, 250, 300, 70, { col: 'rgba(255,255,255,.14)', round: 1, alpha: lockA }); pillText(CX, 253, '비행기 모드', { size: 30, w: 600, col: WHITE, alpha: lockA });
    const ns = spr(t, [[0, 0], [137.9, 1, 2.4, .36]]); if (ns > .01) { g.save(); g.translate(CX, 760); g.scale(ns, ns); blob(0, 0, 520, 90, { col: 'rgba(255,255,255,.12)', round: 1, alpha: lockA }); pillText(0, 3, '새 알림 없음', { size: 36, w: 500, col: GREY, alpha: lockA }); g.restore() }
    cap(t, 53, 0, null, CX, 940, { size: 44, w: 400, tr: .1, col: WHITE, al: 'center', alpha: lockA, hide: S(54) - .1 });
  }
  // L54-55 two faces on a scale: YOU heavy, then lighter as ME thinks badly of YOU; the beam levels
  if (t > S(54) - .3 && t < S(57)) {
    const on = spr(t, [[0, 0], [S(54) - .2, 1, 2.2, .38], [S(56) - .15, 0, 2.2, .6]]), tilt = spr(t, [[0, 0], [cT(54, 5), -.2, 1.6, .3], [S(55) + .4, -.1, 1.2, .5], [E(55) - .3, 0, 1.2, .45]]);
    const light = seg(t, S(55), E(55) - S(55));
    if (on > .01) { g.save(); g.translate(CX, 1240); g.scale(on, on);
      g.fillStyle = WHITE; g.beginPath(); g.moveTo(0, 0); g.lineTo(-40, 90); g.lineTo(40, 90); g.fill();
      g.rotate(tilt); blob(0, 0, 760, 18, { col: WHITE, round: 1 });
      avatar('you_front', -360, -lerp(100, 80, light), lerp(100, 78, light), { filter: `grayscale(${light})` }); ring(-360, -lerp(100, 80, light), lerp(100, 78, light) + 8, 6, YOUCOL);
      avatar('me_portrait', 360, -80, 78); ring(360, -80, 86, 6, MECOL); g.restore() }
    cap(t, 54, 0, null, CX, 1560, { size: 46, w: 500, col: WHITE, al: 'center', hide: S(55) - .1 }); cap(t, 55, 0, null, CX, 1560, { size: 46, w: 500, col: WHITE, al: 'center', hide: S(56) - .1 });
  }
  // L56 a breath: the screen goes to sleep and slowly wakes; only the dot, breathing
  if (t > S(56) - .2 && t < S(57) + .2) { const d = Math.sin(clamp((t - S(56)) / (E(56) - S(56) + .3)) * Math.PI); rect(0, 0, W, H, '#05060C', .88 * d); blob(CX, CY, 44 * (1 + .25 * Math.sin((t - S(56)) * 2.4)), 44 * (1 + .25 * Math.sin((t - S(56)) * 2.4)), { col: MECOL, alpha: d });
    cap(t, 56, 0, null, CX, 1180, { size: 44, w: 300, tr: lerp(.1, .5, d), col: WHITE, al: 'center', alpha: d }) }
  // L57-59 editing ME's profile: every save fails; the toasts pile up; then the dot swells and bursts
  if (t > S(57) - .3) {
    const cs = spr(t, [[0, 0], [S(57) - .2, 1, 2.2, .38]]) * (1 - eIn(seg(t, 155.9, .4))), burst = eOut(seg(t, 156.25, .35));
    if (cs > .01) { g.save(); g.translate(CX, 900); g.scale(cs, cs); blob(0, -20, 900, 940, { col: WHITE, round: .08 }); avatar('me_portrait', 0, -190, 150); txt('프로필 편집', 0, -400, { size: 36, w: 700, col: INK, al: 'center' });
      blob(0, 40, 700, 90, { col: CREAM, round: 1 }); pillText(0, 43, '나', { size: 40, w: 600, col: INK }); blob(0, 170, 700, 90, { col: CREAM, round: 1 }); pillText(0, 173, 'sub character', { size: 36, w: 500, fam: EN, col: GREY });
      const tries = [S(57) + 1.2, S(58) + .2, S(58) + 1.7, S(59)], press = tries.reduce((a, x) => a + wob(t - x, .3), 0);
      g.save(); g.translate(0, 320); g.scale(1 + press * .4, 1 - press * .4); blob(0, 0, 360, 100, { col: MECOL, round: 1 }); pillText(0, 3, '저장', { size: 40, w: 700, col: WHITE }); g.restore();
      g.restore();
      tries.forEach((x, k) => { const s = spr(t, [[0, 0], [x + .05, 1, 2.8, .34]]); if (s < .01) return; const n = tries.filter(y => t > y + .05).length, yy = 1560 - (n - 1 - k) * 110;
        g.save(); g.translate(CX, yy); g.scale(s, s); blob(0, 0, 640, 90, { col: '#2A2B40', round: 1 }); pillText(0, 3, '저장할 수 없습니다', { size: 34, w: 600, col: WHITE }); g.restore() });
    }
    cap(t, 57, 0, null, CX, 300, { size: 50, w: 500, col: WHITE, al: 'center', hide: 155.8 }); cap(t, 58, 0, null, CX, 390, { size: 50, w: 500, col: WHITE, al: 'center', hide: 155.8 });
    cap(t, 59, 0, null, CX, 1820, { size: 80, w: 800, col: WHITE, al: 'center', hide: 156.2 });
    const sw = eIn(seg(t, 155.9, .4)); if (sw > 0) blob(CX, 700, 60 + sw * 200, 60 + sw * 200, { col: MECOL, wob: sw * .25, ph: t * 20 });
    if (burst > 0) disc(CX, 700, burst * 2400, VIOLET);                                                              // the same violet page chorus 1 opened on
  }
}

// ================= FINAL CHORUS 156.6 - 179.2: chorus 1 again (same objects, same grammar), with small changes: ME has a face, her post has colour, the search finds her, and I wanna be you opens onto the empty stage =================
function FC(t) { C1(t, 43) }

// ================= OWN LINE 179.2 - 204.2: ME makes her own post =================
function OW(t) {
  fill(CREAM); blurBg('mem_rooftop', CREAM, .82);
  const PICK = ['me_run', 'me_guitar', 'me_paint', 'me_speech', 'me_dance', 'me_friend'];   // her camera roll is her own now: the things she tried
  const C71 = chars(71), selT = j => C71[Math.min(j, C71.length - 1)].t, gatherT = selT(5) + .35, gather = eIO(seg(t, gatherT, .6)), upT = cT(77, 10), up = eIn(seg(t, upT + .2, .6));
  // a carousel: once picked, the six photos slide by one after another (hold, then a jelly slide)
  const carousel = (x, y, w, h, o = {}) => { const f = Math.max(0, (t - gatherT - .7) / 1.9), i = Math.floor(f), fr = eIO(clamp((f - i - .72) / .28));
    g.save(); g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, o.r ?? 22); g.clip();
    for (const k of [0, 1]) photo(PICK[(i + k) % 6], x + (k - fr) * w, y, w, h, { r: 0, fx: .5, fy: .35, bg: '#EDE7F2' });
    g.restore(); for (let k = 0; k < 6; k++) disc(x - 75 + k * 30, y + h / 2 + 34, 8, k === (i + (fr > .5 ? 1 : 0)) % 6 ? MECOL : GREY, o.alpha ?? 1) };
  // the new-post screen: a grid of her photos; each is ticked on a syllable (1-6), then they gather into one post
  if (t < upT + .9) {
    blob(CX, 150, 940, 110, { col: WHITE, round: 1, alpha: 1 - up }); pillText(CX, 153, '새 게시물', { size: 40, w: 700, col: INK, alpha: 1 - up });
    const us = 1 - up * .9, uy = up * -520;
    if (gather < 1) for (let j = 5; j >= 0; j--) { const c = j % 3, r = Math.floor(j / 3), s = spr(t, [[0, 0], [179.4 + j * .08, 1, 2.6, .35]]); if (s < .01) continue;
      const px = lerp(210 + c * 330, CX, gather), py = lerp(420 + r * 330, 640, gather), pw = lerp(300, 820, gather), ph = lerp(300, 720, gather), sel = spr(t, [[0, 0], [selT(j), 1, 2.8, .32]]);
      g.save(); g.translate(px, py); g.rotate((j - 2.5) * .06 * Math.sin(gather * Math.PI)); g.scale(s, s * (1 + .08 * wob(t - selT(j), .3)));
      photo(PICK[j], 0, 0, pw, ph, { r: 22, fx: .5, fy: .35, bg: '#EDE7F2' });
      if (sel > .01) { disc(pw / 2 - 40, -ph / 2 + 40, 30 * sel, MECOL); txt(String(j + 1), pw / 2 - 40, -ph / 2 + 52, { size: 32 * sel, w: 800, fam: EN, col: WHITE, al: 'center', upper: false }) }
      g.restore() }
    else carousel(CX, 640 + uy, 820 * us, 720 * us, { alpha: 1 - up });
    // the caption box: 내 이야기는 결국 / I'm a sub character / and the lines after it, newest at the bottom
    if (t > S(71) - .2) {
      const cs = spr(t, [[0, 0], [S(71) - .1, 1, 2.4, .36]]) * (1 - up), lines = [[71], [72], [73], [74], [75], [76]].map(([i]) => i).filter(i => t > S(i) - .1).slice(-3);
      if (cs > .01) { g.save(); g.translate(CX, 1320); g.scale(cs, cs); blob(0, 0, 900, 380, { col: WHITE, round: .12 }); txt('문구 입력...', -410, -130, { size: 30, w: 500, col: GREY, alpha: lines.length ? 0 : 1 });
        lines.forEach((i, j) => cap(t, i, 0, null, -410, -110 + j * 105, { size: i === 72 ? 42 : 48, w: 600, fam: i === 72 ? EN : KR, col: INK, upper: false })); g.restore() }
    }
    // share
    if (t > S(77) - .2) { const bs = spr(t, [[0, 0], [S(77) - .1, 1, 2.6, .35]]), pr = wob(t - upT, .4); g.save(); g.translate(CX, 1650); g.scale(bs * (1 + pr), bs * (1 - pr)); blob(0, 0, 420, 120, { col: MECOL, round: 1 }); pillText(0, 3, '공유', { size: 46, w: 800, col: WHITE }); g.restore();
      cap(t, 77, 0, 10, CX, 1820, { size: 56, w: 800, fam: EN, col: INK, al: 'center', upper: true }); cap(t, 77, 10, null, CX + 330, 1820, { size: 56, w: 800, col: MECOL }) }
  }
  // L78-79 the upload bar; ME's words hang from it on threads
  if (t > upT && t < S(80) + .3) {
    const bar = spr(t, [[0, 0], [upT + .2, 1, 2.4, .36]]), prog = eIO(seg(t, upT + .3, E(79) - upT)), out = seg(t, S(80) - .2, .4);
    g.globalAlpha = 1 - out; blob(CX, 520, 840 * bar, 40, { col: WHITE, round: 1 }); if (prog > .02) blob(120 + 840 * prog / 2, 520, 840 * prog, 40, { col: MECOL, round: 1, wob: .08, ph: t * 8 }); txt(Math.round(prog * 100) + '%', CX, 460, { size: 36, w: 700, fam: EN, col: INK, al: 'center', upper: false });
    for (const i of [78, 79]) { const C = layout(i, 0, chars(i).length, { size: 120, w: 850 }), x0 = i === 78 ? 170 : 150, base = i === 78 ? 900 : 1300;
      C.gl.forEach((G, j) => { const a = seg(t, G.t - .05, .3); if (a <= 0) return; const x = x0 + G.x + G.w / 2, len = base - 540 + (j % 2) * 60, sw = Math.sin(t * 2.3 + j) * .07 * (1 - a * .4);
        g.save(); g.translate(x, 540); g.rotate(sw); line(0, 0, 0, len * eOutQ(a), 3, INK, 1, 1); txt(G.c, 0, len * eOutQ(a) + 95, { size: 120, w: 850, col: i === 79 ? MECOL : INK, al: 'center', alpha: a }); g.restore() }) }
    g.globalAlpha = 1;
  }
  // L80 the DM: ME asks; YOU types... and sends a picture of a hand held out; the two bubbles join into holding hands
  if (t > S(80) - .3 && t < S(81) + .2) {
    const out = seg(t, S(81) - .15, .35), meS = spr(t, [[0, 0], [S(80) - .1, 1, 2.6, .35]]), join = eIO(seg(t, cT(80, 10) + .5, .8));
    g.globalAlpha = 1 - out;
    blob(CX, 150, 940, 110, { col: WHITE, round: 1 }); avatar('you_front', 150, 150, 42); txt('주인공', 215, 164, { size: 40, w: 700, col: INK });
    if (meS > .01) { g.save(); g.translate(lerp(640, CX, join), lerp(560, 760, join)); g.scale(meS, meS); blob(0, 0, 760, 150, { col: MECOL, round: 1 }); g.restore(); cap(t, 80, 0, null, lerp(290, 190, join), lerp(576, 776, join), { size: 50, w: 700, col: WHITE }) }
    const dots = seg(t, cT(80, 7), .2) * (1 - seg(t, cT(80, 10), .1)); if (dots > 0) { blob(250, 820, 200, 100, { col: WHITE, round: 1, alpha: dots }); for (let j = 0; j < 3; j++) disc(200 + j * 50, 820 - 14 * Math.max(0, Math.sin(t * 8 - j)), 14, GREY, dots) }
    const rs = spr(t, [[0, 0], [cT(80, 10), 1, 2.4, .35]]); if (rs > .01) { g.save(); g.translate(lerp(360, CX, join), lerp(1180, 1260, join)); g.scale(rs, rs); blob(0, 0, 560 + join * 300, 700 - join * 200, { col: WHITE, round: .12 });
      photo(join > .5 ? 'pov_hands' : 'pov_turn', 0, 0, 520 + join * 300, 660 - join * 200, { r: 26, fx: .5, fy: join > .5 ? .5 : .55, bg: '#EDE7F2' }); g.restore() }
    g.globalAlpha = 1;
  }
  // L81 ME's post is in the feed: one like, from YOU
  if (t > S(81) - .3) {
    const s = spr(t, [[0, 0], [S(81) - .2, 1, 2.2, .38]]), liked = seg(t, cT(81, 2), .1), end = eIn(seg(t, 204.4, .7));
    g.save(); g.translate(CX, lerp(900, 900, end)); g.scale(s * (1 - end), s * (1 - end));
    blob(0, 10, 900, 1180, { col: 'rgba(0,0,0,.12)', round: .08 }); blob(0, 0, 900, 1180, { col: WHITE, round: .08 });
    avatar('me_portrait', -370, -520, 42); ring(-370, -520, 52, 6, MECOL); txt('나', -300, -506, { size: 40, w: 800, col: INK });
    photo(PICK[0], 0, -80, 840, 760, { r: 24, fx: .5, fy: .35, bg: '#EDE7F2' }); for (let k = 0; k < 6; k++) disc(-75 + k * 30, 334, 8, k ? GREY : MECOL);
    heart(-370, 380, 80 * (1 + wob(t - cT(81, 2), .5)), { col: liked ? MECOL : null, stroke: liked ? null : INK, lw: 6 });
    avatar('you_front', -250, 385, 28, { alpha: liked }); txt('좋아요 1 · 주인공님이 좋아합니다', -205, 398, { size: 32, w: 600, col: INK, alpha: liked });
    cap(t, 81, 0, null, -410, 490, { size: 48, w: 700, col: INK });
    g.restore();
  }
}

// ================= END 204.2 - 214.4: the coral dot (ME, from the first second) builds the title itself. On every beat it
// jumps onto the next slot; the letter springs up under it and lifts it; the last jump lands on the baseline as the period.
// Then "sub" goes quiet and grey, and "character." stays lit.
function EN2(t) {
  fill(CREAM); disc(CX, 900, eOut(seg(t, 204.5, .8)) * 2400, INK);
  const word = 'sub character', SZ = 150, base = 1010, r = 22, T0 = onBeat(Math.ceil(beatN(205.4))), tl = k => T0 + k * BEAT;
  font(800, SZ, EN); setTrack(0);
  const ws = [...word].map(c => g.measureText(c).width), tw = ws.reduce((a, b) => a + b, 0) + 50;
  let xx = CX - tw / 2; const xs = ws.map(w => { const c = xx + w / 2; xx += w; return c }), n = word.length, px = xx + 38;
  const hOf = c => c === ' ' ? 0 : 'bht'.includes(c) ? .74 * SZ : .54 * SZ, lift = k => spr(t, [[0, 0], [tl(k), 1, 2.6, .34]]);
  const quiet = eIO(seg(t, tl(n) + 2 * BEAT, .8)), jolt = wob(t - tl(n) - BEAT, .35);                  // after the period: one shared bounce, then "sub" dims
  [...word].forEach((c, k) => { if (c === ' ') return; const s = lift(k); if (s < .01) return;
    g.save(); g.translate(xs[k], base); g.scale(1 + .12 * wob(t - tl(k), .4), s * (1 - .12 * jolt));
    txt(c, 0, 0, { size: SZ, w: 800, fam: EN, col: k < 3 ? lerpCol(WHITE, '#5B5A70', quiet) : WHITE, al: 'center', upper: false }); g.restore() });
  // where the dot rests on slot k (on top of the letter, riding it up), and where it lands on the period
  const rest = k => k >= n ? [px, base - r] : [xs[k], base - hOf(word[k]) * lift(k) * (1 - .12 * jolt) - r];
  let x, y, vx = 0, vy = 0, sq = 0;
  if (t < tl(0) - BEAT * .8) { x = xs[0] - 170; y = fall(t, 204.9, tl(0) - BEAT * .8, -60, base - r); sq = wob(t - tl(0) + BEAT * .8, .5) }
  else {
    let k = 0; while (k < n && t >= tl(k + 1) - BEAT * .8) k++;                                          // the next landing slot is k (or the period)
    const from = k === 0 ? [xs[0] - 170, base - r] : rest(k - 1), to = k >= n ? [px, base - r] : [xs[k], base - r];
    const h0 = tl(k) - BEAT * .8, p = clamp((t - h0) / (BEAT * .8));
    if (p < 1) { x = lerp(from[0], to[0], p); y = lerp(from[1], to[1], p) - 170 * 4 * p * (1 - p); vx = 1200; vy = 1600 * (p - .5) }   // the hop
    else { [x, y] = rest(k); sq = wob(t - tl(k), .5) }
  }
  if (t > 204.9) blob(x, y, r * 2, r * 2, { col: MECOL, vx, vy, sq });
  txt('Younha  ·  Sub character', CX, 1160, { size: 30, w: 500, fam: EN, tr: .25, col: WHITE, al: 'center', alpha: .7 * seg(t, tl(n) + 1.2, .8), upper: false });
  rect(0, 0, W, H, INK, eIn(seg(t, 213.4, .95)));
}
