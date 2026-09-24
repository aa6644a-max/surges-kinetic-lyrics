"""Build kinetic.html (1080x1920 vertical) and lyrics.srt/.lrc from work/lines.json (see align.py)."""
import json

L = json.load(open("work/lines.json", encoding="utf-8"))
b = json.load(open("work/beats.json"))
data = {"dur": 142.5, "bpm": b["bpm"], "beats": b["beats"], "energy": b.get("energy_0p5s"),
        "lines": [{k: x[k] for k in ("s", "e", "w", "ko", "bk", "bko")} for x in L]}
html = open("work/template.html", encoding="utf-8").read()
open("kinetic.html", "w", encoding="utf-8").write(
    html.replace("/*DATA*/null", json.dumps(data, ensure_ascii=False, separators=(",", ":"))))

def srt_t(t):
    ms = int(round(t * 1000))
    return "%02d:%02d:%02d,%03d" % (ms // 3600000, ms // 60000 % 60, ms // 1000 % 60, ms % 1000)

with open("lyrics.srt", "w", encoding="utf-8") as f:
    f.write("\n".join(f"{i+1}\n{srt_t(s['s'])} --> {srt_t(s['e'])}\n{s['t']}\n{s['ko']}\n" for i, s in enumerate(L)))
with open("lyrics.lrc", "w", encoding="utf-8") as f:
    f.write("\n".join("[%02d:%05.2f]%s" % (s["s"] // 60, s["s"] % 60, s["t"]) for s in L))
print("built", len(L), "lines")
