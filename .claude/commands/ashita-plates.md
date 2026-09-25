---
description: 明日の夜空哨戒班 — generate the painted scene plates with Codex CLI, composite them into the cinematic lyric video, and render
argument-hint: "[anchor | all | <plate id,...> | render]"
---
Work in this repository. The lyric video engine is `ashita/cine.html` (built by `ashita/build_cine.py`).
Option B: scene background art ("plates") is generated as images and composited in code under the
camera path, the two lights and the lyrics. Scenes whose plates are missing fall back to code drawing.

Files:
- `ashita/plates/plates.json`: shared style text, key instructions, and one prompt per plate (id, size, key, ref)
- `ashita/tools/gen_plates.py`: one `codex exec` call per plate, output to `ashita/plates/raw/<id>.png` (git-ignored)
- `ashita/tools/prep_plates.py`: chroma/black key + resize → `ashita/plates/<id>.webp` + `ashita/plates/_sheet.jpg`
- The scene table `SC` in `ashita/cine.html` maps plates to song time (roof → clock → time-lapse → hands →
  rise → sea of clouds → rain → photo → wind → glass sky → shatter into dawn → home rooftop)

Argument: $ARGUMENTS

Steps:
1. Check the tools: `codex --version`, `python3 -c "import PIL, numpy"` (else `pip install pillow numpy`),
   `node -e "require('playwright')"` (else `npm i playwright`), `python3 -c "import imageio_ffmpeg"`
   (else `pip install imageio-ffmpeg`).
2. **anchor** (or no argument on a fresh checkout): generate only the style anchor
   `python3 ashita/tools/gen_plates.py --only s01_sky`, then `python3 ashita/tools/prep_plates.py --only s01_sky`.
   Show me `ashita/plates/raw/s01_sky.png` and ask whether the style is right. If not, edit `style`/`prompt`
   in plates.json and regenerate with `--force`. Every other plate uses the anchor as its style reference.
3. **all**: `python3 ashita/tools/gen_plates.py` (skips existing plates), then `python3 ashita/tools/prep_plates.py`.
   Open `ashita/plates/_sheet.jpg` and check each plate:
   - keyed plates (`key: green`/`black`) have a clean transparent background (the sheet shows alpha on magenta)
   - no text/logos, no known characters, the boy/girl silhouettes read as the same two people
   - regenerate bad ones with `--only <id> --force`
   If Codex cannot run or save images, run `gen_plates.py --dry` and let me generate from the printed prompts,
   saving each result as `ashita/plates/raw/<id>.png`.
4. **render** (also after step 3):
   `python3 ashita/build_cine.py`
   stills: `node work/render.mjs --page ashita/kinetic_cine.html --stills 3,14,20,31,50,68,92,101.6,110,122,128.9,140,165 --dir out/ashita_stills`
   Look at the stills (plates must never show an edge, lyrics must stay readable on top of the art).
   Test clip: `node work/render.mjs out/ashita_b_test.mp4 --page ashita/kinetic_cine.html --audio ashita/song.mp3 --from 0 --to 45`
   Full: `node work/render.mjs out/ashita_b_full.mp4 --page ashita/kinetic_cine.html --audio ashita/song.mp3`
   Compare against the code-only version with `?noplates` (open `ashita/kinetic_cine.html?noplates` in a browser).
5. Commit `ashita/plates/*.webp`, `_sheet.jpg` and any prompt/engine changes (never `plates/raw/`).
