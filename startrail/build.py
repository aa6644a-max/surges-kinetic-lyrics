"""Build startrail/kinetic.html from lines.json (force-aligned) + the scene plan."""
import json, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
L = json.load(open("lines.json", encoding="utf-8"))
# line -> (scene, keyword, anchor unit text, extra)
PLAN = [("TRAIL", "STAR TRAIL", "Star", {}), ("TRAIL", "StelLive", "StelLive", {}), ("CARD", "어둠", "어", {}), ("CARD", "눈물", "눈", {}),
        ("RISE", "luminous", "luminous", {}), ("CHART", "6등성", "6", {"mode": "six"}), ("CARD", "everys", "everys", {}),
        ("FLASH", "cliche", "cliche", {}), ("CONST", "UNIVERSE", "universe", {}), ("RISE", "노래해", "노", {}),
        ("CARD", "shine", "shine", {}), ("FLASH", "starlight", "starlight", {}), ("TUNNEL", "너머로", "너", {"dir": 1}),
        ("TRAIL", "StelLive", "StelLive", {}), ("TUNNEL", "세상", "세", {"dir": -1}), ("CARD", "길", "길", {}),
        ("CARD", "everys", "everys", {}), ("FLASH", "cliche", "cliche", {}), ("CONST", "UNIVERSE", "universe", {}),
        ("RISE", "노래해", "노", {}), ("TUNNEL", "fade away", "fade", {"dir": -1}), ("CHART", "1등성", "1", {"mode": "try"}),
        ("TUNNEL", "너에게", "너", {"dir": 1}), ("TRAIL", "la-la-la", "la-", {}), ("TRAIL", "la-la-la", "la-", {}),
        ("CONST", "별", "별", {}), ("CARD", "내일", "내", {}), ("RISE", "노래해", "노", {}), ("CARD", "shine", "shine", {}),
        ("CHART", "1등성", "1", {"mode": "one"}), ("CARD", "내일", "내", {}), ("STAGE", "stage", "stage", {}),
        ("CONST", "기적", "기", {}), ("RISE", "한계", "한", {}), ("TRAIL", "함께", "함", {}), ("TRAIL", "StelLive", "StelLive", {})]
assert len(PLAN) == len(L), (len(PLAN), len(L))
core = lambda s: re.sub(r"[^\w가-힣-]", "", s)
lines = []
for i, (l, (sc, key, anc, ex)) in enumerate(zip(L, PLAN)):
    kt = next((u[1] for u in l["u"] if core(u[0]).lower().startswith(anc.lower())), None)
    assert kt is not None, (i, anc)
    lines.append({"i": i, "t": l["t"], "u": l["u"], "s": l["s"], "e": l["e"], "sc": sc, "key": key, "kt": kt, "pre": .25, **ex})
ST = lambda i: lines[i]["s"]
data = {"dur": 224.0, "b0": 6.92 % (60 / 94), "dawn": ST(27), "lines": lines,
        "flashes": [ST(i) - .25 for i in (2, 5, 9, 14, 19, 23, 27, 35)],
        "mag": [[0, 6], [ST(5), 6], [ST(9), 5], [ST(14), 4.5], [ST(19), 4], [ST(21), 3], [ST(27), 2], [ST(29), 1.6], [lines[29]["kt"] + .4, 1.0]]}
html = open("template.html", encoding="utf-8").read().replace("/*DATA*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":")))
open("kinetic.html", "w", encoding="utf-8").write(html)
print("built", len(lines), "lines")
