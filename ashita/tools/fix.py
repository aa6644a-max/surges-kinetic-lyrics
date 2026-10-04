"""Manual fixes after build_lines.py (read off the vocal envelope / Whisper windows)."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
L = json.load(open("lines.json", encoding="utf-8"))
ST = {19: {0: 85.33}}
for i, m in ST.items():
    u = L[i]["u"]
    for k, s0 in m.items(): u[k][1] = s0
    for k in range(len(u) - 1): u[k][2] = round(max(u[k + 1][1], u[k][1] + .06), 2)
    L[i]["s"], L[i]["e"] = u[0][1], u[-1][2]
json.dump(L, open("lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("fixed", list(ST))
