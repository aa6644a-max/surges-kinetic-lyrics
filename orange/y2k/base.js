/* ORANGE Y2K base (from subchar/puretype/engine.js): canvas helpers, lyric timing and reveal for SPYAIR "Orange".
   Canvas 2D, 1080x1920. Every frame is a pure function of t (no state carried between frames), so
   renderAt(t) reproduces any frame exactly. Materials: type, simple geometry, line, solid colour. */
const W = 1080, H = 1920, CX = 540, CY = 960;
let g = null, Ln = [];

// ---------- palette: five colours, fixed for the whole piece ----------
const OR = '#FF6A13', OR2 = '#FF8A3D', BK = '#0E0F14', WH = '#FFF6EC', AMB = '#E3923A', AMB2 = '#C4742A', TEAL = '#16B3A6', NAVY = '#101B2D',
  PEACH = '#FFB38A', PINK = '#F58FB0', LILAC = '#B9A3F0', GREY = '#8C8A93';

// ---------- type: two families. Hierarchy = weight, size, tracking ----------
const KR = '"Pretendard Variable"', JP = '"Dela Gothic One"', EN = '"Anton"', MK = '"Yusei Magic"';
// ---------- math ----------
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lerp = (a, b, x) => a + (b - a) * x;
const seg = (t, a, d) => clamp((t - a) / d);
const eOut = x => 1 - (1 - x) ** 3, eIn = x => x * x * x, eIO = x => x < .5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2;
const eSm = x => x * x * (3 - 2 * x), eOutQ = x => 1 - (1 - x) ** 5, eExp = x => x >= 1 ? 1 : 1 - 2 ** (-10 * x);
const eBk = (x, c = 1.4) => { x = clamp(x) - 1; return 1 + (c + 1) * x * x * x + c * x * x };
const R = (i, s = 0) => { const x = Math.sin(i * 127.1 + s * 311.7 + .5) * 43758.5453; return x - Math.floor(x) };
const BEAT = .60386, B0 = 13.777, BAR = BEAT * 4, PULSE = BEAT / 2;   // felt 99.4 BPM; the band comes in on the downbeat at 13.777
const beatN = t => (t - B0) / BEAT, onBeat = n => B0 + n * BEAT;
const pulse = (t, k = 7) => { const b = beatN(t); return b < 0 ? 0 : Math.exp(-(b - Math.floor(b)) * BEAT * k) };

// ---------- lyric timing ----------
const LC = {};
function chars(i) {                                    // visible characters of line i: [{c, t, sp}]
  if (LC[i]) return LC[i]; const out = [];
  for (const u of Ln[i].u) { let q = 0; [...u[0]].forEach((c, k) => { if (c === ' ') return; out.push({ c, t: u[1] + q * .035, sp: (k === 0 && !!u[4]) || u[0][k - 1] === ' ' }); q++ }) }
  return LC[i] = out;
}
const S = i => Ln[i].s, E = i => Ln[i].e;
const cT = (i, k) => chars(i)[Math.min(k, chars(i).length - 1)].t;

// ---------- fonts ----------
function font(w, size, fam = KR) { g.font = `${Math.round(w)} ${size.toFixed(1)}px ${fam}`; }
function setTrack(px) { g.letterSpacing = `${px.toFixed(2)}px` }
function measure(txt, w, size, tr = 0, fam = KR) { font(w, size, fam); setTrack(tr * size); return g.measureText(txt).width }

// ---------- text ----------
// txt(s, x, y, o): one run. o: {w, size, fam, tr (em), col, al, base, alpha, upper, outline, lw}
function txt(s, x, y, o) {
  const size = o.size, w = o.w ?? 500, fam = o.fam ?? KR; if (o.upper || fam === EN && o.upper !== false) s = s.toUpperCase();
  font(w, size, fam); setTrack((o.tr ?? 0) * size); g.textAlign = o.al ?? 'left'; g.textBaseline = o.base ?? 'alphabetic';
  g.globalAlpha = o.alpha ?? 1;
  if (o.outline) { g.strokeStyle = o.col; g.lineWidth = o.lw ?? Math.max(1.5, size * .012); g.lineJoin = 'round'; g.strokeText(s, x, y) } else { g.fillStyle = o.col; g.fillText(s, x, y) }
  g.globalAlpha = 1; return g.measureText(s).width;
}
// lyric run: characters a..b of line i, each revealed on its sung time. Returns the laid-out glyphs.
// o: text style + {rev: 'fade'|'rise'|'drop'|'grow'|'type'|'weight', dur, keep, from (weight for 'weight'), hide (t after which gone), fx(glyph,a) -> extra transform}
function layout(i, a, b, o) {
  const C = chars(i), size = o.size, w = o.w ?? 500, fam = o.fam ?? KR, tr = (o.tr ?? 0) * size;
  font(w, size, fam); setTrack(tr); let x = 0; const gl = [];
  for (let k = a; k < b; k++) {
    if (k > a && C[k].sp) x += size * (o.space ?? .3);
    const c = (o.upper || fam === EN && o.upper !== false) ? C[k].c.toUpperCase() : C[k].c, cw = g.measureText(c).width;
    gl.push({ c, x, w: cw, t: C[k].t, k }); x += cw;
  }
  return { gl, width: x - tr };
}
function lyr(t, i, a, b, x, y, o) {
  if (b == null) b = chars(i).length; const L = layout(i, a, b, o), size = o.size;
  const x0 = o.al === 'center' ? x - L.width / 2 : o.al === 'right' ? x - L.width : x;
  const fade = o.keep == null ? 1 : 1 - (1 - o.keep) * seg(t, E(i) + (o.hold ?? .6), .8);
  if (o.hide != null) { const h = seg(t, o.hide, o.hideDur ?? .35); if (h >= 1) return L; }
  const out = o.hide != null ? 1 - eIn(seg(t, o.hide, o.hideDur ?? .35)) : 1;
  g.textAlign = 'left'; g.textBaseline = o.base ?? 'alphabetic';
  for (const G of L.gl) {
    const a0 = seg(t, G.t - .05, o.dur ?? .22); if (a0 <= 0 && o.rev !== 'ghost') continue;
    let dx = 0, dy = 0, sc = 1, al = a0, wt = o.w ?? 500;
    switch (o.rev) {
      case 'rise': dy = (1 - eOut(a0)) * size * .35; break;
      case 'drop': dy = -(1 - eBk(a0)) * size * .5; break;
      case 'grow': sc = eBk(a0, 1.8); al = a0 > 0 ? 1 : 0; break;
      case 'type': al = a0 > 0 ? 1 : 0; break;
      case 'weight': wt = lerp(o.from ?? 100, o.w ?? 500, eOut(a0)); al = clamp(a0 * 3); break;
      case 'ghost': al = .12 + .88 * a0; break;
    }
    if (o.fx) { const f = o.fx(G, a0, t); dx += f.dx || 0; dy += f.dy || 0; if (f.sc) sc *= f.sc; if (f.al != null) al *= f.al; if (f.w) wt = f.w }
    font(wt, size, o.fam ?? KR); setTrack(0);
    g.globalAlpha = clamp(al) * fade * out * (o.alpha ?? 1);
    const gx = x0 + G.x + dx, gy = y + dy;
    if (sc !== 1) { g.save(); g.translate(gx + G.w / 2, gy - size * .35); g.scale(sc, sc); g.translate(-(gx + G.w / 2), -(gy - size * .35)) }
    if (o.outline) { g.strokeStyle = o.col; g.lineWidth = o.lw ?? Math.max(1.5, size * .012); g.strokeText(G.c, gx, gy) } else { g.fillStyle = typeof o.col === 'function' ? o.col(G, t) : o.col; g.fillText(G.c, gx, gy) }
    if (sc !== 1) g.restore();
  }
  g.globalAlpha = 1; L.x0 = x0; return L;
}

