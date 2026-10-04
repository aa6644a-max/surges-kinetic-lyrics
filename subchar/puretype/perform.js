/* PURETYPE performer: every sung line is its own kinetic scene (the SURGES system, ported to canvas).
   One line at a time: each syllable lands on the moment it is sung, the line explodes / falls / spins away when the next
   one starts. Layouts: cam (chunks turn 90° and the camera follows the newest one, rotating so it reads upright),
   spiral, stack (poster rows), zoom (one chunk at a time), scatter (letters fly in), bounce (letters drop), tate
   (vertical columns), shout (one giant word). The emphasised chunk (!) takes the accent colour: early on it is YOU's
   word; across the song ME's words take it over, and the rest of ME's type gets heavier act by act. */

// "style|chunk/chunk/!emphasis" for all 82 lines
const KSPEC = [
  'zoom|언제나/!처럼', 'cam|네/!뒷모습만', 'stack|뚫어지게/!쳐다보다', 'scatter|갑자기/온 생각', 'tate|내가/뭘 해도',
  'shout|!너처럼/될 순 있을까', 'cam|또다시/열등감에/!빠져', 'bounce|마음은/점점', 'zoom|!오염되어/가', 'stack|빠르게/!식어 가',
  'cam|알고 있어,/난 아니야/!주인공', 'stack|그저 한 명의/!extra/일 뿐', 'tate|Oh, 그저/네가/!완벽해/보여서', 'shout|아무 이유 없이/!널/미워했어',
  'scatter|미안해,/but/어쩔 수 없었어', 'bounce|사실/!지금도', 'stack|애써/!버티고/있어',
  'cam|I\'m a/!sub character', 'zoom|우린/!안 비슷해', 'shout|부러워/!넌/어찌 그리/빛나는지', 'stack|모두/!널/좋아해', 'scatter|모두의/!인정받고',
  'shout|!행복해/보여', 'spiral|I\'m a/sub/!character', 'stack|Just/another/!loser', 'zoom|!열등감으로/찬', 'cam|Tell me/내가/!나쁜/맘일까', 'shout|I wanna be/!you',
  'stack|언젠가부터/!내 자신이/점점', 'bounce|!싫어져만/갔어', 'tate|문득/든 생각', 'shout|이건 누구/!탓이지', 'cam|아마도/!너일/거야', 'zoom|알아/!나도',
  'stack|!넌/잘못 없어', 'scatter|그저 내가/이런 나라서/!그랬어', 'cam|어떤 기분이니,/!주인공', 'tate|혹시/!너도/아프고 있니', 'bounce|이젠 난/아예 다/!모르겠어',
  'spiral|복잡하게/서로/!얽혀져/있어',
  'stack|미안해,/!미워하기만/해서', 'zoom|그래도/!어려워', 'cam|이 마음을/!지우는 건',
  'shout|I\'m a/!sub character', 'stack|딱히/!안 중요해', 'cam|말해줘/!넌/이 기분/알고 있니', 'scatter|알아 난 추해,/패배자의/!montage', 'shout|!결말이/정해져 있는',
  'spiral|I\'m a/sub/!character', 'stack|Just/another/!loser', 'scatter|어디로/!가야 할까', 'cam|Tell me/내 이야기는/!결국', 'bounce|!버려지는/걸까',
  'tate|아무도/아무 말도/하지 않아도', 'stack|자꾸만 혼자/!너와 날/비교해', 'zoom|널 가능한 한/!나쁘게/생각한 뒤', 'tate|안도의/!한숨을/내쉬어',
  'stack|알아 나도,/진짜 별로지/!나', 'cam|몇 번이고/!고치려/해도', 'shout|!안 되더라',
  'shout|I\'m a/!sub character', 'zoom|우린/!안 비슷해', 'cam|부러워/!넌/어찌 그리/빛나는지', 'stack|모두/!널/좋아해', 'scatter|모두의/!인정받고',
  'shout|!행복해/보여', 'spiral|I\'m a/sub/!character', 'stack|Just/another/!loser', 'zoom|!열등감으로/찬', 'cam|Tell me/내가/!나쁜/맘일까', 'shout|I wanna/be/!you',
  'stack|!내 이야기는/결국', 'cam|I\'m a/!sub character', 'bounce|전혀/!안 중요해', 'tate|말해줘/누군가는/!아니라고', 'stack|알아,/더 이상/!의미 없단 걸',
  'zoom|!정해져/있었어', 'shout|!I don\'t care/그래도', 'shout|!패배자여도', 'bounce|!매달릴/순 있잖아', 'cam|Help me,/!내 손을/잡아 줘', 'stack|넌/!주인공이니까'];

