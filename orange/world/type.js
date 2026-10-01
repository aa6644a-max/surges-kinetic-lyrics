/* ORANGE lockups (the Maps grammar): a sung line laid out as a block of mixed sizes — thin tracked words, a heavy key word,
   a hand-written accent — built char by char on the sung syllables, each row with its own entrance:
   fly (scattered letters assemble), stamp, drop, type, rise (out of a mask). Styles come from ST or an object. */
const ST = {
  heavy: { fam: JP, col: '#FFFFFF', line: INK, lwk: .12 },
  heavyO: { fam: JP, col: ORG, line: INK, lwk: .1 },
  heavyY: { fam: JP, col: YEL, line: INK, lwk: .1 },
  heavyS: { fam: JP, col: SKY, line: INK, lwk: .1 },
  dark: { fam: JP, col: INK, line: '#FFFFFF', lwk: .1 },
  thin: { fam: RD, w: 500, col: '#FFFFFF', outline: false, shadow: false, tr: .14 },
  thinD: { fam: RD, w: 500, col: INK, outline: false, shadow: false, tr: .14 },
  round: { fam: RD, w: 800, col: '#FFFFFF', line: INK, lwk: .14 },
  roundO: { fam: RD, w: 800, col: ORG, line: INK, lwk: .14 },
  hand: { fam: HW, w: 600, col: INK, outline: false, shadow: false },
  handW: { fam: HW, w: 600, col: '#FFFFFF', outline: false, shadow: false },
  boil: { fam: JP, col: '#FFFFFF', boil: true },
};
// lockup(t, { x, y, rot, s, al, alpha(t), rows: [{ i, a, b, size, st, ent, gap, dx, dy, wob, from, lh }] }) -> world box
function lockup(t, L) {
  const rows = L.rows.map(r => { const st = Object.assign({}, typeof r.st === 'string' ? ST[r.st] : (r.st ?? ST.heavy), r.col ? { col: r.col } : {}); const C = chars(r.i).slice(r.a, r.b ?? chars(r.i).length);
    font(st.w ?? 400, r.size, st.fam); setTrack(0); const tr = (st.tr ?? 0) * r.size, ws = C.map(G => g.measureText(G.c).width + tr), sp = C.map((G, k) => k && G.sp ? r.size * .3 : 0);
    return { r, st, C, ws, sp, width: ws.reduce((a, c) => a + c, 0) + sp.reduce((a, c) => a + c, 0) - tr, h: r.size * (r.lh ?? 1.1) } });
  const totalH = rows.reduce((a, R2) => a + R2.h + (R2.r.gap ?? 0), 0), alpha = L.alpha ? L.alpha(t) : 1; let y = -totalH / 2;
  if (alpha <= .002) return null;
  g.save(); g.translate(L.x, L.y); g.rotate(L.rot ?? 0); g.scale(L.s ?? 1, L.s ?? 1);
  rows.forEach((R2, ri) => { const { r, st, C, ws, sp, width, h } = R2; let x = (L.al === 'left' ? 0 : L.al === 'right' ? -width : -width / 2) + (r.dx ?? 0); const cy = y + h / 2 + (r.dy ?? 0);
    C.forEach((G, k) => { x += sp[k]; const cx = x + ws[k] / 2 - (st.tr ?? 0) * r.size / 2; x += ws[k]; const t0 = G.t - .03; if (t >= t0) drawChar(t, t0, G.c, cx, cy, r, st, k, ri, alpha) });
    y += h + (r.gap ?? 0) });
  g.restore();
  return { x: L.x, y: L.y, w: Math.max(...rows.map(R2 => R2.width)) * (L.s ?? 1), h: totalH * (L.s ?? 1) };
}
function drawChar(t, t0, c, x, y, r, st, k, ri, alpha) {
  const ent = r.ent ?? 'stamp', size = r.size, d = t - t0, sd = k * 13 + ri * 101 + (r.i ?? 0) * 7;
  const paint = (px, py, a = 1) => { if (st.boil) { boilChar(t, c, px, py, size, st, alpha * a); return } sticker(c, px, py, size, Object.assign({}, st, { alpha: alpha * a })) };
  if (ent === 'fly') { const s = MO.springStep(d, { damping: 11, stiffness: 190 }), dx = (R(sd, 5) - .5) * 1300, dy = (R(sd, 6) - .5) * 1000, rot = (R(sd, 7) - .5) * 3.2, q = 1 - Math.min(1, s);
    g.save(); g.translate(x + dx * (1 - s), y + dy * (1 - s)); g.rotate(rot * q); const sc = .35 + .65 * s; g.scale(sc, sc); paint(0, 0, clamp(d / .08)); g.restore(); return }
  if (ent === 'drop') { const s = MO.springStep(d, { damping: 9, stiffness: 300 }); paint(x, y - (1 - s) * size * 2.4); return }
  if (ent === 'type') { paint(x, y); return }
  if (ent === 'rise') { const p = eOut(clamp(d / .3)); g.save(); g.beginPath(); g.rect(x - size, y - size * .64, size * 2, size * 1.28); g.clip(); paint(x, y + (1 - p) * size * 1.15); g.restore(); return }
  stampIn(t, t0, x, y, (R(sd, 9) - .5) * (r.wob ?? .16), () => paint(0, 0), { from: r.from ?? 2.2, dur: .1 });
}
// a boiling outline glyph (hand-drawn double stroke, redrawn 8 times a second)
function boilChar(t, c, x, y, size, st, a) { const b0 = boil(t); font(400, size, st.fam ?? JP); g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.save(); g.globalAlpha = a; g.strokeStyle = st.col ?? '#FFFFFF'; g.lineWidth = size * .028; for (let p = 0; p < 2; p++) g.strokeText(c, x + (R(p + 3, b0) - .5) * size * .03, y + (R(p + 9, b0) - .5) * size * .03); g.restore() }
