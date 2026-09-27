/* Sub character v4 prototype: light and lyrics.
   Lyrics are world objects too: they sit on the cast board, the floor, the braces, the beam, the seats and the booth
   glass, and they stay where they were written (dimmed) after the line ends. Each character appears on its sung time. */
let Ln = [];
const LC = {};
function lineChars(i) {                                  // [{c, t, sp}] per visible character; sp = a space precedes it
  if (LC[i]) return LC[i]; const out = [];
  for (const u of Ln[i].u) { let q = 0; [...u[0]].forEach((c, k) => { if (c === ' ') return; out.push({ c, t: u[1] + q * .035, sp: (k === 0 && !!u[4]) || u[0][k - 1] === ' ' }); q++ }) }
  return LC[i] = out;
}
const chT = (i, k) => lineChars(i)[k].t;
const fsize = font => +font.match(/(\d+(?:\.\d+)?)px/)[1];

// runs(t, i, segs, x, y, o): characters a..b of line i in several fonts, laid out as one line and revealed per character
function runs(t, i, segs, x, y, o = {}) {
  const C = lineChars(i), items = []; let w = 0;
  for (const s of segs) {
    g.font = s.font;
    for (let k = s.a; k < s.b; k++) { if (k > segs[0].a && C[k].sp) w += fsize(s.font) * .32; const cw = g.measureText(C[k].c).width; items.push({ ch: C[k], x: w, s }); w += cw + (s.track || 0) }
  }
  const x0 = o.al === 'left' ? x : o.al === 'right' ? x - w : x - w / 2, E = Ln[i].e, keep = o.keep ?? .45;
  const fade = 1 - (1 - keep) * clamp((t - E - 1.4) / 1.2);
  g.textAlign = 'left'; g.textBaseline = o.base || 'alphabetic';
  for (const it of items) {
    const a = clamp((t - it.ch.t + .06) / .22); if (a <= 0) continue;
    g.font = it.s.font; g.globalAlpha = a * fade * (o.alpha ?? 1) * (it.s.alpha ?? 1);
    g.fillStyle = it.s.col; g.fillText(it.ch.c, x0 + it.x, y + (it.s.dy || 0) + (1 - eOut(a)) * fsize(it.s.font) * (o.rise ?? .25));
  }
  g.globalAlpha = 1; return w;
}
const all = i => lineChars(i).length;
function lyric(layer, x, y, i, draw, o = {}) { obj(layer, x, y, t => { if (Ln[i] && t > Ln[i].s - .3) draw(t) }, { rad: o.rad ?? 1200, name: `L${i}` }) }

// ================= light: the follow spot is the bridge between YOU and ME =================
function poolPath(cx, cy, rx) { g.beginPath(); g.ellipse(cx, cy, rx, rx * circleAspect(), 0, 0, 7) }
obj('SUBJECT', LAMP.x, LAMP.y, t => {
  const on = spotOn(t); if (on <= 0) return;
  const off = offYou(t), ex = spotX(t) - LAMP.x, ey = lerp(5520, CIRCLE.y, off) - LAMP.y, hw = lerp(300, 400, off);
  const L = Math.hypot(ex, ey), nx = -ey / L, ny = ex / L;
  g.globalCompositeOperation = 'lighter';
  const gr = g.createLinearGradient(0, 0, ex, ey); gr.addColorStop(0, rgba(PAL.spot, .34 * on)); gr.addColorStop(1, rgba(PAL.spot, .13 * on));
  g.fillStyle = gr; g.beginPath(); g.moveTo(nx * 34, ny * 34); g.lineTo(ex + nx * hw, ey + ny * hw); g.lineTo(ex - nx * hw, ey - ny * hw); g.lineTo(-nx * 34, -ny * 34); g.fill();
  const px = spotX(t) - LAMP.x, py = CIRCLE.y - LAMP.y, rx = 400;
  g.save(); g.translate(px, py); g.scale(1, circleAspect()); const pg = g.createRadialGradient(0, 0, 10, 0, 0, rx);
  pg.addColorStop(0, rgba(PAL.spot, .5 * on)); pg.addColorStop(.85, rgba(PAL.spot, .34 * on)); pg.addColorStop(1, rgba(PAL.spot, 0)); g.fillStyle = pg; g.beginPath(); g.arc(0, 0, rx, 0, 7); g.fill(); g.restore();
  g.globalCompositeOperation = 'source-over';
  g.strokeStyle = rgba(PAL.spot, .55 * on); g.lineWidth = 4; poolPath(px, py, rx - 6); g.stroke();   // the hard edge of a follow spot
  const lg = g.createRadialGradient(0, 0, 0, 0, 0, 90); lg.addColorStop(0, `rgba(255,250,235,${.9 * on})`); lg.addColorStop(1, 'rgba(255,240,200,0)');
  g.globalCompositeOperation = 'lighter'; g.fillStyle = lg; g.fillRect(-90, -90, 180, 180); g.globalCompositeOperation = 'source-over';
}, { rad: 2800, name: 'follow spot' });

