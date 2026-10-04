/* ORANGE manga: a motion comic. The screen is one manga page (1080 x 1920): panels ink in on the song, the camera reads
   them right to left and top to bottom (zooming into each panel, back out to the page), and the page turns between scenes.
   Every picture is a generated black-and-white manga panel with one orange spot colour; the lyrics are lettered in code as
   vertical narration boxes, speech balloons, a thought cloud and sound-effect lettering, each character on its sung time. */

const PAPERC = '#F6F3EC', INKC = '#121214', IMG = {}, TURN = .42;
const loadPanels = ids => Promise.all(ids.map(id => new Promise(r => { const im = new Image(); im.onload = () => { IMG[id] = im; r() }; im.onerror = () => r(); im.src = `panels/${id}.webp` })));
let GRAIN = null;
function grain() { if (GRAIN) return GRAIN; const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d');
  for (let k = 0; k < 2600; k++) { x.fillStyle = `rgba(60,50,40,${.025 + R(k, 5) * .05})`; x.fillRect(R(k, 1) * 256, R(k, 2) * 256, 1 + R(k, 3) * 1.5, 1 + R(k, 4) * 1.5) }
  return GRAIN = g.createPattern(c, 'repeat') }

// ---------------------------------------------------------------- panels
const panelPath = p => { const [x, y, w, h] = p.r; g.beginPath(); if (p.cloud) cloudPath(x + w / 2, y + h / 2, w / 2, h / 2); else g.rect(x, y, w, h) };
function cloudPath(cx, cy, rx, ry) { const n = 16; for (let k = 0; k <= n; k++) { const a0 = k / n * Math.PI * 2, a1 = (k + 1) / n * Math.PI * 2, am = (a0 + a1) / 2,
  mx = cx + Math.cos(am) * rx * 1.02, my = cy + Math.sin(am) * ry * 1.02, x1 = cx + Math.cos(a1) * rx * .9, y1 = cy + Math.sin(a1) * ry * .9;
  if (k === 0) g.moveTo(cx + Math.cos(a0) * rx * .9, cy + Math.sin(a0) * ry * .9); if (k < n) g.quadraticCurveTo(mx + Math.cos(am) * rx * .16, my + Math.sin(am) * ry * .16, x1, y1) } g.closePath() }
// the picture, cover-cropped around a focus point, with a slow drift (kb: [dfx, dfy, dzoom] over 8 s)
function panelImage(p, t) { const im = IMG[p.id], [x, y, w, h] = p.r; if (!im) { rect(x, y, w, h, '#C9C5BC'); return }
  const u = clamp((t - p.t) / (p.kbDur ?? 8)), kb = p.kb ?? [0, 0, .05], z = (p.zoom ?? 1) * (1 + kb[2] * eSm(u)), fx = (p.fx0 ?? .5) + kb[0] * u, fy = (p.fy0 ?? .5) + kb[1] * u;
  const s = Math.max(w / im.width, h / im.height) * z, iw = im.width * s, ih = im.height * s;
  const ix = clamp(x + w / 2 - iw * fx, x + w - iw, x), iy = clamp(y + h / 2 - ih * fy, y + h - ih, y);
  g.drawImage(im, ix, iy, iw, ih) }
function revealClip(p, u) { const [x, y, w, h] = p.r, fx = p.fx ?? 'wipe';
  if (fx === 'wipe') { const e = eOut(clamp(u / .45)); g.beginPath(); g.rect(x + w * (1 - e) - 2, y, w * e + 4, h); g.clip() }
  else if (fx === 'ink') { const e = eOut(clamp(u / (p.inkDur ?? .7))), ox = x + w * (p.ox ?? .5), oy = y + h * (p.oy ?? .5), r = Math.hypot(w, h) * 1.05 * e, n = 30; g.beginPath();
    for (let k = 0; k <= n; k++) { const a = k / n * Math.PI * 2, rr2 = r * (1 + .16 * Math.sin(k * 2.7 + 1) + .09 * Math.sin(k * 6.1 + 2)); k ? g.lineTo(ox + Math.cos(a) * rr2, oy + Math.sin(a) * rr2) : g.moveTo(ox + Math.cos(a) * rr2, oy + Math.sin(a) * rr2) } g.clip() } }
