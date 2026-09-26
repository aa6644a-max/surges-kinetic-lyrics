"""subchar/sil/raw/<id>.png (black on white) -> subchar/sil/<id>.png (black shape on transparent, cropped), + sil/_sheet.jpg."""
import glob, os
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); SIL = os.path.normpath(os.path.join(HERE, "..", "sil"))
done = []
for src in sorted(glob.glob(os.path.join(SIL, "raw", "*.png"))):
    sid = os.path.basename(src)[:-4]; a = np.asarray(Image.open(src).convert("L"), dtype=np.float32) / 255
    alpha = np.clip((0.92 - a) / 0.84, 0, 1)                         # white -> transparent, black -> opaque, soft edge kept
    ys, xs = np.where(alpha > .05); pad = 8
    y0, y1, x0, x1 = max(0, ys.min() - pad), min(a.shape[0], ys.max() + pad), max(0, xs.min() - pad), min(a.shape[1], xs.max() + pad)
    rgba = np.zeros((y1 - y0, x1 - x0, 4), np.uint8); rgba[..., 3] = (alpha[y0:y1, x0:x1] * 255 + .5).astype(np.uint8)
    Image.fromarray(rgba, "RGBA").save(os.path.join(SIL, sid + ".png")); done.append(sid); print("prepped", sid, rgba.shape[1], "x", rgba.shape[0])
if done:
    th = 360; ims = [Image.open(os.path.join(SIL, s + ".png")) for s in done]; ws = [int(i.width * th / i.height) for i in ims]
    sheet = Image.new("RGB", (sum(ws) + 20 * len(ims), th + 20), (255, 184, 107)); x = 10
    for im, w in zip(ims, ws):
        t = im.resize((w, th)); sheet.paste((58, 39, 102), (x, 10, x + w, 10 + th), t); x += w + 20
    sheet.save(os.path.join(SIL, "_sheet.jpg"), quality=88)
