/* ORANGE graphics: the ball, the court (top-down and in perspective), the net, gym lights, the scoreboard,
   hand silhouettes, anime impact effects, team lettering and the Korean subtitle. All pure functions of t. */

// ---------------------------------------------------------------- impacts: shake, flash, impact frame, speed lines
const HITS = [];                                           // [t, amount] — registered by the acts; shake decays after each hit
function shakeAt(t) { let x = 0, y = 0, r = 0;
  for (const [t0, a] of HITS) { const d = t - t0; if (d < 0 || d > .6) continue; const k = a * Math.exp(-d * 8), s = MO.shake(t, 1, 26, t0 * 13); x += s.x * k; y += s.y * k; r += s.rot * k * .6 }
  return { x, y, r } }
function flash(t, t0, col = WH, d = .14, a = .9) { if (t < t0) return; const k = 1 - seg(t, t0, d); if (k > 0) rect(-40, -40, W + 80, H + 80, col, a * k) }
// anime impact frame: two frames of inverted colour on the hit
function impactFrame(t, t0, d = .066) { if (t < t0 || t >= t0 + d) return; g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'difference'; g.fillStyle = '#fff'; g.fillRect(0, 0, W, H); g.restore() }
// radial speed lines closing in on a point (focus lines)
function focusLines(t, cx, cy, o = {}) { const n = o.n ?? 70, col = o.col ?? WH, a = o.a ?? .85, r0 = o.r0 ?? 260;
  g.save(); g.fillStyle = col; for (let k = 0; k < n; k++) { const an = R(k, 1) * 6.2832, ph = (t * (o.speed ?? 5) + R(k, 4)) % 1, r = r0 + (1 - ph) * 500, len = 700 + R(k, 2) * 900, wd = 3 + R(k, 3) * 14;
    g.globalAlpha = a * Math.sin(ph * Math.PI); g.save(); g.translate(cx + Math.cos(an) * r, cy + Math.sin(an) * r); g.rotate(an); g.beginPath(); g.moveTo(0, -wd / 2); g.lineTo(len, 0); g.lineTo(0, wd / 2); g.fill(); g.restore() }
  g.restore() }
// parallel streaks along an angle (the direction of travel)
function streaks(t, ang, o = {}) { const n = o.n ?? 40, col = o.col ?? WH, a = o.a ?? .6, sp = o.speed ?? 2400;
  g.save(); g.translate(CX, CY); g.rotate(ang); g.fillStyle = col;
  for (let k = 0; k < n; k++) { const y = (R(k, 5) - .5) * 2600, len = 300 + R(k, 6) * 900, x = ((R(k, 7) * 4000 + t * sp * (.6 + R(k, 8) * .8)) % 4000) - 2000, th = 2 + R(k, 9) * 7;
    g.globalAlpha = a * (.4 + .6 * R(k, 10)); g.fillRect(x - len, y - th / 2, len, th) }
  g.restore() }

// ---------------------------------------------------------------- the ball
// ball(x, y, r, rot, { sq: squash along travel, ang: travel angle, alpha })
function ball(x, y, r, rot = 0, o = {}) {
  if (r <= .5) return;
  g.save(); g.globalAlpha = o.alpha ?? 1; g.translate(x, y);
  if (o.sq) { g.rotate(o.ang || 0); g.scale(1 + o.sq, 1 - o.sq * .8); g.rotate(-(o.ang || 0)) }
  g.rotate(rot);
  g.beginPath(); g.arc(0, 0, r, 0, 7); g.fillStyle = WH; g.fill(); g.save(); g.clip();
  for (const [c, a] of [[OR, 0], [NAVY, 2.094], [OR, 4.189]]) { g.save(); g.rotate(a); g.fillStyle = c; g.beginPath();
    g.moveTo(-r * 1.3, -r * .12); g.bezierCurveTo(-r * .45, -r * .72, r * .45, -r * .72, r * 1.3, -r * .12); g.lineTo(r * 1.3, -r * .5); g.bezierCurveTo(r * .45, -r * 1.12, -r * .45, -r * 1.12, -r * 1.3, -r * .5); g.closePath(); g.fill(); g.restore() }
  const gr = g.createRadialGradient(-r * .38, -r * .42, r * .08, 0, 0, r * 1.05); gr.addColorStop(0, 'rgba(255,255,255,.45)'); gr.addColorStop(.55, 'rgba(255,255,255,0)'); gr.addColorStop(1, 'rgba(0,0,0,.38)');
  g.rotate(-rot); g.fillStyle = gr; g.fillRect(-r, -r, 2 * r, 2 * r); g.restore();
  g.lineWidth = Math.max(2, r * .07); g.strokeStyle = BK; g.beginPath(); g.arc(0, 0, r, 0, 7); g.stroke();
  g.restore();
}
// motion-smeared ball: ghosts along where it was (pos: t -> [x, y])
function ballTrail(t, pos, r, o = {}) { const n = o.n ?? 6, dt = o.dt ?? .018;
  for (let k = n; k >= 1; k--) { const [x, y] = pos(t - k * dt); disc(x, y, r * (1 - k * .06), o.col ?? OR, (o.a ?? .22) * (1 - k / (n + 1))) }
  const [x, y] = pos(t), [px, py] = pos(t - .02), sp = Math.hypot(x - px, y - py) / .02;
  ball(x, y, r, o.rot ?? t * 9, { sq: Math.min(.28, sp / 9000), ang: Math.atan2(y - py, x - px) }) }

