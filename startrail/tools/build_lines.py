"""Force-align lyrics.txt to the separated vocals.
Korean is aligned syllable by syllable; English words are aligned through a Hangul transliteration
and keep one unit per word. Lines are aligned in blocks whose windows come from the Whisper phrases."""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import falign as FA

TR = {"star": "스타", "trail": "트레일", "we": "위", "are": "아", "stellive": "스텔라이브", "luminous": "루미너스",
      "everys": "에브리스", "cliche": "클리셰", "universe": "유니버스", "make": "메이크", "each": "이치", "other": "아더",
      "shine": "샤인", "brighter": "브라이터", "starlight": "스타라이트", "if": "이프", "just": "저스트", "stay": "스테이",
      "here": "히어", "will": "윌", "fade": "페이드", "away": "어웨이", "la": "라", "stage": "스테이지", "do": "두",
      "you": "유", "wanna": "워너", "come": "컴", "with": "위드", "me": "미"}
NUM = {"6": "육", "1": "일"}
BLOCKS = [((0, 1), 6.5, 19.0), ((2, 3), 29.6, 39.3), ((4, 5), 39.7, 49.8), ((6, 8), 49.4, 59.7), ((9, 10), 59.4, 70.3),
          ((11, 12), 70.1, 84.0), ((13, 13), 83.9, 90.2), ((14, 15), 95.9, 105.9), ((16, 18), 105.5, 115.8),
          ((19, 22), 115.7, 138.6), ((23, 24), 139.4, 150.2), ((25, 26), 151.2, 160.8), ((27, 29), 160.5, 177.0),
          ((30, 31), 176.6, 186.5), ((32, 34), 186.3, 205.0), ((35, 35), 205.4, 211.5)]
sp = FA.sp

def units_of(line):
    """-> list of [display, translit, isEN, spaceBefore]"""
    out = []
    for wi, word in enumerate(line.split()):
        if re.match(r"^[A-Za-z]", word):
            parts = word.split("-") if word.lower().startswith("la-") else [word]
            for k, p in enumerate(parts):
                key = re.sub(r"[^a-z]", "", p.lower())
                disp = p + ("-" if k < len(parts) - 1 else "")
                out.append([disp, TR[key], True, wi > 0 or k > 0])
        else:
            syl = [c for c in word if re.match(r"[가-힣0-9]", c)]
            for k, c in enumerate(syl):
                out.append([c, NUM.get(c, c), False, wi > 0 and k == 0])
            if out and not syl:
                continue
            tail = re.sub(r"[가-힣0-9A-Za-z]", "", word)       # punctuation stays glued to the last syllable
            if tail and out: out[-1][0] += tail
    return out

def ids_of(tr, word_initial):
    pieces = sp.encode(tr, out_type=str)
    if not word_initial and pieces and pieces[0].startswith("▁"):
        head = pieces[0][1:]
        if not head: pieces = pieces[1:]
        elif sp.piece_to_id(head) != sp.unk_id(): pieces[0] = head
    return [sp.piece_to_id(p) for p in pieces]

lyr = [l.strip() for l in open("../lyrics.txt", encoding="utf-8") if l.strip()]
LINES = [{"t": l, "u": units_of(l)} for l in lyr]
for (a, b), t0, t1 in BLOCKS:
    ids, owner = [], []
    for li in range(a, b + 1):
        for ui, u in enumerate(LINES[li]["u"]):
            wi = u[3] or ui == 0
            if u[2] and not wi:          # English word glued inside a hyphen chain behaves as word initial too
                wi = True
            ii = ids_of(u[1], wi)
            owner.append((li, ui, len(ids))); ids += ii
    _, times = FA.align(t0, t1, "", ids=ids)
    for li, ui, k in owner:
        LINES[li]["u"][ui].append(round(times[k], 2))
    print(f"block {a}-{b}: {t0}-{t1}", " | ".join(f"{LINES[li]['u'][0][0]}@{LINES[li]['u'][0][4]}" for li in range(a, b + 1)))
out = []
for li, L in enumerate(LINES):
    us = L["u"]
    nxt = LINES[li + 1]["u"][0][4] if li + 1 < len(LINES) else us[-1][4] + 3
    blk_end = next(t1 for (a, b), t0, t1 in BLOCKS if a <= li <= b)
    U = []
    for k, u in enumerate(us):
        s = u[4]
        e = us[k + 1][4] if k + 1 < len(us) else min(nxt - .05, blk_end, s + 2.5)
        e = min(max(e, s + .08), s + (1.2 if k + 1 < len(us) else 2.5))
        U.append([u[0], s, round(e, 2), 1 if u[2] else 0, 1 if u[3] else 0])
    out.append({"t": L["t"], "u": U, "s": U[0][1], "e": U[-1][2]})
json.dump(out, open("../lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("wrote", len(out), "lines")