// sections: page colour, ink, accent (emphasis), second accent (rings, outlines); act sets ME's weight
const PSECT = [
  { t: 15.0, name: 'VERSE 1', bg: IVORY, txt: NAVY, acc: CORAL, acc2: VIOLET, act: 1 },
  { t: 30.9, name: 'PRE-CHORUS', bg: NAVY, txt: IVORY, acc: ACID, acc2: CORAL, act: 1 },
  { t: 48.3, name: 'CHORUS 1', bg: VIOLET, txt: IVORY, acc: ACID, acc2: CORAL, act: 1 },
  { t: 82.0, name: 'VERSE 2', bg: NAVY, txt: IVORY, acc: CORAL, acc2: VIOLET, act: 2, noWipe: true },   // the interlude already hands over a navy page
  { t: 107.6, name: 'CORRECTION', bg: IVORY, txt: NAVY, acc: CORAL, acc2: VIOLET, act: 2 },
  { t: 115.1, name: 'CHORUS 2', bg: CORAL, txt: NAVY, acc: IVORY, acc2: VIOLET, act: 2 },
  { t: 137.4, name: 'BRIDGE', bg: NAVY, txt: IVORY, acc: CORAL, acc2: VIOLET, act: 2 },
  { t: 156.4, name: 'FINAL CHORUS', bg: VIOLET, txt: IVORY, acc: ACID, acc2: CORAL, act: 3 },
  { t: 179.0, name: 'OWN LINE', bg: NAVY, txt: IVORY, acc: ACID, acc2: CORAL, act: 3 },
  { t: 192.6, name: 'OWN LINE', bg: IVORY, txt: NAVY, acc: CORAL, acc2: VIOLET, act: 3 }];
const psecAt = t => { let k = 0; for (let j = 0; j < PSECT.length; j++) if (t >= PSECT[j].t) k = j; return k };
const ACT_W = [0, 640, 760, 860];

const LEAD = { pop: .04, slam: .03, far: .1, fly: .34, drop: .26, slide: .08, flip: .08 };
const ENT = { cam: u => u.emph ? 'slam' : 'pop', spiral: u => u.emph ? 'slam' : 'pop', stack: u => u.emph ? 'slam' : ['flip', 'pop', 'drop', 'pop'][u.ch % 4],
  zoom: u => u.emph ? 'slam' : 'far', scatter: () => 'fly', bounce: () => 'drop', tate: u => u.emph ? 'slam' : 'slide', shout: u => u.emph ? 'slam' : 'pop' };
