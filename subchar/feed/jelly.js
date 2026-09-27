/* FEED jelly engine: soft, springy shapes (the "쫀득" feel of Blueming), deterministic in t.
   A value is a chain of spring steps: v(t) = v0 + Σ (v_i - v_{i-1}) · step(t - t_i). Each step is the analytic response
   of an under-damped spring, so a new target can arrive before the last one settled and it all still depends on t only.
   Shapes are rounded rectangles sampled as polygons, so the same path morphs dot -> line -> pill -> card, can wobble on
   impact, stretch along their velocity (smear) and squash with volume kept (sx · sy = 1). */

// ---------- palette (FEED) ----------
const INK = '#12131F', CREAM = '#FCEBDD', WHITE = '#FFF9F1', GREY = '#BDB7C9', MECOL = '#FF6B6B', YOUCOL = '#5A3CF0',
  YEL = '#FFD23F', PEACH = '#FFB36B', TEAL = '#62B6B7', MAUVE = '#6D5B80', DEEP = '#23243F', PINK = '#FF8FB1';

// ---------- springs ----------
function stepR(tau, f = 2.2, z = .38) {
  if (tau <= 0) return 0; const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * tau) * (Math.cos(wd * tau) + z * w / wd * Math.sin(wd * tau));
}
// keys: [[t0, v0], [t1, v1, f?, z?], ...]
function spr(t, keys, f = 2.2, z = .38) { let v = keys[0][1]; for (let i = 1; i < keys.length; i++) v += (keys[i][1] - keys[i - 1][1]) * stepR(t - keys[i][0], keys[i][2] ?? f, keys[i][3] ?? z); return v }
const sprV = (t, keys, f, z) => (spr(t, keys, f, z) - spr(t - 1 / 240, keys, f, z)) * 240;
// an impact: a decaying wobble (0 at rest)
const wob = (tau, amp = .3, fr = 3.2, damp = 5) => tau < 0 ? 0 : amp * Math.exp(-damp * tau) * Math.cos(2 * Math.PI * fr * tau);
// ballistic fall that lands at tLand (y0 -> y1 under gravity), then stays
const fall = (t, t0, tLand, y0, y1) => t <= t0 ? y0 : t >= tLand ? y1 : lerp(y0, y1, ((t - t0) / (tLand - t0)) ** 2);

