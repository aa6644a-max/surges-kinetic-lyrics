"""Build kinetic.html (1080x1920 vertical) and lyrics.srt/.lrc.

Inputs: work/lines.json (align.py), work/scenes.txt (style + chunks per line), work/beats.json.
"""
import json, re

PUNCT = set("「」！？!?”“\"、。 　・…")
core = lambda s: "".join(c for c in s if c not in PUNCT)

L = json.load(open("work/lines.json", encoding="utf-8"))
rows = [r for r in open("work/scenes.txt", encoding="utf-8").read().splitlines() if r.strip() and not r.startswith("#")]
assert len(rows) == len(L), f"scenes.txt has {len(rows)} rows, lines.json has {len(L)}"

lines = []
for i, (x, row) in enumerate(zip(L, rows)):
    head, spec = [p.strip() for p in row.split("|")]
    style, *flags = head.split()
    units = [[u[0].strip(), u[1], u[2]] for u in x["w"]]
    chunks, k = [], 0
    for part in spec.split("/"):
        emph = part.startswith("!")
        n = len(core(part.lstrip("!")))
        got = core("".join(u[0] for u in units[k:k + n]))
        assert got == core(part.lstrip("!")), f"line {i}: chunk {part!r} does not match units {got!r}"
        chunks.append([k, k + n, 1 if emph else 0])
        k += n
    assert k == len(units), f"line {i}: chunks cover {k} of {len(units)} units"
    lines.append({"s": x["s"], "e": x["e"], "w": units, "ch": chunks, "st": style, "fl": flags,
                  "ko": re.sub(r"[「」]", "", x["ko"]).strip(), "bk": x["bk"], "bko": x["bko"]})

b = json.load(open("work/beats.json"))
data = {"dur": 142.5, "bpm": b["bpm"], "beats": b["beats"], "energy": b.get("energy_0p5s"), "lines": lines}
html = open("work/template.html", encoding="utf-8").read()
open("kinetic.html", "w", encoding="utf-8").write(
    html.replace("/*DATA*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":"))))

def srt_t(t):
    ms = int(round(t * 1000))
    return "%02d:%02d:%02d,%03d" % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)

with open("lyrics.srt", "w", encoding="utf-8") as f:
    f.write("\n".join(f"{i+1}\n{srt_t(s['s'])} --> {srt_t(s['e'])}\n{s['t']}\n{s['ko']}\n" for i, s in enumerate(L)))
with open("lyrics.lrc", "w", encoding="utf-8") as f:
    f.write("\n".join("[%02d:%05.2f]%s" % (s["s"] // 60, s["s"] % 60, s["t"]) for s in L))
print("built", len(lines), "lines")
