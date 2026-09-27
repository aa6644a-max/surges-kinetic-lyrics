/* FEED act 1 (0 - 70.4): one take. The protagonist is ME, a small coral dot (a notification). It never leaves:
   it falls in, is pushed aside by YOU's story circle, flies off as a line that opens the page, becomes a lens, the icon of
   a banner, a slider knob, the core of a loading spinner, bursts into hearts, and finally stretches toward YOU and snaps.
   Lyrics live inside the objects (captions, banners, chips, input boxes, bubbles), small, synced to the syllables. */

const cap = (t, i, a, b, x, y, o) => lyr(t, i, a, b ?? chars(i).length, x, y, { rev: 'rise', dur: .25, ...o });

// ================= INTRO 0 - 15.2: a dot falls into the dark; YOU's circle arrives and pushes it aside =================
function I0(t) {
  fill(INK);
  // the title types in letter by letter, each one a little jelly, in colour first
  const title = 'sub character', ta = 1 - seg(t, 13.5, .6); font(300, 42, EN); setTrack(42 * .35);
  let tx = CX - g.measureText(title).width / 2;
  [...title].forEach((c, j) => { const tj = .4 + j * .09, s = spr(t, [[0, 0], [tj, 1, 3, .35]]); font(300, 42, EN); setTrack(42 * .35); const w = g.measureText(c).width;
    if (s > .01) { g.save(); g.translate(tx + w / 2, 760); g.scale(s, s); txt(c, 0, 0, { size: 42, w: 300, fam: EN, tr: .35, col: t < tj + .5 ? [MECOL, YEL, WHITE][j % 3] : WHITE, al: 'center', upper: false, alpha: ta }); g.restore() }
    tx += w });
  // YOU: a story circle that rises in with colour layers trailing, a person icon, and its ring
  const Yx = CX, Yy = 1010, yr = t0 => spr(t0, [[0, 0], [4.09, 170, 2, .33]]);
  if (t > 4) {
    layered(t, [.12, .06, 0], [MECOL, YEL, WHITE], (tt, col) => blob(Yx, Yy + (1 - clamp(yr(tt) / 170)) * 60, yr(tt) * 2, yr(tt) * 2, { col, wob: wob(tt - 4.09, .22) }));
    if (t > 4.3) avatar('you_front', Yx, Yy, yr(t) * .9, { alpha: seg(t, 4.3, .4) });
    const ring = eOut(seg(t, 6.03, .9)); g.save(); g.lineCap = 'round'; for (const [col, lag, rr] of [[YEL, .12, 206], [YOUCOL, 0, 206]]) { const p = eOut(seg(t, 6.03 + lag, .9)); if (p <= 0) continue; g.strokeStyle = col; g.lineWidth = 14; g.beginPath(); g.arc(Yx, Yy, rr + wob(t - 6.9, 6), -Math.PI / 2, -Math.PI / 2 + p * Math.PI * 2); g.stroke() } g.restore();
    // other people: small dots that pop in around YOU on the beat and slowly orbit
    for (let j = 0; j < 7; j++) { const tj = onBeat(13 + j), s = spr(t, [[0, 0], [tj, 1, 3, .32]]), an = j / 7 * 6.28 + .6 + t * .07, d = 330 + 70 * R(j, 2);
      blob(Yx + Math.cos(an) * d, Yy + Math.sin(an) * d * .9 + Math.sin(t * 1.3 + j) * 8, (14 + 22 * R(j, 3)) * 2 * s, (14 + 22 * R(j, 3)) * 2 * s, { col: [GREY, WHITE, PEACH, TEAL][j % 4], alpha: .9 }) }
  }
  // ME: the coral dot. Falls, lands with a squash, is shoved aside by YOU, then launches off to the right as a line
  const launch = 13.95, xk = [[0, CX], [4.05, 250, 1.6, .45]], x0 = spr(t, xk), fly = eIn(seg(t, launch, .32));
  const x = lerp(x0, 1500, fly), y = fall(t, 2.15, 2.62, -80, Yy), r = spr(t, [[0, 28], [4.05, 20]]);
  const vx = fly > 0 && fly < 1 ? 4000 : sprV(t, xk), vy = t > 2.15 && t < 2.62 ? 3000 : 0;
  const pre = seg(t, 13.6, .3) * (1 - seg(t, launch, .05));
  const meC = spr(t, [[0, 0], [5.0, 1, 2.4, .36], [13.2, 0, 2.6, .5]]);
  if (meC > .02) { disc(x, y, 84 * meC, '#3A3B52'); avatar('me_portrait', x, y, 76 * meC, { filter: 'grayscale(.75) brightness(.9)' }); ring(x, y, 84 * meC, 5, GREY, .8);
    txt('나', x, y + 150, { size: 34, w: 600, col: GREY, al: 'center', alpha: meC }); txt('주인공', Yx, Yy + 290, { size: 34, w: 700, col: WHITE, al: 'center', alpha: meC }) }
  const bx = x + 60 * meC, by = y - 60 * meC;                                                                        // while her circle is open the dot sits on it like a badge
  if (t > 2.1 && x < 1300) blob(bx, by, r * 2, r * 2, { col: MECOL, vx, vy, sq: wob(t - 2.62, .5) + wob(t - 4.1, .3) + pre * .45 });
  // the line it leaves opens into the next page (cream), like a slit widening
  if (t > launch) {
    const lx = Math.min(W, x), open = eIO(seg(t, 14.35, .85)), hh = 8 + open * (H + 40);
    if (open <= 0) line(250, Yy, lx, Yy, 8, MECOL, 1, 1);
    else { rect(0, Yy - hh / 2, W, hh, CREAM); rect(0, Yy - hh / 2 - 6, W, 6, MECOL, 1 - open); rect(0, Yy + hh / 2, W, 6, MECOL, 1 - open) }
  }
}