// inside the circle on the empty floor, the next world is already flickering: film frames of old memories
const MEM = ['mem_entrance', 'mem_class', 'mem_race', 'mem_festival', 'mem_rain', 'mem_library', 'mem_lunch', 'mem_sunset', 'mem_rooftop', 'mem_photo', 'mem_award'];
obj('SUBJECT', CIRCLE.x, CIRCLE.y, t => {
  const a = clamp((t - 66.4) / .6) * (.07 + .5 * eIn(clamp((t - 67.6) / 2.5))); if (a <= 0) return;
  const rx = 392, ry = rx * circleAspect(), dx = spotX(t) - CIRCLE.x;
  g.save(); g.beginPath(); g.ellipse(dx, 0, rx, ry, 0, 0, 7); g.clip();
  const im = IMG[MEM[Math.floor((t - B0) / (BEAT * 2)) % MEM.length]];
  if (im) { const s = Math.max(2 * rx / im.width, 2 * ry / (im.height * .8)); g.globalAlpha = a; g.drawImage(im, dx - im.width * s / 2, -im.height * s / 2, im.width * s, im.height * s) }
  g.globalAlpha = a * 1.2; g.fillStyle = '#0B0810'; const fh = ry * .16;                       // film edges with sprocket holes
  g.fillRect(dx - rx, -ry, 2 * rx, fh); g.fillRect(dx - rx, ry - fh, 2 * rx, fh);
  g.fillStyle = rgba(PAL.spot, .6 * a); const hw = rx / 9, off = ((t * 300) % (hw * 2));
  for (let x = -rx - hw * 2 + off; x < rx; x += hw * 2) { g.fillRect(dx + x, -ry + fh * .3, hw * .9, fh * .4); g.fillRect(dx + x, ry - fh * .7, hw * .9, fh * .4) }
  g.restore();
}, { rad: 900, name: 'circle / film' });