function drawPanel(p, t, P) { const u = t - p.t; if (u < -.22) return; const [x, y, w, h] = p.r, dark = P.bg && P.bg !== PAPERC;
  g.save();
  if (p.rot || p.inset || p.fx === 'pop') { const s = p.inset || p.fx === 'pop' ? Math.min(1.04, MO.springStep(u, { damping: 12, stiffness: 260 })) : 1; g.translate(x + w / 2, y + h / 2); g.rotate(p.rot ?? 0); g.scale(s, s); g.translate(-x - w / 2, -y - h / 2); if (s <= .01) { g.restore(); return } }
  if (p.inset) { g.save(); panelPath(p); g.lineWidth = 26; g.strokeStyle = dark ? INKC : '#FFFFFF'; g.stroke(); g.restore() }
  if (u >= 0) { g.save(); panelPath(p); g.clip(); if (p.cloud) { g.fillStyle = '#FFFFFF'; g.fill() } revealClip(p, u); panelImage(p, t);
    if (p.fx === 'flash' && u < .32) rect(x - 10, y - 10, w + 20, h + 20, '#FFFFFF', 1 - u / .32); g.restore() }
  if (!p.bleed) { const bp = clamp((u + .22) / .2); g.save(); g.lineWidth = p.cloud ? 8 : 7; g.strokeStyle = dark ? '#EDEDED' : INKC; g.lineJoin = 'round';
    if (bp < 1) { const L = p.cloud ? (w + h) * 1.7 : 2 * (w + h); g.setLineDash([L * bp, L]) } panelPath(p); g.stroke(); g.restore() }
  g.restore() }

// ---------------------------------------------------------------- lettering
const SMALLK = 'ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ', ROT90 = 'ー〜～…', PUNCT = '、。';
const glyphPop = d => 1 + .4 * Math.exp(-d * 24);
// vertical text: chars a..b of line i, centred block at (cx, cy), columns of colLen from right to left
function vblock(i, a, b, size, o = {}) { const n = b - a, colLen = o.colLen ?? 99, cols = Math.ceil(n / colLen), rows = Math.min(n, colLen), gap = o.colGap ?? 1.32;
  return { cols, rows, w: (cols - 1) * size * gap + size, h: rows * size * (o.lead ?? 1.04) } }
function vtext(t, i, a, b, cx, cy, size, o = {}) { const C = chars(i), B = vblock(i, a, b, size, o), colLen = o.colLen ?? 99, gap = o.colGap ?? 1.32, lead = o.lead ?? 1.04;
  const x0 = cx + B.w / 2 - size / 2, y0 = cy - B.h / 2;
  for (let k = a; k < b; k++) { const G = C[k], d = t - (G.t - .03); if (d < 0) continue; const j = k - a, col = Math.floor(j / colLen), row = j % colLen, ch = G.c;
    let x = x0 - col * size * gap, y = y0 + row * size * lead + size / 2, rot = 0;
    if (SMALLK.includes(ch)) { x += size * .13; y -= size * .12 } else if (PUNCT.includes(ch)) { x += size * .33; y -= size * .33 } else if (ROT90.includes(ch)) rot = Math.PI / 2;
    const s = glyphPop(d), col2 = o.hl && k >= o.hl[0] && k < o.hl[1] ? ORG : (o.col ?? INKC);
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); sticker(ch, 0, 0, size, { fam: o.fam ?? MJ, col: col2, line: o.line ?? '#FFFFFF', lwk: o.lwk ?? .1, shadow: false, outline: o.line !== null, alpha: clamp(d / .05) }); g.restore() } }
// horizontal text, centred at (cx, cy)
function htext(t, i, a, b, cx, cy, size, o = {}) { const C = chars(i).slice(a, b), fam = o.fam ?? MJ; font(o.w ?? 400, size, fam); setTrack(0);
  const ws = C.map(G => g.measureText(G.c).width + size * (o.tr ?? .02)), tot = ws.reduce((s, v) => s + v, 0); let x = o.al === 'left' ? cx : cx - tot / 2;
  C.forEach((G, k) => { const w = ws[k], px = x + w / 2; x += w; const d = t - (G.t - .03); if (d < 0) return; const col = o.hl && a + k >= o.hl[0] && a + k < o.hl[1] ? ORG : (o.col ?? INKC);
    const sty = { fam, w: o.w ?? 400, col, line: o.line ?? '#FFFFFF', lwk: o.lwk ?? .1, shadow: false, outline: o.line !== null };
    if (o.ent === 'type') sticker(G.c, px, cy, size, sty);
    else stampIn(t, G.t - .03, px, cy + (o.wave ? Math.sin(k * 1.3) * size * .08 : 0), (R(k + a, 7) - .5) * (o.wob ?? .12), () => sticker(G.c, 0, 0, size, sty), { from: o.from ?? 1.9, dur: .1 }) }) }
