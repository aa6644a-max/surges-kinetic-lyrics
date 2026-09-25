"""plates/raw/<id>.png -> plates/<id>.webp for cine.html, plus plates/_sheet.jpg for review.
key "green": chroma-key the flat #00FF00 background (with despill); key "black": luminance -> alpha.
Portrait plates are scaled to 2400 px high, landscape plates to 2200 px high (room for camera drift).
  python ashita/tools/prep_plates.py [--only id,id]"""
import argparse, json, os
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PL = os.path.normpath(os.path.join(HERE, "..", "plates"))

def smooth(x, a, b): x = np.clip((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x)

def key_green(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    spill = g - np.maximum(r, b)                          # how much greener than the other channels
    a = 1 - smooth(spill, .12, .35)
    out = rgb.copy(); out[..., 1] = np.minimum(g, np.maximum(r, b) + .02)   # despill the edges
    return out, a

def key_black(rgb):
    lum = rgb @ np.array([.3, .55, .15])
    a = smooth(lum, .035, .4)
    out = np.clip(rgb / np.maximum(a, 1e-3)[..., None], 0, 1)             # un-premultiply so edges stay bright
    return out, a

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--only"); a = ap.parse_args()
    M = json.load(open(os.path.join(PL, "plates.json"), encoding="utf-8"))
    only = set(a.only.split(",")) if a.only else None
    thumbs = []
    for p in M["plates"]:
        src = os.path.join(PL, "raw", p["id"] + ".png")
        if not os.path.exists(src) or (only and p["id"] not in only):
            if os.path.exists(os.path.join(PL, p["id"] + ".webp")): thumbs.append(p["id"])
            continue
        im = Image.open(src).convert("RGB")
        h = 2400 if im.height >= im.width else 2200
        im = im.resize((round(im.width * h / im.height), h), Image.LANCZOS)
        rgb = np.asarray(im, dtype=np.float32) / 255
        k = p.get("key")
        if k:
            rgb, al = (key_green if k == "green" else key_black)(rgb)
            arr = np.dstack([rgb, al]); mode = "RGBA"
        else:
            arr = rgb; mode = "RGB"
        Image.fromarray((arr * 255 + .5).astype(np.uint8), mode).save(os.path.join(PL, p["id"] + ".webp"), quality=90, method=6)
        thumbs.append(p["id"]); print("prepped", p["id"], im.size, k or "")
    # contact sheet on a checkerboard so keyed edges are visible
    if thumbs:
        tw, th, n = 270, 400, len(thumbs); cols = min(n, 6)
        sheet = Image.new("RGB", (cols * tw, ((n + cols - 1) // cols) * th), (40, 40, 40))
        for i, pid in enumerate(thumbs):
            t = Image.open(os.path.join(PL, pid + ".webp")).convert("RGBA"); t.thumbnail((tw, th))
            bg = Image.new("RGBA", t.size, (90, 30, 90, 255)); bg.alpha_composite(t)
            sheet.paste(bg.convert("RGB"), ((i % cols) * tw, (i // cols) * th))
        sheet.save(os.path.join(PL, "_sheet.jpg"), quality=88); print("sheet ->", os.path.join(PL, "_sheet.jpg"))

if __name__ == "__main__":
    main()
