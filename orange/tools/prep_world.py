"""Painted-world plates (the anime pilot): plates/raw/<id>.png -> plates/<id>.webp, upscaled with Real-ESRGAN (anime model).
  w_*  world maps: 4x upscale, kept as RGB.
  s_*  sprites on chroma green: 2x upscale, then the green is keyed out (same keyer as prep_plates.py).
  python orange/tools/prep_world.py [--only id,id]
Real-ESRGAN ncnn-vulkan lives in models/esrgan (git-ignored); without it the plates are only resized (Lanczos)."""
import argparse, json, os, subprocess, tempfile
import numpy as np
from PIL import Image
from prep_plates import key_green

HERE = os.path.dirname(os.path.abspath(__file__))
PL = os.path.normpath(os.path.join(HERE, "..", "plates"))
ESR = os.path.normpath(os.path.join(HERE, "..", "..", "models", "esrgan", "realesrgan-ncnn-vulkan.exe"))

def upscale(src, scale):
    if not os.path.exists(ESR):
        im = Image.open(src).convert("RGB"); return im.resize((im.width * scale, im.height * scale), Image.LANCZOS)
    out = os.path.join(tempfile.gettempdir(), "esr_" + os.path.basename(src))
    subprocess.run([ESR, "-i", src, "-o", out, "-n", "realesrgan-x4plus-anime"], check=True, capture_output=True)
    im = Image.open(out).convert("RGB")
    return im if scale == 4 else im.resize((im.width * scale // 4, im.height * scale // 4), Image.LANCZOS)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--only"); a = ap.parse_args()
    M = json.load(open(os.path.join(PL, "plates.json"), encoding="utf-8"))
    only = set(a.only.split(",")) if a.only else None
    for p in M["plates"]:
        pid = p["id"]
        if not (pid.startswith("w_") or pid.startswith("s_")) or (only and pid not in only): continue
        src = os.path.join(PL, "raw", pid + ".png")
        if not os.path.exists(src): continue
        if pid.startswith("w_"):
            im = upscale(src, 4); im.save(os.path.join(PL, pid + ".webp"), quality=88, method=6)
        else:
            im = upscale(src, 2); rgb, al = key_green(np.asarray(im, dtype=np.float32) / 255)
            Image.fromarray((np.dstack([rgb, al]) * 255 + .5).astype(np.uint8), "RGBA").save(os.path.join(PL, pid + ".webp"), quality=90, method=6)
        print("prepped", pid, im.size)

if __name__ == "__main__":
    main()
