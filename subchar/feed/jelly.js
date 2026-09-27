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

// ---------- anime art (restored subculture illustrations in subchar/art) ----------
const ART = {}, ARTS = ['mem_class', 'mem_sunset', 'mem_festival', 'mem_award', 'mem_race', 'mem_rooftop', 'mem_photo', 'you_front', 'you_stage', 'you_crowd', 'me_profile', 'me_smile'];
const loadArt = () => Promise.all(ARTS.map(id => new Promise(r => { const im = new Image(); im.onload = () => { ART[id] = im; r() }; im.onerror = () => r(); im.src = `../art/${id}.png` })));
// faces for avatars: focus point (0..1) and how many avatar-widths the whole picture spans
const FACE = { you_front: [.44, .2, 1.8], you_stage: [.46, .27, 1.9], me_profile: [.52, .26, 2.0], me_smile: [.5, .27, 1.6] };   // [focus x, focus y, picture width in avatar diameters]
// faces in the class photo (mem_photo), for the likes crowd
const CROWD = [[.15, .14], [.32, .13], [.53, .16], [.62, .15], [.78, .14], [.12, .33], [.26, .35], [.39, .31], [.69, .32], [.81, .34], [.95, .29], [.18, .47], [.3, .49], [.5, .44], [.65, .47], [.8, .5]];
// a picture inside a rounded rect, cover-fit around a focus point
function photo(id, cx, cy, w, h, o = {}) {
  const im = ART[id]; if (!im || w < 2 || h < 2) return;
  const z = o.zoom ?? 1, s = Math.max(w / im.width, h / im.height) * z, iw = im.width * s, ih = im.height * s;
  const fx = o.fx ?? .5, fy = o.fy ?? .5, x = clamp(cx - iw * fx, cx + w / 2 - iw, cx - w / 2), y = clamp(cy - ih * fy, cy + h / 2 - ih, cy - h / 2);
  g.save(); g.beginPath(); g.roundRect(cx - w / 2, cy - h / 2, w, h, o.r ?? 30); g.clip();
  if (o.bg) { g.fillStyle = o.bg; g.fillRect(cx - w / 2, cy - h / 2, w, h) }
  if (o.filter) g.filter = o.filter; g.globalAlpha = o.alpha ?? 1; g.drawImage(im, x, y, iw, ih); g.filter = 'none'; g.restore(); g.globalAlpha = 1;
}
function avatar(id, cx, cy, r, o = {}) {
  const im = ART[id]; if (!im || r < 1) return; const [fx, fy, span] = o.face || FACE[id] || [.5, .3, 3], iw = 2 * r * span, s = iw / im.width, ih = im.height * s;
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.clip(); g.fillStyle = o.bg || '#EDE7F2'; g.fillRect(cx - r, cy - r, 2 * r, 2 * r);
  if (o.filter) g.filter = o.filter; g.globalAlpha = o.alpha ?? 1; g.drawImage(im, cx - iw * fx, cy - ih * fy, iw, ih); g.filter = 'none'; g.restore(); g.globalAlpha = 1;
}
// a whole-page background: the picture, heavily blurred once (cached), under a wash of the section colour
const BLUR = {};
function blurBg(id, tint, a = .8) {
  let c = BLUR[id]; const im = ART[id];
  if (!c && im) { c = document.createElement('canvas'); c.width = 270; c.height = 480; const x = c.getContext('2d'), s = Math.max(270 / im.width, 480 / im.height);
    x.filter = 'blur(10px)'; x.drawImage(im, (270 - im.width * s) / 2 - 20, (480 - im.height * s) / 2 - 20, im.width * s + 40, im.height * s + 40); BLUR[id] = c }
  if (c) { g.save(); g.imageSmoothingQuality = 'high'; g.drawImage(c, 0, 0, W, H); g.restore() }
  rect(0, 0, W, H, tint, a);
}

// a small round crop of a picture at (fx, fy): used for the faces in the likes crowd
function photoCrop(id, cx, cy, r, fx, fy, span = 12) { const im = ART[id]; if (!im) return; const iw = 2 * r * span, s = iw / im.width, ih = im.height * s;
  g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 7); g.clip(); g.drawImage(im, cx - iw * fx, cy - ih * fy, iw, ih); g.restore() }
