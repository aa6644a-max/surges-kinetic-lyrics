/* ORANGE Y2K kit: the zine / phone-UI collage language of the "RUDE!" reference, rebuilt for a volleyball song.
   Paper with halftone dots, giant dotted background type, halftone photos (the painted plates), torn-paper cut-outs,
   boiling hand-drawn lines, stamps, emoji, chat bubbles, flat retro windows, a cursor, comic starbursts.
   Everything is a pure function of t (boil = a hand-drawn line re-drawn 8 times a second from a seed). */

const PAPER = '#F4F1EA', INK = '#1D1D21', ORG = '#FF6A13', SKY = '#74CBF2', LIME = '#8FE35A', YEL = '#FFD83A', RED = '#E8322B', CHAR = '#2A2A2F', MINT = '#CFEBDD';
const UB = '"Unbounded"', RD = '"M PLUS Rounded 1c"', HW = '"Klee One"', PM = '"Permanent Marker"', EMO = '"Noto Color Emoji"';

// ---------------------------------------------------------------- plates (../plates/<id>.webp) and the prop cut-outs
const PL = {}, PLATES = ['gym_lit', 'gym_dark', 'court_top', 'gym_sunset', 'sky_horizon', 'sky_up', 'sky_orange', 'gym_ceiling', 'net_close', 'floor_close', 'stands', 'arena_teal', 'board',
  'bench_orange', 'gym_after', 'locker', 'dawn', 'p_ball', 'p_orange', 'p_shoe', 'p_cloud_a', 'p_cloud_b', 'p_flare', 'p_dust',
  'p_vball', 'sky_clean', 'cl_far', 'cl_mid', 'cl_near', 'cl_puff'];
const loadPlates = () => Promise.all(PLATES.map(id => new Promise(r => { const im = new Image(); im.onload = () => { PL[id] = im; r() }; im.onerror = () => r(); im.src = `../plates/${id}.webp` })));
// cover-draw a plate into the box (x, y, w, h) around focus (fx, fy)
function cover(id, x, y, w, h, o = {}) { const im = typeof id === 'string' ? PL[id] : id; if (!im) return false;
  const s = Math.max(w / im.width, h / im.height) * (o.zoom ?? 1), iw = im.width * s, ih = im.height * s, fx = o.fx ?? .5, fy = o.fy ?? .5;
  const ix = clamp(x + w / 2 - iw * fx, x + w - iw, x) + (o.dx || 0), iy = clamp(y + h / 2 - ih * fy, y + h - ih, y) + (o.dy || 0);
  g.save(); g.globalAlpha = o.alpha ?? 1; if (o.filter) g.filter = o.filter; g.drawImage(im, ix, iy, iw, ih); g.restore(); return true }
function prop(id, x, y, w, rot = 0, o = {}) { const im = PL[id]; if (!im) return false; const h = w * im.height / im.width;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(o.sx ?? 1, o.sy ?? 1); g.globalAlpha = o.alpha ?? 1; if (o.filter) g.filter = o.filter; if (o.add) g.globalCompositeOperation = 'lighter'; g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); return true }

// ---------------------------------------------------------------- halftone: dot patterns and halftone photos (cached)
const PATS = {};
function dots(col, cell = 12, r = 2.6, bg = null) { const k = [col, cell, r, bg].join('|'); if (PATS[k]) return PATS[k];
  const c = document.createElement('canvas'); c.width = c.height = cell * 2; const x = c.getContext('2d'); if (bg) { x.fillStyle = bg; x.fillRect(0, 0, cell * 2, cell * 2) }
  x.fillStyle = col; for (const [px, py] of [[cell / 2, cell / 2], [cell * 1.5, cell * 1.5], [cell * 1.5, cell / 2], [cell / 2, cell * 1.5]]) { x.beginPath(); x.arc(px, py, r, 0, 7); x.fill() }
  return PATS[k] = g.createPattern(c, 'repeat') }
