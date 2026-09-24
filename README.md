# Surges — Kinetic Lyrics (Reels 1080x1920)

Kinetic typography for "Surges" (おとなりモンスター cover). Private: contains cover audio.

- `kinetic.html` — vertical 1080x1920 page synced to `song.m4a`. Opens as a player; `?render` exposes `renderAt(t)` for frame rendering. All animation is a pure function of time.
- `lyrics.srt` / `lyrics.lrc` — corrected line-level subtitles (SRT includes the Korean translation)
- `work/lyrics_user.txt` — correct lyrics (Japanese / pronunciation / Korean, 3 lines each; `(...)` = backing vocal)
- `work/lyrics.json` — Whisper large-v3 output with per-token timestamps (timing source)
- `work/align.py` — aligns the correct lyrics to Whisper timings → `work/lines.json`
- `work/beats.json` — BPM (~92) and beat times, 0.5s energy
- `work/build.py` — builds `kinetic.html`, `lyrics.srt`, `lyrics.lrc`
- `work/render.mjs` — Playwright + ffmpeg → MP4 with audio

```
python3 work/align.py && python3 work/build.py
node work/render.mjs surges_reels.mp4            # full video
node work/render.mjs clip.mp4 --from 60 --to 90  # section
```
ffmpeg comes from `pip install imageio-ffmpeg` (or set `FFMPEG`). Set `CHROME` to use a specific Chromium.

Note: the singer repeats 「流れ続く空と日々の狭間に」 at 1:02, which the lyric sheet omits; `align.py` inserts it (`EXTRA`).
