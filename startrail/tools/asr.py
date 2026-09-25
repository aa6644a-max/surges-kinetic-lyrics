import sherpa_onnx as s, numpy as np, soundfile as sf, json
M="/tmp/claude-0/models/sherpa-onnx-zipformer-korean-2024-06-24/"
d0,sr=sf.read("stem0.wav"); d1,_=sf.read("stem1.wav")
def env(d): m=d.mean(1); h=sr//20; return np.sqrt(np.add.reduceat(m*m,np.arange(0,len(m),h))/h)
e0,e1=env(d0),env(d1)
# vocal stem = the one with more near-silent frames
v = 0 if (e0<0.01*e0.max()).mean()>(e1<0.01*e1.max()).mean() else 1
print("vocal stem",v,"silent frac",(e0<0.01*e0.max()).mean(),(e1<0.01*e1.max()).mean())
voc=(d0 if v==0 else d1).mean(1).astype(np.float32); e=env(voc[:,None].repeat(2,1))
# resample to 16k
n=int(len(voc)*16000/sr); voc16=np.interp(np.linspace(0,len(voc)-1,n),np.arange(len(voc)),voc).astype(np.float32)
sf.write("vocals16k.wav",voc16,16000)
# segments by energy (50ms frames)
act=e>0.06*np.percentile(e,99); segs=[];st=None
for i,a in enumerate(act):
    if a and st is None: st=i
    if not a and st is not None:
        if i-st>=4: segs.append([st,i])
        st=None
# merge gaps < 0.35s, cap length ~12s
m=[]
for a,b in segs:
    if m and a-m[-1][1]<7 and b-m[-1][0]<240: m[-1][1]=b
    else: m.append([a,b])
rec=s.OfflineRecognizer.from_transducer(encoder=M+"encoder-epoch-99-avg-1.int8.onnx",decoder=M+"decoder-epoch-99-avg-1.int8.onnx",joiner=M+"joiner-epoch-99-avg-1.int8.onnx",tokens=M+"tokens.txt",num_threads=4,decoding_method="modified_beam_search")
out=[]
for a,b in m:
    t0=max(0,a*0.05-0.15); t1=b*0.05+0.15
    st=rec.create_stream(); st.accept_waveform(16000,voc16[int(t0*16000):int(t1*16000)]); rec.decode_stream(st)
    r=st.result; toks=[(tk,round(t0+ts,2)) for tk,ts in zip(r.tokens,r.timestamps)]
    out.append({"s":round(t0,2),"e":round(t1,2),"text":r.text,"toks":toks})
    print(f"{t0:6.2f}-{t1:6.2f} {r.text}")
json.dump(out,open("asr.json","w"),ensure_ascii=False)