// a narration box / speech balloon / thought cloud around a vertical block
function boxShape(kind, cx, cy, w, h, size, tail) {
  if (kind === 'cap') { const pad = size * .42; g.beginPath(); g.rect(cx - w / 2 - pad, cy - h / 2 - pad, w + pad * 2, h + pad * 2); return }
  if (kind === 'think') { cloudPath(cx, cy, w / 2 + size * 1.0, h / 2 + size * .95); return }
  const rx = w / 2 + size * .95, ry = h / 2 + size * .8; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  if (tail) { const [tx, ty] = tail, a = Math.atan2(ty, tx), bx = cx + Math.cos(a) * rx * .82, by = cy + Math.sin(a) * ry * .82, n = Math.hypot(tx, ty);
    g.moveTo(bx + Math.cos(a + 1.57) * size * .45, by + Math.sin(a + 1.57) * size * .45); g.lineTo(cx + Math.cos(a) * (rx + n), cy + Math.sin(a) * (ry + n)); g.lineTo(bx + Math.cos(a - 1.57) * size * .45, by + Math.sin(a - 1.57) * size * .45) } }
function boxText(t, it, P) { const t0 = (it.i != null ? cT(it.i, it.a) : it.t) - .14; if (t < t0) return; const s = Math.min(1, MO.springStep(t - t0, { damping: 13, stiffness: 340 })), dark = it.inv;
  const B = it.i != null ? vblock(it.i, it.a, it.b, it.size, it) : { w: it.size * 1.0 * (it.text.length) , h: it.size * 1.2 };
  g.save(); g.translate(it.x, it.y); g.rotate(it.rot ?? 0); g.scale(s, s); g.translate(-it.x, -it.y);
  boxShape(it.k, it.x, it.y, B.w, B.h, it.size, it.tail); g.fillStyle = dark ? INKC : '#FFFFFF'; g.fill(); g.lineWidth = it.k === 'cap' ? 4 : 5; g.strokeStyle = dark ? '#FFFFFF' : INKC; g.lineJoin = 'round'; g.stroke();
  if (it.k === 'think') { for (const [dx, dy, r] of it.dots ?? []) { disc(it.x + dx, it.y + dy, r, '#FFFFFF'); ring(it.x + dx, it.y + dy, r, 5, INKC) } }
  if (it.i != null) vtext(t, it.i, it.a, it.b, it.x, it.y, it.size, Object.assign({ line: null, col: dark ? '#FFFFFF' : INKC }, it));
  else txt(it.text, it.x, it.y + it.size * .36, { size: it.size, fam: it.fam ?? RD, w: 800, col: dark ? '#FFFFFF' : INKC, al: 'center', upper: false });
  g.restore() }