// ---------------------------------------------------------------- the court, top down (portrait: net across the middle)
// court(cx, cy, s, { p: lines drawn 0..1, floor, net }) — 9 m x 18 m, s px per metre
function courtTop(cx, cy, s, o = {}) {
  const hw = 4.5 * s, hl = 9 * s, p = o.p ?? 1, lw = Math.max(3, s * .08);
  if (o.floor !== false) { rect(cx - hw - 2.5 * s, cy - hl - 3 * s, 2 * hw + 5 * s, 2 * hl + 6 * s, AMB2, o.floorA ?? 1); rect(cx - hw, cy - hl, 2 * hw, 2 * hl, AMB, o.floorA ?? 1);
    g.save(); g.globalAlpha = .12 * (o.floorA ?? 1); g.fillStyle = BK; for (let k = -12; k <= 12; k++) g.fillRect(cx + k * s * .75, cy - hl - 3 * s, 2, 2 * hl + 6 * s); g.restore() }
  g.save(); g.strokeStyle = o.lineCol ?? WH; g.lineWidth = lw; g.lineCap = 'square';
  const L = (x0, y0, x1, y1, a, b) => { const q = clamp((p - a) / (b - a)); if (q <= 0) return; g.beginPath(); g.moveTo(x0, y0); g.lineTo(lerp(x0, x1, q), lerp(y0, y1, q)); g.stroke() };
  L(cx - hw, cy + hl, cx + hw, cy + hl, 0, .25); L(cx + hw, cy + hl, cx + hw, cy - hl, .1, .5); L(cx + hw, cy - hl, cx - hw, cy - hl, .3, .6); L(cx - hw, cy - hl, cx - hw, cy + hl, .4, .8);
  L(cx - hw, cy + 3 * s, cx + hw, cy + 3 * s, .6, .85); L(cx + hw, cy - 3 * s, cx - hw, cy - 3 * s, .65, .9);
  g.restore();
  if (o.net !== false) netTop(cx, cy, hw + .9 * s, s, clamp((p - .75) / .25), o.netWob || 0);
}
// the net seen from above: a band across the court with posts; wob bends it after a hit
function netTop(cx, cy, hw, s, a = 1, wob = 0) { if (a <= 0) return;
  g.save(); g.globalAlpha = a; g.strokeStyle = WH; g.lineWidth = Math.max(4, s * .12);
  g.beginPath(); for (let k = 0; k <= 40; k++) { const x = cx - hw + 2 * hw * k / 40, y = cy + wob * Math.sin(k / 40 * Math.PI) * 30; k ? g.lineTo(x, y) : g.moveTo(x, y) } g.stroke();
  disc(cx - hw, cy, s * .22, WH, a); disc(cx + hw, cy, s * .22, WH, a); g.restore() }

