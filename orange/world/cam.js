/* ORANGE camera: framings in world coordinates, eased with SmoothDamp (MO.camPath: x, y, roll linear; zoom in log space),
   applied as roll + zoom around the frame centre. Fast moves (whips, dives) get motion blur from sub-frames in main.js. */
// keys: [t, x, y, zoom, roll, smoothTime]
const camKeys = K => K.map(([t, x, y, z, r, st]) => [t, { x, y, zoom: z, rot: r ?? 0 }, st]);
function camAt(t, K) { return MO.camPath(t, K, .4) }
function applyCam(c) { g.translate(CX, CY); g.rotate(-c.rot); g.scale(c.zoom, c.zoom); g.translate(-c.x, -c.y) }
// follow keys: sample a target framing every dt seconds (for following the ball)
function followKeys(t0, t1, fn, dt = .1, st = .25) { const K = []; for (let t = t0; t <= t1 + 1e-6; t += dt) { const c = fn(t); K.push([t, c.x, c.y, c.z, c.r, st]) } return K }
// how fast the picture moves, in px per frame: pan × zoom, zoom change, roll (for the motion-blur sub-frame count)
function camSpeed(c0, c1) { return Math.hypot(c1.x - c0.x, c1.y - c0.y) * c1.zoom + Math.abs(Math.log(c1.zoom / c0.zoom)) * 1100 + Math.abs(c1.rot - c0.rot) * 1100 }