const EXITK = { cam: 'cam', spiral: 'cam', stack: 'explode', zoom: 'zoom', scatter: 'explode', bounce: 'fall', tate: 'shutter', shout: 'explode' };
const isEN = c => /[A-Za-z'’,.!?]/.test(c) && !/[가-힣]/.test(c);
const spring = a => { const p = clamp(a / .35); return 1 + .35 * Math.exp(-6 * p) * Math.sin(p * 11) * (p < 1 ? 1 : 0) - (1 - eOut(p)) * 0 };

// ---------- geometry helpers for the cam layout (rotated boxes) ----------
const rotp = (x, y, d) => { const r = d * Math.PI / 180, c = Math.cos(r), s = Math.sin(r); return [x * c - y * s, x * s + y * c] };
const boxOf = P => ({ x0: Math.min(...P.map(p => p[0])), x1: Math.max(...P.map(p => p[0])), y0: Math.min(...P.map(p => p[1])), y1: Math.max(...P.map(p => p[1])) });
const boxU = (A, B) => A ? { x0: Math.min(A.x0, B.x0), x1: Math.max(A.x1, B.x1), y0: Math.min(A.y0, B.y0), y1: Math.max(A.y1, B.y1) } : B;
const boxRot = (B, d) => boxOf([[B.x0, B.y0], [B.x1, B.y0], [B.x0, B.y1], [B.x1, B.y1]].map(p => rotp(p[0], p[1], d)));

// ---------- scenes ----------
const SCN = [];
function unitW(c, emph, act) { font(isEN(c) ? 800 : (emph ? 900 : ACT_W[act]), 100, isEN(c) ? EN : KR); setTrack(0); return g.measureText(isEN(c) ? c.toUpperCase() : c).width / 100 }
function placeRow(c, f, cx, cy, rot) {
  const w = c.n * f; let x = -w / 2;
  c.us.forEach(u => { x += u.gap * f; const uw = u.wr * f, [rx, ry] = rotp(x + uw / 2, 0, rot); u.x = cx + rx; u.y = cy + ry; u.f = f; u.rot = rot; x += uw });
  Object.assign(c, { cx, cy, f, w, rot });
}
const LAYOUT = {
  cam(sc, spiral) {
    let B = null, th = 0;
    sc.chunks.forEach((c, k) => {
      if (k > 0 && (spiral || k % 2 === 1)) th += spiral ? -90 : (k % 4 === 1 ? -90 : 90);
      const Bp = B && boxRot(B, -th);
      let f = Bp ? clamp((Bp.x1 - Bp.x0) / c.n, 70, 300) : clamp(760 / c.n, 100, 230);
      if (Bp && c.emph) f = Math.min(f * 1.2, 340);
      const w = c.n * f, h = f * 1.12; let cxp = 0, cyp = 0;
      if (Bp) { cyp = Bp.y1 + f * .1 + h / 2; const al = c.emph ? 0 : (k % 2 ? -1 : 1); cxp = al < 0 ? Bp.x0 + w / 2 : al > 0 ? Bp.x1 - w / 2 : (Bp.x0 + Bp.x1) / 2 }
      const [cx, cy] = rotp(cxp, cyp, th); placeRow(c, f, cx, cy, th); c.th = th;
      B = boxU(B, boxOf([[-w / 2, -h / 2], [w / 2, -h / 2], [-w / 2, h / 2], [w / 2, h / 2]].map(p => rotp(p[0] + cxp, p[1] + cyp, th))));
      c.z = clamp(820 / w, Math.min(120, 900 / c.nc) / f, 250 / f);
    });
    sc.B = B;
  },
  rows(sc) {
    const MW = 920; let best = null;
    for (let f = 200; f >= 80; f -= 5) {
      const rows = []; let cur = [], cw = 0, split = false; const push = () => { if (cur.length) rows.push(cur); cur = []; cw = 0 };
      for (const c of sc.chunks) { const k = c.emph ? 1.2 : 1, w = c.n * f * k, sp = cur.length ? .3 * f : 0;
        if (cw + sp + w <= MW) { if (cur.length) cur.push([null, sp]); c.us.forEach(u => cur.push([u, f * k])); cw += sp + w } else if (w <= MW) { push(); c.us.forEach(u => cur.push([u, f * k])); cw = w }
        else { split = true; for (const u of c.us) { const uw = (u.wr + u.gap) * f * k; if (cw + uw > MW) push(); cur.push([u, f * k]); cw += uw } } }
      push(); best = rows; if (rows.length <= 3 && !split) break;
    }
    const rh = best.map(r => Math.max(...r.filter(([u]) => u).map(([, f]) => f)) * 1.2); let y = -rh.reduce((a, b) => a + b, 0) / 2;
    const wOf = ([u, f]) => u ? (u.wr + u.gap) * f : f;                           // a null entry is the space between chunks
    best.forEach((r, ri) => { const rw = r.reduce((a, e) => a + wOf(e), 0); let x = -rw / 2; const cy = y + rh[ri] / 2;
      r.forEach(([u, f]) => { if (!u) { x += f; return } x += u.gap * f; const w = u.wr * f; u.x = x + w / 2; u.y = cy; u.f = f; u.rot = 0; x += w }); y += rh[ri] });
  },
  stack(sc) {                         // poster stack: every row fills the same width; emphasis rows huge; odd rows outlined
    const Wd = 880, G = 16, rows = sc.chunks.map(c => ({ c, f: Math.max(60, Math.min(Wd / c.n, c.emph ? 300 : 220)) }));
    let tot = rows.reduce((a, r) => a + r.f * 1.12, 0) + G * (rows.length - 1);
    if (tot > 980) { const k = 980 / tot; rows.forEach(r => r.f *= k); tot = 980 }
    let y = -tot / 2;
    rows.forEach((r, k) => { const { c, f } = r, h = f * 1.12, w = c.n * f, j = (k + sc.i) % 5;
      placeRow(c, f, [-1, 1, 0, 1, -1][j] * (Wd - w) / 2, y + h / 2, [-3, 2.5, -2, 3, -1.5][j]); c.ol = !c.emph && k % 2 === 1; y += h + G });
  },
  zoom(sc) { sc.chunks.forEach((c, k) => placeRow(c, Math.min(900 / c.n, c.emph ? 330 : 270), 0, 0, (R(sc.i * 7 + k, 3) - .5) * 8)) },
  tate(sc) {                          // vertical writing, columns right to left
    const G = 26, cols = sc.chunks.map(c => ({ c, len: c.us.reduce((a, u) => a + 1 + u.gap, 0), f: Math.min(940 / c.us.length, c.emph ? 250 : 190) }));
    let Wd = cols.reduce((a, o) => a + o.f * 1.1, 0) + G * (cols.length - 1); if (Wd > 900) { const k = 900 / Wd; cols.forEach(o => o.f *= k); Wd = 900 }
    let x = Wd / 2;
    cols.forEach((o, k) => { const cw = o.f * 1.1, cx = x - cw / 2, hg = o.len * o.f; let y = -hg / 2 + (k % 2 ? 40 : -40) + o.f / 2;
      o.c.us.forEach(u => { y += u.gap * o.f; u.x = cx; u.y = y; u.f = o.f; u.rot = 0; u.vert = true; y += o.f }); o.c.cx = cx; o.c.cy = 0; x -= cw + G });
  },
  shout(sc) {                         // one giant word; the rest small above and below
    const Ec = sc.chunks.find(c => c.emph) || sc.chunks[0], fE = Math.min(940 / Ec.n, 380);
    placeRow(Ec, fE, 0, 20, 0); Ec.us.forEach(u => u.big = 1);
    let top = 20 - fE * .62, bot = 20 + fE * .62;
    for (let k = Ec.k - 1; k >= 0; k--) { const c = sc.chunks[k], f = Math.min(760 / c.n, 150), h = f * 1.2; top -= h; placeRow(c, f, 0, top + h / 2, -4); top -= 8 }
    for (let k = Ec.k + 1; k < sc.chunks.length; k++) { const c = sc.chunks[k], f = Math.min(760 / c.n, 150), h = f * 1.2; placeRow(c, f, 0, bot + h / 2, 3); bot += h + 8 }
  }};
const OUTS = { 27: 70.0, 81: 204.35 };                               // lines that must be gone before a non-lyric frame takes over
function outOfLine(i) { if (OUTS[i]) return OUTS[i]; const nx = Ln[i + 1]; if (!nx || nx.s - E(i) > 4) return E(i) + 1.3; return Math.min(nx.s - .06, E(i) + 1.8) }
function buildScene(i) {
  const [st, spec] = KSPEC[i].split('|'), C = chars(i), act = PSECT[psecAt(S(i))].act;
  let k = 0; const chunks = spec.split('/').map((raw, ci) => {
    const emph = raw.startsWith('!'), txt = raw.replace('!', '').replace(/ /g, ''), us = [];
    for (let j = 0; j < [...txt].length; j++, k++) { const G = C[k]; if (!G) break;
      us.push({ c: G.c, t: G.t, emph, ch: ci, k, gap: j > 0 && G.sp ? .28 : 0, wr: unitW(G.c, emph, act), r1: R(i * 31 + k, 1) * 2 - 1, fx: (R(i * 31 + k, 2) - .5) * 1600, fy: (R(i * 31 + k, 3) - .5) * 2000, spin: (R(i * 31 + k, 4) - .5) * 720,
        vx: (R(i * 31 + k, 5) - .5) * 2400, vy: -300 - R(i * 31 + k, 6) * 900, spin2: (R(i * 31 + k, 7) - .5) * 900, h0: 500 + R(i * 31 + k, 8) * 500 }) }
    return { k: ci, emph, us, n: us.reduce((a, u) => a + u.wr + u.gap, 0), nc: us.length, s: us[0] ? us[0].t : S(i) };
  });
  if (k !== C.length) console.warn(`[puretype] KSPEC L${i}: ${k} chars mapped, line has ${C.length}`);
  const sc = { i, st, chunks, units: chunks.flatMap(c => c.us), out: outOfLine(i), exit: EXITK[st], act };
  (st === 'cam' || st === 'spiral') ? LAYOUT.cam(sc, st === 'spiral') : (st === 'scatter' || st === 'bounce') ? LAYOUT.rows(sc) : LAYOUT[st](sc);
  sc.units.forEach(u => { u.ent = ENT[st](u); u.lead = LEAD[u.ent] });
  return sc;
}
const scene = i => SCN[i] || (SCN[i] = buildScene(i));

// ---------- camera for cam / spiral scenes: follow the newest chunk, turn so it reads upright ----------
function camAt(sc, t) {
  const C = sc.chunks; let k = 0; for (let j = 1; j < C.length; j++) if (t >= C[j].s - .08) k = j;
  const T = j => ({ x: C[j].cx, y: C[j].cy, a: -C[j].th, z: C[j].z }); let cam;
  if (k === 0) { const p = eOut(seg(t, C[0].s - .2, .6)), A = T(0); cam = { ...A, z: A.z * (2.2 - 1.2 * p), a: A.a + (1 - p) * (sc.i % 2 ? 20 : -20) } }
  else { const p = seg(t, C[k].s - .08, .34), A = T(k - 1), B = T(k), e = eIO(p); cam = { x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e), a: lerp(A.a, B.a, eBk(p, 1.2)), z: lerp(A.z, B.z, e) * (1 - .22 * Math.sin(Math.PI * p)) } }
  const last = C[C.length - 1], r0 = Math.max(last.s + .55, sc.out - 1);            // pull back to show the whole thing before leaving
  if (k === C.length - 1 && t > r0 && sc.out - r0 > .25) {
    const p = eIO(seg(t, r0, Math.min(.6, sc.out - r0))), B = sc.B, Bp = boxRot(B, cam.a), zo = Math.min(900 / (Bp.x1 - Bp.x0), 1000 / (Bp.y1 - Bp.y0));
    cam.x = lerp(cam.x, (B.x0 + B.x1) / 2, p); cam.y = lerp(cam.y, (B.y0 + B.y1) / 2, p); cam.z = lerp(cam.z, zo, p);
  }
  return cam;
}