// ================= VERSE 1 15.2 - 31.0: YOU's feed =================
const ROLL = [['pov_backrow', .5, .45], ['pov_hallway', .5, .5], ['pov_zoom', .5, .45]];
function card(cx, cy, sc, kind, t, capFn) {
  g.save(); g.translate(cx, cy); g.scale(sc, sc);
  blob(0, 14, 900, 980, { col: 'rgba(109,91,128,.14)', round: .09 }); blob(0, 0, 900, 980, { col: WHITE, round: .09 });
  avatar('me_portrait', -380, -420, 40); txt('나', -318, -406, { size: 36, w: 700, col: INK }); txt('사진첩 · 나만 보기', -270, -406, { size: 28, w: 500, col: GREY });
  g.save(); g.beginPath(); g.roundRect(-410, -360, 820, 620, 30); g.clip();
  photo(ROLL[kind][0], 0, -50, 820, 620, { fx: ROLL[kind][1], fy: ROLL[kind][2], r: 0 });                               // her own photos of YOU, taken from far away
  g.restore();
  g.save(); g.translate(-372, 326); blob(0, 8, 40, 32, { col: GREY, round: .3 }); ring(0, -12, 13, 6, GREY); g.restore(); txt('비공개', -330, 340, { size: 30, w: 600, col: GREY });
  if (capFn) capFn();
  g.restore();
}
function V1(t) {
  fill(CREAM); blurBg('pov_backrow', CREAM, .82);
  const feedA = 1 - seg(t, S(5) - .1, .35);
  const zoom = spr(t, [[0, 1], [S(2) - .1, 1.75, 1.5, .5], [S(3) - .35, 1, 1.6, .45]]);
  const sy = spr(t, [[0, 1900], [15.2, 0, 1.8, .45], [S(1) - .12, -1080, 1.8, .42], [S(2) - .2, -2160, 1.8, .42]]);
  if (feedA > 0) {
    g.save(); g.globalAlpha = feedA; g.translate(CX, 900); g.scale(zoom, zoom); g.translate(-CX, -900);
    card(CX, 960 + sy, 1, 0, t, () => cap(t, 0, 0, null, -400, 432, { size: 44, w: 600, col: INK }));
    card(CX, 960 + 1080 + sy, 1, 1, t, () => cap(t, 1, 0, null, -400, 432, { size: 44, w: 600, col: INK }));
    card(CX, 960 + 2160 + sy, 1, 2, t);
    g.restore(); g.globalAlpha = 1;
  }
  // L2 the dot comes back as a magnifying lens, staring at YOU's back
  const lensA = seg(t, S(2) - .1, .1) * (1 - seg(t, S(3) - .35, .1));
  const lr = spr(t, [[0, 0], [S(2), 120, 2.4, .35], [S(3) - .4, 0, 2.6, .5]]), lx = spr(t, [[0, 240], [S(2), 560, 1.2, .5], [cT(2, 4), 480, 1.4, .5]]), ly = spr(t, [[0, 1500], [S(2), 780, 1.2, .5]]);
  if (lensA > 0 && lr > 1) {
    g.save(); g.translate(lx, ly); g.rotate(.8); blob(lr + 50, 0, 120, 28, { col: MECOL, round: 1 }); g.restore();
    ring(lx, ly, lr, 14, MECOL, lensA); disc(lx, ly, lr - 7, 'rgba(255,255,255,.18)', lensA);
    blob(lx, ly + lr + 90, 560, 96, { col: WHITE, round: 1, alpha: lensA }); cap(t, 2, 0, null, lx, ly + lr + 106, { size: 40, w: 600, col: INK, al: 'center', alpha: lensA });
  }
  // L3 a notification banner drops in from the top; the dot rides in as its icon.  L4 it grows into ME's profile card
  if (t > S(3) - .4 && t < S(5) + .3) {
    const by = fall(t, S(3) - .35, S(3) + .05, -200, 200), bh = spr(t, [[0, 150], [S(4) - .1, 640, 1.6, .42], [S(5) - .15, 0, 2.2, .6]]), bcy = by + (bh - 150) / 2;
    const bs = wob(t - S(3) - .05, .35);
    if (bh > 4) {
      blob(CX, bcy + 10, 880, bh, { col: 'rgba(109,91,128,.16)', round: bh < 200 ? 1 : .12 }); blob(CX, bcy, 880, bh, { col: WHITE, round: bh < 200 ? 1 : .12, sq: bs });
      const iy = t < S(4) ? by : spr(t, [[0, by], [S(4) - .1, by + 60]]);
      blob(170, iy, 56, 56, { col: MECOL, sq: bs * 1.4 });                                                  // the dot, as the banner's icon
      if (t < S(4) + .2) cap(t, 3, 0, null, 230, by + 14, { size: 42, w: 600, col: INK, alpha: 1 - seg(t, S(4), .2) });
      if (t > S(4) - .1 && bh > 300) {
        const a = seg(t, S(4) + .05, .3) * (1 - seg(t, S(5) - .2, .15));
        avatar('me_portrait', 250, bcy - bh / 2 + 150, 80 * a, { filter: 'grayscale(.6)' }); disc(300, bcy - bh / 2 + 100, 18 * a, MECOL);          // ME's avatar: grey, one coral dot
        for (const [k, s, xx] of [[0, '게시물 0', 520], [1, '팔로워 38', 780]]) { blob(xx, bcy - bh / 2 + 150, 220, 80, { col: CREAM, round: 1, alpha: a }); txt(s, xx, bcy - bh / 2 + 150, { size: 34, w: 600, col: INK, al: 'center', base: 'middle', alpha: a }) }
        cap(t, 4, 0, null, 150, bcy - bh / 2 + 330, { size: 48, w: 500, col: INK, alpha: a });
      }
    }
  }
  // L5 the profile folds into a chart: YOU's bar shoots up, ME's barely leaves the floor.  L6 ME's bar falls through
  if (t > S(5) - .2 && t < S(7) + .4) {
    const out = seg(t, S(7) - .2, .4), base = 1560, yb = spr(t, [[0, 0], [S(5), 880, 1.6, .36]]), mb = spr(t, [[0, 0], [cT(5, 3), 56, 2.4, .3]]);
    const yx = spr(t, [[0, 380], [S(7) - .25, -300, 1.4, .5]]), fallY = t > cT(6, 7) ? 1600 * (seg(t, cT(6, 7), .8)) ** 2 : 0;
    line(80, base, 1000, base, 5, INK, 1 - out, eOut(seg(t, S(5) - .2, .4)));
    blob(yx, base - yb / 2, 200, Math.max(1, yb), { col: YOUCOL, round: .16 }); txt('12,480', yx, base - yb - 40, { size: 64, w: 800, fam: EN, col: YOUCOL, al: 'center', alpha: seg(t, S(5) + .2, .3) });
    blob(700, base - mb / 2 + fallY, 200, Math.max(1, mb), { col: MECOL, round: .3, sq: wob(t - cT(5, 3) - .1, .4) }); txt('38', 700, base - mb - 40 + fallY, { size: 50, w: 800, fam: EN, col: MECOL, al: 'center', alpha: seg(t, cT(5, 3), .3) });
    cap(t, 5, 0, 3, CX, 400, { size: 130, w: 900, col: YOUCOL, al: 'center', alpha: 1 - seg(t, S(6) - .15, .2), rev: 'grow' });
    cap(t, 5, 3, null, CX, 500, { size: 50, w: 500, col: INK, al: 'center', alpha: 1 - seg(t, S(6) - .15, .2) });
    if (t > S(6) - .15) { cap(t, 6, 0, 3, CX, 330, { size: 50, w: 500, col: INK, al: 'center' }); cap(t, 6, 3, 7, CX, 450, { size: 96, w: 800, col: INK, al: 'center' });
      cap(t, 6, 7, null, CX + 330, 450, { size: 96, w: 800, col: MECOL, fx: G => ({ dy: 1400 * (seg(t, G.t + .15, .9)) ** 2 }) }) }
  }
  // L7-L9 a filter slider: the knob is the dot; each step drains the colour. Then the knob cools and floods the page navy
  if (t > S(7) - .4) {
    const ky = 1100, kx = spr(t, [[0, 190], ...chars(8).map((G, k) => [G.t, 190 + (k + 1) * 130, 2.6, .35])]), kIn = fall(t, S(7) - .4, S(7) - .05, 2100, ky);
    const drain = seg(t, S(8) - .1, E(8) - S(8) + .3), cool = seg(t, S(9), .6);
    const pa = seg(t, S(7) - .3, .4); if (pa > 0) { const ps = spr(t, [[0, 0], [S(7) - .3, 1, 2.2, .38]]); g.save(); g.translate(CX, 440); g.scale(ps, ps); blob(0, 8, 840, 540, { col: 'rgba(109,91,128,.18)', round: .1 }); photo('pov_window', 0, 0, 820, 520, { fx: .5, fy: .5, r: 34, filter: `grayscale(${drain}) contrast(${1 - .15 * drain}) brightness(${1 - .15 * cool})` }); g.restore() }
    rect(0, 0, W, H, '#8E8A96', .45 * drain);                                                                          // the page loses its colour
    for (let k = 0; k < 5; k++) { const G = chars(8)[k], a = seg(t, G.t, 1.2); if (a > 0) blob(190 + (k + 1) * 130, ky + 180 + 40 * R(k, 4), 260 * eOut(a), 180 * eOut(a), { col: '#6F6A78', alpha: .35 * (1 - cool), wob: .4, ph: t * 2 + k }) }
    blob(CX, ky, 760, 26, { col: GREY, round: 1 }); blob((190 + Math.max(190, kx)) / 2, ky, Math.max(26, kx - 190), 26, { col: lerpCol(MECOL, GREY, drain), round: 1 });
    const kr = lerp(46, 30, cool), kc = lerpCol(MECOL, '#9C97A8', cool);
    blob(kx, kIn, kr * 2 + 12, kr * 2 + 12, { col: WHITE, sq: wob(t - S(7) + .05, .4) }); blob(kx, kIn, kr * 2, kr * 2, { col: kc, vx: sprV(t, [[0, 190], ...chars(8).map((G, k) => [G.t, 190 + (k + 1) * 130, 2.6, .35])]) * .4 });
    cap(t, 7, 0, null, CX, 820, { size: 64, w: 500, col: INK, al: 'center' });
    cap(t, 8, 0, null, CX, 1330, { size: 64, w: 600, col: INK, al: 'center', fx: G => ({ al: 1 - .5 * seg(t, G.t + .2, .6) }) });
    if (t > S(9) - .1) cap(t, 9, 0, null, CX, 1480, { size: 52, w: 400, tr: .08, col: '#6A7390', al: 'center' });
    disc(kx, ky, eIn(seg(t, 30.25, .72)) * 2400, DEEP);                                                              // the cooled knob floods the page
  }
}
function lerpCol(a, b, x) { const p = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)), q = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16)); return `rgb(${p.map((v, i) => Math.round(lerp(v, q[i], clamp(x)))).join(',')})` }

