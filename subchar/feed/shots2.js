/* FEED act 2 (70.4 - 137.5): the interlude explore grid, the selfie camera (a mirror), split screen, the bin, the DM,
   the tangle, the message typed and deleted, and the stories (montage, the end, ME's own story with 0 views, thrown away).
   The coral dot is still the thread: everything gathers into it and grows back out of it. */

// ================= INTERLUDE 70.4 - 82.3: an explore grid of YOU's memories, tilted, drifting; then it all drains into one point =================
const EXPLORE = ['mem_entrance', 'pov_backrow', 'mem_class', 'pov_hallway', 'mem_lunch', 'pov_zoom', 'pov_window', 'mem_race', 'mem_award', 'pov_rain', 'mem_rain', 'mem_library',
  'pov_stage', 'mem_festival', 'you_stage', 'you_crowd', 'mem_photo', 'mem_rooftop', 'mem_sunset', 'you_front', 'pov_backrow', 'mem_class', 'pov_hallway', 'mem_entrance', 'pov_window', 'mem_lunch', 'pov_zoom', 'mem_race', 'pov_stage', 'mem_rain'];
function I2(t) {
  fill(MECOL);
  const drain = eIn(seg(t, 80.9, 1.2)), drift = (t - 70.4) * 70;
  const deep = eOut(seg(t, 81.6, .6)); if (deep > 0) disc(CX, CY, deep * 2400, INK);
  g.save(); g.translate(CX, CY); g.rotate(-.32 * (1 - drain));
  for (let k = 0; k < 30; k++) {
    const col = k % 3, row = Math.floor(k / 3), x0 = (col - 1) * 340, y0 = (row - 3.5) * 340 - drift + 170 * (col % 2);
    const pop = spr(t, [[0, 0], [70.45 + k * .09, 1, 2.6, .34]]), x = lerp(x0, 0, drain), y = lerp(y0, 0, drain), s = pop * (1 - drain) * (1 + .05 * pulse(t - k * .02));
    if (s < .01) continue;
    g.save(); g.translate(x, y); g.scale(s, s); g.rotate(.32 * (1 - drain) * .0);
    blob(0, 8, 316, 316, { col: 'rgba(0,0,0,.14)', round: .14 }); blob(0, 0, 316, 316, { col: WHITE, round: .14 });
    photo(EXPLORE[k], 0, 0, 292, 292, { r: 22, fx: .5, fy: .45 });
    if (k % 4 === 1) heart(110, 110, 46, { col: MECOL, sq: wob(t - 70.6 - k * .09, .5) });
    g.restore();
  }
  // soft shapes floating between the tiles
  for (let k = 0; k < 10; k++) { const a = t * .5 + k, x = Math.cos(a * .7 + k) * 420, y = Math.sin(a * .5 + k * 2) * 760; blob(lerp(x, 0, drain), lerp(y, 0, drain), (60 + 50 * R(k, 5)) * (1 - drain), (40 + 70 * R(k, 6)) * (1 - drain), { col: [YEL, TEAL, PEACH, WHITE, YOUCOL][k % 5], round: 1, wob: .2, ph: t * 3 + k }) }
  g.restore();
  if (drain > .6) blob(CX, CY, 40 + 20 * wob(t - 82.1, 1), 40, { col: MECOL, alpha: seg(t, 81.6, .3) });                  // what is left: the dot
}