// ---------- letters ----------
function entry(u, t) {
  const a = t - u.t + u.lead; if (a < 0) return null;
  const o = { dx: 0, dy: 0, ly: 0, dr: 0, sx: 1, sy: 1, op: 1 };
  switch (u.ent) {
    case 'pop': { const p = clamp(a / .35); o.sx = o.sy = eBk(p, 2.2); o.op = clamp(a / .05); o.dr = u.r1 * 28 * (1 - eOut(p)); o.ly = 60 * (1 - eOut(p)); break }
    case 'slam': { const p = clamp(a / .2); let s = 1 + (u.big ? 2.6 : 1.6) * (1 - eOut(p)); if (a > .2) s -= .14 * Math.sin(clamp((a - .2) / .22) * Math.PI);
      o.sx = o.sy = s; o.op = clamp(a / .04); o.dr = u.r1 * (u.big ? 30 : 14) * (1 - eOut(p)); break }
    case 'far': { const p = clamp(a / .4); o.sx = o.sy = .12 + .88 * eBk(p, 2); o.op = clamp(a / .1); o.dr = u.r1 * 20 * (1 - p); break }
    case 'fly': { const p = clamp(a / .52), e = eBk(p, 1.25); o.dx = u.fx * (1 - e); o.dy = u.fy * (1 - e); o.dr = u.spin * (1 - e); o.sx = o.sy = 1 + 1.4 * (1 - e); o.op = clamp(a / .1); break }
    case 'drop': { const p = clamp(a / .7); o.ly = -u.h0 * (1 - oBounce(p)); let q = 0; for (const [c, m] of [[.3636, .34], [.7273, .17], [.9091, .08]]) if (p >= c) q = Math.max(q, m * Math.exp(-(p - c) * 26));
      o.sy = 1 - q; o.sx = 1 + q * .9; o.ly += u.f * .55 * q; o.dr = u.r1 * 14 * (1 - p); o.op = clamp(a / .04); break }
    case 'slide': { const p = clamp(a / .32), e = eExp(p); o.ly = -320 * (1 - e); o.sy = 1 + .6 * (1 - e); o.op = clamp(a / .07); break }
    case 'flip': { const p = clamp(a / .42); o.sy = Math.max(.02, Math.cos((1 - eBk(p, 1.7)) * 1.9)); o.op = clamp(a / .08); break }
  }
  return o;
}
const oBounce = x => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + .75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + .9375; return n * (x -= 2.625 / d) * x + .984375 };
function exitFx(kind, out, u, t, o) {
  const x = t - out; if (x <= 0) return;
  if (kind === 'explode') { o.dx += u.vx * x; o.dy += u.vy * x + 1300 * x * x; o.dr += u.spin2 * x; o.op *= 1 - clamp((x - .2) / .3); o.sx *= 1 + x * .8; o.sy *= 1 + x * .8 }
  else if (kind === 'fall') { const y = Math.max(0, x - u.k * .018); o.dy += 1600 * y * y - 200 * y; o.dr += u.r1 * 300 * y; o.op *= 1 - clamp((y - .25) / .25) }
  else if (kind === 'shutter') { const p = clamp(x / .4); o.dy += (u.ch % 2 ? 1 : -1) * 1600 * eIn(p); o.op *= 1 - clamp((p - .6) / .4) }
}
function drawUnit(u, o, P, sc, ol) {
  const en = isEN(u.c), c = en ? u.c.toUpperCase() : u.c, w = en ? 800 : (u.emph ? 900 : ACT_W[sc.act]);
  g.save(); g.translate(u.x + o.dx, u.y + o.dy); g.rotate((u.rot + o.dr) * Math.PI / 180); g.translate(0, o.ly); g.scale(o.sx, o.sy);
  font(w, u.f, en ? EN : KR); setTrack(0); g.textAlign = 'center'; g.textBaseline = 'middle'; g.globalAlpha = clamp(o.op);
  const col = u.emph ? P.acc : P.txt;
  if (ol) { g.strokeStyle = col; g.lineWidth = Math.max(2, u.f * .03); g.lineJoin = 'round'; g.strokeText(c, 0, 0) } else { g.fillStyle = col; g.fillText(c, 0, 0) }
  g.restore(); g.globalAlpha = 1;
}

