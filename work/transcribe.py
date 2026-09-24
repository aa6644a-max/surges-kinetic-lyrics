import json, sys
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8")
segs, info = m.transcribe("work/song.m4a", language="ja", word_timestamps=True,
    vad_filter=False, beam_size=5, condition_on_previous_text=False)
out = []
for s in segs:
    seg = {"start": round(s.start,2), "end": round(s.end,2), "text": s.text.strip(),
           "words": [{"w": w.word, "s": round(w.start,2), "e": round(w.end,2), "p": round(w.probability,2)} for w in s.words]}
    out.append(seg); print(f"[{s.start:6.2f}-{s.end:6.2f}] {s.text.strip()}", flush=True)
json.dump(out, open("work/lyrics.json","w",encoding="utf-8"), ensure_ascii=False, indent=1)
print("DONE")