// ================= VERSE 2 82.3 - 107.85: the selfie camera is a mirror; then split screen, the bin, the DM, the tangle =================
const FILTERS = ['none', 'grayscale(1)', 'sepia(.85)', 'hue-rotate(150deg) saturate(1.4)', 'contrast(1.5) saturate(0)', 'brightness(.6) saturate(.4)', 'blur(3px) grayscale(.6)'];
function V2(t) {
  fill(INK); blurBg('pov_night', INK, .72);
  // L28-30 the front camera: a round frame opening from the dot; every syllable of 싫어져만 갔어 swaps the filter, the frame wobbles
  if (t < S(31) + .1) {
    const nf = t < S(29) ? 0 : chars(29).filter(G => t >= G.t).length, lastT = nf ? chars(29)[nf - 1].t : 0;
    const R0 = spr(t, [[0, 0], [82.3, 400, 1.8, .36], [S(30) - .1, 270, 1.8, .45]]), cy = spr(t, [[0, 860], [S(30) - .1, 640, 1.8, .45]]);
    const w = spr(t, [[0, 0], [82.3, 800, 1.8, .36], [S(30) - .1, 540, 1.8, .45], [S(31) - .15, 900, 2, .45]]), h = spr(t, [[0, 0], [82.3, 800, 1.8, .36], [S(30) - .1, 540, 1.8, .45], [S(31) - .15, 620, 2, .45]]);
    const rd = t < S(31) - .15 ? 1 : lerp(1, .1, seg(t, S(31) - .15, .3)), wb = wob(t - lastT, .12);
    g.save(); g.beginPath(); g.roundRect(CX - w / 2, cy - h / 2, w, h, rd * Math.min(w, h) / 2); g.clip(); g.filter = FILTERS[nf % FILTERS.length];
    const im = ART.pov_selfie; if (im) { const s = Math.max(w / im.width, h / im.height) * 1.25 * (1 + wb), iw = im.width * s, ih = im.height * s; g.fillStyle = '#E9E3EE'; g.fillRect(CX - w / 2, cy - h / 2, w, h); g.drawImage(im, CX - iw * .5, cy - ih * .3, iw, ih) }
    g.filter = 'none'; g.restore();
    g.save(); g.strokeStyle = WHITE; g.lineWidth = 8; g.beginPath(); g.roundRect(CX - w / 2, cy - h / 2, w, h, rd * Math.min(w, h) / 2); g.stroke(); g.restore();
    // shutter and filter chips
    const ua = seg(t, 82.6, .4) * (1 - seg(t, S(30) - .2, .3));
    ring(CX, 1560, 78, 10, WHITE, ua); disc(CX, 1560, 60 * (1 - .15 * wob(t - lastT, 1)), WHITE, ua);
    for (let k = -3; k <= 3; k++) { if (!k) continue; const cx = CX + k * 130 - (nf % 7) * 0; disc(cx, 1560, 34, ['#FFB36B', '#BDB7C9', '#D9B38C', '#62B6B7', '#8A8594', '#6D5B80'][(k + 3) % 6], ua * .9) }
    cap(t, 28, 0, null, CX, 280, { size: 50, w: 500, col: WHITE, al: 'center', hide: S(30) - .1 });
    cap(t, 29, 0, null, CX, 1360, { size: 64, w: 700, col: WHITE, al: 'center', hide: S(30) - .1 });
    cap(t, 30, 0, null, CX, 1060, { size: 56, w: 500, col: WHITE, al: 'center', hide: S(31) - .1 });
  }
  // L31-35 split screen: ME on top, YOU below; YOU's half pushes ME's up; then equal; then ME's pictures go to the bin
  if (t > S(31) - .2 && t < S(36) + .2) {
    const topH = spr(t, [[0, 620], [cT(32, 3), 420, 2.2, .38], [S(34) - .1, 620, 2, .4], [S(35) + .2, 0, 2.2, .6]]), botH = spr(t, [[0, 0], [S(32) - .1, 620, 2.2, .36], [cT(32, 3), 900, 2.2, .38], [S(34) - .1, 620, 2, .4], [S(36) - .2, 0, 2.2, .6]]);
    const topY = 120 + topH / 2 + 40, botY = 120 + topH + 80 + botH / 2 + 40;
    if (topH > 4) { photo('pov_window', CX, topY, 900, topH, { fx: .5, fy: .55, r: 36, bg: '#E7E2EC' }); blob(260, topY - topH / 2 + 60, 220, 70, { col: WHITE, round: 1 }); pillText(260, topY - topH / 2 + 63, 'ME', { size: 30, w: 700, fam: EN, col: MECOL }) }
    if (botH > 4) { photo('mem_rain', CX, botY, 900, botH, { fx: .52, fy: .45, r: 36 }); blob(260, botY - botH / 2 + 60, 220, 70, { col: WHITE, round: 1 }); pillText(260, botY - botH / 2 + 63, 'YOU', { size: 30, w: 700, fam: EN, col: YOUCOL }) }
    const lbl = (i, y, sz = 52) => cap(t, i, 0, null, CX, y, { size: sz, w: 700, col: WHITE, al: 'center', hide: S(i + 1) - .1 });
    if (t < S(32)) lbl(31, topY + topH / 2 - 40); else if (t < S(33)) lbl(32, botY + botH / 2 - 50);
    else if (t < S(34)) lbl(33, topY + topH / 2 - 40); else if (t < S(35)) lbl(34, botY + botH / 2 - 50);
    // L35 ME's own pictures fly into the bin
    if (t > S(35) - .2) {
      const bx = 880, by = 1700, bs = spr(t, [[0, 0], [S(35) - .1, 1, 2.6, .35], [S(36) - .1, 0, 2.4, .6]]);
      ['me_cry', 'me_angry', 'me_envy'].forEach((id, k) => { const t0 = S(35) + .3 + k * .45, p = eIn(seg(t, t0, .55)); if (p >= 1 || t < t0 - .4) return;
        const x = lerp(260 + k * 280, bx, p), y = lerp(1100, by, p) - Math.sin(p * Math.PI) * 300, s = 1 - .8 * p;
        g.save(); g.translate(x, y); g.rotate(p * 2 * (k - 1)); g.scale(s, s); blob(0, 0, 240, 300, { col: WHITE, round: .1 }); photo(id, 0, -10, 220, 250, { fx: .5, fy: .3, r: 14, bg: '#E7E2EC', filter: 'grayscale(.6)' }); g.restore() });
      const hit = [0, 1, 2].reduce((a, k) => a + wob(t - (S(35) + .85 + k * .45), .3), 0);
      g.save(); g.translate(bx, by); g.scale(bs, bs * (1 - hit)); blob(0, 30, 150, 170, { col: WHITE, round: .2 }); rect(-95, -80, 190, 20, WHITE); rect(-30, -104, 60, 20, WHITE); for (const x of [-35, 0, 35]) rect(x - 4, -10, 8, 110, GREY); g.restore();
      cap(t, 35, 0, null, CX, 1420, { size: 50, w: 600, col: WHITE, al: 'center', hide: S(36) - .1 });
    }
  }
  // L36-37 the DM: ME's bubbles to YOU; no read mark; YOU's story shows YOU hurting too
  if (t > S(36) - .3 && t < S(38) + .4) {
    const out = seg(t, S(38) - .1, .4), hd = spr(t, [[0, -120], [S(36) - .25, 190, 2.2, .4]]);
    g.globalAlpha = 1 - out;
    blob(CX, hd, 940, 130, { col: WHITE, round: 1 }); avatar('you_front', 150, hd, 46); txt('주인공', 220, hd + 14, { size: 42, w: 700, col: INK });
    const bub = (i, y, t0) => { const s = spr(t, [[0, 0], [t0, 1, 2.6, .35]]); if (s < .01) return; font(600, 46, KR); setTrack(0); const L = layout(i, 0, chars(i).length, { size: 46, w: 600 }), bw = L.width + 90;
      g.save(); g.translate(1000 - bw / 2, y); g.scale(s, s); blob(0, 0, bw, 120, { col: MECOL, round: 1 }); g.restore(); cap(t, i, 0, null, 1000 - bw + 45, y + 16, { size: 46, w: 600, col: WHITE }) };
    bub(36, 560, S(36)); bub(37, 720, S(37));
    txt('읽지 않음', 980, 820, { size: 30, w: 500, col: GREY, al: 'right', alpha: seg(t, E(37) - .3, .4) });
    const ss = spr(t, [[0, 0], [S(37) + .4, 1, 2.2, .38]]); if (ss > .01) { g.save(); g.translate(360, 1260); g.scale(ss, ss); g.rotate(-.05); blob(0, 0, 440, 600, { col: WHITE, round: .1 }); photo('pov_you_alone', 0, -20, 400, 520, { fx: .5, fy: .45, r: 20, bg: '#DDE3EA', filter: 'saturate(.7)' }); pillText(0, 270, 'YOU · 스토리', { size: 28, w: 600, col: INK }); g.restore() }
    g.globalAlpha = 1;
  }
  // L38-39 everything tangles: lines between faces knot and wriggle, then pull into one point
  if (t > S(38) - .2) {
    const pull = eIn(seg(t, E(39) - .5, .7)), a = seg(t, S(38) - .1, .6);
    const ends = [['you_front', 200, 500], ['me_portrait', 880, 560], ['you_stage', 220, 1500], ['me_portrait', 860, 1420], [null, 540, 300], [null, 540, 1700]];
    for (let k = 0; k < 9; k++) { const A = ends[k % 6], B = ends[(k * 5 + 2) % 6], ph = t * (1.1 + .2 * k) + k;
      const ax = lerp(A[1], CX, pull), ay = lerp(A[2], 1000, pull), bx = lerp(B[1], CX, pull), by = lerp(B[2], 1000, pull);
      g.save(); g.strokeStyle = [MECOL, YEL, TEAL, YOUCOL, PEACH, WHITE][k % 6]; g.lineWidth = 8 + 4 * a; g.lineCap = 'round'; g.globalAlpha = a; g.beginPath(); g.moveTo(ax, ay);
      g.bezierCurveTo(CX + Math.sin(ph) * 420 * (1 - pull), 900 + Math.cos(ph * 1.3) * 500 * (1 - pull), CX + Math.cos(ph * .8) * 420 * (1 - pull), 1100 + Math.sin(ph * 1.1) * 500 * (1 - pull), bx, by); g.stroke(); g.restore() }
    ends.forEach(([id, x, y], k) => { if (!id) return; const s = spr(t, [[0, 0], [S(38) + k * .12, 1, 2.6, .35]]) * (1 - pull); if (s > .01) avatar(id, lerp(x, CX, pull), lerp(y, 1000, pull), 70 * s) });
    cap(t, 38, 0, null, CX, 900, { size: 54, w: 600, col: WHITE, al: 'center', hide: S(39) - .1 });
    cap(t, 39, 0, null, CX, 1120, { size: 60, w: 700, col: WHITE, al: 'center', alpha: 1 - pull });
    if (pull > .5) blob(CX, 1000, 40, 40, { col: MECOL });
  }
}