const HT = {};
// halftone(id, { w, cell, ink, bg, gain, color }): a printed-dots version of a plate; color: keep the plate's colours in the dots
function halftone(id, o = {}) { const key = id + JSON.stringify(o); if (HT[key]) return HT[key]; const im = PL[id]; if (!im) return null;
  const w = o.w ?? 1080, h = o.h ?? Math.round(w * im.height / im.width), cell = o.cell ?? 10, cw = Math.ceil(w / cell), ch = Math.ceil(h / cell);
  const src = document.createElement('canvas'); src.width = cw; src.height = ch; const sx = src.getContext('2d'); sx.drawImage(im, 0, 0, cw, ch); const d = sx.getImageData(0, 0, cw, ch).data;
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = o.bg ?? PAPER; x.fillRect(0, 0, w, h);
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) { const k = (j * cw + i) * 4, L = (.3 * d[k] + .59 * d[k + 1] + .11 * d[k + 2]) / 255, r = Math.min(cell * .72, cell * .6 * Math.sqrt(Math.max(0, 1 - L)) * (o.gain ?? 1.25));
    if (r < .35) continue; x.fillStyle = o.color ? `rgb(${d[k]},${d[k + 1]},${d[k + 2]})` : (o.ink ?? INK); x.beginPath(); x.arc(i * cell + cell / 2 + (j % 2 ? cell / 2 : 0), j * cell + cell / 2, r, 0, 7); x.fill() }
  return HT[key] = c }

// ---------------------------------------------------------------- paper backgrounds with giant dotted type
// paper(t, { bg, dot, word, size, speed, rows }): a page; the giant word is filled with the dot pattern and drifts slowly
function paper(t, o = {}) {
  g.fillStyle = o.bg ?? PAPER; g.fillRect(-60, -60, W + 120, H + 120);
  g.save(); g.globalAlpha = o.gridA ?? .35; g.fillStyle = dots(o.gridCol ?? 'rgba(255,106,19,.35)', 14, 1.6); g.fillRect(-60, -60, W + 120, H + 120); g.restore();
  if (o.word === false) return;
  const word = o.word ?? 'ORANGE', size = o.size ?? 760, rows = o.rows ?? [word.slice(0, 2), word.slice(2, 4), word.slice(4)], step = size * .92, drift = (t * (o.speed ?? 26)) % (step * rows.length);
  g.save(); g.fillStyle = dots(o.dot ?? 'rgba(255,106,19,.55)', 11, 3.3); font(900, size, UB); setTrack(-size * .04); g.textAlign = 'center'; g.textBaseline = 'alphabetic';
  for (let k = -1; k <= rows.length + 1; k++) { const r = rows[((k % rows.length) + rows.length) % rows.length]; g.fillText(r, CX + (o.dx ?? 0), k * step + size * .82 - drift) }
  g.restore(); setTrack(0);
}

// ---------------------------------------------------------------- torn paper, polygons
function poly(P) { g.beginPath(); P.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath() }
function tornPoly(w, h, seed, amp = 12, step = 18) { const P = [];
  const edge = (x0, y0, x1, y1, s) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(L / step)), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
    for (let k = 0; k < n; k++) { const u = k / n, a = (R(k, s) - .5) * amp + (R(k * 7, s + 3) - .5) * amp * .5; P.push([lerp(x0, x1, u) + nx * a, lerp(y0, y1, u) + ny * a]) } };
  edge(-w / 2, -h / 2, w / 2, -h / 2, seed); edge(w / 2, -h / 2, w / 2, h / 2, seed + 1); edge(w / 2, h / 2, -w / 2, h / 2, seed + 2); edge(-w / 2, h / 2, -w / 2, -h / 2, seed + 3); return P }
// torn(x, y, w, h, rot, draw, { s, seed, paper, shadow }): a torn-paper cut-out; draw() paints the content centred on (0, 0)
function torn(x, y, w, h, rot, draw, o = {}) { const s = o.s ?? 1; if (s <= .001) return;
  const seed = o.seed ?? 1, outer = tornPoly(w + 44, h + 44, seed + 10, 26, 15), inner = tornPoly(w, h, seed, 12, 22);
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  if (o.shadow !== false) { g.save(); g.translate(12, 16); g.fillStyle = 'rgba(20,20,25,.22)'; poly(outer); g.fill(); g.restore() }
  g.fillStyle = o.paper ?? '#FFFFFF'; poly(outer); g.fill(); g.save(); poly(inner); g.clip(); draw(w, h); g.restore(); g.restore() }
