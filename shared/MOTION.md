# MOTION.md — motion toolkit for kinetic typography

`shared/motion.js` holds the techniques of four motion tools, rewritten as pure functions of time.
- **GSAP**: eases, timeline, stagger, SplitText, MotionPath, DrawSVG and MorphSVG.
- **Remotion**: spring, interpolate, posterize and transition presentations.
- **Theatre.js**: keyframe tracks with bezier and hold curves.
- **camera-controls**: SmoothDamp, dolly, zoom, truck, orbit, fitToBox and lerpLookAt.

Every function answers "what is the value at time t". That keeps `renderAt(t)` deterministic, so `work/render.mjs` can render any frame in any order with any number of workers. That is also why the libraries themselves are not used: GSAP and Theatre run on a live clock and keep state between frames.

Load it with `<script src="../../shared/motion.js"></script>`. Everything is under `MO`, so it never clashes with a song's own helpers (`spr`, `lerp`, `eOut`, …).

The test card is `shared/motion_demo.html`:

```
node work/render.mjs --page shared/motion_demo.html --stills 1,4.2 --dir out/motion_demo
```

## 1. What each source teaches

| source | the idea worth keeping | in MO |
|---|---|---|
| GSAP eases | named curves with a direction: `power3.out`, `back.out(2)`, `elastic.out(1,.4)`, `steps(8)`, `rough`, `slow` (SlowMo), `expoScale`, CustomEase (bezier), CustomWiggle | `MO.ease(name)`, `MO.bezier`, `MO.wiggle` |
| GSAP timeline | place tweens relative to each other instead of hard-coding seconds: `'<'` (with the previous one), `'>'` (after it), `'<.2'`, `'+=.5'`, labels, `'label+=.3'`, yoyo and repeat | `MO.timeline().to(ch, {...}, pos)`, `.get(ch, t)` |
| GSAP stagger | a start offset per element from a distribution: `each` / `amount`, `from` start, center, edges, end, random or an index, `grid` ripples, `axis`, eased spacing | `MO.stagger(i, n, opts)` |
| GSAP SplitText | split into chars, words and lines; each piece rises from behind a mask (its own line box) | `MO.split`, `MO.maskReveal` |
| GSAP MotionPath / DrawSVG / MorphSVG | move along a curve at constant speed with autoRotate; reveal a stroke between two fractions; morph two outlines with matched points | `MO.path(...).at(u)`, `.draw`, `MO.drawStroke`, `MO.resample` + `MO.morph` |
| Remotion `spring()` | physical spring with mass, damping and stiffness (defaults 1 / 10 / 100), `overshootClamping`, `durationInFrames` stretch, `delay`, `reverse`, `measureSpring` | `MO.spring({t, ...})`, `MO.springStep`, `MO.springPath`, `MO.measureSpring` |
| Remotion `interpolate()` | map a time range onto values with one ease per segment; extrapolate `extend`, `clamp`, `identity` or `wrap`; `interpolateColors`; `posterize` (sample every n frames) | `MO.interpolate`, `MO.interpolateColors` (OKLab, so no muddy middle), `MO.posterize` |
| Remotion TransitionSeries | during a transition both scenes are drawn, and a presentation decides how. Presentations: fade, slide, wipe, flip, clockWipe, iris, cube, none. Timings: linear or spring | `MO.transition(ctx, p, kind, drawOut, drawIn)`, `MO.tProgress` |
| Theatre.js | a prop is a list of keyframes; each gap has its own curve (graph-editor bezier handles, or hold); several props make one object | `MO.track([[t, v, curve], ...])`, `MO.sheet({...})` |
| camera-controls | SmoothDamp, a critically damped follow with ω = 2 / smoothTime. **dolly** (moves the camera, depth layers parallax) is not **zoom** (lens, everything scales alike). truck and pedestal, focal offset, `fitToBox` with padding, `lerpLookAt` between two framings | `MO.damp`, `MO.smoothDamp`, `MO.cam`, `MO.project`, `MO.apply`, `MO.fitToBox`, `MO.lerpCam`, `MO.camPath`, `MO.shake` |

## 2. Recipes for lyric videos

### Syllable timing
Syllables in `lines.json` are the clock. Most of the recipes below start from the time of one sung syllable, `G.t`.

### Word entrances
- **Mask rise (the SplitText classic).** Use `maskReveal(..., { by: 'chars', stagger: { each: .03 }, ease: 'power4.out' })`. For lyrics, set each char's `t0` to its sung syllable instead of a fixed stagger:

  ```js
  p = MO.ease('power4.out')(clamp((t - G.t + .05) / .35))
  ```

  Then clip to the line box and offset y by `(1 - p) * lineHeight`.
- **Jelly pop.**
  - A single pop is `MO.spring({ t: t - G.t, damping: 8, stiffness: 180 })` on the scale.
  - A beat that must feel physical: set the scale y to the spring and the scale x to `1 + (1 - spring) * .3`, which keeps the volume.
- **Weight or width sweep:** `MO.interpolate(t, [G.t, G.t + .3], [200, 800], { easing: 'expo.out', extrapolate: 'clamp' })` into a variable-font `wght`.
- **Typewriter or stop motion:** `MO.posterize(t, 12)` for the whole scene ("on twos"), or `steps(n)` on a reveal.