// ================= CORRECTION 107.85 - 115.3: the message box. Typed, backspaced, typed again, selected, deleted =================
function CR(t) {
  fill(WHITE); blurBg('pov_night', WHITE, .8);
  const k40 = chars(40), del0 = E(40) - .25, nDel = Math.floor(clamp((t - del0) / .07, 0, 7));
  const L1 = (() => { let s = ''; for (let k = 0; k < k40.length; k++) { if (t < k40[k].t) break; if (k > 0 && k40[k].sp) s += ' '; s += k40[k].c } const keep = '미안해,'; if (t > del0) { const full = s; s = full.slice(0, Math.max(keep.length, full.length - nDel * 2)) } return s })();
  const typed = i => { let s = ''; for (const G of chars(i)) { if (t < G.t) break; if (s && G.sp) s += ' '; s += G.c } return s };
  let l1 = L1; if (t > S(41) - .05) l1 = '미안해, ' + typed(41);
  const l2 = t > S(42) - .05 ? typed(42) : '';
  const sel = seg(t, 113.9, .15), gone = eIn(seg(t, 114.45, .25)), toDot = eIn(seg(t, 114.7, .5));
  const bh = spr(t, [[0, 0], [107.95, 140, 2.4, .36], [S(42) - .1, 240, 2.2, .4]]) * (1 - toDot) + 40 * toDot, bw = spr(t, [[0, 0], [107.95, 940, 2.4, .36]]) * (1 - toDot) + 40 * toDot;
  // the DM context above: YOU's name, the unread bubbles from before, faded
  const ca = seg(t, 108, .5) * (1 - toDot);
  blob(CX, 190, 940, 130, { col: WHITE, round: 1, alpha: ca }); avatar('you_front', 150, 190, 46, { alpha: ca }); txt('주인공', 220, 204, { size: 42, w: 700, col: INK, alpha: ca });
  blob(CX, 1000, bw, bh, { col: toDot > .5 ? MECOL : WHITE, round: toDot > .5 ? 1 : Math.min(1, 140 / Math.max(1, bh)), sq: wob(t - 107.95, .15) });
  if (toDot < .3) {
    g.save(); g.globalAlpha = 1 - gone; const y1 = 1000 - (bh - 140) / 2 + 16;
    if (sel > 0) { font(600, 48, KR); setTrack(0); rect(90, y1 - 44, g.measureText(l1).width + 10, 60, YOUCOL, .25 * sel); if (l2) rect(90, y1 + 56, g.measureText(l2).width + 10, 60, YOUCOL, .25 * sel) }
    txt(l1 || '메시지 보내기...', 95, y1, { size: 48, w: 600, col: l1 ? INK : GREY, upper: false }); if (l2) txt(l2, 95, y1 + 100, { size: 48, w: 600, col: INK, upper: false });
    font(600, 48, KR); setTrack(0); const cw = g.measureText(l2 || l1).width; if (Math.floor((t - B0) / (BEAT / 2)) % 2 === 0 && sel === 0) rect(100 + cw, (l2 ? y1 + 100 : y1) - 40, 5, 54, YOUCOL);
    g.restore();
  }
}

