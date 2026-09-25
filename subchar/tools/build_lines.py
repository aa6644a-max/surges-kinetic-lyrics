"""Force-align lyrics.txt to the separated vocals.
Korean is aligned syllable by syllable; English words are aligned through a Hangul transliteration
and keep one unit per word. Lines are aligned in blocks whose windows come from the Whisper phrases."""
import json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
os.chdir(os.path.dirname(os.path.abspath(__file__)))
import falign as FA

TR = {"im": "아임", "a": "어", "sub": "서브", "character": "캐릭터", "extra": "엑스트라일", "oh": "오", "but": "벗",
      "just": "저스트", "another": "어나더", "loser": "루저", "tell": "텔", "me": "미", "i": "아이", "wanna": "워너",
      "be": "비", "you": "유", "montage": "몽타주", "dont": "돈트", "care": "케어", "help": "헬프"}
NUM = {"6": "육", "1": "일"}
BLOCKS = [((0, 2), 15.2, 20.2), ((3, 5), 20.1, 25.35), ((6, 9), 25.2, 31.1), ((10, 15), 31.0, 45.1), ((16, 16), 45.0, 47.6),
          ((17, 25), 48.2, 65.1), ((26, 27), 65.2, 70.1), ((28, 29), 82.3, 87.5), ((30, 32), 87.45, 92.6), ((33, 34), 92.7, 95.5),
          ((35, 39), 95.55, 107.9), ((40, 42), 107.9, 114.95), ((43, 45), 114.95, 121.3), ((46, 50), 121.3, 131.2),
          ((51, 52), 131.15, 137.3), ((53, 54), 137.3, 142.6), ((55, 56), 142.6, 147.6), ((57, 58), 147.6, 153.9),
          ((59, 59), 153.9, 156.3), ((60, 68), 156.6, 173.5), ((69, 70), 173.6, 178.7), ((71, 76), 178.9, 192.8),
          ((77, 79), 192.75, 198.1), ((80, 81), 198.1, 204.3)]
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