// ---------------------------------------------------------------- the gym in perspective (behind our baseline, looking at the net)
// world: x across (-4.5..4.5 court), z from the camera's baseline forward (0..18, net at 9), y up (metres)
const GYM = { hor: 820, f: 1500, camH: 1.7, z0: 3.2 };
const pj = (x, y, z, c = GYM) => { const d = Math.max(.2, z + c.z0); return [CX + x * c.f / d, c.hor + (c.camH - y) * c.f / d] };
function gymPersp(t, lit, o = {}) {
  const c = Object.assign({}, GYM, o.cam || {}), P = (x, y, z) => pj(x, y, z, c);
  // floor: the free zone and the court, planks running away from us
  const quad = (pts, col, a = 1) => { g.globalAlpha = a; g.fillStyle = col; g.beginPath(); pts.forEach(([x, y, z], k) => { const [X, Y] = P(x, y, z); k ? g.lineTo(X, Y) : g.moveTo(X, Y) }); g.closePath(); g.fill(); g.globalAlpha = 1 };
  quad([[-40, 0, -2], [40, 0, -2], [40, 0, 60], [-40, 0, 60]], AMB2, lit);
  quad([[-4.5, 0, 0], [4.5, 0, 0], [4.5, 0, 18], [-4.5, 0, 18]], AMB, lit);
  g.save(); g.globalAlpha = .13 * lit; g.strokeStyle = BK; g.lineWidth = 2; for (let k = -30; k <= 30; k++) { const [a, b] = P(k * .6, 0, -2), [c2, d] = P(k * .6, 0, 60); g.beginPath(); g.moveTo(a, b); g.lineTo(c2, d); g.stroke() } g.restore();
  // lines
  g.save(); g.globalAlpha = lit; g.strokeStyle = WH; g.lineWidth = 6; const seg3 = (a, b) => { const [x0, y0] = P(...a), [x1, y1] = P(...b); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke() };
  seg3([-4.5, 0, 0], [4.5, 0, 0]); seg3([-4.5, 0, 0], [-4.5, 0, 18]); seg3([4.5, 0, 0], [4.5, 0, 18]); seg3([-4.5, 0, 6], [4.5, 0, 6]); seg3([-4.5, 0, 12], [4.5, 0, 12]); seg3([-4.5, 0, 18], [4.5, 0, 18]); g.restore();
  // the net at z = 9: posts, the tape at 2.43 m, the mesh
  const nz = 9, top = 2.43, bot = 1.43;
  g.save(); g.globalAlpha = Math.max(.25, lit);
  for (const x of [-5.3, 5.3]) { const [a, b] = P(x, 0, nz), [, d] = P(x, top + .3, nz); rect(a - 7, d, 14, b - d, '#2A2B33') }
  const [lx, ty] = P(-5.3, top, nz), [rx] = P(5.3, top, nz), [, by] = P(0, bot, nz);
  g.strokeStyle = 'rgba(255,246,236,.35)'; g.lineWidth = 1.5; for (let x = lx; x <= rx; x += 14) { g.beginPath(); g.moveTo(x, ty); g.lineTo(x, by); g.stroke() } for (let y = ty; y <= by; y += 14) { g.beginPath(); g.moveTo(lx, y); g.lineTo(rx, y); g.stroke() }
  rect(lx, ty - 6, rx - lx, 12, WH); rect(lx, by - 3, rx - lx, 6, WH, .8); g.restore();
}
// ceiling lights: banks of lamps that switch on; on[k] 0..1
function gymLights(t, on, c = GYM) {
  for (let row = 0; row < on.length; row++) { const z = 1 + row * 3.4, a = on[row]; if (a <= 0) continue;
    for (let k = -2; k <= 2; k++) { const [x, y] = pj(k * 3.2, 11, z, c), r = 1100 / (z + c.z0);
      const gr = g.createRadialGradient(x, y, 0, x, y, r * 2.4); gr.addColorStop(0, `rgba(255,236,200,${.55 * a})`); gr.addColorStop(1, 'rgba(255,236,200,0)'); g.fillStyle = gr; g.fillRect(x - r * 2.4, y - r * 2.4, r * 4.8, r * 4.8);
      g.globalAlpha = a; g.fillStyle = '#FFF4DA'; g.beginPath(); g.ellipse(x, y, r * .55, r * .2, 0, 0, 7); g.fill(); g.globalAlpha = 1 } }
}

// ---------------------------------------------------------------- scoreboard flip cards
function flipCard(x, y, w, h, from, to, t0, t, o = {}) {
  const p = clamp((t - t0) / (o.dur ?? .28)), bg = o.bg ?? '#1B1C24', col = o.col ?? WH, size = h * .78;
  const face = (d, clipTop, sy) => { g.save(); g.beginPath(); g.rect(x - w / 2, clipTop ? y - h / 2 : y, w, h / 2); g.clip(); g.translate(x, y); g.scale(1, sy); g.fillStyle = bg; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 12); g.fill();
    txt(String(d), 0, size * .36, { size, fam: EN, col, al: 'center', upper: false }); g.restore() };
  face(to, true, 1); face(from, false, 1);
  if (p < .5) face(from, true, Math.max(.001, 1 - p * 2)); else face(to, false, Math.max(.001, (p - .5) * 2));
  rect(x - w / 2, y - 2, w, 4, BK, .8);
}

