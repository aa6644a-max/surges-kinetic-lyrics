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
    if (cs > .01) { g.save(); g.translate(CX, 900); g.scale(cs, cs); blob(0, 0, 900, 860, { col: WHITE, round: .08 }); avatar('me_portrait', 0, -200, 150); txt('프로필 편집', 0, -400, { size: 36, w: 700, col: INK, al: 'center' });
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
  const PICK = ['me_run', 'pov_backrow', 'pov_hallway', 'pov_stage', 'pov_window', 'pov_rain'];   // her camera roll is all YOU; she picks the one of herself
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
      photo(join > .5 ? 'pov_hands' : 'pov_turn', 0, 0, 520 + join * 300, 660 - join * 200, { r: 26, fx: .5, fy: join > .5 ? .5 : .55, bg: '#EDE7F2' }); g.restore() }
    g.globalAlpha = 1;
  }
  // L81 ME's post is in the feed: one like, from YOU
  if (t > S(81) - .3) {
    const s = spr(t, [[0, 0], [S(81) - .2, 1, 2.2, .38]]), liked = seg(t, cT(81, 2), .1), end = eIn(seg(t, 204.4, .7));
    g.save(); g.translate(CX, lerp(900, 900, end)); g.scale(s * (1 - end), s * (1 - end));
    blob(0, 10, 900, 1180, { col: 'rgba(0,0,0,.12)', round: .08 }); blob(0, 0, 900, 1180, { col: WHITE, round: .08 });
    avatar('me_portrait', -370, -520, 42); ring(-370, -520, 52, 6, MECOL); txt('나', -300, -506, { size: 40, w: 800, col: INK });
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
