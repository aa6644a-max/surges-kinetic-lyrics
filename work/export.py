import json
L = json.load(open("work/lyrics.json", encoding="utf-8"))
print([(w["w"], w["s"], w["p"]) for w in L[4]["words"]])

def srt_t(t):
    ms = int(round(t * 1000))
    return "%02d:%02d:%02d,%03d" % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)

with open("lyrics.srt", "w", encoding="utf-8") as f:
    f.write("\n".join(f"{i+1}\n{srt_t(s['start'])} --> {srt_t(s['end'])}\n{s['text']}\n" for i, s in enumerate(L)))
with open("lyrics.lrc", "w", encoding="utf-8") as f:
    f.write("\n".join("[%02d:%05.2f]%s" % (s["start"] // 60, s["start"] % 60, s["text"]) for s in L))

b = json.load(open("work/beats.json"))
data = {"bpm": b["bpm"], "beats": b["beats"],
        "lines": [{"s": x["start"], "e": x["end"], "t": x["text"],
                   "w": [[w["w"].strip(), w["s"], w["e"]] for w in x["words"] if w["w"].strip()]} for x in L]}
json.dump(data, open("work/data.json", "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print("ok", sum(len(l["w"]) for l in data["lines"]), "words")