// ---------- one scene ----------
function renderScene(sc, t, P) {
  if (t < sc.units[0].t - .8 || t > sc.out + .7) return;
  const x = t - sc.out; let z, a, cx = 0, cy = 0, op = 1;
  if (sc.exit === 'cam') { const c = camAt(sc, t); z = c.z; a = c.a; cx = c.x; cy = c.y; if (x > 0) { const e = eIn(clamp(x / .42)); z *= 1 - .75 * e; a += 45 * e * (sc.i % 2 ? 1 : -1); op = 1 - e } }
  else { const pr = clamp((t - S(sc.i)) / Math.max(.6, sc.out - S(sc.i))); z = 1 + .07 * pr; if (sc.st === 'shout') z += .3 * (1 - eOut(seg(t, S(sc.i) - .1, .45))); a = (sc.i % 2 ? 1 : -1) * (1.5 - 3 * pr) }
  let ak = 0; sc.chunks.forEach((c, k) => { if (t >= c.s - .05) ak = k });
  g.save(); g.translate(CX, CY); g.scale(z, z); g.rotate(a * Math.PI / 180); g.translate(-cx, -cy); g.globalAlpha = op;
  // impacts: a ring and a burst of shapes when the emphasised chunk lands
  for (const c of sc.chunks) if (c.emph) {
    const ia = t - c.s; if (ia < 0 || ia > .9) continue; const ccx = c.cx ?? 0, ccy = c.cy ?? 0, p = ia / .9;
    ring(ccx, ccy, 80 + 1100 * eOut(p), 14 * (1 - p) + 1, P.acc2, (1 - p) * op);
    for (let j = 0; j < 12; j++) { const an = j / 12 * 6.28 + sc.i, d = 120 + 700 * eOut(p) * (.6 + .4 * R(j, sc.i)), s = (18 + 22 * R(j, sc.i + 3)) * (1 - p);
      g.save(); g.translate(ccx + Math.cos(an) * d, ccy + Math.sin(an) * d); g.rotate(an + p * 3); g.globalAlpha = (1 - p) * op; g.fillStyle = [P.acc, P.acc2, P.txt][j % 3];
      if (j % 3 === 0) g.fillRect(-s / 2, -s / 2, s, s); else if (j % 3 === 1) { g.beginPath(); g.moveTo(0, -s * .6); g.lineTo(s * .55, s * .45); g.lineTo(-s * .55, s * .45); g.fill() } else { g.beginPath(); g.arc(0, 0, s * .45, 0, 7); g.fill() }
      g.restore() }
  }
  // zoom scenes show one chunk at a time; the old one flies past the camera
  const zoomHide = (c, k) => { if (sc.st !== 'zoom') return { hide: false, s: 1, o: 1 }; const end = k < sc.chunks.length - 1 ? sc.chunks[k + 1].s - .04 : sc.out, y = t - end;
    if (y > .32) return { hide: true }; if (y > 0) { const p = clamp(y / .3); return { hide: false, s: 1 + 4.5 * eIn(p), o: 1 - p } } return { hide: false, s: 1 + .05 * Math.max(0, t - c.s), o: 1 } };
  sc.chunks.forEach((c, k) => {
    const zh = zoomHide(c, k); if (zh.hide) return;
    g.save(); if (zh.s !== 1) g.scale(zh.s, zh.s);
    for (const u of c.us) {
      const o = entry(u, t); if (!o) continue;
      if (t > u.t + .35) { const bp = pulse(t - u.k * .025), amp = u.ch === ak ? 24 : 10; o.ly -= amp * bp; if (u.ch === ak) { o.sy *= 1 + .08 * bp; o.sx *= 1 - .05 * bp } }   // the beat runs through the landed letters
      exitFx(sc.exit, sc.out, u, t, o); o.op *= zh.o * op;
      if (c.ol) { drawUnit(u, o, P, sc, true) } else drawUnit(u, o, P, sc, false);
    }
    g.restore();
  });
  g.restore(); g.globalAlpha = 1;
}

