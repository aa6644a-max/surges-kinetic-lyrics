"""Hand-set start times for English-only lines, read off the vocal envelope (the Korean model can't align English)."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
FIX = {
    0: [1.72, 2.18, 2.55],                        # Sailing My Sea!
    1: [2.80, 4.37, 4.85, 5.80],                  # Yeah~ Never Say Die
    2: [6.66, 6.93, 7.93, 9.02],                  # Gotta Go! Go!! Go!!!
    34: [100.85, 102.40, 102.95, 103.88, 104.78, 105.05],  # Yeah~ Never Say Die Gotta Go!
    35: [106.08, 107.13],                         # Go!! Go!!!
}
END = {0: 2.78, 1: 6.45, 2: 10.62, 34: 105.55, 35: 108.7}
L = json.load(open("lines.json", encoding="utf-8"))
for i, ts in FIX.items():
    w = L[i]["w"]; assert len(w) == len(ts), (i, len(w))
    for k, t in enumerate(ts):
        w[k][1] = t; w[k][2] = round(min(ts[k + 1] if k + 1 < len(ts) else END[i], t + .9), 2)
    L[i]["s"], L[i]["e"] = w[0][1], w[-1][2]
json.dump(L, open("lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("fixed", list(FIX))