// a strip of translucent tape
function tape(x, y, w, rot, col = 'rgba(255,236,170,.75)') { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; const h = 56; g.beginPath(); for (let k = 0; k <= 8; k++) g.lineTo(-w / 2 + (k % 2) * 6, -h / 2 + k * h / 8); for (let k = 8; k >= 0; k--) g.lineTo(w / 2 - (k % 2) * 6, -h / 2 + k * h / 8); g.closePath(); g.fill(); g.restore() }

// ---------------------------------------------------------------- boiling hand-drawn lines
const boil = (t, fps = 8) => Math.floor(t * fps + 1e-6);
// sketch(points, t, { col, lw, jit, passes, closed, p (0..1 drawn), fps })
function sketch(P, t, o = {}) { if (!P.length) return; const b = boil(t, o.fps ?? 8), j = o.jit ?? 3.2, p = o.p ?? 1;
  let pts = P; if (p < 1) { const L = [0]; for (let k = 1; k < P.length; k++) L.push(L[k - 1] + Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1])); const tot = L[L.length - 1] * clamp(p);
    pts = []; for (let k = 0; k < P.length; k++) { if (L[k] <= tot) pts.push(P[k]); else { const u = (tot - L[k - 1]) / (L[k] - L[k - 1]); pts.push([lerp(P[k - 1][0], P[k][0], u), lerp(P[k - 1][1], P[k][1], u)]); break } } }
  g.save(); g.strokeStyle = o.col ?? INK; g.lineWidth = o.lw ?? 6; g.lineCap = 'round'; g.lineJoin = 'round'; g.globalAlpha = o.alpha ?? 1;
  for (let pass = 0; pass < (o.passes ?? 2); pass++) { g.beginPath(); pts.forEach(([x, y], k) => { const dx = (R(k * 3 + pass * 101, b) - .5) * 2 * j, dy = (R(k * 3 + 1 + pass * 101, b) - .5) * 2 * j; k ? g.lineTo(x + dx, y + dy) : g.moveTo(x + dx, y + dy) });
    if (o.closed && p >= 1) g.closePath(); g.stroke() }
  g.restore() }
const rectPts = (x, y, w, h, n = 5) => { const P = []; for (const [a, b, c, d] of [[x, y, x + w, y], [x + w, y, x + w, y + h], [x + w, y + h, x, y + h], [x, y + h, x, y]]) for (let k = 0; k < n; k++) P.push([lerp(a, c, k / n), lerp(b, d, k / n)]); P.push([x, y]); return P };
const ellPts = (cx, cy, rx, ry, turns = 1.08, a0 = -2.4, n = 48) => Array.from({ length: n + 1 }, (_, k) => { const a = a0 + k / n * Math.PI * 2 * turns, rr = 1 + .05 * Math.sin(k * .9); return [cx + Math.cos(a) * rx * rr, cy + Math.sin(a) * ry * rr] });
const starPts = (cx, cy, r1, r2, n = 5, rot = -Math.PI / 2) => Array.from({ length: n * 2 + 1 }, (_, k) => { const a = rot + k * Math.PI / n, r = k % 2 ? r2 : r1; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] });
// a hand-drawn arrow from a to b with a head
function arrow(t, a, b, o = {}) { const P = []; for (let k = 0; k <= 12; k++) { const u = k / 12; P.push([lerp(a[0], b[0], u) + Math.sin(u * Math.PI) * (o.bend ?? 30), lerp(a[1], b[1], u)]) } sketch(P, t, o);
  if ((o.p ?? 1) >= 1) { const ang = Math.atan2(b[1] - P[11][1], b[0] - P[11][0]), L = o.head ?? 34; sketch([[b[0] - Math.cos(ang - .5) * L, b[1] - Math.sin(ang - .5) * L], b, [b[0] - Math.cos(ang + .5) * L, b[1] - Math.sin(ang + .5) * L]], t, o) } }
