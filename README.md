# Surges — Kinetic Lyrics

Kinetic typography for "Surges" (おとなりモンスター cover). Private: contains cover audio.

- `kinetic.html` — browser preview synced to `song.m4a` (per-character reveal, keyword accent, beat pulse)
- `lyrics.srt` / `lyrics.lrc` — line-level subtitles
- `work/lyrics.json` — Whisper large-v3 output with per-token timestamps (446 tokens)
- `work/beats.json` — BPM (~92, maybe 184) and beat times
- `work/data.json` — compact data embedded into `kinetic.html` by `work/build.py`

Rebuild page: `python work/build.py`

## TODO
1. Correct misheard lyrics (e.g. 80.2s 「あずみ」→「明日に」?, 45s 「もぐれていたって」) while keeping timing
2. After Effects `.jsx` generator from `work/lyrics.json`
3. Render MP4 of the kinetic page (headless browser + ffmpeg)