// ---------- the page behind the lines: colour, slow rays, a few drifting outline shapes ----------
const SHAPES = Array.from({ length: 16 }, (_, j) => ({ x: R(j, 11) * W, y: R(j, 12) * H, s: 30 + 60 * R(j, 13), k: j % 4, sp: 8 + 20 * R(j, 14), rot: R(j, 15) * 6 }));
function page(t) {
  const k = psecAt(t), P = PSECT[k], prev = PSECT[Math.max(0, k - 1)], wipe = eIn(seg(t, P.t, .45));
  const w0 = k > 0 && !P.noWipe && wipe < 1; fill(w0 ? prev.bg : P.bg); if (w0) disc(CX, CY, wipe * 1200, P.bg);
  g.save(); g.translate(CX, CY); g.rotate(t * .05); g.globalAlpha = .06; g.fillStyle = P.txt;
  for (let j = 0; j < 18; j++) { g.rotate(Math.PI / 9); g.beginPath(); g.moveTo(0, 0); g.lineTo(-40, -1500); g.lineTo(40, -1500); g.fill() }
  g.restore(); g.globalAlpha = 1;
  for (const s of SHAPES) {
    const y = ((s.y - t * s.sp) % (H + 200) + H + 200) % (H + 200) - 100; g.save(); g.translate(s.x, y); g.rotate(s.rot + t * .3); g.globalAlpha = .22; g.strokeStyle = [P.acc, P.acc2, P.txt, P.acc2][s.k]; g.lineWidth = 4;
    g.beginPath(); if (s.k === 0) g.arc(0, 0, s.s / 2, 0, 7); else if (s.k === 1) g.rect(-s.s / 2, -s.s / 2, s.s, s.s); else if (s.k === 2) { g.moveTo(0, -s.s / 2); g.lineTo(s.s / 2, s.s / 2); g.lineTo(-s.s / 2, s.s / 2); g.closePath() } else { g.moveTo(-s.s / 2, -s.s / 2); g.lineTo(s.s / 2, s.s / 2); g.moveTo(s.s / 2, -s.s / 2); g.lineTo(-s.s / 2, s.s / 2) }
    g.stroke(); g.restore();
  }
  g.globalAlpha = 1; return P;
}

// ---------- counter portal: at the end of "I wanna be you" / "Just another loser" the camera goes into the O ----------
function portal(t, i, col, t0, t1, fade = 0) {                      // a disc opens from the O's counter and becomes the whole page
  const sc = scene(i), O = sc.units.find(u => u.c.toUpperCase() === 'O' && u.emph); if (!O) return;
  const p = eIn(seg(t, t0, t1 - t0)); if (p <= 0) return;
  const a = fade ? 1 - seg(t, t1, fade) : 1; if (a <= 0) return;
  disc(CX + O.x * (1 - p), CY + O.y * (1 - p), 40 + p * p * 1500, col, a);
}

function PERFORM(t) {
  const P = page(t);
  for (let i = 0; i < KSPEC.length; i++) { const s0 = S(i); if (t < s0 - 1 || t > outOfLine(i) + .8) continue; renderScene(scene(i), t, PSECT[psecAt(s0)]) }
  if (t > 69 && t < 70.4) portal(t, 27, NAVY, 69.45, 70.35);                       // into the O of YOU -> the interlude
  if (t > 169 && t < 171) portal(t, 67, ACID, cT(67, 15) + .1, S(68) - .02, .35);    // into the O of LOSER -> a flash, then 열등감으로 찬
}
