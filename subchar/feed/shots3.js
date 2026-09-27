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
      avatar('me_profile', 360, -80, 78); ring(360, -80, 86, 6, MECOL); g.restore() }
    cap(t, 54, 0, null, CX, 1560, { size: 46, w: 500, col: WHITE, al: 'center', hide: S(55) - .1 }); cap(t, 55, 0, null, CX, 1560, { size: 46, w: 500, col: WHITE, al: 'center', hide: S(56) - .1 });
  }
  // L56 a breath: the screen goes to sleep and slowly wakes; only the dot, breathing
  if (t > S(56) - .2 && t < S(57) + .2) { const d = Math.sin(clamp((t - S(56)) / (E(56) - S(56) + .3)) * Math.PI); rect(0, 0, W, H, '#05060C', .88 * d); blob(CX, CY, 44 * (1 + .25 * Math.sin((t - S(56)) * 2.4)), 44 * (1 + .25 * Math.sin((t - S(56)) * 2.4)), { col: MECOL, alpha: d });
    cap(t, 56, 0, null, CX, 1180, { size: 44, w: 300, tr: lerp(.1, .5, d), col: WHITE, al: 'center', alpha: d }) }
  // L57-59 editing ME's profile: every save fails; the toasts pile up; then the dot swells and bursts
  if (t > S(57) - .3) {
    const cs = spr(t, [[0, 0], [S(57) - .2, 1, 2.2, .38]]) * (1 - eIn(seg(t, 155.9, .4))), burst = eOut(seg(t, 156.25, .35));
    if (cs > .01) { g.save(); g.translate(CX, 900); g.scale(cs, cs); blob(0, 0, 900, 860, { col: WHITE, round: .08 }); avatar('me_profile', 0, -200, 150); txt('프로필 편집', 0, -400, { size: 36, w: 700, col: INK, al: 'center' });
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
    if (burst > 0) disc(CX, 700, burst * 2400, MECOL);
  }
}

