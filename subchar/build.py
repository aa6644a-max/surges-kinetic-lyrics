"""Build a page: python subchar/build.py <page>  (subchar/<page>.html -> subchar/<page>_built.html with the aligned lines)."""
import json, os, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
page = sys.argv[1] if len(sys.argv) > 1 else "trans"
L = json.load(open("lines.json", encoding="utf-8"))
html = open(page + ".html", encoding="utf-8").read().replace("/*DATA*/null", json.dumps({"dur": 214.4, "lines": L}, ensure_ascii=False, separators=(",", ":")))
open(page + "_built.html", "w", encoding="utf-8").write(html)
print("built", page, len(L), "lines")