// ================= lyrics =================
// L14 a pencil note in the margin of the cast board, next to 행인 7
lyric('SUBJECT', 6500, 5450, 14, t => { g.rotate(-.035); runs(t, 14, [{ a: 0, b: all(14), font: `italic 300 30px "Noto Sans KR"`, col: '#4A4860' }], -300, 585, { al: 'left', keep: .9 }) });
// L15 written on the floor inside the light that leaks from the gap
lyric('SUBJECT', 6900, 6205, 15, t => { g.scale(1, .45); runs(t, 15, [{ a: 0, b: all(15), font: MK(74, 500), col: PAL.spot }], 0, 0, { keep: .55 }) });
// L16 "애써 [버티고] 있어": 버티고 are the braces (MID_FG); the small words sit at their feet
lyric('SUBJECT', 6800, 6090, 16, t => { runs(t, 16, [{ a: 0, b: 2, font: CK(40, 400), col: PAL.credit }], 0, 0, { al: 'right', keep: .7 }) });
lyric('SUBJECT', 7120, 6090, 16, t => { runs(t, 16, [{ a: 5, b: 7, font: CK(40, 400), col: PAL.credit }], 0, 0, { al: 'left', keep: .7 }) });
// L17 the credit line, tiny, printed on the apron edge of a huge stage
lyric('SUBJECT', 7430, 6262, 17, t => { runs(t, 17, [{ a: 0, b: all(17), font: CE(58, 400), col: PAL.credit }], 0, 0, { al: 'left', keep: .8, rise: .1 }) });
// L18 우린 in the light, 안 비슷해 in the dark beyond the pool
lyric('SUBJECT', 7960, 6020, 18, t => { runs(t, 18, [{ a: 0, b: 2, font: TK(170), col: PAL.title }], 0, 0, { keep: .5 }) });
lyric('SUBJECT', 8800, 6085, 18, t => { runs(t, 18, [{ a: 2, b: all(18), font: CK(50, 400), col: PAL.credit }], 0, 0, { al: 'left', keep: .6 }) });
// L19 the words ride the beam from YOU up toward its source: the camera follows them to the booth
lyric('SUBJECT', YOU.x, 5520, 19, t => {
  const ang = Math.atan2(LAMP.y - 5520, LAMP.x - YOU.x); g.rotate(ang); g.translate(420, -80);
  runs(t, 19, [{ a: 0, b: 3, font: MK(92, 800), col: PAL.title }, { a: 3, b: 4, font: TK(150), col: PAL.title }, { a: 4, b: 8, font: MK(92, 800), col: PAL.title }, { a: 8, b: 12, font: TK(170), col: '#FFE45C' }], 0, 0, { al: 'left', keep: .5 });
}, { rad: 2200 });
// L20 over the seats: 널 is title-sized, the room is made of 좋아해
lyric('SUBJECT', 9980, 5760, 20, t => { runs(t, 20, [{ a: 0, b: 2, font: MK(96, 800), col: PAL.title }, { a: 2, b: 3, font: TK(250), col: PAL.title }, { a: 3, b: 6, font: MK(96, 800), col: PAL.title }], 0, 0, { keep: .45 }) });
// L21 the rows stand up (in the seats object); the words float above them
lyric('SUBJECT', 10430, 5330, 21, t => { runs(t, 21, [{ a: 0, b: all(21), font: MK(84, 800), col: PAL.title }], 0, 0, { keep: .45 }) });
// booth glass: L22 the reflection of the stage, then ME's own lines (credit type, growing a little)
lyric('SUBJECT', 10760, 4290, 22, t => { runs(t, 22, [{ a: 0, b: all(22), font: CK(56, 500), col: '#FFE9C8' }], -380, -240, { al: 'left', keep: .35 }) });
lyric('SUBJECT', 10760, 4290, 23, t => { runs(t, 23, [{ a: 0, b: all(23), font: CE(30 * meGrow(t), 500), col: PAL.me }], -380, 318, { al: 'left', keep: .8, rise: .1 }) });
lyric('SUBJECT', 10760, 4290, 24, t => {
  txt('LIGHT OP.  ·········', 170, -250, CE(24 * meGrow(t), 400), 'rgba(142,138,166,.8)', 'left');
  runs(t, 24, [{ a: 0, b: all(24), font: CE(26 * meGrow(t), 500), col: PAL.me }], 170, -210, { al: 'left', keep: .8, rise: .1 });
});
lyric('SUBJECT', 10760, 4290, 25, t => {                              // the glass fills up with the line
  g.save(); g.beginPath(); g.rect(-400, -330, 800, 580); g.clip();
  const s = Ln[25].s, d = Ln[25].e - s + .4, f = CK(42 * meGrow(t), 400);
  for (let r = 1; r < 11; r++) { const a = clamp((t - s - (r / 11) * d) / .3); if (a <= 0) continue; g.globalAlpha = .2 * a; txt('열등감으로 찬   열등감으로 찬   열등감으로 찬', -390 + (r % 2) * 60, -300 + r * 50, f, PAL.me, 'left') }
  g.globalAlpha = 1; runs(t, 25, [{ a: 0, b: all(25), font: CK(46 * meGrow(t), 500), col: PAL.me }], -380, -300, { al: 'left', keep: .6 }); g.restore();
});
// L26 "Tell me" on the glass, then 내가 나쁜 맘일까 written on the floor and read only where the moving spot lights it
lyric('SUBJECT', 10760, 4290, 26, t => { runs(t, 26, [{ a: 0, b: 6, font: CE(62 * meGrow(t), 500), col: PAL.me }], -380, 225, { al: 'left', keep: .6 }) });
function floorText(t, i, segs, x, o = {}) {
  const px = spotX(t) - x, asp = circleAspect(); g.save(); g.beginPath(); g.ellipse(px, 0, 396, 396 * asp, 0, 0, 7); g.clip();
  g.scale(1, Math.min(1, asp * 1.5)); runs(t, i, segs, 0, o.dy || 0, { keep: .9, rise: 0, al: o.al }); g.restore();
}
lyric('SUBJECT', CIRCLE.x, CIRCLE.y, 26, t => floorText(t, 26, [{ a: 6, b: all(26), font: MK(92, 800), col: '#2A1C22' }], CIRCLE.x, { dy: 118 }), { rad: 1400 });
// L27 "I wanna be" inside the circle (credit type, ME's colour), "you" left outside in the dark, title-sized, next to YOU
lyric('SUBJECT', CIRCLE.x, CIRCLE.y, 27, t => floorText(t, 27, [{ a: 0, b: 8, font: CE(84, 500), col: '#1E3A52' }], CIRCLE.x, { dy: -70 }), { rad: 1400 });
lyric('SUBJECT', YOU.x - 40, 4960, 27, t => { runs(t, 27, [{ a: 8, b: all(27), font: TE(170), col: PAL.title }], 0, 0, { alpha: .75 }) });
