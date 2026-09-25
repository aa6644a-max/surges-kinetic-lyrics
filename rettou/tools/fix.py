"""Post-fixes after falign_ja.py: first characters pulled into a breath before the line, and the
compressed start of the word-list rap (read off the vocal envelope)."""
import json, os
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
L = json.load(open("lines.json", encoding="utf-8"))
MANUAL = {23: [99.80, 100.00, 100.25, 100.65, 101.01, 101.33, 101.89, 102.21]}   # 劣等 喪失 達成 存在
# "…ないって": the っ follows the dip right after ない and て is the long held note (vocal envelope)
TAIL = {18: (75.58, 75.68, 77.3), 40: (159.55, 159.62, 161.6)}
for i, l in enumerate(L):
    w = l["w"]
    if i in TAIL:
        w[-2][1], w[-1][1] = TAIL[i][0], TAIL[i][1]
    if i in MANUAL:
        for u, t in zip(w, MANUAL[i]): u[1] = t
    elif len(w) > 1 and w[1][1] - w[0][1] > .5:          # lone first char far before the second
        w[0][1] = round(w[1][1] - .3, 2)
    for j in range(len(w)):
        nx = w[j + 1][1] if j + 1 < len(w) else w[j][1] + .6
        w[j][2] = round(min(max(nx, w[j][1] + .06), w[j][1] + .9), 2)
    if i in TAIL: w[-1][2] = TAIL[i][2]
    l["s"], l["e"] = w[0][1], w[-1][2]
json.dump(L, open("lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for i in [0, 20, 23, 43, 47]: print(i, " ".join(f"{u[0]}@{u[1]}" for u in L[i]["w"][:5]))
