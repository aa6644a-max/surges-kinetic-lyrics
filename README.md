# Surges — Kinetic Lyrics (Reels 1080x1920)

Kinetic typography for "Surges" (おとなりモンスター cover). Private: contains cover audio.

- `kinetic.html` — vertical 1080x1920 page synced to `song.m4a`. Opens as a player; `?render` exposes `renderAt(t)` for frame rendering. All animation is a pure function of time.
- `lyrics.srt` / `lyrics.lrc` — corrected line-level subtitles (SRT includes the Korean translation)
- `work/lyrics_user.txt` — correct lyrics (Japanese / pronunciation / Korean, 3 lines each; `(...)` = backing vocal)
- `work/lyrics.json` — Whisper large-v3 output with per-token timestamps (timing source)
- `work/align.py` — aligns the correct lyrics to Whisper timings → `work/lines.json`
- `work/scenes.txt` — per line: motion style, flags, and how the line splits into chunks (`!` = emphasis)
- `work/beats.json` — BPM (~92) and beat times, 0.5s energy
- `work/build.py` — builds `kinetic.html`, `lyrics.srt`, `lyrics.lrc`
- `work/render.mjs` — Playwright + ffmpeg → MP4 with audio (parallel workers)

```
python3 work/align.py && python3 work/build.py
node work/render.mjs surges_reels.mp4            # full video (4 workers)
node work/render.mjs clip.mp4 --from 60 --to 90  # section
node work/render.mjs --stills 12.5,48.2 --dir .  # PNG frames
```
ffmpeg comes from `pip install imageio-ffmpeg` (or set `FFMPEG`). Set `CHROME` to use a specific Chromium.

## Motion styles (`work/scenes.txt`)

| style | entrance | exit |
|---|---|---|
| `cam` | chunks laid out around each other, some turned 90°; the camera pans/zooms/rotates to each new chunk | camera pulls back and spins away |
| `spiral` | like `cam`, but every chunk turns 90° so the camera keeps spinning | same |
| `stack` | poster rows of equal width (short rows huge), pop / flip / drop per row, emphasis slams | letters explode |
| `zoom` | one chunk at a time from far away; the previous one flies past the camera | zoom-through |
| `scatter` | letters fly in from all directions (`wind`: from the left, `rise`: from below) | letters explode |
| `bounce` | letters drop and bounce with squash & stretch | letters fall |
| `tate` | vertical writing, columns slide down | columns shutter up/down |
| `shout` | giant emphasis word slams in and shakes | letters explode |

Fonts: Noto Sans JP Black (lyrics, title), Noto Sans KR Bold (Korean subtitles).

Flags: `inv` (yellow pop-art background), `fire` (fire gradient + embers), `dawn` (sunrise background).
Emphasis chunks trigger screen shake, flash, shockwave ring, confetti and RGB split. Instrumental breaks and the outro show a bouncing SURGES title.

Note: the singer repeats 「流れ続く空と日々の狭間に」 at 1:02, which the lyric sheet omits; `align.py` inserts it (`EXTRA`).
