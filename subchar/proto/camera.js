/* Sub character v4 prototype: the camera.
   One continuous state (x, y, s, r) with velocity. A target path is built from keys that depart on the beat, and the
   camera chases it with a damped spring on every channel (scale in log space). The spring gives the acceleration,
   the lag, the small overshoot and the settle. It is simulated once, at a fixed step, over the whole range and then
   sampled by time, so renderAt(t) returns the same frame for the same t in any order. */
const BEAT = 60 / 123.5, B0 = .205;
const qb = t => B0 + Math.round((t - B0) / BEAT) * BEAT;            // snap a time to the nearest beat
const clamp = (x, a = 0, b = 1) => x < a ? a : x > b ? b : x, lerp = (a, b, x) => a + (b - a) * x;
const eIO = x => x < .5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2, eOut = x => 1 - (1 - x) ** 3, eIn = x => x * x * x;
const eSm = x => x * x * (3 - 2 * x), eBk = (x, c = 1.2) => { x = clamp(x) - 1; return 1 + (c + 1) * x * x * x + c * x * x };
// ease-in-out that passes the destination by ~3% and comes back: the spring turns it into a soft overshoot + settle
const eOS = x => eIO(x) + .032 * Math.sin(Math.PI * clamp((x - .5) / .5)) ** 2 * (x < 1 ? 1 : 0);
const R = (i, s = 0) => { const x = Math.sin(i * 127.1 + s * 311.7 + .5) * 43758.5453; return x - Math.floor(x) };

const CAM = { x: 0, y: 0, s: 1, r: 0, vx: 0, vy: 0 };                // the state used by the renderer (r in degrees)
const CAMERA = { keys: [], buf: null, t0: 0, HZ: 120, W: 6.2, Z: .8 };

// key: {at, dur, to:{x,y,s,r} | fn:t=>({x,y,s,r}), ease, name, w, z}
// The target at time t is the chain of keys blended in order: a finished key contributes its full destination.
function camTarget(t) {
  const K = CAMERA.keys; let cur = K[0].to, name = K[0].name, key = K[0];
  for (let k = 1; k < K.length; k++) {
    const q = K[k]; if (t < q.at) break;
    const dst = q.fn ? q.fn(t) : q.to, p = (q.ease || (q.fn ? eIO : eOS))(clamp((t - q.at) / q.dur));
    cur = { x: lerp(cur.x, dst.x, p), y: lerp(cur.y, dst.y, p), s: Math.exp(lerp(Math.log(cur.s), Math.log(dst.s), p)), r: lerp(cur.r, dst.r, p) };
    name = q.name; key = q;
  }
  return { ...cur, name, key };
}

function camBuild(t0, t1) {
  const dt = 1 / 720, per = 720 / CAMERA.HZ, start = t0 - 1.5, n = Math.ceil((t1 + 1 - start) * CAMERA.HZ) + 2;
  const tg = camTarget(start), x = [tg.x, tg.y, Math.log(tg.s), tg.r], v = [0, 0, 0, 0];
  const buf = new Float32Array(n * 6); let t = start;
  for (let i = 0; i < n; i++) {
    buf.set([x[0], x[1], x[2], x[3], v[0], v[1]], i * 6);
    for (let k = 0; k < per; k++) {
      const T = camTarget(t), w = T.key.w || CAMERA.W, z = T.key.z || CAMERA.Z, dst = [T.x, T.y, Math.log(T.s), T.r];
      for (let c = 0; c < 4; c++) { v[c] += (w * w * (dst[c] - x[c]) - 2 * z * w * v[c]) * dt; x[c] += v[c] * dt }
      t += dt;
    }
  }
  CAMERA.buf = buf; CAMERA.t0 = start;
}

function camAt(t) {
  const f = clamp((t - CAMERA.t0) * CAMERA.HZ, 0, CAMERA.buf.length / 6 - 1.001), i = Math.floor(f), a = f - i, B = CAMERA.buf, o = i * 6;
  const g = c => lerp(B[o + c], B[o + 6 + c], a);
  CAM.x = g(0); CAM.y = g(1); CAM.s = Math.exp(g(2)); CAM.r = g(3); CAM.vx = g(4); CAM.vy = g(5);
  return CAM;
}
