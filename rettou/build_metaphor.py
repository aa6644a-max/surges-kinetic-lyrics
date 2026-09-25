"""Build rettou/kinetic_metaphor.html (v3, illustrated-metaphor direction) from lines.json."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
L = json.load(open("lines.json", encoding="utf-8"))
data = {"dur": 214.0, "lines": [{"s": l["s"], "e": l["e"], "t": l["t"], "ko": l["ko"], "w": l["w"]} for l in L]}
html = open("metaphor.html", encoding="utf-8").read().replace("/*DATA*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":")))
open("kinetic_metaphor.html", "w", encoding="utf-8").write(html)
print("built", len(L), "lines")