// ================= PRE-CHORUS 31.0 - 48.4: tags, the likes list, a badge, a heart pressed and taken back, a comment deleted, a spinner holding on =================
function P1(t) {
  fill(DEEP); blurBg('mem_festival', DEEP, .8);
  // L10 "@주인공" pops; ME's "@나" appears on 난 and deflates on 아니야
  const chipS = spr(t, [[0, 0], [S(10), 1, 2.4, .35], [S(11) - .1, .72, 1.8, .5], [S(12) - .1, 1.1, 2, .4], [S(13) - .1, 0, 2.6, .6]]);
  const chipY = spr(t, [[0, 900], [S(11) - .1, 470, 1.6, .5], [S(12) - .1, 880, 1.6, .5]]);
  if (chipS > .01 && t < S(13) + .6) { g.save(); g.translate(CX, chipY); g.scale(chipS, chipS); blob(0, 0, 560, 140, { col: WHITE, round: 1, wob: wob(t - S(10), .12) }); avatar('you_front', -205, 0, 48); pillText(40, 4, '@주인공', { size: 64, w: 800, col: YOUCOL }); g.restore() }
  if (t < S(11) + .4) {
    const ms = spr(t, [[0, 0], [cT(10, 5), 1, 3, .35], [cT(10, 6) + .15, 0, 2.2, .7]]);
    if (ms > .01) { g.save(); g.translate(CX, 1120); g.scale(ms, ms * (1 + wob(t - cT(10, 6) - .15, .4))); blob(0, 0, 200, 80, { col: GREY, round: 1 }); pillText(0, 3, '@나', { size: 36, w: 600, col: INK }); g.restore() }
    cap(t, 10, 0, 9, CX, 560, { size: 40, w: 400, tr: .1, col: WHITE, al: 'center', hide: S(11) - .1 });
  }
  // L11 the likes list: a crowd of avatars; one of them is the coral dot
  if (t > S(11) - .2 && t < S(13)) {
    const gather = eIn(seg(t, S(12) - .1, .5));
    for (let r = 0; r < 7; r++) for (let c = 0; c < 7; c++) {
      const n = r * 7 + c, me = r === 5 && c === 1, gx = CX + (c - 3) * 120, gy = 1010 + (r - 3) * 120, d = Math.hypot(c - 3, r - 3);
      const s = spr(t, [[0, 0], [S(11) + d * .07, 1, 2.6, .35]]) * (1 - gather) * (me ? 1 + .5 * pulse(t) * (t > cT(11, 5)) : 1);
      const x = lerp(gx, CX, gather), y = lerp(gy, chipY, gather);
      if (s > .01) { if (me) blob(x, y, 60 * s, 60 * s, { col: MECOL }); else { g.save(); g.translate(x, y); g.scale(s, s); disc(0, 0, 32, WHITE); photoCrop('mem_photo', 0, 0, 29, ...CROWD[(n * 5) % CROWD.length], 11); g.restore() } }   // other people's faces; ME is the coral dot
    }
    const ls = spr(t, [[0, 0], [cT(11, 5), 1, 2.6, .35]]) * (1 - gather); if (ls > .01) { g.save(); g.translate(CX, 1560); g.scale(ls, ls); blob(0, 0, 380, 96, { col: WHITE, round: 1 }); pillText(0, 3, '외 1,203명', { size: 40, w: 600, col: INK }); g.restore() }
    cap(t, 11, 0, 5, CX - 60, 1720, { size: 40, w: 400, tr: .1, col: WHITE, al: 'center', hide: S(12) - .1 });
    cap(t, 11, 5, 10, CX + 220, 1720, { size: 36, w: 500, fam: EN, tr: .2, col: MECOL, hide: S(12) - .1 });
  }
  // L12 a verified badge pops on the chip and a check draws itself
  if (t > S(12) - .1 && t < S(13) + .3) {
    const bs = spr(t, [[0, 0], [cT(12, 7) - .05, 1, 2.8, .32], [S(13) - .1, 0, 2.4, .6]]), bx = 830, by = 790;
    if (bs > .01) { g.save(); g.translate(bx, by); g.scale(bs, bs); g.rotate(t * .4); g.beginPath(); for (let k = 0; k <= 96; k++) { const a = k / 96 * 6.28, rr = 90 * (1 + .1 * Math.sin(a * 12)); k ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(rr, 0) } g.fillStyle = YEL; g.fill(); g.restore();
      drawPath([[bx - 38 * bs, by], [bx - 8 * bs, by + 30 * bs], [bx + 42 * bs, by - 30 * bs]], seg(t, cT(12, 7) + .2, .35), 14, DEEP) }
    cap(t, 12, 0, 7, CX, 640, { size: 40, w: 400, tr: .1, col: WHITE, al: 'center', hide: S(13) - .1 });
    cap(t, 12, 7, 10, CX, 1180, { size: 150, w: 900, col: YEL, al: 'center', rev: 'grow', hide: S(13) - .1 });
    cap(t, 12, 10, null, CX, 1290, { size: 44, w: 400, tr: .1, col: WHITE, al: 'center', hide: S(13) - .1 });
  }
  // L13 a heart: pressed (fills with a jelly pop) on 널, taken back on 미워했어.  L14 a comment typed, erased, retyped
  if (t > S(13) - .15 && t < S(15) + .2) {
    const hs = spr(t, [[0, 0], [S(13), 1, 2.2, .35], [S(14) - .1, .6, 1.6, .5], [S(15) - .2, 0, 2.4, .6]]), hy = spr(t, [[0, 960], [S(14) - .1, 720, 1.6, .5]]);
    const fillA = seg(t, cT(13, 6), .06) * (1 - seg(t, cT(13, 8) + .1, .45)), hp = wob(t - cT(13, 6), .35) - wob(t - cT(13, 8) - .1, .25);
    { g.save(); g.translate(CX, hy); g.scale(hs, hs); blob(0, 8, 860, 640, { col: 'rgba(0,0,0,.25)', round: .08 }); photo('mem_award', 0, 0, 840, 620, { fx: .45, fy: .4, r: 34 }); g.restore() }
    heart(CX, hy, 360 * hs * (1 + hp * .4), { col: MECOL, alpha: fillA }); heart(CX, hy, 360 * hs * (1 + hp * .4), { stroke: WHITE, lw: 14 });                     // double-tap on YOU's photo
    cap(t, 13, 0, 7, CX, 1420, { size: 44, w: 400, tr: .1, col: WHITE, al: 'center', hide: S(14) - .1 }); cap(t, 13, 7, null, CX, 1490, { size: 64, w: 700, col: MECOL, al: 'center', hide: S(14) - .1 });
    if (t > S(14) - .4) {
      const iy = spr(t, [[0, 2100], [S(14) - .3, 1600, 2, .45], [S(15) - .25, 2200, 1.6, .5]]);
      blob(CX, iy, 920, 140, { col: WHITE, round: 1, sq: wob(t - S(14) + .1, .15) }); disc(930, iy, 44, YOUCOL);
      const C = chars(14), del = cT(14, 4) - .02; let s = '';
      for (let k = 0; k < C.length; k++) { if (t < C[k].t) break; if (k < 4 && t > del + (4 - k) * .07) continue; if (k > 0 && C[k].sp && s) s += ' '; s += C[k].c }
      if (t > del && t < del + .35) s = s.replace(/^\s+/, '');
      font(500, 44, KR); setTrack(0); const tw = g.measureText(s).width; txt(s, 110, iy + 16, { size: 44, w: 500, col: INK, upper: false });
      if (Math.floor((t - B0) / (BEAT / 2)) % 2 === 0) rect(116 + tw, iy - 24, 4, 50, YOUCOL);                         // cursor
    }
  }
  // L15-16 a loading spinner around the dot: it holds on while the ring tightens; then the dot swells and bursts
  if (t > S(15) - .4) {
    const press = seg(t, S(15), 47.7 - S(15)), dIn = fall(t, S(15) - .4, S(15) - .05, 2000, CX + 420), sw = eIn(seg(t, 47.7, .6));
    const dr = lerp(40, 28, press) + sw * 80, cy = Math.min(dIn, 960);
    if (sw < 1) { g.save(); g.lineCap = 'round'; g.strokeStyle = WHITE; g.lineWidth = lerp(10, 34, press); g.globalAlpha = 1 - sw; const a0 = t * 6; g.beginPath(); g.arc(CX, cy, 130 - press * 30, a0, a0 + Math.PI * 1.5); g.stroke(); g.restore() }
    blob(CX, cy, dr * 2, dr * 2, { col: MECOL, sq: .25 * pulse(t) * (1 - sw), wob: sw * .3, ph: t * 20 });
    cap(t, 15, 0, null, CX, 700, { size: 50, w: 400, tr: .1, col: WHITE, al: 'center', hide: 47.9 });
    cap(t, 16, 0, null, CX, 1280, { size: 64, w: 500, col: WHITE, al: 'center', hide: 47.9, fx: () => ({ w: lerp(420, 820, press) }) });
    disc(CX, cy, eOut(seg(t, 48.25, .35)) * 2400, VIOLET);                                                           // the burst: a violet page
  }
}