// ================= CHORUS 2 115.3 - 137.5: stories. YOU's stories, a montage, the end; then ME's own story (0 views), undecided, timed out, thrown away =================
const STORIES = () => [
  [S(43) - .15, 'mem_entrance', 'you', 43], [S(44) - .1, 'mem_lunch', 'you', 44], [S(45) - .1, 'mem_library', 'you', 45], [S(46) - .1, 'mem_rain', 'you', 46],
  [cT(46, 6), 'me_mirror', 'me', -1], [cT(46, 6) + BEAT, 'me_envy', 'me', -1], [cT(46, 6) + 2 * BEAT, 'me_cry', 'me', -1], [cT(46, 6) + 3 * BEAT, 'me_angry', 'me', -1],
  [S(47) - .1, 'mem_sunset', 'you', 47], [S(48) - .15, 'pov_night', 'me', 48]];
function storyFrame(id, who, cx, s, t, extra) {
  g.save(); g.translate(cx, CY); g.scale(s, s);
  const bg = who === 'me' ? '#CFC9D8' : '#222';
  photo(id, 0, 0, 1000, 1780, { r: 44, fx: .5, fy: who === 'me' ? .4 : .45, bg, filter: who === 'me' ? 'grayscale(.45) brightness(.95)' : '' });
  const gr = g.createLinearGradient(0, -890, 0, -600); gr.addColorStop(0, 'rgba(0,0,0,.45)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.roundRect(-500, -890, 1000, 290, [44, 44, 0, 0]); g.fill();
  avatar(who === 'me' ? 'me_portrait' : 'you_front', -400, -770, 40); txt(who === 'me' ? '나' : '주인공', -340, -756, { size: 36, w: 700, col: WHITE });
  if (extra) extra();
  g.restore();
}
function sticker(x, y, w, h, t0, t, rot, draw) { const s = spr(t, [[0, 0], [t0, 1, 2.8, .34]]); if (s < .01) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); blob(0, 6, w, h, { col: 'rgba(0,0,0,.2)', round: .3 }); blob(0, 0, w, h, { col: WHITE, round: .3 }); draw(); g.restore() }
function C2(t) {
  fill(INK);
  const L = STORIES(); let k = 0; for (let j = 0; j < L.length; j++) if (t >= L[j][0]) k = j;
  const open = spr(t, [[0, .02], [115.3, 1, 2, .4]]), toss = eIn(seg(t, cT(52, 4), .8));
  // progress bars across the top
  const bars = (n, cur, p) => { for (let j = 0; j < n; j++) { const x = 40 + j * (1000 / n); blob(x + (1000 / n - 12) / 2, 70, 1000 / n - 12, 8, { col: 'rgba(255,255,255,.35)', round: 1 }); const f = j < cur ? 1 : j === cur ? p : 0; if (f > 0) blob(x + (1000 / n - 12) * f / 2, 70, (1000 / n - 12) * f, 8, { col: WHITE, round: 1 }) } };
  const [t0, id, who, li] = L[k], next = L[k + 1] ? L[k + 1][0] : E(52), p = clamp((t - t0) / Math.max(.2, next - t0));
  const slide = spr(t, [[0, 0], [t0, 1, 2.6, .5]]), prev = k > 0 ? L[k - 1] : null;
  // ME's story: indecision (left, right), a 24h timer, then dragged down into the bin
  const dither = t > S(50) && t < S(51) ? spr(t, [[0, 0], ...chars(50).map((G, j) => [G.t, (j % 2 ? -1 : 1) * 160, 3, .35]), [E(50), 0, 3, .4]]) : 0;
  const dropY = toss * 1300, sc = open * (1 - .75 * toss);
  if (prev && slide < .999) storyFrame(prev[1], prev[2], CX - (slide) * 1100, sc, t);
  g.save(); g.translate(0, dropY); storyFrame(id, who, CX + (1 - slide) * 1100 * (prev ? 1 : 0) + dither, sc, t, () => {
    if (li === 43 || li === 44) sticker(0, 520, 780, 150, S(li), t, li === 43 ? -.04 : .04, () => cap(t, li, 0, null, 0, 16, { size: 52, w: li === 43 ? 700 : 600, fam: li === 43 ? EN : KR, col: INK, al: 'center', upper: false }));
    if (li === 45) sticker(0, 420, 820, 300, S(45), t, -.03, () => { g.fillStyle = YOUCOL; g.beginPath(); g.roundRect(-410, -150, 820, 90, [44, 44, 0, 0]); g.fill(); txt('질문', 0, -92, { size: 36, w: 700, col: WHITE, al: 'center' }); cap(t, 45, 0, null, 0, 50, { size: 44, w: 600, col: INK, al: 'center' }) });
    if (li === 46) sticker(0, 560, 760, 150, S(46), t, .03, () => cap(t, 46, 0, 6, 0, 16, { size: 56, w: 700, col: INK, al: 'center' }));
    if (li === -1) { txt('MONTAGE', 0, 700, { size: 110, w: 900, fam: EN, col: WHITE, al: 'center', tr: .05 }); cap(t, 46, 6, 10, 0, 560, { size: 90, w: 900, col: YEL, al: 'center' }) }
    if (li === 47) { sticker(0, 380, 700, 170, S(47), t, -.05, () => cap(t, 47, 0, null, 0, 18, { size: 56, w: 700, col: INK, al: 'center' })); txt('THE END', 0, -300, { size: 150 * spr(t, [[0, 0], [cT(47, 5), 1, 2.6, .35]]), w: 900, fam: EN, col: WHITE, al: 'center' }) }
    if (who === 'me') {
      const cur = t < S(49) ? 48 : t < S(50) ? 49 : t < S(51) ? 50 : t < S(52) ? 51 : 52;
      sticker(0, 560, 820, 150, S(cur), t, cur % 2 ? .04 : -.04, () => cap(t, cur, 0, null, 0, 16, { size: cur === 48 || cur === 49 ? 50 : 52, w: 700, fam: cur === 48 || cur === 49 ? EN : KR, col: MECOL, al: 'center', upper: false }));
      if (t > S(49) - .1) { const vs = spr(t, [[0, 0], [S(49), 1, 2.8, .34]]); g.save(); g.translate(-330, 790); g.scale(vs, vs); blob(0, 0, 250, 80, { col: 'rgba(0,0,0,.4)', round: 1 }); pillText(0, 3, '조회 0', { size: 34, w: 700, col: WHITE }); g.restore() }
      if (t > S(51) - .1) { const tp = seg(t, S(51), E(52) - S(51)); g.save(); g.lineCap = 'round'; ring(390, -760, 48, 10, 'rgba(255,255,255,.35)'); g.strokeStyle = MECOL; g.lineWidth = 10; g.beginPath(); g.arc(390, -760, 48, -Math.PI / 2, -Math.PI / 2 + (1 - tp) * 6.28); g.stroke(); g.restore(); txt('24h', 390, -748, { size: 26, w: 700, fam: EN, col: WHITE, al: 'center', upper: false }) }
    }
  }); g.restore();
  if (t < S(48) - .15) bars(9, Math.min(k, 8), p); else bars(1, 0, seg(t, S(48), E(52) - S(48)));
  // the bin the story falls into
  if (t > cT(52, 2)) { const bs = spr(t, [[0, 0], [cT(52, 2), 1, 2.6, .35]]) * (1 - eIn(seg(t, 137.1, .3))); const hit = wob(t - (cT(52, 4) + .75), .35); g.save(); g.translate(CX, 1720); g.scale(bs * 1.3, bs * 1.3 * (1 - hit)); blob(0, 30, 150, 170, { col: WHITE, round: .2 }); rect(-95, -80, 190, 20, WHITE); rect(-30, -104, 60, 20, WHITE); for (const x of [-35, 0, 35]) rect(x - 4, -10, 8, 110, GREY); g.restore() }
  if (t > cT(52, 4)) cap(t, 52, 0, null, CX, 1480, { size: 60, w: 700, col: WHITE, al: 'center' });
}
