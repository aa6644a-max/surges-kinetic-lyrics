"""Build startrail/kinetic_cine.html (cinematic kinetic version) from lines.json."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
L = json.load(open("lines.json", encoding="utf-8"))
data = {"dur": 224.0, "lines": [{"t": l["t"], "u": l["u"], "s": l["s"], "e": l["e"]} for l in L]}
html = open("cine.html", encoding="utf-8").read().replace("/*DATA*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":")))
open("kinetic_cine.html", "w", encoding="utf-8").write(html)
print("built", len(L), "lines")