// ================= CHORUS 1 48.4 - 70.4: hearts, YOU shining, the counter, comments, a colour burst; ME's post with 0 likes =================
const HEARTS = Array.from({ length: 28 }, (_, j) => ({ x: 90 + (j % 7) * 150 + (R(j, 1) - .5) * 40, row: Math.floor(j / 7), t0: 48.35 + j * .032 + R(j, 2) * .15, s: 100 + 40 * R(j, 3), rot: (R(j, 4) - .5) * .6, col: [MECOL, PINK, YEL, WHITE, PEACH][j % 5] }));
function C1(t, o = 0) {
  const d = S(17 + o) - S(17), fin = o > 0;                                                // the final chorus replays chorus 1 with small changes
  const peach = eOut(seg(t, S(22 + o) - .05, .5)), teal = eIO(seg(t, S(26 + o) - .3, .55));
  fill(VIOLET); blurBg('pov_stage', VIOLET, .78);
  // YOU's circle (it will shine, collect the likes, then wait at the end)
  const Yx = spr(t, [[0, 380], [cT(18 + o, 2), 330, 2.4, .35], [S(19 + o) - .1, CX, 1.4, .5], [S(27 + o) - .2, 760, 1.4, .5]]), Yy = spr(t, [[0, 820], [S(27 + o) - .2, 1000, 1.4, .5]]);
  const Yr = spr(t, [[0, 0], [S(18 + o), 200, 2.2, .33], [S(19 + o) - .1, 280, 1.6, .4], [S(22 + o) - .1, 0, 2.2, .7], [S(27 + o) - .25, 190, 2.2, .35]]);
  if (peach > 0) { g.save(); g.beginPath(); g.arc(Yx, Yy, peach * 2400, 0, 7); g.clip(); fill(PEACH); blurBg('mem_rooftop', PEACH, .74); g.restore() }
  if (teal > 0) { g.save(); g.beginPath(); const off = (1 - teal) * 2200; g.moveTo(off - 300, 0); g.lineTo(off + 1600, 0); g.lineTo(off + 1300, H); g.lineTo(off - 600, H); g.clip(); fill(TEAL); blurBg('mem_sunset', TEAL, .78); g.restore() }
  // hearts rain down and pile up; on "모두 널 좋아해" they fly up into the counter
  if (t < S(21 + o) + .5) HEARTS.forEach((h, j) => {
    const t0 = h.t0 + d, land = t0 + .55, yl = 1850 - h.row * 118, y = fall(t, t0, land, -120, yl), fly = eIn(seg(t, S(20 + o) + j * .018, .45));
    if (t < t0) return; const x = lerp(h.x, CX - 200, fly), yy = lerp(y, 1300, fly);
    heart(x, yy, h.s * (1 - fly), { col: h.col, rot: h.rot, sq: wob(t - land, .45) });
  });
  if (t < S(18 + o) + .2) { const s = spr(t, [[0, 0], [S(17 + o), 1, 2.6, .35], [S(18 + o) - .05, 0, 2.6, .6]]); if (s > .01) { g.save(); g.translate(CX, 900); g.scale(s, s); blob(0, 0, 640, 120, { col: WHITE, round: 1 }); g.restore(); cap(t, 17 + o, 0, null, CX, 916, { size: 40 * s, w: 700, fam: EN, tr: .06, col: YOUCOL, al: 'center' }) } }
  // YOU (story circle) and ME (dot): they bump apart on 안 비슷해
  if (Yr > 1) {
    const ringsOn = t > S(19 + o) && t < S(20 + o) + .3;
    if (ringsOn) for (let k = 0; k < 6; k++) { const tb = onBeat(Math.floor(beatN(S(19 + o))) + k), a = t - tb; if (a > 0 && a < 1.2) ring(Yx, Yy, Yr + 30 + a * 520, 12 * (1 - a / 1.2) + 2, YEL, 1 - a / 1.2) }
    layered(t, [.08, 0], [YEL, WHITE], (tt, col) => blob(Yx, Yy, Yr * 2, Yr * 2, { col, wob: wob(tt - S(18 + o), .15) + wob(tt - cT(18 + o, 2), .2) }));
    avatar(t < S(26 + o) ? 'you_stage' : 'you_front', Yx, Yy, Yr * .92); ring(Yx, Yy, Yr + 22, 12, YOUCOL);
  }
  const Mx = spr(t, [[0, 800], [cT(18 + o, 2), 880, 2.4, .35], [S(19 + o) - .1, 1350, 1.4, .5], [S(27 + o) - .25, 260, 1.4, .5]]), My = spr(t, [[0, 860], [S(27 + o) - .25, 1000, 1.4, .5]]);
  if (t > S(18 + o) - .1 && t < S(19 + o) + .4) { blob(Mx, My, 120, 120, { col: MECOL, sq: wob(t - cT(18 + o, 2), .5) }); if (fin) avatar('me_portrait', Mx, My, 54) }
  if (t > S(18 + o) - .1 && t < S(19 + o)) { cap(t, 18 + o, 0, 2, 380, 1120, { size: 70, w: 800, col: WHITE, al: 'center' }); cap(t, 18 + o, 2, null, 860, 1020, { size: 44, w: 500, col: WHITE, al: 'center' }) }
  if (t > S(19 + o) - .1 && t < S(20 + o)) { cap(t, 19 + o, 0, 3, 80, 380, { size: 46, w: 400, tr: .1, col: WHITE }); cap(t, 19 + o, 4, 8, CX, 1215, { size: 46, w: 400, tr: .1, col: WHITE, al: 'center' }); cap(t, 19 + o, 8, null, CX, 1345, { size: 120, w: 900, col: YEL, al: 'center', rev: 'grow' }) }
  // L20 the like counter rolls up.  L21 comment bubbles pop all around
  if (t > S(20 + o) - .15 && t < S(22 + o) + .1) {
    const s = spr(t, [[0, 0], [S(20 + o), 1, 2.4, .35], [S(22 + o) - .1, 0, 2.6, .6]]), n = Math.round(lerp(1203, 99999, eIO(seg(t, S(20 + o) + .2, 1.2))));
    if (s > .01) { g.save(); g.translate(CX, 1300); g.scale(s, s); blob(0, 0, 640, 170, { col: WHITE, round: 1 }); heart(-220, 4, 90, { col: MECOL, sq: .3 * pulse(t) });
      txt(n.toLocaleString('en-US'), 40, 26, { size: 76, w: 800, fam: EN, col: INK, al: 'center', upper: false }); g.restore() }
    cap(t, 20 + o, 0, null, CX, 1160, { size: 60, w: 700, col: WHITE, al: 'center', hide: S(21 + o) - .05 });
    const B = [[250, 470, '최고'], [800, 560, '대박'], [230, 1070, '멋져'], [860, 1130, '짱'], [300, 1680, '부러워'], [790, 1720, '인정']];
    B.forEach(([x, y, w], k) => { const bs = spr(t, [[0, 0], [S(21 + o) + k * .1, 1, 2.8, .32], [S(22 + o) - .1, 0, 2.6, .6]]); if (bs < .01) return; g.save(); g.translate(x, y); g.scale(bs, bs);
      const col = [PEACH, TEAL, YEL, WHITE, PINK, WHITE][k]; blob(0, 0, 250, 100, { col, round: 1 }); g.beginPath(); g.moveTo(-40, 40); g.lineTo(-70, 80); g.lineTo(-10, 46); g.fillStyle = col; g.fill(); pillText(0, 4, w, { size: 40, w: 700, col: INK }); g.restore() });
    if (t > S(21 + o) - .1) cap(t, 21 + o, 0, null, CX, 1540, { size: 60, w: 700, col: WHITE, al: 'center' });
  }
  // L22 a burst of colour (peach page, a sun, a teal wave): 행복해
  if (t > S(22 + o) - .1 && t < S(26 + o)) {
    const k = seg(t, S(22 + o), .1);
    const sun = spr(t, [[0, 0], [S(22 + o), 300, 1.8, .33], [S(25 + o) - .1, 180, 1.6, .5]]);
    disc(CX, 700, sun, YEL); const pc = spr(t, [[0, 0], [S(22 + o) + .1, 1, 2, .36], [S(23 + o) + .3, .55, 1.6, .5]]), pcy = spr(t, [[0, 820], [S(23 + o) + .3, 560, 1.6, .5]]);
    if (pc > .01 && t < S(25 + o)) { g.save(); g.translate(CX, pcy); g.scale(pc, pc); g.rotate(-.04); blob(0, 10, 640, 800, { col: 'rgba(0,0,0,.14)', round: .08 }); blob(0, 0, 640, 800, { col: WHITE, round: .08 }); photo('you_crowd', 0, -40, 580, 640, { fx: .5, fy: .3, r: 20 }); heart(-240, 340, 50, { col: MECOL }); txt('99,999', -196, 356, { size: 40, w: 800, fam: EN, col: INK, upper: false }); g.restore() } blob(260 + 30 * Math.sin(t), 1650, 900 * k, 520 * k, { col: TEAL, round: .7, wob: .15, ph: t * 2 });
    if (t < S(23 + o) + .2) { layered(t, [.1, .05, 0], [MECOL, YEL, WHITE], (tt, col) => cap(tt, 22 + o, 0, 3, CX, 1420, { size: 200, w: 900, col, al: 'center', rev: 'grow' })); cap(t, 22 + o, 3, null, CX, 1530, { size: 56, w: 500, col: WHITE, al: 'center' }) }
  }
  // L23-24 ME's post: a small tile slides in with a heart and 0; it is brought to the centre and wobbles
  if (t > S(23 + o) - .3 && t < S(26 + o) - .1) {
    const sc = spr(t, [[0, 1], [S(24 + o) - .1, 2.1, 1.6, .45], [S(25 + o) - .1, 1.25, 1.6, .5]]), cx = spr(t, [[0, 1300], [S(23 + o) - .2, 830, 2, .4], [S(24 + o) - .1, CX, 1.6, .45]]), cy = spr(t, [[0, 1560], [S(24 + o) - .1, 900, 1.6, .45], [S(25 + o) - .1, 760, 1.6, .5]]);
    g.save(); g.translate(cx, cy); g.scale(sc, sc);
    blob(0, 6, 340, 440, { col: 'rgba(0,0,0,.12)', round: .12 }); blob(0, 0, 340, 440, { col: WHITE, round: .12 }); photo('me_smile', 0, -60, 300, 240, { fx: .51, fy: .4, zoom: 1, r: 18, bg: '#E7E2EC', filter: fin ? '' : 'grayscale(.5)' });
    heart(-120, 110, 44, { stroke: INK, lw: 5 }); txt('0', -84, 124, { size: 40, w: 800, fam: EN, col: MECOL, upper: false });
    cap(t, 23 + o, 0, null, -140, 170, { size: 20, w: 500, fam: EN, col: INK, hide: S(24 + o) - .05 }); if (t > S(24 + o) - .05) cap(t, 24 + o, 0, null, -140, 170, { size: 20, w: 600, fam: EN, col: MECOL });
    g.restore();
  }
  // L25 the storage bar fills with coral jelly until it bulges
  if (t > S(25 + o) - .2 && t < S(26 + o) + .2) {
    const f = eIO(seg(t, S(25 + o), E(25 + o) - S(25 + o) + .1)), out = seg(t, S(26 + o) - .1, .3), bw = 820 * f;
    blob(CX, 1480, 840, 140, { col: WHITE, round: 1, alpha: 1 - out }); if (bw > 20) blob(130 + bw / 2, 1480, bw, 120, { col: MECOL, round: 1, wob: .12 + (f > .95 ? .25 : 0) * wob(t - E(25 + o), 1), ph: t * 9, alpha: 1 - out });
    txt('저장공간 가득 참', CX, 1360, { size: 36, w: 600, col: INK, al: 'center', alpha: (1 - out) * seg(t, S(25 + o), .3) });
    cap(t, 25 + o, 0, null, CX, 1500, { size: 56, w: 800, col: WHITE, al: 'center', alpha: 1 - out });
  }
  // L26 a search box drops in: "Tell me" is its placeholder, then 내가 나쁜 맘일까 is typed. No results.
  if (t > S(26 + o) - .3 && t < S(27 + o) + .1) {
    const sy = fall(t, S(26 + o) - .25, S(26 + o) + .15, -200, 420), out = seg(t, S(27 + o) - .2, .3);
    blob(CX, sy, 920, 140, { col: WHITE, round: 1, sq: wob(t - S(26 + o) - .15, .3), alpha: 1 - out }); ring(120, sy - 6, 24, 7, INK, 1 - out); line(138, sy + 12, 156, sy + 30, 7, INK, 1 - out, 1);
    if (t < cT(26 + o, 6)) cap(t, 26 + o, 0, 6, 190, sy + 16, { size: 44, w: 400, fam: EN, col: GREY, upper: false, alpha: 1 - out }); else cap(t, 26 + o, 6, null, 190, sy + 16, { size: 44, w: 600, col: INK, alpha: 1 - out });
    for (let k = 0; k < 3; k++) blob(CX, 700 + k * 150, 800 - k * 160, 70, { col: 'rgba(255,255,255,.35)', round: 1, alpha: (.5 + .5 * Math.sin(t * 4 + k)) * seg(t, E(26 + o) - 1.2, .4) * (1 - out) });
    if (!fin) txt('결과 없음', CX, 1150, { size: 40, w: 500, col: WHITE, al: 'center', alpha: seg(t, E(26 + o) - .8, .4) * (1 - out) });
    else { const rs = spr(t, [[0, 0], [E(26 + o) - 1.2, 1, 2.4, .36]]) * (1 - out); if (rs > .01) { g.save(); g.translate(CX, 820); g.scale(rs, rs); blob(0, 0, 900, 180, { col: WHITE, round: .3 }); avatar('me_portrait', -340, 0, 60); txt('나', -250, 16, { size: 46, w: 800, col: INK }); txt('게시물 1 · 팔로워 38', -250, 60, { size: 30, w: 500, col: GREY }); g.restore() } }
  }
  // L27 I wanna be you: the dot stretches toward YOU like taffy... and snaps back. Then it rushes at the lens.
  if (t > S(27 + o) - .3) {
    const reach = spr(t, fin ? [[0, 0], [S(27 + o) + .1, 1, 1.2, .6]] : [[0, 0], [S(27 + o) + .1, 1, 1.2, .6], [cT(27 + o, 8), 0, 4, .25]]), tipX = lerp(Mx, Yx - Yr - 30, clamp(reach)), thick = lerp(100, 34, clamp(reach));
    const rush = fin ? 0 : eIn(seg(t, 69.55, .8));
    if (reach > .02) blob((Mx + tipX) / 2, My, Math.abs(tipX - Mx) + thick, thick, { col: MECOL, round: 1 });
    blob(Mx, My, 100 + rush * 4600, 100 + rush * 4600, { col: MECOL, sq: wob(t - cT(27 + o, 8), .6) });
    cap(t, 27 + o, 0, 8, CX, 600, { size: 60, w: 600, fam: EN, tr: .12, col: WHITE, al: 'center' });
    if (fin) { const st = eIO(seg(t, S(27 + o) + .3, 1.0)); if (st > 0) { g.save(); g.beginPath(); g.arc(Mx, My, st * 2300, 0, 7); g.clip(); photo('pov_empty_stage', CX, CY, W, H, { fx: .5, fy: .5, r: 0 }); g.restore() } }   // she stands where he stood
    cap(t, 27 + o, 8, null, Yx, Yy + 330, { size: 150, w: 900, fam: EN, col: WHITE, al: 'center', rev: 'grow' });
    if (fin) disc(CX, CY, eIn(seg(t, 178.6, .6)) * 2400, CREAM);
  }
}