// a filled hand-cut star sticker that pops on t0
function starSticker(t, t0, x, y, r, col, rot = 0) { const s = MO.springStep(t - t0, { damping: 8, stiffness: 320 }); if (s <= .01) return;
  g.save(); g.translate(x, y); g.rotate(rot + (t - t0) * .4); g.scale(s, s); g.fillStyle = col; poly(starPts(0, 0, r, r * .45)); g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); g.restore() }

// ---------------------------------------------------------------- type helpers
// a sticker word: heavy text with a thick white outline and a hard offset shadow (neo-brutal)
function sticker(s, x, y, size, o = {}) { const fam = o.fam ?? JP, w = o.w ?? 400; font(w, size, fam); setTrack((o.tr ?? 0) * size); g.textAlign = o.al ?? 'center'; g.textBaseline = o.base ?? 'middle'; g.lineJoin = 'round';
  g.save(); g.globalAlpha = o.alpha ?? 1;
  if (o.shadow !== false) { g.fillStyle = o.shadowCol ?? INK; g.fillText(s, x + size * .06, y + size * .07) }
  if (o.outline !== false) { g.strokeStyle = o.line ?? '#FFFFFF'; g.lineWidth = size * (o.lwk ?? .16); g.strokeText(s, x, y) }
  g.fillStyle = o.col ?? INK; g.fillText(s, x, y); g.restore(); setTrack(0) }
// stamp(t, t0, draw): slam in on t0 (big -> 1 with a wobble); draw() paints at (0,0)
function stampIn(t, t0, x, y, rot, draw, o = {}) { const d = t - t0; if (d < -.02) return; const k = Math.max(0, d), dur = o.dur ?? .12;
  const sc = lerp(o.from ?? 2.3, 1, eOut(clamp(k / dur))) * (1 + (k > dur ? .07 * Math.exp(-(k - dur) * 12) * Math.sin((k - dur) * 42) : 0));
  g.save(); g.translate(x, y); g.rotate(rot + (1 - clamp(k / dur)) * (o.spin ?? .3)); g.scale(sc, sc); g.globalAlpha = clamp(k / .04 + .2) * (o.alpha ?? 1); draw(); g.restore() }
// lyric chars stamped one by one on their sung times along a list of positions
function stampChars(t, i, a, b, pos, size, o = {}) { const C = chars(i); for (let k = a; k < b; k++) { const G = C[k], [x, y, rot] = pos(k - a); if (o.hide != null && t > o.hide) continue;
  stampIn(t, G.t - .03, x, y, rot ?? 0, () => sticker(G.c, 0, 0, size, o), o) } }
// a line of lyric chars typed into place (no animation but appearance) — returns the drawn width
function typed(t, i, a, b, x, y, size, o = {}) { const C = chars(i); let s = ''; for (let k = a; k < b; k++) { if (t < C[k].t - .02) break; if (k > a && C[k].sp) s += ' '; s += C[k].c }
  font(o.w ?? 800, size, o.fam ?? RD); setTrack(0); const w = g.measureText(s).width; txt(s, x, y, { size, w: o.w ?? 800, fam: o.fam ?? RD, col: o.col ?? INK, al: o.al ?? 'left', upper: false, alpha: o.alpha }); return { s, w } }

