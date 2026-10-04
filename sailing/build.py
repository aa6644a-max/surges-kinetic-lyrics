"""Build sailing/kinetic.html from lines.json (timed units), scenes.txt (style + chunks) and beats.json.

Units are Korean syllables or English words: [text, start, end, space_after, is_english].
"""
import json, os, re

os.chdir(os.path.dirname(os.path.abspath(__file__)))

def units(s):
    out = []
    for word in s.split():
        if re.search(r"[A-Za-z]", word): out.append(word)
        else: out += list(word)
    return out

L = json.load(open("lines.json", encoding="utf-8"))
rows = [r for r in open("scenes.txt", encoding="utf-8").read().splitlines() if r.strip() and not r.startswith("#")]
assert len(rows) == len(L), f"scenes.txt has {len(rows)} rows, lines.json has {len(L)}"

lines = []
for i, (x, row) in enumerate(zip(L, rows)):
    head, spec = [p.strip() for p in row.split("|")]
    style, *flags = head.split()
    us = x["w"]
    chunks, k = [], 0
    for part in spec.split("/"):
        emph = part.startswith("!")
        want = units(part.lstrip("!"))
        got = [u[0] for u in us[k:k + len(want)]]
        assert got == want, f"line {i}: chunk {part!r} does not match units {got}"
        chunks.append([k, k + len(want), 1 if emph else 0])
        k += len(want)
    assert k == len(us), f"line {i}: chunks cover {k} of {len(us)} units"
    lines.append({"s": x["s"], "e": x["e"], "t": x["t"], "w": us, "ch": chunks, "st": style, "fl": flags})

b = json.load(open("beats.json"))
data = {"dur": 139.0, "bpm": b["bpm"], "beats": b["beats"], "energy": b.get("energy_0p5s"), "lines": lines}
html = open("template.html", encoding="utf-8").read()
open("kinetic.html", "w", encoding="utf-8").write(
    html.replace("/*DATA*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":"))))
print("built", len(lines), "lines")
