"""Manual fixes read off the vocal envelope: the opening 'Star trail' and the closing chant."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
L = json.load(open("lines.json", encoding="utf-8"))
FIX = {0: {0: (6.92, 7.9), 1: (8.0, 9.15)}, 35: {0: (205.7, 206.6), 1: (206.65, 207.3), 2: (207.3, 210.0)}}
for i, m in FIX.items():
    for k, (s, e) in m.items(): L[i]["u"][k][1], L[i]["u"][k][2] = s, e
    L[i]["s"], L[i]["e"] = L[i]["u"][0][1], L[i]["u"][-1][2]
json.dump(L, open("lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("fixed", list(FIX))
