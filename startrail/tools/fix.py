"""Manual fixes read off the vocal envelope: the opening 'Star trail' and the closing chant."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
L = json.load(open("lines.json", encoding="utf-8"))
# (start times per unit index; ends are re-derived from the next start). Read off the vocal envelope (syllable onsets after dips).
ST = {3: {0: 34.7, 1: 34.88},
      15: {6: 102.75, 7: 103.55, 8: 103.85, 9: 104.15, 10: 104.3, 11: 104.65},
      18: {0: 113.25, 1: 113.55, 2: 113.88, 3: 114.2},
      26: {6: 157.25, 7: 157.6, 8: 157.9, 9: 158.1, 10: 158.55, 11: 158.85},
      32: {2: 187.9, 3: 188.1, 4: 188.25, 5: 188.55, 6: 188.9, 7: 189.2, 8: 189.5, 9: 190.0, 10: 190.15, 11: 190.45, 12: 190.65, 13: 191.0},
      34: {6: 199.25, 7: 199.45, 8: 199.7, 9: 201.3, 10: 201.6, 11: 201.95, 12: 202.25, 13: 202.6, 14: 203.1, 15: 203.25, 16: 203.4},
      35: {1: 206.15, 2: 206.75}}
LAST_END = {3: 39.3, 15: 105.5, 18: 115.45, 26: 160.5, 32: 191.35, 34: 204.55, 35: 210.0}
for i, m in ST.items():
    u = L[i]["u"]
    for k, s0 in m.items(): u[k][1] = s0
    for k in range(len(u)):
        nx = u[k + 1][1] if k + 1 < len(u) else LAST_END[i]
        u[k][2] = round(min(max(nx, u[k][1] + .08), u[k][1] + (1.3 if k + 1 < len(u) else 2.5)), 2)
    L[i]["s"], L[i]["e"] = u[0][1], u[-1][2]
FIX = {0: {0: (6.92, 7.9), 1: (8.0, 9.15)}}
for i, m in FIX.items():
    for k, (s, e) in m.items(): L[i]["u"][k][1], L[i]["u"][k][2] = s, e
    L[i]["s"], L[i]["e"] = L[i]["u"][0][1], L[i]["u"][-1][2]
json.dump(L, open("lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("fixed", list(FIX))
