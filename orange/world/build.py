"""Build the page: python orange/world/build.py  (index.html + ../lines.json -> index_built.html)."""
import json, os
here = os.path.dirname(os.path.abspath(__file__))
L = json.load(open(os.path.join(here, "..", "lines.json"), encoding="utf-8"))
html = open(os.path.join(here, "index.html"), encoding="utf-8").read().replace("/*DATA*/null", json.dumps({"dur": 232.4, "lines": L}, ensure_ascii=False, separators=(",", ":")))
open(os.path.join(here, "index_built.html"), "w", encoding="utf-8").write(html)
print("built", len(L), "lines")