// ---------------------------------------------------------------- emoji
function emo(ch, x, y, size, rot = 0, o = {}) { if (size <= 1) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(o.sx ?? 1, o.sy ?? 1); g.globalAlpha = o.alpha ?? 1; g.letterSpacing = '0px';
  g.font = `${Math.round(size)}px ${EMO}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#000'; g.fillText(ch, 0, 0); g.restore() }
function emoPop(t, t0, ch, x, y, size, rot = 0, o = {}) { const s = MO.springStep(t - t0, { damping: o.damping ?? 8, stiffness: o.stiffness ?? 300 }); if (s <= .01) return; emo(ch, x, y + (1 - Math.min(1, s)) * 60, size * s, rot + (o.wig ? Math.sin((t - t0) * 9) * .12 : 0), o) }

// ---------------------------------------------------------------- UI: rounded boxes, bubbles, windows, cursor, progress
function rr(x, y, w, h, r, fill, o = {}) { g.save(); g.globalAlpha = o.alpha ?? 1; g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = fill; g.fill() } if (o.line) { g.lineWidth = o.lw ?? 4; g.strokeStyle = o.line; g.stroke() } g.restore() }
// neo-brutal card: solid offset shadow + outline
function card(x, y, w, h, r, fill, o = {}) { rr(x + (o.sh ?? 12), y + (o.sh ?? 12) + 2, w, h, r, o.shCol ?? INK, { alpha: o.alpha }); rr(x, y, w, h, r, fill, { line: o.line ?? INK, lw: o.lw ?? 5, alpha: o.alpha }) }
// chat bubble: me (right, lime) / them (left, white); returns its height. text may contain emoji
function bubble(x, y, text, o = {}) { const size = o.size ?? 46, me = !!o.me, fam = o.fam ?? RD; font(800, size, fam); setTrack(0);
  const tw = g.measureText(text).width, pw = o.w ?? tw + size * 1.2, ph = o.h ?? size * 1.9, bx = me ? x - pw : x;
  g.save(); g.globalAlpha = o.alpha ?? 1; g.fillStyle = o.col ?? (me ? LIME : '#FFFFFF'); g.beginPath(); g.roundRect(bx, y, pw, ph, ph / 2); g.fill();
  g.beginPath(); if (me) { g.moveTo(bx + pw - 26, y + ph - 16); g.lineTo(bx + pw + 14, y + ph + 6); g.lineTo(bx + pw - 46, y + ph - 4) } else { g.moveTo(bx + 26, y + ph - 16); g.lineTo(bx - 14, y + ph + 6); g.lineTo(bx + 46, y + ph - 4) } g.fill();
  if (o.line !== false) { g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,.12)'; g.beginPath(); g.roundRect(bx, y, pw, ph, ph / 2); g.stroke() }
  g.restore(); if (text) { g.save(); g.globalAlpha = o.alpha ?? 1; g.font = `800 ${size}px ${fam}, ${EMO}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = o.ink ?? INK; g.fillText(text, bx + pw / 2, y + ph / 2 + size * .04); g.restore() }
  return ph }
function typingDots(t, x, y, o = {}) { rr(x, y, 150, 84, 42, o.col ?? '#FFFFFF'); for (let k = 0; k < 3; k++) disc(x + 42 + k * 33, y + 42 - 10 * Math.max(0, Math.sin(t * 9 - k * .8)), 10, GREY) }
// a flat retro window; draw(w, h) paints the content (origin at the content's top-left)
function win(x, y, w, h, title, o = {}) { const s = o.s ?? 1; if (s <= .001) return; g.save(); g.translate(x, y); g.rotate(o.rot ?? 0); g.scale(s, s); g.globalAlpha = o.alpha ?? 1;
  const L = -w / 2, T = -h / 2; rr(L + 14, T + 16, w, h, 22, INK); rr(L, T, w, h, 22, o.bg ?? '#FFFFFF', { line: INK, lw: 5 });
  g.save(); g.beginPath(); g.roundRect(L, T, w, 70, [22, 22, 0, 0]); g.fillStyle = o.bar ?? SKY; g.fill(); g.restore(); line(L, T + 70, L + w, T + 70, 5, INK);
  [RED, YEL, LIME].forEach((c, k) => { disc(L + 40 + k * 38, T + 35, 12, c); ring(L + 40 + k * 38, T + 35, 12, 3, INK) });
  txt(title, 0, T + 47, { size: 30, w: 800, fam: RD, col: INK, al: 'center', upper: false });
  if (o.draw) { g.save(); g.beginPath(); g.rect(L + 3, T + 73, w - 6, h - 76); g.clip(); g.translate(L, T + 70); o.draw(w, h - 70); g.restore() }
  g.restore() }
