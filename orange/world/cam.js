/* ORANGE camera: framings in world coordinates, eased with SmoothDamp (MO.camPath: x, y, roll, tilt linear; zoom in log
   space), applied as tilt + roll + zoom around the frame centre. Tilt foreshortens the floor (the replay orbit sees the court
   at an angle). Fast moves (whips, dives) get motion blur from sub-frames in main.js. */
// keys: [t, x, y, zoom, roll, smoothTime, tilt]
const camKeys = K => K.map(([t, x, y, z, r, st, tl]) => [t, { x, y, zoom: z, rot: r ?? 0, tilt: tl ?? 0 }, st]);
function camAt(t, K) { return MO.camPath(t, K, .4) }
function applyCam(c) { g.translate(CX, CY); if (c.tilt) g.scale(1, Math.cos(c.tilt)); g.rotate(-c.rot); g.scale(c.zoom, c.zoom); g.translate(-c.x, -c.y) }
// where a world point lands on the screen (for screen-space effects aimed at something in the world)
function toScreen(c, x, y) { const dx = (x - c.x) * c.zoom, dy = (y - c.y) * c.zoom, cs = Math.cos(-c.rot), sn = Math.sin(-c.rot); return [CX + dx * cs - dy * sn, CY + (dx * sn + dy * cs) * Math.cos(c.tilt || 0)] }
// follow keys: sample a target framing every dt seconds (for following the ball)
function followKeys(t0, t1, fn, dt = .1, st = .25) { const K = []; for (let t = t0; t <= t1 + 1e-6; t += dt) { const c = fn(t); K.push([t, c.x, c.y, c.z, c.r, st]) } return K }
// how fast the picture moves, in px per frame: pan × zoom, zoom change, roll, tilt (for the motion-blur sub-frame count)
function camSpeed(c0, c1) { return Math.hypot(c1.x - c0.x, c1.y - c0.y) * c1.zoom + Math.abs(Math.log(c1.zoom / c0.zoom)) * 1100 + Math.abs(c1.rot - c0.rot) * 1100 + Math.abs((c1.tilt || 0) - (c0.tilt || 0)) * 1100 }
// the part of the world in view (a circle around the camera), so far-away objects can be skipped
let VIEW = null;
const vis = (x, y, r) => !VIEW || Math.hypot(x - VIEW.x, y - VIEW.y) < VIEW.r + r;
