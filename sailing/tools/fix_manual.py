"""Hand-set syllable/word start times read off the separated-vocal envelope (+ Whisper probes).
Run after align3.py. The second pre-chorus (1:22-1:36) repeats the first one exactly 54.27s later."""
import json, os, copy
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
L = json.load(open("lines.json", encoding="utf-8"))
GOTD = lambda a, b: [a, a + .21, a + .36, a + .51, b, b + .21, b + .36, b + .51]
FIX = {
    0: [1.72, 2.18, 2.55],                                   # Sailing My Sea!
    1: [2.80, 4.37, 4.85, 5.80],                             # Yeah~ Never Say Die
    2: [6.66, 6.93, 7.93, 9.02],                             # Gotta Go! Go!! Go!!!
    7: GOTD(27.83, 28.84),                                   # Get on the Deck! x2
    9: GOTD(32.00, 33.05),
    10: [34.14, 34.25, 34.40, 34.55, 34.70, 34.90, 35.15, 35.40, 35.65, 36.15, 36.65, 37.20, 37.70],  # 붉은 태양의 저 바다로 출발하자
    11: [38.25, 38.75, 39.33, 39.87, 40.37, 40.88, 41.43],   # 다 함께 할렐루야
    19: [59.28, 59.52, 59.61, 60.41, 60.64, 60.79, 61.14, 61.59, 61.99, 62.44, 62.74, 63.04, 63.19],  # 이 세상 끝까지 자유롭게 가보자
    33: [92.52, 94.17, 94.40],                               # Yeah~ Oh Yeah~
    34: [100.85, 102.40, 102.95, 103.88, 104.78, 105.05],    # Yeah~ Never Say Die Gotta Go!
    35: [106.08, 107.13],                                    # Go!! Go!!!
    44: [130.15, 130.40, 130.55, 131.35, 131.60, 131.75, 132.10, 132.55, 132.95, 133.40, 133.70, 134.00, 134.15],
}
END = {0: 2.78, 1: 6.45, 2: 10.62, 11: 42.1, 19: 63.45, 33: 95.85, 34: 105.55, 35: 108.7, 44: 134.45}
# 오션라이너 tail (line 28): 질주하자 오션라이너
tail = [80.80, 80.95, 81.10, 81.25, 81.40, 81.50, 81.65, 81.80, 81.90]
w = L[28]["w"]
for k, t in enumerate(tail): w[len(w) - len(tail) + k][1] = t
head = len(w) - len(tail)                      # 위험을 넘어 끝없이: evenly from 80.01
for k in range(head): w[k][1] = round(80.01 + (80.78 - 80.01) * k / head, 2)
END[28] = 82.02
# second pre-chorus = first one + 54.27s (line 29 sings Get on the Deck twice again)
L[29] = copy.deepcopy(L[7])
for src, dst in [(7, 29), (8, 30), (9, 31), (10, 32)]:
    ts = FIX.get(src) or [u[1] for u in L[src]["w"]]
    FIX[dst] = [round(t + 54.27, 2) for t in ts]
END[32] = 92.35
for i, ts in FIX.items():
    w = L[i]["w"]; assert len(w) == len(ts), (i, len(w), len(ts))
    for k, t in enumerate(ts): w[k][1] = t
for i, l in enumerate(L):
    w = l["w"]
    for k in range(len(w)):
        nxt = w[k + 1][1] if k + 1 < len(w) else END.get(i, w[k][1] + .5)
        w[k][2] = round(min(max(nxt, w[k][1] + .08), w[k][1] + .9), 2)
    l["s"], l["e"] = w[0][1], w[-1][2]
json.dump(L, open("lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("fixed", sorted(FIX), "+ line 28 tail")
