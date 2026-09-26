"""Manual fixes read off the vocal envelope where the forced alignment slipped."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
L = json.load(open("lines.json", encoding="utf-8"))
# unit start times per line (index -> start); ends are re-derived from the next start, the last unit keeps its end
ST = {17: {0: 48.55, 1: 48.95, 2: 49.1, 3: 49.45},          # chorus 1 "I'm a sub character" starts on the onset at 48.55
      43: {0: 115.45, 1: 115.75, 2: 116.0, 3: 116.5},        # chorus B: onset at 115.45, "딱히" at the phrase start 117.3
      44: {0: 117.3, 1: 117.5, 2: 117.75, 3: 117.95, 4: 118.15, 5: 118.35},
      36: {0: 98.4, 1: 98.62},                               # "어떤" was glued to the end of line 35
      57: {0: 147.92, 1: 148.1},
      72: {0: 182.85, 1: 183.05},                            # "결국" is held until ~182.6
      77: {0: 192.9, 1: 193.15, 2: 193.45},
      # "Tell me ..." lines: the aligner pushed the Korean half late; starts read off the voiced segments
      26: {0: 65.42, 1: 65.72, 2: 66.0, 3: 66.2, 4: 66.5, 5: 66.75, 6: 67.0, 7: 67.3, 8: 67.55},
      27: {0: 68.04, 1: 68.35},
      51: {2: 132.66, 3: 132.85, 4: 133.05, 5: 133.25, 6: 133.45, 7: 134.06, 8: 134.4},
      52: {0: 135.2},
      69: {0: 173.82, 1: 174.12, 2: 174.4, 3: 174.6, 4: 174.86, 5: 175.1, 6: 175.35, 7: 175.7, 8: 175.92},
      70: {0: 176.5, 1: 176.78}}                  # "I don't care" starts right after the dip at 192.85
for i, m in ST.items():
    u = L[i]["u"]
    for k, s0 in m.items(): u[k][1] = s0
    for k in range(len(u) - 1):
        u[k][2] = round(min(max(u[k + 1][1], u[k][1] + .08), u[k][1] + 1.3), 2)
    L[i]["s"], L[i]["e"] = u[0][1], u[-1][2]
L[71]["u"][-1][2] = L[71]["e"] = 182.6
for a, b in zip(L, L[1:]):                                   # a moved start must not overlap the previous line
    if a["e"] > b["s"] - .05: a["u"][-1][2] = a["e"] = round(max(a["u"][-1][1] + .08, b["s"] - .05), 2)
json.dump(L, open("lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("fixed", list(ST))
