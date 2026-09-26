"""Build subchar/kinetic_type.html (kinetic typography version) from lines.json."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
L = json.load(open("lines.json", encoding="utf-8"))
data = {"dur": 214.4, "lines": L}
html = open("kinetic.html", encoding="utf-8").read().replace("/*DATA*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":")))
open("kinetic_type.html", "w", encoding="utf-8").write(html)
print("built", len(L), "lines")