// ---------- geometry ----------
function rect(x, y, w, h, col, a = 1) { g.globalAlpha = a; g.fillStyle = col; g.fillRect(x, y, w, h); g.globalAlpha = 1 }
function disc(x, y, r, col, a = 1) { if (r <= 0) return; g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.globalAlpha = 1 }
function ring(x, y, r, lw, col, a = 1) { if (r <= 0) return; g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.globalAlpha = 1 }
function line(x0, y0, x1, y1, lw, col, a = 1, p = 1) { if (p <= 0) return; g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'butt'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(lerp(x0, x1, p), lerp(y0, y1, p)); g.stroke(); g.globalAlpha = 1 }
function fill(col) { g.fillStyle = col; g.fillRect(-2000, -2000, W + 4000, H + 4000) }
// a bracket pair drawn as lines: open 0..1 (1 = wide open)
function brackets(cx, cy, w, h, lw, col, open = 0, a = 1) {
  const dx = w / 2 + open * 260, arm = 34;
  for (const s of [-1, 1]) { const x = cx + s * dx; g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.moveTo(x - s * arm, cy - h / 2); g.lineTo(x, cy - h / 2); g.lineTo(x, cy + h / 2); g.lineTo(x - s * arm, cy + h / 2); g.stroke() }
  g.globalAlpha = 1;
}

// ---------- layers & masks ----------
const LAYERS = {};
function layer(id) { let c = LAYERS[id]; if (!c) { c = document.createElement('canvas'); c.width = W; c.height = H; LAYERS[id] = c } const x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.globalCompositeOperation = 'source-over'; x.clearRect(0, 0, W, H); return c }
function drawOn(c, fn) { const g0 = g; g = c.getContext('2d'); try { fn() } finally { g = g0 } return c }
// MASK PASS: draw `scene` only inside the shape drawn by `shape` (both are functions drawing into the current g)
function masked(id, scene, shape) {
  const a = drawOn(layer(id + 'a'), scene), m = drawOn(layer(id + 'm'), shape);
  const x = a.getContext('2d'); x.globalCompositeOperation = 'destination-in'; x.drawImage(m, 0, 0); x.globalCompositeOperation = 'source-over';
  g.drawImage(a, 0, 0);
}

// ---------- reflow: a vertical flow whose items push each other as they arrive / leave ----------
// items: [{t0, t1, h, draw(y, a)}]; each item's height grows in over `inDur` and shrinks out after t1; the rest follow.
function flow(t, items, y0, o = {}) {
  let y = y0; const inDur = o.inDur ?? .45, outDur = o.outDur ?? .45;
  for (const it of items) {
    const pin = eOutQ(seg(t, it.t0 - .12, inDur)), pout = it.t1 != null ? eIO(seg(t, it.t1, outDur)) : 0, p = pin * (1 - pout);
    if (p <= 0) continue;
    const yy = o.up ? y - it.h * p : y;
    it.draw(o.up ? yy : y, p, pin, pout);
    y = o.up ? yy - (o.gap ?? 0) * p : y + (it.h + (o.gap ?? 0)) * p;
  }
  return y;
}

// ---------- camera (support only: glyph entry, pull-out reveal, following a long line) ----------
let CAM = { x: CX, y: CY, s: 1, r: 0 };
function camera(c) { g.setTransform(1, 0, 0, 1, 0, 0); g.translate(CX, CY); g.rotate(c.r || 0); g.scale(c.s, c.s); g.translate(-c.x, -c.y) }
