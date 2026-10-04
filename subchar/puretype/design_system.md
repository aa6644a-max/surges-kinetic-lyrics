# Sub character: PURETYPE design system

**Concept:** a footnote gradually becomes the subject of the sentence.
- There are no characters, no photos and no illustrations.
- The type hierarchy itself is the story.
- The YOU / MAIN words start big, heavy and central; ME starts as a margin note, a footnote, something in parentheses.
- Over the song ME's type gains weight, size and position. At the end the two share one baseline and one weight.

## What was taken from the reference (IU "Blueming" kinetic typography)

Structure only:
- Typography is the protagonist.
- Every lyric gets one short, clear graphic idea.
- A shape turns into type, and type turns back into a shape, to carry one scene into the next (a circle grows into the next page, a colour block wipes).
- Long holds over wide empty space.
- A fixed, small palette.

Not taken: speech bubbles, the rose, its palette, its compositions, its specific transitions.

## Materials

Type, simple geometry (disc, ring, rectangle), line, solid colour. Nothing else.

## Palette (5 colours, fixed for the whole piece)

| name | hex | role |
|---|---|---|
| Midnight Navy | `#13152E` | night pages, main ink on light pages |
| Electric Violet | `#5A3CF0` | chorus pages |
| Coral Pink | `#FF6B6B` | ME's marks: footnote numbers, corrections, brackets, the final period |
| Warm Ivory | `#F4EDE1` | paper pages, main ink on dark pages |
| Acid Yellow | `#DCF23A` | a highlight for YOU (완벽해, 넌), and flash pages in the choruses |

## Type (2 families, local files in `subchar/fonts`, OFL)

- **Pretendard Variable:** all Korean.
- **Inter Tight Variable:** English, in capitals for labels (SUB CHARACTER, YOUNHA, EXTRA, MONTAGE). The English lyrics use the same grammar as the Korean.
- **Banned:** serif, script, handwriting, decorative faces, italics.
- **READY rule:** READY only resolves after both families measure differently from the fallback. Otherwise it holds with a console warning.

| role | weight | tracking | size (px, 1080 wide) |
|---|---|---|---|
| YOU / MAIN | 900 | −0.045em | 165–1400; crops and overscans are allowed |
| ME, act 1 (0–70 s) | 320 | +0.12em | 18–60 |
| ME, act 2 (70–157 s) | 560 (650 at CORRECTION / CHORUS 2) | +0.03em | 60–150 |
| ME, act 3 (157–214 s) | 820–900 | −0.03em | 110–300 |
| neutral lyric | 600–800 | −0.02em | as needed |
| label (Inter Tight) | 500–600 | +0.18–0.3em | 18–70 |
| big English (Inter Tight) | 800–850 | −0.03–−0.04em | 130–600 |

ME never gets a different font. She takes the main character's grammar (weight 900, tight tracking, title size) inside the same face.

## Motion (v2: the line performer)

v1 laid lyrics out as pages that kept accumulating. v2 performs them the way SURGES and ashita do:
- **One line at a time.** Each syllable lands on its sung time and the line leaves when the next one starts.
- **Every line is a scene** with one of eight layouts: cam, spiral, stack, zoom, scatter, bounce, tate, shout (see sequence_map.md).
- **Letter entrances:** pop, slam, far, fly, drop (with bounce), slide, flip.
- **Exits:** the camera spins out, or the letters explode, fall or shutter away.
- **Beat:** a wave runs through the landed letters; the current chunk bounces the most. No screen shake.
- **The emphasised chunk:** accent colour, weight 900, slam entrance, plus a ring and a burst of simple shapes (square, triangle, dot) in the palette.
- **The page:** section colour, slow rays and a few drifting outline shapes. A new section opens as a disc from the centre.
- **Hierarchy across the song:**
  - Early, the emphasis is mostly YOU's word (주인공, 넌, 널, 완벽해, 행복해).
  - Later it is more and more ME's (내 자신이, 나도, 안 되더라, 내 이야기는, 내 손을).
  - ME's non-emphasised letters get heavier act by act: 640 → 760 → 860.
- **Kept from v1:** the opening footnote pushed aside by 주인공, the interlude that takes letters apart into strokes, the counter portals (into the O of YOU and of LOSER), and the end card where 서브 and 캐릭터 become one size.

## Rendering

- **Engine:** Canvas 2D, 1080×1920.
  - Crisp variable-font text with per-glyph weight and tracking.
  - Masks via offscreen layers and even-odd holes.
- **Determinism:** every frame is a pure function of t; `renderAt(t)` reproduces any frame. Section functions S0–S11 each own their background and their hand-over.
- **Sync:** lyric characters appear on their sung time, from `lines.json` (per-syllable).
- **Build:** `python subchar/puretype/build.py` → `index_built.html`.
- **Render:** `node work/render.mjs out/x.mp4 --page subchar/puretype/index_built.html --audio subchar/song.mp3 --fps 60`
- **Debug:** `?debug=1` shows time, beat, section and lyric.
