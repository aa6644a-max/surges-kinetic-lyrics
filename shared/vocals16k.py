"""Pick the vocal stem written by <song>/tools/sep.py and save it as mono 16 kHz vocals16k.wav.

  cd <song>/tools && python ../../shared/vocals16k.py

The vocal stem is the one with more near-silent frames (vocals pause between phrases, the band does not)."""
import numpy as np, soundfile as sf

d0, sr = sf.read("stem0.wav"); d1, _ = sf.read("stem1.wav")
def env(d): m = d.mean(1); h = sr // 20; return np.sqrt(np.add.reduceat(m * m, np.arange(0, len(m), h)) / h)
e0, e1 = env(d0), env(d1)
q0, q1 = (e0 < 0.01 * e0.max()).mean(), (e1 < 0.01 * e1.max()).mean()
v = 0 if q0 > q1 else 1
print("vocal stem", v, "silent frac", round(q0, 3), round(q1, 3))
voc = (d0 if v == 0 else d1).mean(1).astype(np.float32)
n = int(len(voc) * 16000 / sr)
voc16 = np.interp(np.linspace(0, len(voc) - 1, n), np.arange(len(voc)), voc).astype(np.float32)
sf.write("vocals16k.wav", voc16, 16000)
print("wrote vocals16k.wav", round(n / 16000, 1), "s")
