"""subchar/art/raw/<id>.png (green background) -> subchar/art/<id>.png (keyed, cropped) + art/_sheet.jpg."""
import glob, os
import numpy as np
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ART = os.path.normpath(os.path.join(HERE, "..", "art"))
def smooth(x, a, b): x = np.clip((x - a) / (b - a), 0, 1); return x * x * (3 - 2 * x)
done = []
for src in sorted(glob.glob(os.path.join(ART, "raw", "*.png"))):
    aid = os.path.basename(src)[:-4]; rgb = np.asarray(Image.open(src).convert("RGB"), dtype=np.float32) / 255
    c = rgb[4, 4]; cutout = c[1] > .8 and c[0] < .3 and c[2] < .3                  # otherwise a painted scene: any green still goes, but no crop
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]; spill = g - np.maximum(r, b); al = 1 - smooth(spill, .12, .35)
    rgb[..., 1] = np.minimum(g, np.maximum(r, b) + .02)                                  # despill the edges
    ys, xs = np.where(al > .05); pad = 6; y0, y1, x0, x1 = (max(0, ys.min() - pad), ys.max() + pad, max(0, xs.min() - pad), xs.max() + pad) if cutout else (0, rgb.shape[0], 0, rgb.shape[1])
    out = np.dstack([rgb, al])[y0:y1, x0:x1]; Image.fromarray((out * 255 + .5).astype(np.uint8), "RGBA").save(os.path.join(ART, aid + ".png")); done.append(aid); print("prepped", aid)
if done:
    th = 400; ims = [Image.open(os.path.join(ART, a + ".png")) for a in done]; ws = [int(i.width * th / i.height) for i in ims]
    sheet = Image.new("RGBA", (sum(ws) + 20 * len(ims), th + 20), (255, 122, 168, 255)); x = 10
    for im, w in zip(ims, ws): sheet.alpha_composite(im.convert("RGBA").resize((w, th)), (x, 10)); x += w + 20
    sheet.convert("RGB").save(os.path.join(ART, "_sheet.jpg"), quality=88)
