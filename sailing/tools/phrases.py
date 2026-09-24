import numpy as np, soundfile as sf, sherpa_onnx as s, json
v,sr=sf.read("vocals16k.wav",dtype="float32")
h=160  # 10ms
e=np.sqrt(np.add.reduceat(v*v,np.arange(0,len(v),h))/h)
e=np.convolve(e,np.ones(3)/3,'same')
thr=0.08*np.percentile(e,99)
act=e>thr
segs=[];st=None
for i,a in enumerate(act):
    if a and st is None: st=i
    if not a and st is not None:
        if i-st>=8: segs.append([st,i])
        st=None
m=[]
for a,b in segs:
    if m and a-m[-1][1]<12: m[-1][1]=b   # merge gaps <120ms
    else: m.append([a,b])
m=[[a/100,b/100] for a,b in m if b-a>=15]
print(len(m),"phrases")
M="../models/sherpa-onnx-whisper-large-v3/"
rec=s.OfflineRecognizer.from_whisper(encoder=M+"large-v3-encoder.int8.onnx",decoder=M+"large-v3-decoder.int8.onnx",tokens=M+"large-v3-tokens.txt",language="ko",task="transcribe",num_threads=4)
out=[]
for a,b in m:
    st=rec.create_stream(); st.accept_waveform(sr,v[int(max(0,a-.1)*sr):int((b+.1)*sr)]); rec.decode_stream(st)
    out.append({"s":a,"e":b,"text":st.result.text.strip()}); print(f"{a:6.2f}-{b:6.2f} {st.result.text.strip()}",flush=True)
json.dump(out,open("phrases.json","w"),ensure_ascii=False,indent=1)