// ================= FINAL CHORUS 156.6 - 179.2: the UI breaks; the type is huge; ME's type is as big as YOU's =================
function FC(t) {
  const sec = [S(60), S(61), S(62), S(63), S(64), S(65), S(66), S(67), S(68), S(69), S(70)];
  let k = 0; for (let j = 0; j < sec.length; j++) if (t >= sec[j] - .1) k = j;
  const BG = [MECOL, YOUCOL, YOUCOL, INK, TEAL, PEACH, PEACH, INK, MECOL, TEAL, INK];
  const prev = k ? BG[k - 1] : MECOL, wipe = eOut(seg(t, sec[k] - .1, .35));
  fill(prev); if (BG[k] !== prev) { g.save(); g.translate(CX, CY); g.rotate(-.3); rect(-1500, -1500 + (1 - wipe) * 3000, 3000, 3000, BG[k]); g.restore() }
  const tk = sec[k], big = (i, a, b, x, y, sz, col, o = {}) => cap(t, i, a, b, x, y, { size: sz, w: 900, col, rev: 'grow', ...o });
  // photo stickers that tumble in
  const stickerP = (id, x, y, w, h, t0, rot, o = {}) => { const s = spr(t, [[0, 0], [t0, 1, 2.6, .33]]); if (s < .01) return; g.save(); g.translate(x, y); g.rotate(rot * (2 - s)); g.scale(s, s); blob(0, 8, w + 30, h + 30, { col: 'rgba(0,0,0,.2)', round: .08 }); blob(0, 0, w + 30, h + 30, { col: WHITE, round: .08 }); photo(id, 0, 0, w, h, { r: 16, fx: o.fx ?? .5, fy: o.fy ?? .3, bg: '#EDE7F2' }); g.restore() };
  if (k === 0) { stickerP('me_run', 740, 1380, 380, 500, S(60) + .2, .12); g.save(); g.translate(CX, 760); g.rotate(-.12); layered(t, [.08, .04, 0], [YEL, INK, WHITE], (tt, col) => { big(60, 0, 4, -470, -60, 230, col, { fam: EN, upper: true }); big(60, 4, null, -470, 160, 230, col, { fam: EN, upper: true }) }); g.restore() }
  if (k === 1) { const hit = eOutQ(seg(t, cT(61, 2), .3)), bump = wob(t - cT(61, 2) - .3, .3);
    stickerP('you_front', lerp(-300, 290, hit), 960, 420, 560, S(61), -.05); stickerP('me_smile', lerp(1400, 790, hit), 960, 420, 560, S(61), .05, { fy: .4 });
    big(61, 0, 2, 290, 1390, 120, WHITE, { al: 'center' }); big(61, 2, null, 790, 1390, 120, WHITE, { al: 'center' }) }
  if (k === 2) { for (let j = 0; j < 5; j++) { const a = t - onBeat(Math.floor(beatN(S(62))) + j); if (a > 0 && a < 1.2) ring(CX, 900, 200 + a * 700, 14 * (1 - a / 1.2) + 2, YEL, 1 - a / 1.2) }
    stickerP('you_stage', CX, 900, 320, 400, S(62), -.06, { fy: .3 }); big(62, 0, 8, CX, 330, 80, WHITE, { al: 'center', w: 800 }); big(62, 8, null, CX, 1420, 260, YEL, { al: 'center' }) }
  if (k === 3) { avatar('you_front', 300, 700, 170); ring(300, 700, 182, 10, YOUCOL); avatar('me_smile', 780, 700, 170); ring(780, 700, 182, 10, MECOL);
    for (let j = 0; j < 24; j++) { const side = j % 2, x = (side ? 780 : 300) + ((j >> 1) % 4 - 1.5) * 90, row = Math.floor(j / 8), t0 = S(63) + j * .04, land = t0 + .5, y = fall(t, t0, land, -100, 1300 - row * 100); if (t > t0) heart(x, y, 100, { col: [MECOL, PINK, YEL, WHITE][j % 4], sq: wob(t - land, .45), rot: (R(j, 3) - .5) * .5 }) }
    big(63, 0, null, CX, 1600, 150, WHITE, { al: 'center' }) }
  if (k === 4) { g.save(); g.translate(CX, CY); g.rotate(.14); big(64, 0, 3, 0, -80, 260, WHITE, { al: 'center' }); big(64, 3, null, 0, 200, 260, INK, { al: 'center' }); g.restore() }
  if (k === 5) { stickerP('you_crowd', 330, 760, 420, 540, S(65), -.07); stickerP('me_smile', 760, 900, 420, 540, S(65) + .25, .06, { fy: .4 }); big(65, 0, 3, CX, 1500, 250, WHITE, { al: 'center' }); big(65, 3, null, CX, 1640, 90, INK, { al: 'center' }) }
  if (k === 6) { const run = (t - S(66)) / (E(66) - S(66) + .3); big(66, 0, null, 200 - run * 3400, 1100, 420, WHITE, { fam: EN, upper: true, rev: 'type' }); rect(0, 1160, W, 14, INK) }
  if (k === 7) { // LOSER, with ME's dot as the O; the dot swells and fills the page
    const sz = 380, sw = eIn(seg(t, E(67) - .5, .7)); font(900, sz, EN); setTrack(0); const wL = g.measureText('L').width, wS = g.measureText('SER').width, wO = sz * .78, x0 = CX - (wL + wO + wS) / 2;
    big(67, 0, 11, CX, 700, 80, WHITE, { fam: EN, upper: true, al: 'center', tr: .15 });
    if (t > cT(67, 11)) { txt('L', x0, 1180, { size: sz, w: 900, fam: EN, col: WHITE }); txt('SER', x0 + wL + wO, 1180, { size: sz, w: 900, fam: EN, col: WHITE, alpha: 1 - sw }) }
    if (t > cT(67, 12)) blob(x0 + wL + wO / 2, 1180 - sz * .36, wO * .9 + sw * 2600, wO * .9 + sw * 2600, { col: MECOL, sq: wob(t - cT(67, 12), .4) }) }
  if (k === 8) { const f = eIO(seg(t, S(68), E(68) - S(68))), pop = eOut(seg(t, E(68) - .15, .7));
    if (pop < 1) { blob(CX, 1000, 860, 150, { col: WHITE, round: 1, alpha: 1 - pop }); if (f > .02) blob(115 + 830 * f / 2, 1000, 830 * f, 126, { col: YEL, round: 1, wob: .15, ph: t * 9, alpha: 1 - pop }) }
    for (let j = 0; j < 22; j++) { if (pop <= 0) break; const a = j / 22 * 6.28, d = pop * (300 + 500 * R(j, 2)); blob(CX + Math.cos(a) * d, 1000 + Math.sin(a) * d + pop * pop * 300, 90 * (1 - pop * .6), 90 * (1 - pop * .6), { col: [YEL, WHITE, PINK][j % 3], wob: .3, ph: j }) }
    big(68, 0, null, CX, 760, 190, WHITE, { al: 'center' }) }
  if (k === 9) { const sy = fall(t, S(69) - .1, S(69) + .3, -200, 420);
    blob(CX, sy, 920, 140, { col: WHITE, round: 1, sq: wob(t - S(69) - .3, .3) }); ring(120, sy - 6, 24, 7, INK); line(138, sy + 12, 156, sy + 30, 7, INK, 1, 1);
    if (t < cT(69, 6)) cap(t, 69, 0, 6, 190, sy + 16, { size: 44, w: 400, fam: EN, col: GREY, upper: false }); else cap(t, 69, 6, null, 190, sy + 16, { size: 44, w: 600, col: INK });
    const rs = spr(t, [[0, 0], [E(69) - 1.2, 1, 2.4, .36]]); if (rs > .01) { g.save(); g.translate(CX, 820); g.scale(rs, rs); blob(0, 0, 900, 180, { col: WHITE, round: .3 }); avatar('me_smile', -340, 0, 60); txt('나', -250, 16, { size: 46, w: 800, col: INK }); txt('게시물 1 · 팔로워 38', -250, 60, { size: 30, w: 500, col: GREY }); g.restore() }   // the search finds ME
    big(69, 0, 6, CX, 1300, 200, WHITE, { fam: EN, al: 'center', upper: true }); big(69, 6, null, CX, 1480, 110, WHITE, { al: 'center', w: 850 }) }
  if (k === 10) { // I wanna be you: this time the two circles are the same size, and nothing snaps
    const s = spr(t, [[0, 0], [S(70) - .1, 1, 2.2, .38]]);
    avatar('you_front', 300, 900, 170 * s); ring(300, 900, 182 * s, 10, YOUCOL); avatar('me_smile', 780, 900, 170 * s); ring(780, 900, 182 * s, 10, MECOL);
    blob(CX, 900, 140 * s, 30, { col: WHITE, round: 1, wob: wob(t - S(70) - .3, .3) });
    big(70, 0, null, CX, 1350, 120, WHITE, { fam: EN, upper: true, al: 'center', w: 900 });
    disc(780, 900, eIn(seg(t, 178.6, .6)) * 2400, CREAM) }
}

