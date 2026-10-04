"""Force-align orange/lyrics.txt (jp | ko) to the separated vocals with the ReazonSpeech zipformer
(character vocab). One unit per Japanese character; Latin words are aligned through katakana and kept
as one unit. Blocks of lines are aligned inside windows taken from the Whisper phrases.
Output: ../lines.json  [{t, ko, u:[[text,s,e,isLatin,spaceBefore]], s, e}]"""
import json, os, re, sys
import numpy as np
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.argv = sys.argv[:1]
import importlib.util
spec = importlib.util.spec_from_file_location("fa", "../../rettou/tools/falign_ja.py")
src = open("../../rettou/tools/falign_ja.py", encoding="utf-8").read().split("rows = [r.split")[0]
src = src.replace('os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")', 'pass')
fa = {}; exec(compile(src.replace('"tools/vocals16k.wav"', '"vocals16k.wav"'), "falign_ja", "exec"), fa)
align = fa["align"]

KATA = {"oh": "オー"}
# words whose sung reading differs from the characters the acoustic model expects: one display unit, aligned as the reading
SPECIAL = {"瞬間": "時", "時間": "時", "1秒": "一秒"}
GLUE = set("「」『』！？、。…“”\"',?")
BLOCKS = [((0, 2), 31.5, 46.5), ((3, 5), 46.4, 60.7), ((6, 7), 60.5, 70.3), ((8, 9), 70.3, 80.0), ((10, 10), 80.0, 83.5),
          ((11, 14), 88.2, 108.0), ((15, 16), 107.9, 117.1), ((17, 18), 117.1, 126.7), ((19, 20), 126.6, 136.4),
          ((21, 21), 136.4, 141.0), ((22, 22), 145.8, 150.0), ((23, 25), 156.6, 169.6), ((26, 27), 172.3, 181.8),
          ((28, 29), 181.7, 191.7), ((30, 32), 191.7, 206.1), ((33, 33), 206.0, 210.8), ((34, 34), 210.8, 215.5), ((35, 35), 220.2, 225.5)]
if os.environ.get("BLOCKS"): BLOCKS = json.loads(os.environ["BLOCKS"])

def units_of(jp):
    out = []; sp = False
    for tok in re.findall("|".join(map(re.escape, SPECIAL)) + r"|[A-Za-z]+…?|\s|　|.", jp):
        if tok in (" ", "　"): sp = True; continue
        if tok in GLUE:
            if out: out[-1][0] += tok
            else: out.append([tok, "", False, False])
            continue
        if re.match(r"[A-Za-z]", tok): out.append([tok, KATA.get(tok, KATA.get(tok.lower(), tok)), True, sp]); sp = False; continue
        out.append([tok, SPECIAL.get(tok, tok), False, sp]); sp = False
    # leading glue-only unit (e.g. an opening bracket) merges into the next
    if out and out[0][1] == "" and len(out) > 1: out[1][0] = out[0][0] + out[1][0]; out = out[1:]
    return out

rows = [r.split("|") for r in open("../lyrics.txt", encoding="utf-8") if r.strip() and not r.startswith("#")]
LINES = [{"t": r[0].strip(), "ko": r[1].strip(), "u": units_of(r[0].strip())} for r in rows]
done = set()
for (a, b), t0, t1 in BLOCKS:
    chars, owner = [], []
    for li in range(a, b + 1):
        for ui, u in enumerate(LINES[li]["u"]):
            owner.append((li, ui, len(chars))); chars += list(u[1])
    times = align(t0, t1, chars)
    for li, ui, k in owner: LINES[li]["u"][ui].append(round(times[k], 2))
    done |= set(range(a, b + 1))
    print(f"block {a}-{b}", " | ".join(f"{LINES[li]['u'][0][0]}@{LINES[li]['u'][0][4]}" for li in range(a, b + 1)))
out = []
for li, L in enumerate(LINES):
    if li not in done: continue
    us = L["u"]; nxt = LINES[li + 1]["u"][0][4] if li + 1 in done else us[-1][4] + 2
    U = []
    for k, u in enumerate(us):
        s = u[4]; e = us[k + 1][4] if k + 1 < len(us) else min(nxt - .05, s + 2.0)
        e = min(max(e, s + .06), s + (1.0 if k + 1 < len(us) else 2.0))
        U.append([u[0], s, round(e, 2), 1 if u[2] else 0, 1 if u[3] else 0])
    out.append({"i": li, "t": L["t"], "ko": L["ko"], "u": U, "s": U[0][1], "e": U[-1][2]})
json.dump(out, open("../lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("wrote", len(out), "lines")
