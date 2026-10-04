"""Build rettou/kinetic_fusion.html (v5 fusion: metaphor worlds + kinetic type + camera transitions) from lines.json."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
L = json.load(open("lines.json", encoding="utf-8"))
data = {"dur": 214.0, "lines": [{"s": l["s"], "e": l["e"], "t": l["t"], "ko": l["ko"], "w": l["w"]} for l in L]}
html = open("fusion.html", encoding="utf-8").read().replace("/*DATA*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":")))
open("kinetic_fusion.html", "w", encoding="utf-8").write(html)
print("built", len(L), "lines")
