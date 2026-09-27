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

## Motion grammar (the shared language; entrance animations are not repeated per line)

| motion | where it is used |
|---|---|
| TYPE REFLOW | MARGIN main column; CHORUS 2 whole-canvas flow; OWN LINE stack (lines push each other in and out) |
| TRACKING EXPANSION | 주인공 flies apart (14 s); I'M A SUB CHARACTER snaps together (48.5 s); 빛나는지 (53 s); 한숨 (145 s); I WANNA BE YOU closes (178 s) |
| WEIGHT MORPH | 오염되어 가 (thin → black); 나쁜 (100 → 900); 버티고 strains; the bridge's weight slowly rises; 내 이야기는 결국 (300 → 860); 서브 (320 → 800) |
| MASK / OCCLUSION | ME's line readable only between the strokes of 널 (39 s); the eraser (113 s) |
| COUNTER PORTAL | into the O of YOU (69.2 s) → interlude; into the O of LOSER (169.8 s) → 열등감으로 찬 |
| BASELINE TRAVEL | the gaze hairline (18 s); crossing rails (102–107 s); I'M A SUB CHARACTER at 560 px running past (167 s) |
| CROP / OVERSCAN | 너처럼, 주인공 (vertical), 넌, LOSER, 빛나는지 (vertical), 행복해, 패배자 |
| LAYOUT COLLISION | 주인공 shoves the footnote (8 s); 완벽해 shoved by 널; 우린 / 안 비슷해; 행복해 pushes ME into the corner; 내 손을 / 잡아 줘 meet |

- **Beat:** used for arrivals, the montage cuts, and the interlude pieces' steps. There is no shake, glitch, particles or glow anywhere.
- **Camera:** used only for the two counter portals and the scroll of the flows. Everything else moves on the page.

## Rendering

- **Engine:** Canvas 2D, 1080×1920.
  - Crisp variable-font text with per-glyph weight and tracking.
  - Masks via offscreen layers and even-odd holes.
- **Determinism:** every frame is a pure function of t; `renderAt(t)` reproduces any frame. Section functions S0–S11 each own their background and their hand-over.
- **Sync:** lyric characters appear on their sung time, from `lines.json` (per-syllable).
- **Build:** `python subchar/puretype/build.py` → `index_built.html`.
- **Render:** `node work/render.mjs out/x.mp4 --page subchar/puretype/index_built.html --audio subchar/song.mp3 --fps 60`
- **Debug:** `?debug=1` shows time, beat, section and lyric.
