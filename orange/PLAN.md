# ORANGE: master plan (v4), "ONE RALLY, ONE TAKE"

All references and techniques combined into one design, with a volleyball feel first.

## 0. The idea in one paragraph

- **The world:** the whole video is one continuous camera move over a giant volleyball world: a gym seen from above, with the sky above it.
- **The camera follows the ball:** every lyric line is a hit (serve, receive, set, spike), and each hit carries the camera to the next lockup.
- **The lyrics stay:** like the Maps video, the words are laid out on the court and remain where they were written. A pull-back late in the song shows the whole court covered in everything sung so far (楽しかったよね、全てが).
- **One object per line:** each line's meaning gets an object or UI placed in that world, as in the RUDE video: a ticket on the floor, the team chat on a phone on the bench, a timer on the scoreboard, a whiteboard at timeout. The camera dives into it and flies out again.
- **Sport moments in anime grammar:** hits are anime impact frames, flashes and speed lines (Haikyu AMV, HOW IT'S DONE).

## 1. What each reference gives us

| reference | what we take | where it shows |
|---|---|---|
| Haikyu AMV (the song's own MV) | the emotion: the ball always in the air, close-ups (hands, shoes, net), the 23–24 set-point hold, the quiet empty gym at the drop, warm orange → teal in the second half, impact frames | the whole story arc, the drop, the final teal arena |
| K-POP Demon Hunters "HOW IT'S DONE" | huge heavy type filling the frame, outline echoes, a script accent over a bold word, full-frame colour flashes, letters as windows with light inside | chorus climaxes (きっと, 1秒) |
| HeartS2Hearts "RUDE!" | one format per line (phone UI, tickets, documents, game UI); halftone paper, torn photos, stickers, stamps, emoji, boiling hand-drawn lines, a cursor that clicks; a word multiplying (toooo) | the objects placed in the world; the きっと ーーー; the cursor clicks that trigger moves |
| Maroon 5 "Maps" | one continuous camera through a big composition; lockups of mixed sizes (thin caps + heavy word + tiny connector + textured script); letters flying in, drawn on, or running along a road; whip rotations with motion blur; zoom-outs that reveal earlier words; tilted 3D planes; objects that open (the box → ALL) | the camera and the layout grammar of the whole piece |
| ashita (our earlier song) | translucent cloud layers you fly through | the rise into the sky (pre-chorus, the final sky) |
| shared/motion.js (GSAP / Remotion / Theatre.js / camera-controls) | SmoothDamp camera paths, dolly vs zoom, fitToBox framing, springs, stagger, text on a path, mask reveals, transitions, posterize | the camera rig, every entrance, the hang time |
| what we already built | painted plates (gym, court, skies, clouds), the yellow-and-blue ball, the Y2K kit (halftone, torn paper, stickers, emoji, chat bubbles, windows, cursor), act-1 formats | reused as world objects |

## 2. The world (top-down, world units, 100 px = 1 m)

```
                        SCOREBOARD + STANDS (north wall)        y ≈ -1700
        ┌────────────── their baseline ──────────────┐          y = -900
        │            their side (the rival)          │
        ├────────────── their attack line ───────────┤          y = -300
 WINDOWS║════════════════ NET (tape) ═════════════════║ BENCH   y = 0
 (west, ├────────────── our attack line ─────────────┤ + white-
 sunset)│            our side                         │ board
        └────────────── our baseline ────────────────┘          y = 900
              SERVICE ZONE                                       y = 1000…1400
 LOCKER / ENTRANCE (south-west)                 x = -1300 … +1300
 ─────────────────────────────────────────────────────────────
 SKY (a second plane "above" the gym): sunset sky, cloud layers, reached by tilting up through the ceiling lights
```

- **The floor:** the painted court plate under crisp vector lines. Court lines double as roads for text-on-path.
- **The walls are thin bands at the edges:** windows to the west (sunset beams cross the floor), the scoreboard and stands to the north, the bench with a whiteboard to the east, the locker room and entrance to the south-west.
- **Objects lie in the world at their own spots, scale and rotation:**
  - tickets, the phone with the team chat, the ball, shoes, a towel, a jersey, the whiteboard, the timer, the camera
  - each is a function that draws in world coordinates; the camera can dive into any of them
- **The sky plane:** reached through a dolly-up transition (ceiling lights → white bloom → clouds). The way back down is a dive.

## 3. Camera grammar

- Built on `MO.camPath` (SmoothDamp between framings), `MO.fitToBox` (frame a lockup with margins) and `MO.lerpCam`. Zoom is blended in log space.
- **Rules:**
  - The camera holds or drifts gently (zoom +3–6 %) while a line is being sung.
  - It moves between lines, landing on a beat.
  - Never more than about 90° of rotation in one move.

| move | when | how |
|---|---|---|
| **follow** | the ball travels (serve, pass) | the camera target rides the ball's arc with a short lag (SmoothDamp ~0.25 s) |
| **whip** | a hit / a new line on the downbeat | 0.25–0.4 s, expo in-out, rotate 30–90°, motion blur from 6–8 sub-frames |
| **dive** | into an object (phone, ticket, whiteboard) | zoom ×3–8 toward it; at the end the object's screen fills the frame |
| **reveal** | after a group of lines | zoom out ×0.3–0.5; earlier lockups appear around (Maps) |
| **tilt up / dolly up** | floor → sky | the floor drops away, the ceiling lights rush past, bloom, then clouds fly through (cloudField) |
| **hold / hang** | あと1秒だけ | the camera stops; posterize to 8–12 fps; tiny shake |
| **impact** | spikes, high five, きっと | an impact frame (inverted), a flash, a shake, speed lines toward the hit |

## 4. Typography system (lockups)

- **A lockup** = one sung line laid out as a block of mixed sizes, built letter by letter on the sung syllables:
  - the key word huge and heavy (Dela Gothic One, slanted like team lettering);
  - function words thin and small (M PLUS Rounded light/medium, tracked out);
  - a hand-written accent (Klee One / Yusei Magic marker) and a Latin accent (Unbounded / Permanent Marker), with tiny rules or brackets.
- **Entrances, chosen per line:** fly-in from scatter and assemble (Maps "conversation"), stroke draw-on, stamp (RUDE), typewriter (UI), along a path (court lines), mask rise (SplitText), multiply (toooo → ーーー).
- **Textures on key words:** halftone fill, stripes, outline echoes (HOW IT'S DONE), a white side extrusion for depth (Maps "MAP").
- **Korean subtitle:** a fixed pill at the bottom, outside the camera. It never moves.

## 5. Look

- **Act colour:**
  - **Warm:** amber gym, orange sunsets, paper cream.
  - **Night-ish:** the drop (dark navy, lights off).
  - **Teal:** the last chorus (the arena court turns teal).
  - **Dawn:** the outro.
- **Materials:**
  - painted plates for the floor and the skies
  - halftone paper objects with torn edges for the formats
  - stickers and stamps, flat emoji
- **Effects:**
  - impact frames, speed lines, colour flashes, motion blur on whips
  - floating dust in light beams, translucent clouds, a vignette

## 6. The journey, section by section

| time | line(s) | where in the world | camera | lockup / object |
|---|---|---|---|---|
| 0–13.8 | intro | locker bench → gym | starts in the dark on a phone on the bench (ORANGE.exe loading); on each guitar accent a bank of lights comes on and the camera **pulls back** a step, revealing more of the gym | files pop on the phone; shoes; the lights |
| 13.8 | band in | centre court | whip down onto centre court | **ORANGE** stamped letter by letter across the court, the O is the ball |
| 13.8–31.9 | pre-game | entrance → bench → scoreboard → service zone | whips between objects on the beats | the FINAL ticket on the floor; the team chat on the bench phone (dive in and out); the scoreboard 00:00 (tilt to the wall); the serve power meter painted at the service zone |
| 31.9–37.1 | さよならは言わない / 約束もない | service zone → over the net | **follow** the serve's arc | the serve writes the line along its arc; the chat input typed and deleted lies beside it; 約束 in outline with a 🤙 crossed out where the ball lands |
| 37.2–41.4 | また会えるから 僕らは | their side → net | follow the receive, set (hang at the top), spike back | the round-trip ticket on their side; 僕らは as three seals crossing the net |
| 41.5–51.2 | オレンジ… 地平線 / 甘酸っぱい光 眩しくて | the net, seen side-on | **tilt** from top-down to side-on: the net tape becomes the horizon, the sky plane behind | the ball rises as the sun and the horizon bites it (かじる); the windows' sunset beams sweep; the exposure blows out on 眩しくて |
| 51.2–60.5 | 汗 / 声 / 叩き合えた肩 / 笑い泣き | floor close-up → centre court | dive to the floor (sweat on the wood, text sliding down), pull back for the high five | drops; a voice-memo waveform painted on the floor; two hands slap at the centre (impact); an emoji flood rising from the stands |
| 60.6–70.5 | 明日へ向かう … 羽ばたいていく | floor → ceiling → **sky** | **dolly up** through the ceiling lights into the clouds | a weather card for tomorrow; the words flap and fly up with the camera through translucent clouds |
| 70.5–80 | あと1秒だけ … 今が | the top of the jump (sky) | **hang**: the camera stops, posterized | the timer at 0:01 with +1秒 pressed twice; 今 captured by a shutter, a polaroid |
| 80.1–88.2 | きっと + spike | sky → down to the floor | **whip down** the spike's line, impact on the court | きっと stamped huge, ーーー multiplying as shock rings on the court; NICE SPIKE |
| 88.2–103 | 小さな背中に… / ここまで来たんだよ / 未来 | jersey on the bench → scoreboard | dive, whip | a jersey back (a big dream.zip copied onto a small back); the scoreboard 23 → 24 (set point); an おみくじ slip |
| 103–108 | 楽しかったよね 全てが | everything | **the big reveal**: zoom out over the whole world, every earlier lockup visible | 全てが = Select All, every lyric on the court ticked |
| 108–117 | 息を切らし 走り続け / 胸の熱さ | court lines | **follow along the lines** | the words run along the court lines like the road in Maps; a stamina bar; a heat gauge |
| 117–136 | もう一回のない瞬間 / 繋がって / 何を描こうか / 想像 | all over the court | follow the passes from player to player | a locked CONTINUE? sign; pass lines linking word to word; court lines redrawn by a paint brush; a thought bubble |
| 136–156 | きっと (instrumental) きっと | above the court, the stands | **orbit** (tilted 3D court), broadcast REPLAY graphics | slow-motion replay of the spike, live comments, KITTO chants from the stands |
| 156–172 | 確かな事 / 間違っても良いよ / 君は君でいい | the bench whiteboard (timeout) | dive into the board | an answer sheet; red ✕ then a big 花丸; 君は君でいい circled |
| 172–181 | 少し苦い オレンジのよう / 切なさ (the drop) | high above the empty gym | slow pull back; lights go off bank by bank (the intro reversed) | a lone ball on the floor; a receipt printing 切なさ × 1 |
| 181–210 | last chorus | the arena (teal court) | faster follows; **only forward** on 振り返らないで | the timer reprise (we let it run out and go); battery 1%; a memories notification; GO STRAIGHT arrows painted on the floor; NEXT STAGE |
| 210–232 | きっと / きっと, outro | match point → the whole world → dawn sky | the final spike, the ball **touches the floor for the first time** (GAME SET); a final zoom-out to the whole world, then dolly up to dawn | confetti; a credits desktop with a music player playing ORANGE |

## 7. Build plan

**Code (orange/world/):**
- `world.js`
  - the world map: floor, lines, walls, the sky plane
  - an object registry: `{ id, x, y, rot, scale, t0, t1, draw(t) }`
  - viewport culling
- `cam.js`
  - keyframes per section into `MO.camPath`
  - whip moves with sub-frame motion blur (deterministic: the same frame drawn at t − k·δ and blended)
  - dive / reveal helpers using `MO.fitToBox` on a lockup's or object's world box
- `type.js`
  - lockup builder: mixed-size blocks, entrance styles, textures
  - text along a path (`MO.path`)
  - persistent lockups, redrawn every frame when visible
- **reuse:** `orange/y2k/kit.js` (halftone, torn paper, stickers, emoji, bubbles, windows, cursor, clouds, ball) and the act-1 formats, turned into world objects.

**Assets:**
- most of it is vector or already generated
- maybe new:
  - a wide top-down gym floor plate (court + surroundings)
  - a jersey cut-out
  - a whiteboard close-up
  - an arena teal top-down plate

**Milestones (each ends with stills + a preview video for you):**
1. **M1, 0–60 s:** the world map, the camera rig, the intro pull-backs, the title, the verse-1 rally.
2. **M2, 60–108 s:** the dolly into the sky, the hang time, the spike, set point, the big reveal.
3. **M3, 108–181 s:** rally 2 on the court lines, the replay orbit, the timeout board, the drop.
4. **M4, 181–232 s:** the teal arena, game set, the outro; polish; full render and caption.

## 8. Risks and how we handle them

- **Readability with a moving camera:** hold still while a line is sung; move between lines; keep on-screen key words ≥ 120 px; the subtitle is fixed.
- **Motion sickness:** no more than about 90° per whip; SmoothDamp everywhere else; rotation used mainly at section changes.
- **Plates blurring on deep zooms:** vector lines and type stay crisp; plates are kept to ≤ 1.6× zoom, and close-up objects are vector.
- **Render time:** motion blur sub-frames only during whips; halftone images cached.