### Groups of words
- **Chorus burst from the centre word:**

  ```js
  delay = MO.stagger(k, n, { each: .04, from: 'center' })
  ```
- **A grid of words or stickers rippling from a tapped point:**

  ```js
  MO.stagger(i, rows * cols, { grid: [rows, cols], from: [fx, fy], amount: .6 })
  ```
- **Random scatter that stays the same every render:** `{ from: 'random', seed: 3 }`.

### Choreographing a line with a timeline
Build a line's motions once, relative to each other, and anchor the whole thing on the sung time:

```js
const tl = MO.timeline({ defaults: { dur: .45, ease: 'back.out(1.8)' } })
  .to('box.w', { from: 0, to: 900 }, 0).to('text.y', { from: 60, to: 0 }, '<.1')
  .addLabel('hit', '>').to('dot.s', { from: 0, to: 1, ease: 'elastic.out(1,.35)' }, 'hit');
const v = ch => tl.get(ch, t - S(i));        // everything follows line i
```

Moving one tween then moves everything positioned after it with `'<'` or `'>'`, the way GSAP timelines behave.

### Hand-shaped curves
- Use a bezier handle as the ease. `[.2, .9, .3, 1.4]` overshoots, like a Theatre.js graph-editor handle pulled above 1.
- `'hold'` gives the stepped key: a jump at the next key. Use it for hard cuts inside a smooth move.
- A multi-prop object:

  ```js
  const logo = MO.sheet({ x: MO.track(...), s: MO.track(...), rot: MO.track(...) }); const L = logo(t);
  ```

### Camera
- **SmoothDamp framings (a one-take music video):** `MO.camPath(t, [[t0, framing0], [t1, framing1], ...], .6)`.
  - Every key is a new target, followed critically damped.
  - Zoom and dolly are damped in log space, so a 1→4 push feels even.
- **Frame a lyric block:**

  ```js
  MO.fitToBox({ x, y, w, h }, { top: 200, bottom: 400 }, 1080, 1920)
  ```

  It gives the camera that fits it. Blend two of those with `MO.lerpCam(a, b, u)`.
- **Dolly vs zoom:**
  - Dolly: `dist` 1000 → 500 doubles the plane and makes near layers (z > 0) grow faster. That is the parallax that sells depth.
  - Zoom: `zoom` 1 → 2 scales every layer alike. Use it for a flat "punch in".
- **Shallow orbit:** `az` (a few degrees) slides depth layers against each other, a fake 3D turn on a 2D canvas.
- **Handheld or impact:** `MO.shake(t, amount, freq, seed)` is smooth value noise, not per-frame random. Deterministic.

### Scene changes
Both scenes are drawn during the overlap:

```js
const p = MO.tProgress(t, t0, .6, { spring: { damping: 14 } });
MO.transition(g, p, 'iris', () => sceneA(t), () => sceneB(t), { cx: dotX, cy: dotY });
```

- An `iris` or `clockWipe` from the protagonist's position turns a transition into story (FEED: the coral dot opening the next page).
- `push` for pages, `flip` for a camera flip or card turn, `cube` for rooms, `zoom` for "through" moves.

### Lines, paths, morphs
- **A lyric riding a curve:** `const P = MO.path(points)`. Place each glyph at `P.at(u0 + k * spacing)` and rotate it by `.angle`.
- **Underline or handwriting on the sung syllables:** `P.draw(ctx, 0, progress)` or `MO.drawStroke`.
- **Shape to shape** (heart → dot, bubble → heart): `MO.morph(MO.resample(A, 64), MO.resample(B, 64), u)`.

### Colour
`MO.interpolateColors(t, [t0, t1, t2], [c0, c1, c2])` in OKLab. A coral → violet move stays bright instead of passing through grey.

## 3. Choosing a curve

| feel | ease or spring |
|---|---|
| calm and natural (default) | `power2.out` / `power3.out` |
| snappy UI | `expo.out`, `circ.out` |
| playful pop, jelly | `back.out(1.7–2.5)`, a spring with damping 8–12 |
| boing, a thing landing | `elastic.out(1, .3–.45)`, `bounce.out` |
| heavy, cinematic | `power4.inOut`, a spring with mass 2–3 |
| mechanical, glitch | `steps(n)`, `rough(1, 20)`, `posterize` |
| hold then rush | `slow(.7, .7)` (SlowMo), `expo.in` |
| constant zoom speed | `expoScale(1, 4)`, or `lerpCam`, which already works in log space |

## 4. Rules of thumb
- **Move on syllables, settle on beats.** Start motion at `G.t - .05` and give springs time to rest before the next line.
- **One lead motion per moment.** Stagger the rest behind it (`'<.1'`, `stagger.each` .02–.06).
- **Continuity over cuts.** Use a transition that grows out of something on screen (iris from the dot, wipe along a line), or `damp` the camera between framings.
- **Keep randomness seeded:** `MO.hash`, `stagger from 'random'`, `rough`, `shake`. Never `Math.random()` in `renderAt`.