// the mouse cursor; click (t0) gives a press squash and a ring
function cursor(t, x, y, o = {}) { g.save(); g.translate(x, y); const press = o.click != null && t >= o.click && t < o.click + .15 ? .82 : 1; g.scale((o.s ?? 1.6) * press, (o.s ?? 1.6) * press);
  g.fillStyle = '#FFFFFF'; g.strokeStyle = INK; g.lineWidth = 3; g.lineJoin = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 44); g.lineTo(11, 33); g.lineTo(20, 52); g.lineTo(28, 48); g.lineTo(19, 30); g.lineTo(33, 30); g.closePath(); g.fill(); g.stroke(); g.restore();
  if (o.click != null && t >= o.click && t < o.click + .45) { const d = (t - o.click) / .45; ring(x, y, 20 + d * 70, 6 * (1 - d), INK, 1 - d) } }
function progress(x, y, w, h, p, o = {}) { rr(x, y, w, h, h / 2, '#FFFFFF', { line: INK, lw: 4 }); if (p > 0) { g.save(); g.beginPath(); g.roundRect(x + 6, y + 6, (w - 12) * clamp(p), h - 12, (h - 12) / 2); g.clip(); rect(x, y, w, h, o.col ?? ORG);
  g.fillStyle = 'rgba(255,255,255,.35)'; for (let k = -2; k < w / 30 + 2; k++) { const sx = x + k * 30 + ((o.t ?? 0) * 60 % 30); g.beginPath(); g.moveTo(sx, y + h); g.lineTo(sx + 14, y + h); g.lineTo(sx + 14 + h, y); g.lineTo(sx + h, y); g.fill() } g.restore() } }

// ---------------------------------------------------------------- comic starburst and speed lines
function burst(t, cx, cy, r, col, o = {}) { const n = o.n ?? 18, b = boil(t, o.fps ?? 6), P = [];
  for (let k = 0; k < n * 2; k++) { const a = (o.rot ?? 0) + k * Math.PI / n, rr2 = k % 2 ? r * (o.inner ?? .62) * (.9 + .2 * R(k, b)) : r * (.9 + .25 * R(k + 50, b)); P.push([cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2]) }
  g.save(); g.fillStyle = col; poly(P); g.fill(); if (o.line) { g.lineWidth = o.lw ?? 6; g.strokeStyle = o.line; g.stroke() } g.restore() }
function rays(t, cx, cy, o = {}) { const n = o.n ?? 26; g.save(); g.translate(cx, cy); g.rotate((o.spin ?? .05) * t); g.fillStyle = o.col ?? '#FFFFFF'; g.globalAlpha = o.alpha ?? 1;
  for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2, w = (o.w ?? .07) * (.6 + R(k, 2)); g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a - w) * 2600, Math.sin(a - w) * 2600); g.lineTo(Math.cos(a + w) * 2600, Math.sin(a + w) * 2600); g.fill() } g.restore() }

// ---------------------------------------------------------------- hanko (a red round seal) and shake
function hanko(t, t0, x, y, r, s, o = {}) { stampIn(t, t0, x, y, o.rot ?? -.15, () => { g.save(); g.globalAlpha *= .9; ring(0, 0, r, r * .12, RED); ring(0, 0, r * .8, r * .04, RED);
  txt(s, 0, r * .36, { size: r * 1.05, fam: o.fam ?? JP, col: RED, al: 'center', upper: false }); g.restore() }, { from: 1.6, dur: .09, spin: .2 }) }
const HITS = [];
function shakeAt(t) { let x = 0, y = 0, r = 0; for (const [t0, a] of HITS) { const d = t - t0; if (d < 0 || d > .6) continue; const k = a * Math.exp(-d * 9), s = MO.shake(t, 1, 30, t0 * 13); x += s.x * k; y += s.y * k; r += s.rot * k * .5 } return { x, y, r } }
function flash(t, t0, col = '#FFFFFF', d = .16, a = .95) { if (t < t0) return; const k = 1 - seg(t, t0, d); if (k > 0) rect(-60, -60, W + 120, H + 120, col, a * k) }
// slow push-in for a scene (keeps every held frame alive)
function push(t, t0, t1, amt = .06, cx = CX, cy = CY) { const s = 1 + amt * seg(t, t0, t1 - t0); g.translate(cx, cy); g.scale(s, s); g.translate(-cx, -cy) }

