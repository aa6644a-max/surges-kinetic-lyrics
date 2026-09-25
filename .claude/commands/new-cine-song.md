---
description: Start a new cinematic kinetic-typography lyric video (song + lyrics → aligned lines → story → plates → render)
argument-hint: "<folder-name> [ja|ko]"
---
Build a new one-take cinematic lyric video in this repo, following `ashita/` (Japanese) or `startrail/` (Korean).
Argument: $ARGUMENTS  (folder name, then the lyric language; default ja)

Local setup (already done once on this PC; re-check only if something fails):
- Python for the audio tools is the repo venv: `.venv\Scripts\python.exe` (Python 3.12; the system 3.14 cannot
  install kaldi-native-fbank). Recreate with `uv venv .venv --python 3.12` +
  `uv pip install --python .venv\Scripts\python.exe sherpa-onnx soundfile onnxruntime sentencepiece kaldi-native-fbank numpy imageio-ffmpeg pillow`.
- Models live in `models/` (git-ignored) or `$CINE_MODELS`: `UVR-MDX-NET-Voc_FT.onnx`, `sherpa-onnx-whisper-large-v3`,
  `sherpa-onnx-zipformer-ja-reazonspeech-2024-08-01`, `sherpa-onnx-zipformer-korean-2024-06-24`
  (from github.com/k2-fsa/sherpa-onnx releases; extract .tar.bz2 with Python `tarfile`, Windows tar has no bzip2).
- Render: `npm i playwright && npx playwright install chromium`; ffmpeg on PATH. Images: `codex` CLI logged in.
- On Windows set `PYTHONIOENCODING=utf-8` before running the Python tools.

Steps — stop at every ⏸ and wait for my answer.

1. **Inputs.** Ask me for anything missing: the audio file, the original lyrics, the Korean translation
   (offer to translate and let me check), and the mood/story direction (optional).
   Create `<folder>/` with `song.mp3` (convert with ffmpeg if needed) and `lyrics.txt`:
   - ja: one line per sung line, `原文 | 한국어` (see `ashita/lyrics.txt`)
   - ko: one line per sung line (see `startrail/lyrics.txt`)
   Copy the tools from the reference song: ja → `ashita/tools/{sep,phrases,build_lines,fix}.py`,
   ko → `startrail/tools/{sep,phrases,falign,build_lines,fix}.py`, and add `<folder>/.gitignore` like `ashita/.gitignore`.
2. **Vocals.** In `<folder>/tools`: `sep.py` (≈3–4 min per 3-min song) → `python ../../shared/vocals16k.py`.
3. **Phrases.** `phrases.py` (Whisper large-v3 on CPU, slow) → `phrases.json`. Set `language=` to the song's language.
4. **Alignment.** Group the lyric lines into BLOCKS whose time windows come from phrases.json (see the BLOCKS table in
   the reference build_lines.py; ko also needs Latin words in `TR`, ja in `KATA`), run `build_lines.py`, then check the
   first unit time of every line against phrases.json and the vocal envelope. Put hand fixes in `fix.py` and run it.
   Report any line whose timing looks wrong. ⏸
5. **Story.** Read the lyrics and propose the one-take camera journey: 8–12 scenes mapped to line ranges/times,
   the recurring visual motifs, the palette, and which moments get special effects (like the clock, polaroid, glass
   shatter in ashita). Keep characters original (no known characters). ⏸
6. **Engine page.** Copy `ashita/cine.html` → `<folder>/cine.html` and `ashita/build_cine.py` (set `dur` to the song
   length). Rewrite the camera path, the scene table `SC`, per-line layouts in `lyrics()`/`SPEC`, and the effects for
   the new story. Keep `var SUB_BOX=1` and the `maxW` limits so lines never leave the 1080-wide frame.
   Build, then render stills at the key moments: `node work/render.mjs --page <folder>/kinetic_cine.html --stills ... --dir out/<folder>_stills`
   and look at them (text inside the frame, readable subtitles). Show me a contact sheet. ⏸
7. **Plates.** Write `<folder>/plates/plates.json` (shared `style`, one prompt per scene, `key` for layers,
   `ref` to the anchor) and copy `ashita/tools/{gen_plates,prep_plates}.py`. Generate the anchor only and show it. ⏸
   Then generate the rest, run prep, review `_sheet.jpg` (clean keys, same two characters, correct poses —
   bodies and limbs must make physical sense), regenerate bad ones with `--only <id> --force`. Show me the sheet. ⏸
8. **Render.** Stills again with plates → 45 s test clip → full video:
   `node work/render.mjs out/<folder>_full.mp4 --page <folder>/kinetic_cine.html --audio <folder>/song.mp3`
   Check frames every ~10 s. ⏸
9. **Ship.** Commit the song folder (never `plates/raw/`, stems, `out/`), ask before pushing, and draft the
   Instagram caption with the objective template:
   `🎵 노래추천 | 제목 (한국어 제목)` / 곡 / 원곡 (연도) / 보컬 / 장르 / 영상: 키네틱 타이포그래피 가사 영상 / 가사 /
   hashtags `#노래추천 #키네틱타이포그래피 #가사영상 #kinetictypography #lyricvideo` + genre/title/artist tags.
   Mark any credit I should double-check.
