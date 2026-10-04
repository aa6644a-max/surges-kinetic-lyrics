# ORANGE (SPYAIR): concept v3, "the lyrics play volleyball"

**Priority: it must feel like sport.** The song is a Haikyu!! theme, so the video should feel like a volleyball match in anime form: speed, impact, hang time, the score, the team.

What we keep from the HOW IT'S DONE reference is only this: no characters, graphic motion typography carries the video. Everything else comes from volleyball.

## Song map (measured)
- **Length:** 3:52.
- **Pulse:** 0.302 s (felt as a 99 BPM rock anthem).
- **Energy:**
  - The intro and choruses are loud.
  - One quiet drop at 2:48–3:00.
- **"きっと"** is a shouted hook: 1:20, 2:16 / 2:26, 3:31 / 3:40.

## Where the sports feeling comes from

1. **The words themselves play.** Every lyric line performs a volleyball action that fits its meaning and the drums:
   - **Serve:** tossed up, hit flat across the frame.
   - **Receive:** a word drops and bounces up off the bottom edge.
   - **Set:** it floats up and hangs at the top.
   - **Spike:** it slams down diagonally with motion blur, an impact flash and a shake.
   - **Block:** a wall of words stops a line dead.
   - **Dig:** a word is scraped off the floor at the last moment.
   - **Timeout:** everything stops.

   The ball is always one of the characters in the frame.
2. **The rhythm of a rally.** Hits land on the drum accents. There are long hang times at the jump peak (the "one more second" lines), then a sudden fast exchange.
3. **Anime sports language:**
   - speed lines, impact frames (a flash of white or inverted colour on the hit);
   - extreme perspective (a ball filling the screen, the court seen from under the net, from above, from the top of the jump);
   - sweat drops, a shoe-squeak mark, the net shaking after a hit;
   - a freeze frame at the peak with a thin outline.
4. **Match structure and broadcast graphics:**
   - the score bug, SET 1 / SET POINT / MATCH POINT banners;
   - a rally counter, a replay wipe with REPLAY and slow motion;
   - a timeout with a coach's tactics board (marker Xs, Os and arrows);
   - the scoreboard flip cards, the whistle, the final GAME SET.
5. **The court as the page:**
   - lines, the attack line, the net and its tape, the antenna;
   - the orange-amber wood floor with lane reflections;
   - the gym lights and the banners on the rail (original slogans, not Haikyu's).

## Look
- **Team colours:** **orange** and **black**, with white. The gym is amber wood under warm lights.
- **Second half:** the court floor turns **teal** for the last chorus, like a bigger arena (the reference AMV does the same move).
- **Palette:**
  - orange `#FF6A13`, black `#0E0F14`, white `#FFF6EC`
  - floor amber `#E3923A`, arena teal `#16B3A6`
  - sunset gradient (peach → pink → lilac) only for the sky moments
- **Type:**
  - Japanese: very heavy gothic, slightly condensed and slanted a few degrees, like team lettering.
  - Numbers and keywords: condensed athletic caps (ORANGE, KITTO, SET POINT, 24).
  - Korean: small, bottom.
- **People:** none by default. We can add body fragments without faces if you want: hands (serve, set, fists together) and shoes. They sell the sport strongly without a character.

## The song as one match

| time | match moment | how the lyrics play |
|---|---|---|
| 0:00–0:32 | **Pre-game.** The gym lights switch on bank by bank on the drum hits; shoes laced; a ball bounced on the floor; the scoreboard wakes up 0–0; a huddle chant; the whistle. | Title ORANGE bounces like a dribble; SET 1 banner. |
| 0:32 | **Serve.** | The toss on the downbeat. |
| 0:33–1:00 | **Rally 1 (verse):** controlled, warm. | さよならは言わない is served; 約束もない received; また会えるから floats as a set; 僕らは passed across the net. **The horizon line = the net tape:** オレンジを少しかじる地平線 with the ball as a sun bitten by the net. 汗 drips; 声 rings; 叩き合えた肩 two hands slap (impact). |
| 1:01–1:10 | **The approach and jump.** | 明日へ向かう climbs; オレンジ色の空へ: the camera looks up past the net into a sunset ceiling; 羽ばたいていく lifts off. |
| 1:11–1:20 | **Hang time at the peak.** | あと1秒だけ: the world slows (posterized frames), a stopwatch sticks at 1.00, the ball hangs, sweat drops float. |
| 1:20 | **SPIKE: きっと** | Impact frame, KITTO slammed diagonally into the floor, a shake, the net ripples. |
| 1:28–1:48 | **SET POINT.** | 小さな背中に大きな夢: a huge jersey number, the small word riding it; ここまで来たんだよ: scoreboard 23 → 24; 楽しかったよね 全てが: a quick replay strip of the rally so far. |
| 1:49–2:16 | **The longest rally:** digs, runs, desperate saves. | 息を切らし: words dive across the floor; 追いかけてた: the camera chases the ball; ずっと繋がってく: pass lines link word to word; 何を描こうか: the court lines draw themselves. |
| 2:16–2:36 | **REPLAY (instrumental).** | Broadcast replay wipe, slow motion of the spike from other angles, the crowd, the banners; きっと ×2 as chants. |
| 2:37–2:48 | **TIMEOUT.** | The coach's tactics board: 確かな事 written in marker, 間違って crossed out, 良いよ; 君は君でいい circled. Fists together from above. |
| 2:48–3:00 | **The drop: after the whistle.** | The lights go down bank by bank; an empty court; one ball rolls to the wall; 少し苦い オレンジのよう: an orange on the bench with a bite gone; 切なさ fades out. |
| 3:01–3:30 | **MATCH POINT (teal arena).** | あと1秒だけ again, but this time the jump goes through; 限られた時間: the countdown; 立ち止まらないで 振り返らないで: the camera only moves forward; 君は進んで行けばいい. |
| 3:31–3:48 | **The last point.** | きっと: the spike; きっと: the ball lands, the frame floods orange, GAME SET. The score is never shown, because the moment is the point. |

## Build notes
- **Engine:** a new canvas page (section functions, deterministic `renderAt(t)`) with `shared/motion.js`. From it:
  - `path` / ballistic arcs for every word throw;
  - `springPath` for bounces, `stagger` for blocks;
  - `posterize` for hang time, `shake` + flash for impacts;
  - `camPath` for the court camera (top-down ↔ side ↔ low angle), `drawStroke` for court lines and the tactics board.
- **Graphics** are drawn in code: court, net, ball with spin, scoreboard, score bug, banners.
- **Generated assets:** only a few cut-outs, all without people: gym interior plates (empty), an orange with a bite, a sneaker. Hands and shoes only if you want them.