// ---------------------------------------------------------------- hands (flat silhouettes, no one in particular)
// hand(x, y, s, rot, pose: 'open' | 'fist' | 'cup', { col, line })
function hand(x, y, s, rot = 0, pose = 'open', o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); const col = o.col ?? BK, ln = o.line ?? WH;
  const shape = () => { g.beginPath(); g.roundRect(-38, 150, 76, 420, 30);                 // forearm
    g.roundRect(-58, -30, 116, 190, 46);                                                    // palm
    if (pose === 'fist') { for (let k = 0; k < 4; k++) g.roundRect(-58 + k * 29, -70, 30, 70, 14); g.roundRect(-92, 10, 70, 32, 16) }
    else { const sp = pose === 'cup' ? .05 : .16; [[-42, 118], [-14, 140], [14, 132], [40, 108]].forEach(([fx, len], k) => { g.save(); g.translate(fx, -10); g.rotate((k - 1.5) * sp); g.roundRect(-13, -len, 26, len + 20, 13); g.restore() });
      g.save(); g.translate(-52, 70); g.rotate(-.9 + (pose === 'cup' ? .4 : 0)); g.roundRect(-14, -100, 28, 110, 14); g.restore() } };
  g.save(); shape(); g.lineWidth = 16 / s * s; g.strokeStyle = ln; g.lineJoin = 'round'; g.stroke(); g.fillStyle = col; g.fill(); g.restore();
  rect(-46, 380, 92, 26, OR); g.restore();                                                  // a wristband in team orange
}

// ---------------------------------------------------------------- team lettering
// the Japanese lyric type: heavy gothic, condensed and slanted a little like team lettering on a jersey
const COND = .84, SLANT = .17;
function lettering(x, y, fn) { g.save(); g.translate(x, y); g.transform(COND, 0, -SLANT * COND, 1, 0, 0); fn(); g.restore() }
// a line of lyric chars a..b, revealed on the sung syllables, with optional outline echoes above/below
function jline(t, i, a, b, x, y, size, o = {}) {
  lettering(x, y, () => { if (o.echo) for (const d of [-1, 1]) lyr(t, i, a, b, 0, d * size * 1.02, { size, fam: JP, col: o.echoCol ?? WH, outline: true, lw: 2, al: o.al ?? 'center', alpha: .32 * (o.alpha ?? 1), rev: 'fade', hide: o.hide, dur: .3 });
    if (o.shadow !== false) lyr(t, i, a, b, 10, 12, { size, fam: JP, col: o.shadowCol ?? BK, al: o.al ?? 'center', alpha: .55 * (o.alpha ?? 1), rev: o.rev ?? 'drop', hide: o.hide, dur: o.dur });
    lyr(t, i, a, b, 0, 0, { size, fam: JP, col: o.col ?? WH, outline: o.outline, lw: o.lw ?? 4, al: o.al ?? 'center', alpha: o.alpha, rev: o.rev ?? 'drop', hide: o.hide, dur: o.dur, fx: o.fx }) });
}

// ---------------------------------------------------------------- the ball writes the lyric
// A phrase is laid on an arc (a hit): chars sit at even spacing along it; the ball passes each char exactly when it is sung
// and the char pops out behind it. kind: 'serve' (long, low), 'receive' (short, high), 'set' (high, hangs), 'spike' (straight, steep)
function arcPt(a, u) { const x = lerp(a.p0[0], a.p1[0], u), y = lerp(a.p0[1], a.p1[1], u) - 4 * (a.h || 0) * u * (1 - u); return [x, y] }
function arcAng(a, u) { const [x0, y0] = arcPt(a, Math.max(0, u - .01)), [x1, y1] = arcPt(a, Math.min(1, u + .01)); return Math.atan2(y1 - y0, x1 - x0) }
// where the ball is on arc `a` of line i, chars [ca, cb): time → u, piecewise through the sung times
function arcU(t, i, a) { const C = chars(i), n = a.cb - a.ca; if (n <= 1) return clamp((t - C[a.ca].t) / .3);
  const ts = []; for (let k = a.ca; k < a.cb; k++) ts.push(C[k].t); const t0 = ts[0] - (a.lead ?? .22), t1 = ts[n - 1] + (a.tail ?? .3);
  if (t <= ts[0]) return clamp((t - t0) / (ts[0] - t0)) * (.5 / n);
  if (t >= ts[n - 1]) return (n - .5) / n + clamp((t - ts[n - 1]) / (t1 - ts[n - 1])) * (.5 / n);
  let k = 0; while (t > ts[k + 1]) k++; return (k + .5 + (t - ts[k]) / (ts[k + 1] - ts[k])) / n }