// ================= OWN LINE 179.2 - 204.2: ME makes her own post =================
function OW(t) {
  fill(CREAM); blurBg('mem_rooftop', CREAM, .82);
  const PICK = ['me_run', 'me_reach', 'me_smile', 'me_profile', 'me_mirror', 'me_envy'];
  const pick = seg(t, cT(71, 4), .1), upT = cT(77, 10), up = eIn(seg(t, upT + .2, .6));
  // the new-post screen: a picker grid of ME's photos; one is chosen and becomes the preview
  if (t < upT + .9) {
    blob(CX, 150, 940, 110, { col: WHITE, round: 1, alpha: 1 - up }); pillText(CX, 153, '새 게시물', { size: 40, w: 700, col: INK, alpha: 1 - up });
    PICK.forEach((id, j) => { const c = j % 3, r = Math.floor(j / 3), s = spr(t, [[0, 0], [179.4 + j * .08, 1, 2.6, .35]]);
      const chosen = j === 0, gone = eIn(seg(t, cT(71, 4), .5)), px = chosen ? lerp(210 + c * 330, CX, eOutQ(pick)) : 210 + c * 330, py = chosen ? lerp(420 + r * 330, 640, eOutQ(pick)) : 420 + r * 330 + gone * 1800;   // the others drop away
      const pw = chosen ? lerp(300, 820, eOutQ(pick)) : 300, ph = chosen ? lerp(300, 720, eOutQ(pick)) : 300, us = 1 - up * .9, uy = up * -520;
      if (s > .01 && (chosen || gone < 1)) { g.save(); g.translate(px, py + uy); g.scale(s * (chosen ? us : 1 - gone), s * (chosen ? us : 1 - gone)); photo(id, 0, 0, pw, ph, { r: 22, fx: .5, fy: .3, bg: '#EDE7F2' }); if (chosen && pick > 0) { disc(pw / 2 - 40, -ph / 2 + 40, 30 * pick, MECOL); drawPath([[pw / 2 - 54, -ph / 2 + 40], [pw / 2 - 42, -ph / 2 + 52], [pw / 2 - 24, -ph / 2 + 28]], seg(t, cT(71, 4) + .1, .3), 7, WHITE) } g.restore() }
    });
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
      photo(join > .5 ? 'hands_hold' : 'you_hand', 0, 0, 520 + join * 300, 660 - join * 200, { r: 26, fx: .5, fy: join > .5 ? .5 : .55, bg: '#EDE7F2' }); g.restore() }
    g.globalAlpha = 1;
  }
  // L81 ME's post is in the feed: one like, from YOU
  if (t > S(81) - .3) {
    const s = spr(t, [[0, 0], [S(81) - .2, 1, 2.2, .38]]), liked = seg(t, cT(81, 2), .1), end = eIn(seg(t, 204.4, .7));
    g.save(); g.translate(CX, lerp(900, 900, end)); g.scale(s * (1 - end), s * (1 - end));
    blob(0, 10, 900, 1180, { col: 'rgba(0,0,0,.12)', round: .08 }); blob(0, 0, 900, 1180, { col: WHITE, round: .08 });
    avatar('me_smile', -370, -520, 42); ring(-370, -520, 52, 6, MECOL); txt('나', -300, -506, { size: 40, w: 800, col: INK });
    photo('me_run', 0, -80, 840, 760, { r: 24, fx: .5, fy: .4, bg: '#1d1d2b' });
    heart(-370, 380, 80 * (1 + wob(t - cT(81, 2), .5)), { col: liked ? MECOL : null, stroke: liked ? null : INK, lw: 6 });
    avatar('you_front', -250, 385, 28, { alpha: liked }); txt('좋아요 1 · 주인공님이 좋아합니다', -205, 398, { size: 32, w: 600, col: INK, alpha: liked });
    cap(t, 81, 0, null, -410, 490, { size: 48, w: 700, col: INK });
    g.restore();
  }
}