// ---------- shapes ----------
function rrPoints(w, h, rad, n = 64) {                 // n points around a rounded rect (corner radius rad), clockwise from the top-left
  rad = Math.max(0, Math.min(rad, w / 2, h / 2)); const sx = w / 2 - rad, sy = h / 2 - rad, q = Math.PI / 2;
  const P = [[2 * sx, u => [-sx + 2 * sx * u, -h / 2]], [q * rad, u => { const a = -q + u * q; return [sx + rad * Math.cos(a), -sy + rad * Math.sin(a)] }],
    [2 * sy, u => [w / 2, -sy + 2 * sy * u]], [q * rad, u => { const a = u * q; return [sx + rad * Math.cos(a), sy + rad * Math.sin(a)] }],
    [2 * sx, u => [sx - 2 * sx * u, h / 2]], [q * rad, u => { const a = q + u * q; return [-sx + rad * Math.cos(a), sy + rad * Math.sin(a)] }],
    [2 * sy, u => [-w / 2, sy - 2 * sy * u]], [q * rad, u => { const a = 2 * q + u * q; return [-sx + rad * Math.cos(a), -sy + rad * Math.sin(a)] }]];
  const per = P.reduce((a, p) => a + p[0], 0), pts = [];
  for (let i = 0; i < n; i++) { let d = i / n * per, hit = null; for (const [len, f] of P) { if (len > 0 && d <= len) { hit = f(d / len); break } d -= Math.max(0, len) } pts.push(hit || P[7][1](1)) }
  return pts;
}
// blob(x, y, w, h, o): o = {round (0..1 of the short side), col, stroke, lw, rot, wob (0..), ph, vx, vy (px/s -> smear), sq (extra squash, + = flatter)}
function blob(x, y, w, h, o = {}) {
  if (w <= .5 || h <= .5) return; const rad = (o.round ?? 1) * Math.min(w, h) / 2;
  const pts = rrPoints(w, h, rad, o.n ?? 72), wb = o.wob || 0, ph = o.ph || 0, k = Math.min(w, h) / 2;
  g.save(); g.translate(x, y);
  const sp = Math.hypot(o.vx || 0, o.vy || 0);
  if (sp > 30) { const s = Math.min(.9, sp / 2600), an = Math.atan2(o.vy, o.vx); g.rotate(an); g.scale(1 + s, 1 / (1 + s)); g.rotate(-an) }   // smear along the motion
  if (o.sq) { const s = 1 + o.sq; g.scale(s, 1 / s) }                                                                                   // squash, volume kept
  if (o.rot) g.rotate(o.rot);
  g.beginPath();
  pts.forEach(([px, py], i) => { const a = Math.atan2(py, px), r = 1 + wb * Math.sin(3 * a + ph) * .5 + wb * .5 * Math.sin(5 * a - ph * 1.3) * .5, qx = px * r, qy = py * r; i ? g.lineTo(qx, qy) : g.moveTo(qx, qy) });
  g.closePath(); g.globalAlpha = o.alpha ?? 1;
  if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.lw ?? 8; g.lineJoin = 'round'; g.stroke() } if (o.col) { g.fillStyle = o.col; g.fill() }
  g.restore(); g.globalAlpha = 1;
}
// the same shape drawn two or three times, each colour a little late (Blueming's trailing colour layers)
function layered(t, lags, cols, fn) { for (let i = 0; i < lags.length; i++) fn(t - lags[i], cols[i], i) }
function heartPath(s) {                               // a heart, centred, width ≈ s
  const k = s / 100; g.beginPath(); g.moveTo(0, 30 * k);
  g.bezierCurveTo(-8 * k, 20 * k, -50 * k, -2 * k, -50 * k, -26 * k); g.bezierCurveTo(-50 * k, -50 * k, -18 * k, -58 * k, 0, -34 * k);
  g.bezierCurveTo(18 * k, -58 * k, 50 * k, -50 * k, 50 * k, -26 * k); g.bezierCurveTo(50 * k, -2 * k, 8 * k, 20 * k, 0, 30 * k); g.closePath();
}
function heart(x, y, s, o = {}) { if (s <= 1) return; g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot); if (o.sq) g.scale(1 + o.sq, 1 / (1 + o.sq)); heartPath(s); g.globalAlpha = o.alpha ?? 1;
  if (o.col) { g.fillStyle = o.col; g.fill() } if (o.stroke) { g.strokeStyle = o.stroke; g.lineWidth = o.lw ?? 6; g.lineJoin = 'round'; g.stroke() } g.restore(); g.globalAlpha = 1 }
function personIcon(x, y, r, col) { disc(x, y - r * .22, r * .3, col); g.save(); g.beginPath(); g.arc(x, y, r, 0, 7); g.clip(); blob(x, y + r * .62, r * 1.15, r * .9, { col, round: 1 }); g.restore() }
// a stroke that draws itself (0..1)
function drawPath(pts, p, lw, col) { if (p <= 0) return; let tot = 0; const L = []; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d }
  let left = tot * p; g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(...pts[0]);
  for (let i = 1; i < pts.length && left > 0; i++) { const f = Math.min(1, left / L[i - 1]); g.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); left -= L[i - 1] } g.stroke() }
// a label inside a pill: text centred
function pillText(x, y, s, o) { txt(s, x, y, { size: o.size, w: o.w ?? 600, fam: o.fam ?? KR, col: o.col, al: 'center', base: 'middle', alpha: o.alpha, tr: o.tr ?? 0, upper: false }) }