function writeArc(t, i, a, o = {}) {
  const C = chars(i), n = a.cb - a.ca, size = a.size ?? 118, hide = a.hide ?? 1e9, out = 1 - eIn(seg(t, hide, .35));
  if (out <= 0) return;
  for (let k = 0; k < n; k++) { const G = C[a.ca + k], u = (k + .5) / n, [x, y] = arcPt(a, u), p = seg(t, G.t - .04, .22); if (p <= 0) continue;
    const ang = arcAng(a, u) * (a.tilt ?? .35), pop = MO.springStep(t - G.t + .04, { damping: 9, stiffness: 260 });
    g.save(); g.translate(x, y); g.rotate(ang); g.transform(COND, 0, -SLANT * COND, 1, 0, 0); g.scale(pop * out, pop * out); g.globalAlpha = out;
    font(400, size, JP); setTrack(0); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = BK; g.globalAlpha = .5 * out; g.fillText(G.c, 8, 10); g.globalAlpha = out;
    if (a.outline) { g.lineWidth = 4; g.strokeStyle = a.col ?? WH; g.strokeText(G.c, 0, 0) } else { g.fillStyle = typeof a.col === 'function' ? a.col(k, t) : (a.col ?? WH); g.fillText(G.c, 0, 0) }
    g.restore() }
  const tIn = C[a.ca].t - (a.lead ?? .22), tOut = C[a.cb - 1].t + (a.tail ?? .3);
  if (o.ball !== false && t >= tIn && t < tOut) ballTrail(t, tt => arcPt(a, clamp(arcU(Math.max(tt, tIn), i, a))), a.ballR ?? 46)
}

// ---------------------------------------------------------------- Korean subtitle (always readable, bottom)
function subtitle(t) {
  let li = -1; for (let i = 0; i < Ln.length; i++) if (t >= S(i) - .12) li = i; if (li < 0) return;
  const nxt = li + 1 < Ln.length ? S(li + 1) - .15 : 1e9, end = Math.min(nxt, E(li) + 1.4); if (t > end) return;
  const a = seg(t, S(li) - .12, .2) * (1 - seg(t, end - .2, .2)); if (a <= 0) return;
  const s = Ln[li].ko; font(600, 40, KR); setTrack(0); const w = g.measureText(s).width;
  g.globalAlpha = .55 * a; g.fillStyle = BK; g.beginPath(); g.roundRect(CX - w / 2 - 28, 1760, w + 56, 70, 35); g.fill();
  txt(s, CX, 1808, { size: 40, w: 600, col: WH, al: 'center', alpha: a });
}

// a drop under gravity from y0 (at t0) that lands on y1 at tLand
function fall(t, t0, tLand, y0, y1) { if (t <= t0) return y0; if (t >= tLand) return y1; const p = (t - t0) / (tLand - t0); return lerp(y0, y1, p * p) }

// ---------------------------------------------------------------- painted plates (orange/plates/<id>.webp) and prop cut-outs
const PL = {}, PLATES = ['gym_lit', 'gym_dark', 'court_top', 'gym_sunset', 'sky_horizon', 'sky_up', 'sky_orange', 'gym_ceiling', 'net_close', 'floor_close', 'stands', 'arena_teal', 'board',
  'bench_orange', 'gym_after', 'locker', 'dawn', 'p_ball', 'p_orange', 'p_shoe', 'p_cloud_a', 'p_cloud_b', 'p_flare', 'p_dust'];
const loadPlates = () => Promise.all(PLATES.map(id => new Promise(r => { const im = new Image(); im.onload = () => { PL[id] = im; r() }; im.onerror = () => r(); im.src = `../plates/${id}.webp` })));
// plate(id, { zoom, fx, fy (focus 0..1), dx, dy, alpha, filter }): cover the frame; returns false when the plate is missing
function plate(id, o = {}) { const im = PL[id]; if (!im) return false;
  const s = Math.max(W / im.width, H / im.height) * (o.zoom ?? 1), w = im.width * s, h = im.height * s, fx = o.fx ?? .5, fy = o.fy ?? .5;
  const x = clamp(CX - w * fx, W - w, 0) + (o.dx || 0), y = clamp(CY - h * fy, H - h, 0) + (o.dy || 0);
  g.save(); g.globalAlpha = o.alpha ?? 1; if (o.filter) g.filter = o.filter; g.drawImage(im, x, y, w, h); g.restore(); return true }
// prop(id, x, y, width, rot, { alpha, add (additive light), filter })
function prop(id, x, y, w, rot = 0, o = {}) { const im = PL[id]; if (!im) return false; const h = w * im.height / im.width;
  g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = o.alpha ?? 1; if (o.filter) g.filter = o.filter; if (o.add) g.globalCompositeOperation = 'lighter'; g.drawImage(im, -w / 2, -h / 2, w, h); g.restore(); return true }
