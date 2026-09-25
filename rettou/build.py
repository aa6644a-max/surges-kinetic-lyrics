"""Build rettou/kinetic.html from lines.json (force-aligned), scenes.txt and beats.json."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
PUNCT = set("「」！？!?”“\"、。 　・…")
core = lambda s: "".join(c for c in s if c not in PUNCT)
L = json.load(open("lines.json", encoding="utf-8"))
import sys
ROAD = "--road" in sys.argv
TRAVEL = "--travel" in sys.argv or ROAD
rows = [r for r in open("scenes_travel.txt" if TRAVEL else "scenes.txt", encoding="utf-8").read().splitlines() if r.strip() and not r.startswith("#")]
assert len(rows) == len(L), (len(rows), len(L))
lines = []
for i, (x, row) in enumerate(zip(L, rows)):
    head, spec = [p.strip() for p in row.split("|")]
    style, *flags = head.split()
    if TRAVEL: flags = [style] + flags
    units = [[u[0], u[1], u[2]] for u in x["w"]]
    chunks, k = [], 0
    for part in spec.split("/"):
        emph = part.startswith("!"); n = len(core(part.lstrip("!")))
        got = core("".join(u[0] for u in units[k:k + n]))
        assert got == core(part.lstrip("!")), f"line {i}: {part!r} vs {got!r}"
        chunks.append([k, k + n, 1 if emph else 0]); k += n
    assert k == len(units), f"line {i}: {k}/{len(units)}"
    lines.append({"s": x["s"], "e": x["e"], "w": units, "ch": chunks, "st": style, "fl": flags, "ko": x["ko"], "bk": "", "bko": ""})
b = json.load(open("beats.json"))
data = {"dur": 214.0, "bpm": b["bpm"], "beats": b["beats"], "energy": b.get("energy_0p5s"), "lines": lines}
html = open("road.html" if ROAD else "travel.html" if TRAVEL else "template.html", encoding="utf-8").read()
open("kinetic_road.html" if ROAD else "kinetic_travel.html" if TRAVEL else "kinetic.html", "w", encoding="utf-8").write(html.replace("/*DATA*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":"))))
print("built", len(lines), "lines")