// ---------------------------------------------------------------- Korean subtitle (bottom pill)
function subtitle(t) {
  let li = -1; for (let i = 0; i < Ln.length; i++) if (t >= S(i) - .12) li = i; if (li < 0) return;
  const nxt = li + 1 < Ln.length ? S(li + 1) - .15 : 1e9, end = Math.min(nxt, E(li) + 1.4); if (t > end) return;
  const a = seg(t, S(li) - .12, .15) * (1 - seg(t, end - .15, .15)); if (a <= 0) return;
  const s = Ln[li].ko; font(700, 40, KR); setTrack(0); const w = g.measureText(s).width;
  rr(CX - w / 2 - 30, 1762, w + 60, 72, 36, INK, { alpha: .82 * a });
  txt(s, CX, 1811, { size: 40, w: 700, col: '#FFFFFF', al: 'center', alpha: a });
}

// ---------------------------------------------------------------- the ball (the yellow-and-blue match ball) and clouds you fly through
// vball(x, y, d, rot): a ball of diameter d (the cut-out has a margin, hence the 1.3); falls back to the older ball, then the emoji
function vball(x, y, d, rot = 0, o = {}) { if (prop('p_vball', x, y, d * 1.2, rot, o)) return; if (prop('p_ball', x, y, d * 1.3, rot, o)) return; emo('🏐', x, y, d, rot, o) }
function vballPop(t, t0, x, y, d, rot = 0) { const s = MO.springStep(t - t0, { damping: 8, stiffness: 300 }); if (s <= .01) return; vball(x, y + (1 - Math.min(1, s)) * 60, d * s, rot + (t - t0) * 2) }
// cloudField: translucent cloud sprites (black-keyed plates) travel from far (small, faint) to near (huge) and fade as they pass us.
// They are drawn in 'screen' mode: the dark parts let the sky through and only the lit parts glow, so a cloud reads as mist,
// never as a dark-edged sticker. Near ones are softened; the closest ones also leave a light haze over the whole frame.
const CLOUDS = ['cl_far', 'cl_mid', 'cl_puff', 'cl_near'];
function cloudField(t, o = {}) {
  const ids = o.ids ?? CLOUDS, n = o.n ?? 9, sp = o.speed ?? .12, L = []; let haze = 0;
  for (let k = 0; k < n; k++) L.push([(((t * sp + k / n + (o.phase ?? 0)) % 1) + 1) % 1, k]);
  L.sort((a, b) => a[0] - b[0]);
  for (const [ph, k] of L) { const im = PL[ids[k % ids.length]]; if (!im) continue;
    const z = lerp(o.zFar ?? 6, o.zNear ?? .45, ph), s = 1 / z, w = (o.w ?? 1800) * s, h = w * im.height / im.width;
    const x = (o.cx ?? CX) + (R(k, 1) - .5) * (o.spread ?? 1900) * s, y = (o.cy ?? CY) + (R(k, 2) - .5) * (o.spreadY ?? 1400) * s;
    const a = (o.alpha ?? .9) * clamp(ph / .22) * (1 - clamp((ph - .68) / .32));
    if (a <= .005) continue; haze = Math.max(haze, a * clamp((ph - .55) / .3));
    g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha *= a; if (ph > .5 && o.soft !== false) g.filter = `blur(${Math.round((ph - .5) * 16)}px)`;
    g.translate(x, y); if (R(k, 3) > .5) g.scale(-1, 1); g.drawImage(im, -w / 2, -h / 2, w, h); g.restore() }
  if (o.haze !== false && haze > 0) { const gr = g.createRadialGradient(CX, CY, 200, CX, CY, 1300); gr.addColorStop(0, `rgba(255,244,230,${.32 * haze})`); gr.addColorStop(1, `rgba(255,236,220,${.12 * haze})`); g.save(); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore() } }
// cloudBand: one cloud plate repeated in a sideways drifting band (a parallax layer)
function cloudBand(t, id, y, w, speed, o = {}) { const im = PL[id]; if (!im) return; const h = w * im.height / im.width, x0 = (((-t * speed) % w) + w) % w - w;
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = o.alpha ?? 1; if (o.blur) g.filter = `blur(${o.blur}px)`; for (let x = x0; x < W + w; x += w) g.drawImage(im, x, y - h / 2, w, h); g.restore() }
