"""Force-align the Japanese lyrics (lyrics.txt) to the separated vocals with the ReazonSpeech zipformer
transducer (character vocab, Viterbi with one symbol per frame) -> lines.json.
Needs: tools/vocals16k.wav (UVR vocals, 16 kHz) and the sherpa-onnx model dir in $JA_MODEL."""
import numpy as np, soundfile as sf, onnxruntime as ort, kaldi_native_fbank as knf, json, os, re
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/..")
import os
MD=os.environ.get("CINE_MODELS") or next(p for p in ("models","../models","../../models") if os.path.isdir(p))   # model dir: $CINE_MODELS or the repo-level models/ folder
M = os.environ.get("JA_MODEL", MD + "/sherpa-onnx-zipformer-ja-reazonspeech-2024-08-01") + "/"
enc = ort.InferenceSession(M + "encoder-epoch-99-avg-1.onnx")
dec = ort.InferenceSession(M + "decoder-epoch-99-avg-1.onnx")
joi = ort.InferenceSession(M + "joiner-epoch-99-avg-1.onnx")
tok = {}
for l in open(M + "tokens.txt", encoding="utf-8"):
    p = l.rstrip("\n").split("\t")
    if len(p) == 2: tok[p[0]] = int(p[1])
v, sr = sf.read("tools/vocals16k.wav", dtype="float32")
PUN = set("？！、。　 ")

def fbank(x):
    o = knf.FbankOptions(); o.frame_opts.dither = 0; o.frame_opts.samp_freq = 16000
    o.frame_opts.snip_edges = False; o.mel_opts.num_bins = 80
    f = knf.OnlineFbank(o); f.accept_waveform(16000, x.tolist()); f.input_finished()
    return np.array([f.get_frame(i) for i in range(f.num_frames_ready)], dtype=np.float32)

def align(a, b, chars):
    x = v[int(a * sr):int(b * sr)]; x = x / (np.abs(x).max() + 1e-6) * .5
    F = fbank(x)[None]
    E = enc.run(None, {"x": F, "x_lens": np.array([F.shape[1]], np.int64)})[0][0]
    T = E.shape[0]; fr = (b - a) / T
    ids = [tok.get(c, tok.get("<unk>", 2)) for c in chars]; U = len(ids)
    ctx = [[0, 0]] + [[ids[u - 2] if u >= 2 else 0, ids[u - 1]] for u in range(1, U + 1)]
    Dout = dec.run(None, {"y": np.array(ctx, np.int64)})[0].astype(np.float32)
    NEG = -1e30; A = np.full(U + 1, NEG); A[0] = 0; Bk = np.zeros((T + 1, U + 1), np.int8)
    tgt = np.array(ids + [0]); ar = np.arange(U + 1)
    for t in range(T):
        lg = joi.run(None, {"encoder_out": np.repeat(E[t:t + 1], U + 1, 0).astype(np.float32), "decoder_out": Dout})[0]
        m = lg.max(1, keepdims=True); lp = lg - m - np.log(np.exp(lg - m).sum(1, keepdims=True))
        stay = A + lp[:, 0]
        emit = np.full(U + 1, NEG); emit[1:] = A[:-1] + lp[ar[:-1], tgt[:-1]]
        Bk[t + 1] = emit > stay; A = np.maximum(stay, emit)
    u = U; times = [0.0] * U
    for t in range(T, 0, -1):
        if u > 0 and Bk[t, u]: times[u - 1] = a + (t - 1) * fr; u -= 1
    return times

rows = [r.split("|") for r in open("lyrics.txt", encoding="utf-8") if r.strip() and not r.startswith("#")]
rows = [(tuple(map(float, r[0].split("-"))), r[1].strip(), r[2].strip()) for r in rows]
out = []; i = 0
while i < len(rows):
    win = rows[i][0]; grp = [r for r in rows[i:] if r[0] == win]
    grp = grp[:next((k for k, r in enumerate(grp) if r[0] != win), len(grp))]
    chars = [c for _, jp, _ in grp for c in jp if c not in PUN]
    times = align(win[0], win[1], chars); k = 0
    for _, jp, ko in grp:
        units = []
        for c in jp:
            if c in PUN:
                if units: units[-1][3] = 1 if c in "　 " else units[-1][3]
                if units and c not in "　 ": units[-1][0] += c
                continue
            units.append([c, round(times[k], 2), 0, 0]); k += 1
        out.append({"t": jp, "ko": ko, "w": units})
    print(f"{win}: {len(chars)} chars")
    i += len(grp)
for l in out:
    w = l["w"]
    for j in range(len(w)):
        nx = w[j + 1][1] if j + 1 < len(w) else w[j][1] + .6
        w[j][2] = round(min(max(nx, w[j][1] + .06), w[j][1] + .9), 2)
    l["s"], l["e"] = w[0][1], w[-1][2]
    print(f'{l["s"]:7.2f} {l["t"]}  ' + " ".join(f"{u[0]}{u[1]:.2f}" for u in w[:6]))
json.dump(out, open("lines.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
