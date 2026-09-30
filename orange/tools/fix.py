"""Manual fixes after build_lines.py (read off the vocal envelope / Whisper windows)."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
L = json.load(open("lines.json", encoding="utf-8"))
ST = {0: {0: 31.9, 1: 32.08},                            # "さ" onset 31.92 (Whisper 31.92)
      16: {0: 112.85, 1: 112.95, 2: 113.05, 3: 113.15},   # "追いかけて" onset 112.9
      22: {0: 146.1}, 25: {0: 166.35}, 27: {0: 177.6},   # onsets 146.14 / 166.38 / 177.68 ("後に" = Whisper "音に")
      30: {0: 191.8}, 35: {0: 220.5}}                     # Whisper 191.78 / 220.54
for i, m in ST.items():
    u = L[i]["u"]
    for k, s0 in m.items(): u[k][1] = s0
    for k in range(len(u) - 1): u[k][2] = round(max(u[k + 1][1], u[k][1] + .06), 2)
    L[i]["s"], L[i]["e"] = u[0][1], u[-1][2]
json.dump(L, open("lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("fixed", list(ST))