// ================= END 204.2 - 214.4: the title. Its period is the dot from the first second. =================
function EN2(t) {
  fill(CREAM); disc(CX, 900, eOut(seg(t, 204.5, .8)) * 2400, INK);
  const a = seg(t, 205.4, .6), s = spr(t, [[0, 0], [205.4, 1, 1.8, .45]]);
  if (s > .01) { g.save(); g.translate(CX, 980); g.scale(s, s); txt('서브캐릭터', -30, 0, { size: 170, w: 800, col: WHITE, al: 'center', alpha: a }); g.restore() }
  font(800, 170, KR); setTrack(0); const tw = g.measureText('서브캐릭터').width, px = CX - 30 + tw / 2 + 40 * s;
  const dy = fall(t, 206.6, 207.1, -200, 980 - 12), sq = wob(t - 207.1, .5);
  if (t > 206.6) blob(px, dy, 44, 44, { col: MECOL, sq });                                          // the dot lands as the period
  txt('sub character  ·  YOUNHA', CX, 1100, { size: 26, w: 400, fam: EN, tr: .3, col: WHITE, al: 'center', alpha: .7 * seg(t, 208, .8), upper: false });
  rect(0, 0, W, H, INK, eIn(seg(t, 213.2, 1.1)) * .9);
}