// sound-effect / key-word lettering: lyric chars stamped one by one (vertical or horizontal), or a fixed word at a time
function sfxText(t, it) {
  if (it.i == null) { if (t < it.t - .02 || (it.until && t > it.until)) return; stampIn(t, it.t, it.x, it.y, it.rot ?? 0, () => sticker(it.text, 0, 0, it.size, { fam: it.fam ?? SFX, col: it.col ?? INKC, line: it.line ?? '#FFFFFF', lwk: it.lwk ?? .12, shadow: false, alpha: it.until ? 1 - seg(t, it.until - .25, .25) : 1 }), { from: it.from ?? 2.1, dur: .1 }); return }
  const C = chars(it.i), n = it.b - it.a, sp = it.size * (it.gap ?? .98), vert = it.dir !== 'h';
  for (let k = 0; k < n; k++) { const G = C[it.a + k], d = t - (G.t - .03); if (d < 0) continue; const off = (k - (n - 1) / 2) * sp, ch = G.c;
    const x = it.x + (vert ? 0 : off) + (R(k, 3) - .5) * it.size * (it.jx ?? .12), y = it.y + (vert ? off : 0), rot = (it.rot ?? 0) + (R(k + it.i, 9) - .5) * (it.wob ?? .22) + (vert && ROT90.includes(ch) ? Math.PI / 2 : 0);
    const fade = it.fadeTo != null ? 1 - (1 - it.fadeTo) * seg(t, G.t + (it.fadeAfter ?? 1), 1.2) : 1, col = it.hl && it.a + k >= it.hl[0] && it.a + k < it.hl[1] ? ORG : (it.col ?? INKC);
    stampIn(t, G.t - .03, x, y, rot, () => sticker(ch, 0, 0, it.size, { fam: it.fam ?? SFX, col, line: it.line ?? '#FFFFFF', lwk: it.lwk ?? .12, shadow: false, alpha: fade }), { from: it.from ?? 2.2, dur: .1 }) } }
function drawText(it, t, P) {
  if (it.k === 'cap' || it.k === 'bal' || it.k === 'think') boxText(t, it, P);
  else if (it.k === 'sfx') sfxText(t, it);
  else if (it.k === 'big') htext(t, it.i, it.a, it.b, it.x, it.y, it.size, it);
  else if (it.k === 'vert') vtext(t, it.i, it.a, it.b, it.x, it.y, it.size, it);
  else if (it.k === 'fn') it.fn(t, P) }

// ---------------------------------------------------------------- pages and the reading camera
function pageCam(P) { if (P.camK) return P.camK; const K = [[P.t0 - .02, { x: 540, y: 960, zoom: 1 }, .01]];
  if (P.cam) P.cam.forEach(([t, x, y, z, st]) => K.push([t, { x, y, zoom: z }, st ?? .5]));
  else for (const p of P.panels) { if (p.focus === false || p.inset || p.bleed) continue; const [x, y, w, h] = p.r, z = clamp(Math.min(1080 / (w + 80), 1920 / (h + 80)), 1, 1.85) * (p.focusZ ?? 1);
    K.push([p.t - .12, { x: x + w / 2, y: y + h / 2, zoom: z }, .36]) }
  K.sort((a, b) => a[0] - b[0]); if (!P.cam) K.push([P.t1 - .62, { x: 540, y: 960, zoom: 1 }, .28]);
  return P.camK = K }
function camOf(P, t) { const c = MO.camPath(t, pageCam(P), .35), z = Math.max(1, c.zoom); return { x: clamp(c.x, 540 / z, 1080 - 540 / z), y: clamp(c.y, 960 / z, 1920 - 960 / z), z } }
function drawPage(P, t) { g.fillStyle = P.bg ?? PAPERC; g.fillRect(-60, -60, 1200, 2040); if (!P.bg) { g.fillStyle = grain(); g.fillRect(0, 0, 1080, 1920) }
  for (const p of P.panels) if (!p.inset) drawPanel(p, t, P);
  if (P.under) P.under(t, P);
  for (const p of P.panels) if (p.inset) drawPanel(p, t, P);
  for (const it of P.text ?? []) drawText(it, t, P);
  txt(`— ${P.n} —`, 70, 1898, { size: 26, fam: BG, col: P.bg ? '#77777C' : '#A9A49A', tr: .1 }) }
function drawPageAt(P, t, c) { g.save(); g.translate(CX, CY); g.scale(c.z, c.z); g.translate(-c.x, -c.y); drawPage(P, t); g.restore() }
const pageAt = t => { let k = 0; for (let j = 0; j < BOOK.length; j++) if (t >= BOOK[j].t0) k = j; return k };
