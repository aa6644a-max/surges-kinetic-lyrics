/* Sub character v4: STYLE SYSTEM (global, every zone uses it).
   Two families only, loaded from local files (subchar/fonts) so the render never falls back:
     Pretendard Variable  - all Korean lyrics and the typographic architecture
     Inter Tight Variable - production labels / equipment / credits in English (uppercase), and a few English lyric words
   Hierarchy comes from weight, size, tracking, opacity, crop and perspective, never from another font.
   YOU / MAIN   : Pretendard 800-900, tracking -0.055..-0.025em, heavy, occupies space
   ME act 1     : Pretendard 300-400, tracking +0.06..+0.16em, small, credit / footnote / margin
   ME act 2     : Pretendard 450-600, tracking shrinking, growing size
   ME act 3     : Pretendard 700-900, tracking -0.03..0, 260px+ allowed
   (ME does not get a new font: she acquires the main character's grammar inside the same one.)
   No serif, script, handwriting, decorative or condensed faces; no italics. */
const KR = '"Pretendard Variable"', EN = '"Inter Tight Variable"', EN_CASE = '"Inter Tight Variable", sans-serif';   // EN_CASE keeps the lyric's own case
const F = (w, s, fam = KR) => `${Math.round(w)} ${Math.round(s * 10) / 10}px ${fam}`;
const YOU_T = s => F(880, s);                                        // the main character's type
const ME_T = (act, s) => F([0, 340, 540, 820][act], s);              // ME by act
const AMB = (s, w = 640) => F(w, s);                                 // neutral lyric / ambient
const LABEL = (s, w = 560) => F(w, s, EN);                           // production label, uppercase
const ARCH_EN = s => F(720, s, EN);                                  // large architectural English
// v4 names kept for zone C, mapped onto the two families
const TK = s => YOU_T(s), TE = s => ARCH_EN(s);
const CK = (s, w = 300) => F(w <= 400 ? 340 : 520, s), CE = (s, w = 400) => LABEL(s, w + 140), MK = (s, w = 700) => F(w, s);

// tracking follows the role (weight / family / size), in em
function trackFor(font) {
  const m = font.match(/^(\d+) ([\d.]+)px (.*)$/); if (!m) return 0;
  const w = +m[1], s = +m[2], en = m[3].includes('Inter Tight');
  if (en) return (m[3] === EN && s < 80 ? .12 : -.02) * s;
  return (w >= 780 ? -.045 : w >= 600 ? -.02 : w >= 450 ? .02 : .1) * s;
}
const isLabel = font => font.endsWith(EN);                           // labels are set in capitals
function setFont(font) { g.font = font; g.letterSpacing = `${trackFor(font).toFixed(2)}px` }

// ---------- font loading: READY waits for both families; if either fails, READY never resolves and we warn ----------
async function loadFonts() {
  const probes = [F(300, 40), F(880, 40), F(500, 40, EN), F(720, 40, EN)];
  await Promise.all(probes.map(f => document.fonts.load(f, '주인공 너 좋아해 ABC')));
  await document.fonts.ready;
  const ok = document.fonts.check(F(500, 40), '주인공') && document.fonts.check(F(500, 40, EN), 'MAIN');
  // a fallback font would measure the same as the generic family: make sure the real faces are in use
  const c = document.createElement('canvas').getContext('2d'), w = f => { c.font = f; return c.measureText('주인공 MAIN CHARACTER 0123').width };
  const real = w(F(500, 40)) !== w('500 40px serif') && w(F(500, 40, EN)) !== w('500 40px serif');
  if (!ok || !real) { console.warn('[subchar] fonts did not load: Pretendard Variable / Inter Tight Variable. READY is held.'); await new Promise(() => { }) }
}

// ---------- planes: content drawn flat into an offscreen canvas, then laid on a world plane whose edges sit at
// different depths (so it skews in perspective as the camera moves). Rows are drawn one strip at a time. ----------
const PLANES = {};
function planeCanvas(id, w, h) {
  let c = PLANES[id]; if (!c) { c = document.createElement('canvas'); c.width = w; c.height = h; PLANES[id] = c }
  const x = c.getContext('2d'); x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, w, h); return c;
}
function onCanvas(c, fn) { const g0 = g; g = c.getContext('2d'); try { fn() } finally { g = g0 } }
// corners: [x, y, p] top-left, top-right, bottom-left, bottom-right (world coords + parallax)
function drawPlane(src, TL, TR, BL, BR, rows = 48, alpha = 1) {
  const L3 = (a, b, v) => [lerp(a[0], b[0], v), lerp(a[1], b[1], v), lerp(a[2], b[2], v)];
  const P = q => proj(q[2], q[0], q[1]);
  g.save(); g.setTransform(1, 0, 0, 1, CX, CY); g.rotate(CAM.r * Math.PI / 180); g.translate(-CX, -CY); g.globalAlpha = alpha;
  for (let i = 0; i < rows; i++) {
    const v0 = i / rows, v1 = (i + 1) / rows, l0 = P(L3(TL, BL, v0)), r0 = P(L3(TR, BR, v0)), l1 = P(L3(TL, BL, v1)), r1 = P(L3(TR, BR, v1));
    const wd = (r0.x - l0.x + r1.x - l1.x) / 2, h = l1.y - l0.y;
    if (h <= 0 || wd <= 0) continue;
    g.drawImage(src, 0, v0 * src.height, src.width, src.height / rows, lerp(l0.x, l1.x, .5), l0.y, wd, h + .6);
  }
  g.restore();
}
