"""Manga panels: orange/manga/raw/<id>.png -> orange/manga/panels/<id>.webp, upscaled 2x with Real-ESRGAN (anime model),
plus orange/manga/panels/_sheet.jpg for review.   python orange/tools/prep_panels.py [--only id,id] [--force]"""
import argparse, os, subprocess, tempfile
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
MG = os.path.normpath(os.path.join(HERE, "..", "manga"))
RAW, OUT = os.path.join(MG, "raw"), os.path.join(MG, "panels")
ESR = os.path.normpath(os.path.join(HERE, "..", "..", "models", "esrgan", "realesrgan-ncnn-vulkan.exe"))

def up2(src):
    if not os.path.exists(ESR):
        im = Image.open(src).convert("RGB"); return im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    tmp = os.path.join(tempfile.gettempdir(), "esr_m_" + os.path.basename(src))
    subprocess.run([ESR, "-i", src, "-o", tmp, "-n", "realesrgan-x4plus-anime"], check=True, capture_output=True)
    im = Image.open(tmp).convert("RGB"); return im.resize((im.width // 2, im.height // 2), Image.LANCZOS)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--only"); ap.add_argument("--force", action="store_true"); a = ap.parse_args()
    os.makedirs(OUT, exist_ok=True); only = set(a.only.split(",")) if a.only else None
    ids = sorted(f[:-4] for f in os.listdir(RAW) if f.endswith(".png"))
    for pid in ids:
        src, dst = os.path.join(RAW, pid + ".png"), os.path.join(OUT, pid + ".webp")
        if only and pid not in only: continue
        if not a.force and os.path.exists(dst) and os.path.getmtime(dst) > os.path.getmtime(src): continue
        up2(src).save(dst, quality=86, method=6); print("prepped", pid, flush=True)
    tw, th, cols = 200, 300, 9; sheet = Image.new("RGB", (cols * tw, ((len(ids) + cols - 1) // cols) * th), (40, 40, 40))
    for i, pid in enumerate(ids):
        t = Image.open(os.path.join(RAW, pid + ".png")).convert("RGB"); t.thumbnail((tw, th)); sheet.paste(t, ((i % cols) * tw, (i // cols) * th))
    sheet.save(os.path.join(OUT, "_sheet.jpg"), quality=86); print("sheet", len(ids))

if __name__ == "__main__":
    main()
