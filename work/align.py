"""Map the correct lyrics (work/lyrics_user.txt) onto Whisper timings (work/lyrics.json).

lyrics_user.txt holds triples: Japanese / Korean pronunciation / Korean translation.
Text in (...) is a backing vocal: shown with its line but not used for timing.
Whisper tokens are split into characters, then the correct lyric characters are
aligned to them with difflib; unmatched runs are spread over the matched gap.
"""
import difflib, json, re

PUNCT = set("「」！？!?”“\"、。 　・…")
# Lines the singer repeats that the lyric sheet leaves out: (insert before line index, triple)
EXTRA = [(24, ("流れ続く空と日々の狭間に", "나가레츠즈쿠 소라토 히비노 하자마니", "계속 이어지는 하늘과 나날들의 사이에"))]

raw = [l.rstrip("\n") for l in open("work/lyrics_user.txt", encoding="utf-8") if l.strip()]
lines = [tuple(raw[i:i + 3]) for i in range(0, len(raw), 3)]
for idx, t in sorted(EXTRA, reverse=True):
    lines.insert(idx, t)

def split_paren(s):
    m = re.search(r"\s*[（(](.*?)[)）]\s*$", s)
    return (s[:m.start()], m.group(1)) if m else (s, "")

# whisper characters with times
wc = []
for seg in json.load(open("work/lyrics.json", encoding="utf-8")):
    for w in seg["words"]:
        t = w["w"].strip()
        if not t:
            continue
        d = (w["e"] - w["s"]) / len(t)
        wc += [(c, w["s"] + k * d, w["s"] + (k + 1) * d) for k, c in enumerate(t)]

# lyric characters (main vocal only)
lc = []  # (line, pos-in-line, char)
parsed = []
for li, (jp, ro, ko) in enumerate(lines):
    main, back = split_paren(jp)
    parsed.append({"main": main, "back": back, "ro": split_paren(ro), "ko": split_paren(ko)})
    lc += [(li, k, c) for k, c in enumerate(main) if c not in PUNCT]

A = "".join(c for _, _, c in lc)
B = "".join(c for c, _, _ in wc)
sm = difflib.SequenceMatcher(None, A, B, autojunk=False)
times = [None] * len(A)
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1):
            times[i1 + k] = wc[j1 + k][1:]
    elif tag == "replace":
        s, e = wc[j1][1], wc[j2 - 1][2]
        n = i2 - i1
        for k in range(n):
            times[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
# pure insertions: interpolate between neighbours
i = 0
while i < len(times):
    if times[i] is None:
        j = i
        while j < len(times) and times[j] is None:
            j += 1
        s = times[i - 1][1] if i else 0.0
        e = times[j][0] if j < len(times) else s + 0.25 * (j - i)
        n = j - i
        for k in range(n):
            times[i + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
        i = j
    i += 1
print("match ratio %.2f" % sm.ratio())

out = []
for li, p in enumerate(parsed):
    ct = {k: times[n] for n, (l, k, _) in enumerate(lc) if l == li}
    # units: every character, punctuation glued to its neighbour
    units, last, quoted = [], None, False
    for k, c in enumerate(p["main"]):
        if c in " 　":
            continue
        if c in PUNCT:
            opening = c in "「“" or (c in "”\"" and not quoted)  # ”…” is used as a pair
            if c in "”\"":
                quoted = not quoted
            if units and not opening: units[-1][0] += c
            else: last = c  # opening mark: prefix next unit
            continue
        s, e = ct[k]
        units.append([(last or "") + c, round(s, 3), round(e, 3)])
        last = None
    s, e = units[0][1], units[-1][2]
    out.append({"s": s, "e": e, "t": p["main"].strip(), "w": units,
                "bk": p["back"], "ro": p["ro"][0].strip(), "ko": p["ko"][0].strip(),
                "bko": p["ko"][1]})
for o in out:
    print("%7.2f-%7.2f %s%s" % (o["s"], o["e"], o["t"], ("  (" + o["bk"] + ")") if o["bk"] else ""))
json.dump(out, open("work/lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
