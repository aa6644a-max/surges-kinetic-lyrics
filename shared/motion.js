/* ============================================================================
   shared/motion.js — motion toolkit for deterministic kinetic typography
   Techniques learned from GSAP (eases, timeline, stagger, SplitText, MotionPath,
   DrawSVG), Remotion (spring, interpolate, posterize, transition presentations),
   Theatre.js (keyframe tracks with per-segment bezier / hold curves) and
   camera-controls (SmoothDamp, truck / dolly / zoom / orbit, fitToBox, lerpLookAt),
   rewritten as pure functions of time so that renderAt(t) stays deterministic.
   Everything lives under one global: MO. No dependencies. Usage notes: MOTION.md
   ========================================================================== */
(function (root) {
  'use strict';
  const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lerp = (a, b, x) => a + (b - a) * x;
  const hash = (i, s = 0) => { const x = Math.sin(i * 127.1 + s * 311.7 + .5) * 43758.5453; return x - Math.floor(x) };

  // ---------------------------------------------------------------- eases (GSAP names)
  // Every ease maps 0..1 -> 0..1 (overshooting ones leave the range). Built from an "in" curve;
  // .out and .inOut are derived exactly like GSAP does.
  const outOf = f => x => 1 - f(1 - x), inOutOf = f => x => x < .5 ? f(x * 2) / 2 : 1 - f((1 - x) * 2) / 2;
  const IN = {
    none: x => x, linear: x => x,
    power0: x => x, power1: x => x * x, power2: x => x ** 3, power3: x => x ** 4, power4: x => x ** 5,
    quad: x => x * x, cubic: x => x ** 3, quart: x => x ** 4, quint: x => x ** 5, strong: x => x ** 5,
    sine: x => 1 - Math.cos(x * Math.PI / 2),
    expo: x => x <= 0 ? 0 : 2 ** (10 * (x - 1)),
    circ: x => 1 - Math.sqrt(Math.max(0, 1 - x * x)),
  };
  const bounceOut = x => { const n = 7.5625, d = 2.75; if (x < 1 / d) return n * x * x; if (x < 2 / d) return n * (x -= 1.5 / d) * x + .75; if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + .9375; return n * (x -= 2.625 / d) * x + .984375 };
  const PARAM = {                                                     // eases that take arguments: name(args) -> "in" curve
    back: (s = 1.70158) => x => x * x * ((s + 1) * x - s),
    elastic: (amp = 1, period = .3) => { const a = Math.max(1, amp), s = period / (2 * Math.PI) * Math.asin(1 / a); return x => x <= 0 ? 0 : x >= 1 ? 1 : -(a * 2 ** (10 * (x - 1)) * Math.sin(((x - 1) - s) * 2 * Math.PI / period)) },
    bounce: () => x => 1 - bounceOut(1 - x),
  };
  // steps(n): discrete jumps (stop motion, typewriter). rough(strength, points, seed): deterministic jitter around linear.
  const steps = n => x => x >= 1 ? 1 : Math.floor(x * n) / n;
  const rough = (strength = 1, points = 20, seed = 0) => x => { if (x <= 0 || x >= 1) return clamp(x); const f = x * points, i = Math.floor(f), u = f - i, s = u * u * (3 - 2 * u);
    const j = k => k <= 0 || k >= points ? 0 : (hash(k, seed) - .5) * .12 * strength; return x + lerp(j(i), j(i + 1), s) };
  // slow(linearRatio, power, yoyo): fast - slow linear middle - fast (GSAP SlowMo). expoScale(a, b): exponential zoom feel for scale a->b.
  const slow = (lr = .7, pw = .7, yoyo = false) => { const p1 = (1 - lr) / 2, p3 = p1 + lr; return x => { const r = x + (.5 - x) * pw;
    if (x < p1) { const u = 1 - x / p1; return yoyo ? 1 - u * u : r - u ** 3 * r } if (x > p3) { const u = (x - p3) / p1; return yoyo ? (x === 1 ? 0 : 1 - u * u) : r + (x - r) * u ** 3 } return yoyo ? 1 : r } };
  const expoScale = (a, b, base = x => x) => x => (a * (b / a) ** base(x) - a) / (b - a);
  // wiggle(n, type): CustomWiggle. Returns an oscillation -1..1 (use as an offset multiplier, not a 0..1 progress).
  const wiggle = (n = 10, type = 'easeOut') => x => { const w = Math.sin(x * n * 2 * Math.PI); return type === 'uniform' ? w : type === 'easeInOut' ? w * Math.sin(x * Math.PI) : type === 'anticipate' ? w * (x < .15 ? x / .15 : 1) * (1 - x) : w * (1 - x) };
  // cubic bezier [x1,y1,x2,y2] like CSS / Theatre.js / CustomEase handles. Newton + bisection solve for t(x).
  const bezier = (x1, y1, x2, y2) => { const B = (a, b, t) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t * t + t ** 3, dB = (a, b, t) => 3 * a * (1 - t) ** 2 + 6 * (b - a) * (1 - t) * t + 3 * (1 - b) * t * t;
    return x => { if (x <= 0) return 0; if (x >= 1) return 1; let t = x; for (let k = 0; k < 6; k++) { const d = dB(x1, x2, t); if (Math.abs(d) < 1e-6) break; t -= (B(x1, x2, t) - x) / d } if (Math.abs(B(x1, x2, t) - x) > 1e-4) { let lo = 0, hi = 1; for (let k = 0; k < 30; k++) { t = (lo + hi) / 2; B(x1, x2, t) < x ? lo = t : hi = t } } return B(y1, y2, t) } };
  const CACHE = {};
  // ease('power3.out') / ease('back.inOut(2.5)') / ease('elastic.out(1, .4)') / ease('steps(8)') / ease([.2,.8,.2,1]) / ease(fn)
  function ease(e) {
    if (typeof e === 'function') return e; if (Array.isArray(e)) return bezier(...e); if (!e) return IN.power1 && outOf(IN.power1);
    if (CACHE[e]) return CACHE[e];
    const m = /^([a-zA-Z0-9]+)(?:\.(in|out|inOut))?(?:\(([^)]*)\))?$/.exec(e.replace(/\s/g, '')); if (!m) throw new Error('MO.ease: unknown ' + e);
    const [, name, dir = 'out', argS] = m, args = argS ? argS.split(',').map(Number) : [];
    let f;
    if (name === 'steps') return CACHE[e] = steps(args[0] || 1);
    if (name === 'rough') return CACHE[e] = rough(...args);
    if (name === 'slow') return CACHE[e] = slow(...args);
    if (name === 'bezier') return CACHE[e] = bezier(...args);
    if (IN[name]) f = IN[name]; else if (PARAM[name]) f = PARAM[name](...args); else throw new Error('MO.ease: unknown ' + e);
    if (name === 'bounce' && dir === 'out') return CACHE[e] = bounceOut;
    return CACHE[e] = dir === 'in' ? f : dir === 'out' ? outOf(f) : inOutOf(f);
  }

  // ---------------------------------------------------------------- interpolate (Remotion)
  // interpolate(x, [0, 1, 2], [0, 100, 40], { easing, extrapolateLeft/Right: 'extend' | 'clamp' | 'identity' | 'wrap' })
  // easing may be one ease for every segment or an array (one per segment, like Theatre.js per-keyframe curves).
  function interpolate(x, inR, outR, o = {}) {
    const n = inR.length, L = o.extrapolateLeft ?? o.extrapolate ?? 'extend', Rt = o.extrapolateRight ?? o.extrapolate ?? 'extend';
    if (n === 1) return outR[0];
    if (x < inR[0] || x > inR[n - 1]) { const side = x < inR[0] ? L : Rt;
      if (side === 'clamp') return x < inR[0] ? outR[0] : outR[n - 1];
      if (side === 'identity') return x;
      if (side === 'wrap') { const span = inR[n - 1] - inR[0]; x = inR[0] + (((x - inR[0]) % span) + span) % span } }
    let k = 0; while (k < n - 2 && x > inR[k + 1]) k++;
    const e = Array.isArray(o.easing) && typeof o.easing[0] !== 'number' ? o.easing[k] : o.easing, u = (x - inR[k]) / (inR[k + 1] - inR[k]);
    const inside = u >= 0 && u <= 1;
    return lerp(outR[k], outR[k + 1], inside && e ? ease(e)(u) : u);
  }
  // colours: '#rrggbb' or [r,g,b]. space 'oklab' (perceptual, no muddy middle) or 'rgb'.
  const hex = h => Array.isArray(h) ? h : [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const toLin = c => (c /= 255) <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4, toSrgb = c => 255 * (c <= .0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - .055);
  const oklab = ([r, g, b]) => { [r, g, b] = [r, g, b].map(toLin); const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b), m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b), s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
    return [.2104542553 * l + .793617785 * m - .0040720468 * s, 1.9779984951 * l - 2.428592205 * m + .4505937099 * s, .0259040371 * l + .7827717662 * m - .808675766 * s] };
  const unlab = ([L, a, b]) => { const l = (L + .3963377774 * a + .2158037573 * b) ** 3, m = (L - .1055613458 * a - .0638541728 * b) ** 3, s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
    return [4.0767416621 * l - 3.3077115913 * m + .2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s, -.0041960863 * l - .7034186147 * m + 1.707614701 * s].map(v => Math.round(clamp(toSrgb(clamp(v)), 0, 255))) };
  function mixColor(a, b, x, space = 'oklab') { const A = hex(a), B = hex(b); x = clamp(x);
    const c = space === 'rgb' ? A.map((v, i) => Math.round(lerp(v, B[i], x))) : unlab(oklab(A).map((v, i) => lerp(v, oklab(B)[i], x))); return `rgb(${c.join(',')})` }
  function interpolateColors(x, inR, cols, o = {}) { const n = inR.length; if (x <= inR[0]) return mixColor(cols[0], cols[0], 0, o.space); if (x >= inR[n - 1]) return mixColor(cols[n - 1], cols[n - 1], 0, o.space);
    let k = 0; while (x > inR[k + 1]) k++; const u = (x - inR[k]) / (inR[k + 1] - inR[k]); return mixColor(cols[k], cols[k + 1], o.easing ? ease(o.easing)(u) : u, o.space) }
  // posterize(t, fps): hold time on a coarser grid ("on twos" stop-motion feel: posterize(t, 12))
  const posterize = (t, fps) => Math.floor(t * fps + 1e-6) / fps;

  // ---------------------------------------------------------------- spring (Remotion physics, closed form)
  // Exact solution of m x'' + c x' + k (x - to) = 0 from rest at `from`. Remotion defaults: mass 1, damping 10, stiffness 100.
  // Time is seconds (Remotion uses frames; divide their `delay` by fps). duration: stretch so it settles at `duration`.
  function springStep(tau, { mass = 1, damping = 10, stiffness = 100, velocity = 0 } = {}) {
    if (tau <= 0) return 0;
    const w0 = Math.sqrt(stiffness / mass), z = damping / (2 * Math.sqrt(stiffness * mass)), v = -velocity;   // x(0) = -1 (distance still to go), x'(0) = v
    let x;
    if (z < 1) { const wd = w0 * Math.sqrt(1 - z * z); x = Math.exp(-z * w0 * tau) * (-Math.cos(wd * tau) + (v - z * w0) / wd * Math.sin(wd * tau)) }
    else if (z === 1) x = Math.exp(-w0 * tau) * (-1 + (v - w0) * tau);
    else { const r = w0 * Math.sqrt(z * z - 1), a = -z * w0 + r, b = -z * w0 - r, B = (v + a) / (b - a), A = -1 - B; x = A * Math.exp(a * tau) + B * Math.exp(b * tau) }
    return 1 + x;
  }
  function measureSpring(cfg = {}, threshold = .005) { for (let t = 0; t < 30; t += 1 / 240) { let ok = true; for (let u = t; u < t + .5; u += 1 / 60) if (Math.abs(springStep(u, cfg) - 1) > threshold) { ok = false; break } if (ok) return t } return 30 }
  // spring({ t, from, to, delay, mass, damping, stiffness, overshootClamping, duration, reverse })
  function spring(o) {
    const cfg = { mass: o.mass, damping: o.damping, stiffness: o.stiffness };
    let tau = o.t - (o.delay || 0); if (o.duration) tau *= measureSpring(cfg) / o.duration;
    let p = springStep(tau, cfg); if (o.overshootClamping) p = Math.min(p, 1); if (o.reverse) p = 1 - p;
    return lerp(o.from ?? 0, o.to ?? 1, p);
  }
  // springPath(t, [[t0, v0], [t1, v1, cfg?], ...]): chain of retargets; each new target adds a spring step on top of the
  // previous motion (the jelly "keep the momentum" feel, same idea as the FEED engine's spr()).
  function springPath(t, keys) { let v = keys[0][1]; for (let k = 1; k < keys.length; k++) { const [tk, vk, cfg] = keys[k]; v += (vk - keys[k - 1][1]) * springStep(t - tk, cfg || {}) } return v }

  // ---------------------------------------------------------------- SmoothDamp (camera-controls)
  // camera-controls eases every transition with SmoothDamp: a critically damped follow, omega = 2 / smoothTime.
  // Stateless form: a path of targets [[t, value], ...]; each change is followed with the critically damped step.
  const dampStep = (tau, smoothTime = .25) => { if (tau <= 0) return 0; const w = 2 / smoothTime; return 1 - (1 + w * tau) * Math.exp(-w * tau) };
  function damp(t, keys, smoothTime = .25) { let v = keys[0][1]; for (let k = 1; k < keys.length; k++) v += (keys[k][1] - keys[k - 1][1]) * dampStep(t - keys[k][0], keys[k][2] ?? smoothTime); return v }
  // stateful SmoothDamp (Unity/camera-controls formula) for frame loops that own their state: returns [value, velocity]
  function smoothDamp(cur, target, vel, smoothTime, dt, maxSpeed = Infinity) {
    smoothTime = Math.max(1e-4, smoothTime); const w = 2 / smoothTime, x = w * dt, e = 1 / (1 + x + .48 * x * x + .235 * x * x * x);
    let ch = cur - target; const maxC = maxSpeed * smoothTime; ch = clamp(ch, -maxC, maxC); const tgt = cur - ch, tmp = (vel + w * ch) * dt;
    vel = (vel - w * tmp) * e; let out = tgt + (ch + tmp) * e; if ((target - cur > 0) === (out > target)) { out = target; vel = (out - target) / dt } return [out, vel] }

  // ---------------------------------------------------------------- keyframe tracks (Theatre.js)
  // track([[t, value, curve], ...]); curve = how to leave this key: an ease name, a bezier [x1,y1,x2,y2] (graph-editor
  // handles), 'hold' (stepped: jump at the next key) or omitted (linear). Values may be numbers or arrays (vectors).
  function track(keys) {
    const lerpV = (a, b, u) => Array.isArray(a) ? a.map((v, i) => lerp(v, b[i], u)) : lerp(a, b, u);
    const f = t => { if (t <= keys[0][0]) return keys[0][1]; const n = keys.length; if (t >= keys[n - 1][0]) return keys[n - 1][1];
      let k = 0; while (t >= keys[k + 1][0]) k++; const [t0, v0, c] = keys[k], [t1, v1] = keys[k + 1];
      if (c === 'hold') return v0; const u = (t - t0) / (t1 - t0); return lerpV(v0, v1, c ? ease(c)(u) : u) };
    f.keys = keys; return f;
  }
  // sheet({ name: track, ... }) -> t => { name: value } (a Theatre "object" with several props)
  const sheet = props => t => Object.fromEntries(Object.entries(props).map(([k, tr]) => [k, tr(t)]));

  // ---------------------------------------------------------------- timeline (GSAP)
  // const tl = MO.timeline({ defaults: { dur: .6, ease: 'power3.out' } })
  //   .to('title.y', { from: 200, to: 0 }, 1.2).to('title.a', { to: 1, dur: .3 }, '<').addLabel('drop', '+=.2')
  //   .to('dot.x', { to: 800, ease: 'back.out(2)' }, 'drop+=.1');
  // tl.get('title.y', t)  — value of a channel at time t (tweens on one channel chain: each starts from the last value).
  // Position: number | '<' (start of previous) | '>' (end of previous) | '<.2' '>-.1' | '+=.5' '-=.3' (from timeline end) |
  //           'label' | 'label+=1' | 'label-=.5'. stagger: tl.to(['a','b','c'], {..., stagger: {each|amount, from, ease}}, pos)
  function timeline(opt = {}) {
    const D = Object.assign({ dur: .5, ease: 'power1.out' }, opt.defaults), ch = {}, labels = {}; let end = 0, prevS = 0, prevE = 0;
    const resolve = pos => { if (pos == null) return end; if (typeof pos === 'number') return pos; pos = String(pos).replace(/\s/g, '');
      let m; if ((m = /^([<>])(-?[\d.]+)?$/.exec(pos))) return (m[1] === '<' ? prevS : prevE) + (+m[2] || 0);
      if ((m = /^([+-])=([\d.]+)$/.exec(pos))) return end + (m[1] === '+' ? 1 : -1) * +m[2];
      if ((m = /^([a-zA-Z_][\w]*)(?:([+-])=([\d.]+))?$/.exec(pos))) { const b = labels[m[1]] ?? (labels[m[1]] = end); return b + (m[2] ? (m[2] === '+' ? 1 : -1) * +m[3] : 0) }
      throw new Error('MO.timeline: bad position ' + pos) };
    const api = {
      to(names, v, pos) { const list = Array.isArray(names) ? names : [names], t0 = resolve(pos), dur = v.dur ?? D.dur, e = v.ease ?? D.ease;
        let last = t0;
        list.forEach((name, i) => { const s = t0 + (v.stagger ? stagger(i, list.length, v.stagger) : 0), c = ch[name] || (ch[name] = []);
          c.push({ s, e: s + dur, from: v.from, to: v.to, ease: ease(e), yoyo: v.yoyo, repeat: v.repeat || 0 }); c.sort((a, b) => a.s - b.s); last = Math.max(last, s + dur) });
        prevS = t0; prevE = last; end = Math.max(end, last); return api },
      set(name, value, pos) { return api.to(name, { to: value, from: value, dur: 0 }, pos) },
      addLabel(name, pos) { labels[name] = resolve(pos); return api },
      label: name => labels[name], duration: () => end, channels: () => Object.keys(ch),
      get(name, t, fallback = 0) { const c = ch[name]; if (!c) return fallback; let v = c[0].from ?? fallback;
        for (const w of c) { const from = w.from ?? v; if (t < w.s) break; const len = w.e - w.s;
          if (len <= 0) { v = w.to; continue } let u = (t - w.s) / len, cyc = Math.floor(u);
          if (cyc > w.repeat) { u = 1; cyc = w.repeat } else u -= cyc; if (w.yoyo && cyc % 2) u = 1 - u;
          if (t >= w.e + len * w.repeat) u = w.yoyo && w.repeat % 2 ? 0 : 1; v = lerp(from, w.to, w.ease(clamp(u))) } return v },
    }; return api;
  }

  // ---------------------------------------------------------------- stagger (GSAP)
  // stagger(i, n, { each | amount, from: 'start'|'center'|'edges'|'end'|'random'|index|[fx, fy], grid: [rows, cols], axis: 'x'|'y', ease, seed })
  // Returns the start delay of element i. With a grid, delays follow the distance from the origin cell (ripples, diagonals).
  function stagger(i, n, o = {}) {
    if (typeof o === 'number') return i * o;
    let d, max;
    if (o.from === 'random') { d = hash(i, o.seed || 7); max = 1 }
    else if (o.grid) { const [rows, cols] = o.grid, r = Math.floor(i / cols), c = i % cols;
      const [oc, orr] = Array.isArray(o.from) ? [o.from[0] * (cols - 1), o.from[1] * (rows - 1)] : o.from === 'center' ? [(cols - 1) / 2, (rows - 1) / 2] : o.from === 'end' ? [cols - 1, rows - 1] : typeof o.from === 'number' ? [o.from % cols, Math.floor(o.from / cols)] : [0, 0];
      const dx = c - oc, dy = r - orr; d = o.axis === 'x' ? Math.abs(dx) : o.axis === 'y' ? Math.abs(dy) : Math.hypot(dx, dy);
      max = Math.max(...[[0, 0], [cols - 1, 0], [0, rows - 1], [cols - 1, rows - 1]].map(([x, y]) => o.axis === 'x' ? Math.abs(x - oc) : o.axis === 'y' ? Math.abs(y - orr) : Math.hypot(x - oc, y - orr))) }
    else { const f = o.from ?? 'start', o0 = f === 'center' ? (n - 1) / 2 : f === 'end' ? n - 1 : typeof f === 'number' ? f : 0;
      d = f === 'edges' ? (n - 1) / 2 - Math.abs(i - (n - 1) / 2) : Math.abs(i - o0); max = f === 'edges' ? (n - 1) / 2 : Math.max(o0, n - 1 - o0) }
    max = max || 1; const p = o.ease ? ease(o.ease)(d / max) * max : d;
    return o.amount != null ? p / max * o.amount : p * (o.each ?? .1);
  }

  // ---------------------------------------------------------------- text split + mask reveal (SplitText)
  // split(ctx, text, font, { maxWidth, lineHeight, tracking }) -> { chars: [{c, x, y, w, word, line}], words, lines, width, height }
  // (set ctx.font once; x is the left edge of the glyph from the block's left, y the baseline).
  function split(ctx, text, font, o = {}) {
    ctx.font = font; const tr = o.tracking || 0, lh = o.lineHeight || 1.2 * parseFloat(/(\d+(?:\.\d+)?)px/.exec(font)[1]), max = o.maxWidth || Infinity;
    const words = text.split(/\s+/).filter(Boolean), sp = ctx.measureText(' ').width, lines = [[]]; let x = 0;
    words.forEach(w => { const ww = ctx.measureText(w).width + tr * w.length; if (x > 0 && x + ww > max) { lines.push([]); x = 0 } lines[lines.length - 1].push(w); x += ww + sp });
    const chars = [], wordsOut = [], linesOut = []; let wi = 0;
    lines.forEach((L, li) => { let cx = 0; const y = li * lh, ls = chars.length;
      L.forEach(w => { const ws = chars.length; for (const c of w) { const cw = ctx.measureText(c).width; chars.push({ c, x: cx, y, w: cw, word: wi, line: li }); cx += cw + tr } wordsOut.push({ text: w, from: ws, to: chars.length, line: li, x: chars[ws].x, w: cx - tr - chars[ws].x }); wi++; cx += sp });
      linesOut.push({ from: ls, to: chars.length, y, w: cx - sp - tr }) });
    return { chars, words: wordsOut, lines: linesOut, width: Math.max(...linesOut.map(l => l.w)), height: lines.length * lh, lineHeight: lh };
  }
  // maskReveal(ctx, s, x, y, t, { t0, by: 'chars'|'words'|'lines', stagger, dur, ease, dir: 'up'|'down', fill, align })
  // The SplitText + mask recipe: each piece rises from behind the edge of its own line box (clipped), staggered.
  function maskReveal(ctx, s, x, y, t, o = {}) {
    const by = o.by || 'chars', units = by === 'lines' ? s.lines.map(l => ({ from: l.from, to: l.to, line: s.lines.indexOf(l) })) : by === 'words' ? s.words : s.chars.map((c, i) => ({ from: i, to: i + 1, line: c.line }));
    const e = ease(o.ease || 'power4.out'), dur = o.dur || .6, lh = s.lineHeight, dir = o.dir === 'down' ? -1 : 1;
    const ax = o.align === 'center' ? -s.width / 2 : o.align === 'right' ? -s.width : 0;
    ctx.save(); ctx.fillStyle = o.fill || '#fff'; ctx.textBaseline = 'alphabetic';
    units.forEach((u, i) => { const p = e(clamp((t - (o.t0 || 0) - stagger(i, units.length, o.stagger ?? .03)) / dur)); if (p <= 0) return;
      const L = s.lines[u.line]; ctx.save(); ctx.beginPath(); ctx.rect(x + ax - 20, y + L.y - lh * .82, s.width + 40, lh); ctx.clip();
      for (let k = u.from; k < u.to; k++) { const c = s.chars[k]; ctx.fillText(c.c, x + ax + c.x, y + c.y + (1 - p) * lh * dir) } ctx.restore() });
    ctx.restore();
  }

  // ---------------------------------------------------------------- motion path, draw, morph (MotionPath / DrawSVG / MorphSVG)
  // path(points, { closed, tension }) -> { at(u) -> {x, y, angle}, length, draw(ctx, from, to) }: Catmull-Rom through the
  // points, sampled by arc length so u moves at constant speed; angle = tangent (autoRotate).
  function path(pts, o = {}) {
    const n = pts.length, tn = o.tension ?? .5, P = i => o.closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)], segs = o.closed ? n : n - 1;
    const cr = (i, u) => { const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2), m1 = [(p2[0] - p0[0]) * tn, (p2[1] - p0[1]) * tn], m2 = [(p3[0] - p1[0]) * tn, (p3[1] - p1[1]) * tn];
      const u2 = u * u, u3 = u2 * u, h1 = 2 * u3 - 3 * u2 + 1, h2 = u3 - 2 * u2 + u, h3 = -2 * u3 + 3 * u2, h4 = u3 - u2; return [h1 * p1[0] + h2 * m1[0] + h3 * p2[0] + h4 * m2[0], h1 * p1[1] + h2 * m1[1] + h3 * p2[1] + h4 * m2[1]] };
    const S = [], N = 40; let len = 0, prev = cr(0, 0); S.push([0, prev]);
    for (let i = 0; i < segs; i++) for (let k = 1; k <= N; k++) { const q = cr(i, k / N); len += Math.hypot(q[0] - prev[0], q[1] - prev[1]); S.push([len, q]); prev = q }
    const at = u => { const d = clamp(u) * len; let lo = 0, hi = S.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; S[m][0] < d ? lo = m : hi = m }
      const [d0, a] = S[lo], [d1, b] = S[hi], f = d1 > d0 ? (d - d0) / (d1 - d0) : 0; return { x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), angle: Math.atan2(b[1] - a[1], b[0] - a[0]) } };
    const draw = (ctx, from = 0, to = 1) => { ctx.beginPath(); const k0 = Math.floor(clamp(from) * (S.length - 1)), k1 = Math.ceil(clamp(to) * (S.length - 1)); const a = at(from); ctx.moveTo(a.x, a.y);
      for (let k = k0 + 1; k < k1; k++) ctx.lineTo(S[k][1][0], S[k][1][1]); const b = at(to); ctx.lineTo(b.x, b.y) };
    return { at, length: len, draw };
  }
  // drawStroke(ctx, path2DOrFn, length, from, to): DrawSVG on canvas — reveal a stroke between two fractions with a dash pattern.
  function drawStroke(ctx, p, length, from, to) { ctx.save(); ctx.setLineDash([Math.max(0, (to - from) * length), length * 2]); ctx.lineDashOffset = -from * length; if (typeof p === 'function') { p(); ctx.stroke() } else ctx.stroke(p); ctx.restore() }
  // resample(points, n) + morph(a, b, u): MorphSVG-style shape morph between two closed outlines with the same point count.
  function resample(pts, n) { const pp = path(pts.concat([pts[0]]), { tension: 0 }); return Array.from({ length: n }, (_, i) => { const q = pp.at(i / n); return [q.x, q.y] }) }
  const morph = (a, b, u) => a.map((p, i) => [lerp(p[0], b[i][0], u), lerp(p[1], b[i][1], u)]);
  const shape = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath() };

  // ---------------------------------------------------------------- 2.5D camera (camera-controls, for canvas)
  // A camera state: { x, y (the point looked at, world units), dist (dolly: distance to the z = 0 plane), zoom (lens),
  // rot (roll, radians), az (azimuth: yaw of a shallow orbit, radians), ox, oy (focal offset in screen px) }.
  // Layers sit at depth z (0 = the plane, + toward the camera, - behind). project() gives screen position and scale, so
  // dolly creates parallax between layers while zoom only scales (the difference camera-controls makes between them).
  const CAM0 = { x: 0, y: 0, dist: 1000, zoom: 1, rot: 0, az: 0, ox: 0, oy: 0 };
  const cam = s => Object.assign({}, CAM0, s);
  function project(c, wx, wy, z = 0, W = 1080, H = 1920) {
    c = cam(c); const d = Math.max(1, c.dist - z), f = c.dist / d * c.zoom;                  // perspective factor: 1 on the plane at zoom 1
    let dx = (wx - c.x) - Math.sin(c.az) * z, dy = wy - c.y; dx *= Math.cos(c.az) || 1e-3;      // orbit: shallow yaw shifts depth layers sideways
    const cs = Math.cos(c.rot), sn = Math.sin(c.rot), rx = dx * cs - dy * sn, ry = dx * sn + dy * cs;
    return { x: W / 2 + c.ox + rx * f, y: H / 2 + c.oy + ry * f, s: f, visible: d > 1 };
  }
  // apply(ctx, cam, z): set the canvas transform so drawing in world coordinates at depth z appears through the camera.
  function apply(ctx, c, z = 0, W = 1080, H = 1920) { const p = project(c, 0, 0, z, W, H), cc = cam(c); ctx.translate(p.x, p.y); ctx.rotate(cc.rot); ctx.scale(p.s * (Math.cos(cc.az) || 1e-3), p.s) }
  // fitToBox(box {x, y, w, h}, pad {top, right, bottom, left}, W, H, { cover }) -> camera that frames the box (contain or cover)
  function fitToBox(b, pad = {}, W = 1080, H = 1920, o = {}) { const pt = pad.top || 0, pr = pad.right || 0, pb = pad.bottom || 0, pl = pad.left || 0;
    const sx = (W - pl - pr) / b.w, sy = (H - pt - pb) / b.h, zoom = o.cover ? Math.max(sx, sy) : Math.min(sx, sy);
    return cam({ x: b.x + b.w / 2, y: b.y + b.h / 2, zoom, ox: (pl - pr) / 2, oy: (pt - pb) / 2, dist: o.dist || CAM0.dist }) }
  // lerpCam(a, b, u): lerpLookAt — interpolate two framings. zoom and dist are blended in log space (a constant-feeling push).
  function lerpCam(a, b, u) { a = cam(a); b = cam(b); const o = {}; for (const k in a) o[k] = k === 'zoom' || k === 'dist' ? a[k] * (b[k] / a[k]) ** u : lerp(a[k], b[k], u); return o }
  // camPath(t, [[t, camState], ...], smoothTime): camera moves as SmoothDamp transitions between framings
  function camPath(t, keys, smoothTime = .6) { const o = {}; for (const k in cam(keys[0][1])) { o[k] = k === 'zoom' || k === 'dist' ? Math.exp(damp(t, keys.map(([tk, c, st]) => [tk, Math.log(cam(c)[k]), st]), smoothTime)) : damp(t, keys.map(([tk, c, st]) => [tk, cam(c)[k], st]), smoothTime) } return o }
  // shake(t, amount, freq, seed): deterministic handheld / impact shake as {x, y, rot} (smooth noise, not random per frame)
  function shake(t, amount = 10, freq = 7, seed = 0) { const n = (s) => { const f = t * freq, i = Math.floor(f), u = f - i, w = u * u * (3 - 2 * u); return lerp(hash(i, seed + s) * 2 - 1, hash(i + 1, seed + s) * 2 - 1, w) }; return { x: n(1) * amount, y: n(2) * amount, rot: n(3) * amount * .002 } }

  // ---------------------------------------------------------------- scene transitions (Remotion presentations)
  // transition(ctx, p, kind, drawOut, drawIn, { dir: 'from-left'|'from-right'|'from-top'|'from-bottom', W, H, cx, cy })
  // Both scenes are drawn while p goes 0 -> 1 (TransitionSeries overlap). drawOut / drawIn are () => void.
  // kinds: none, fade, slide, wipe, flip, clockWipe, iris, cube, push (slide + the old one pushed out), zoom (through).
  function transition(ctx, p, kind, drawOut, drawIn, o = {}) {
    const W = o.W || 1080, H = o.H || 1920, cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, dir = o.dir || 'from-right';
    const vx = dir === 'from-left' ? -1 : dir === 'from-right' ? 1 : 0, vy = dir === 'from-top' ? -1 : dir === 'from-bottom' ? 1 : 0;
    const clipDraw = (fn, clip) => { ctx.save(); ctx.beginPath(); clip(); ctx.clip(); fn(); ctx.restore() };
    if (p <= 0) return drawOut(); if (p >= 1) return drawIn();
    switch (kind) {
      case 'none': return (p < .5 ? drawOut : drawIn)();
      case 'fade': drawOut(); ctx.save(); ctx.globalAlpha = p; drawIn(); ctx.restore(); return;
      case 'slide': drawOut(); ctx.save(); ctx.translate(vx * W * (1 - p), vy * H * (1 - p)); drawIn(); ctx.restore(); return;
      case 'push': ctx.save(); ctx.translate(-vx * W * p, -vy * H * p); drawOut(); ctx.restore(); ctx.save(); ctx.translate(vx * W * (1 - p), vy * H * (1 - p)); drawIn(); ctx.restore(); return;
      case 'wipe': drawOut(); return clipDraw(drawIn, () => vx ? ctx.rect(vx > 0 ? W * (1 - p) : 0, 0, W * p, H) : ctx.rect(0, vy > 0 ? H * (1 - p) : 0, W, H * p));
      case 'clockWipe': drawOut(); return clipDraw(drawIn, () => { const r = Math.hypot(W, H); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + p * 2 * Math.PI); ctx.closePath() });
      case 'iris': drawOut(); return clipDraw(drawIn, () => ctx.arc(cx, cy, p * Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)), 0, 2 * Math.PI));
      case 'flip': { const a = p * Math.PI, s = Math.abs(Math.cos(a)); ctx.save(); ctx.translate(cx, cy); ctx.scale(Math.max(.001, s), 1 + .08 * Math.sin(a)); ctx.translate(-cx, -cy); (p < .5 ? drawOut : drawIn)(); ctx.restore(); return }
      case 'cube': { const L = vx >= 0; ctx.save(); ctx.translate(L ? 0 : W * p, 0); ctx.scale(1 - p, 1); drawOut(); ctx.fillStyle = `rgba(0,0,0,${.5 * p})`; ctx.fillRect(0, 0, W, H); ctx.restore();   // two faces of a box turning
        ctx.save(); ctx.translate(L ? W * (1 - p) : 0, 0); ctx.scale(p, 1); drawIn(); ctx.fillStyle = `rgba(0,0,0,${.5 * (1 - p)})`; ctx.fillRect(0, 0, W, H); ctx.restore(); return }
      case 'zoom': { ctx.save(); ctx.translate(cx, cy); ctx.scale(1 + p * 3, 1 + p * 3); ctx.translate(-cx, -cy); ctx.globalAlpha = 1 - p; drawOut(); ctx.restore();
        ctx.save(); ctx.translate(cx, cy); ctx.scale(.6 + .4 * p, .6 + .4 * p); ctx.translate(-cx, -cy); ctx.globalAlpha = p; drawIn(); ctx.restore(); return }
    }
    throw new Error('MO.transition: unknown ' + kind);
  }
  // timing for a transition window [t0, t0 + dur]: 'linear', any ease name, or { spring: cfg } (springTiming)
  const tProgress = (t, t0, dur, timing = 'linear') => { const u = clamp((t - t0) / dur); if (timing && timing.spring) return clamp(springStep(u * measureSpring(timing.spring), timing.spring), 0, 1.2); return timing === 'linear' ? u : ease(timing)(u) };

  root.MO = { clamp, lerp, hash, ease, bezier, steps, rough, slow, expoScale, wiggle, interpolate, interpolateColors, mixColor, posterize,
    springStep, spring, springPath, measureSpring, dampStep, damp, smoothDamp, track, sheet, timeline, stagger,
    split, maskReveal, path, drawStroke, resample, morph, shape, cam, project, apply, fitToBox, lerpCam, camPath, shake, transition, tProgress };
})(typeof window !== 'undefined' ? window : globalThis);
