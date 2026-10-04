import sherpa_onnx as s, soundfile as sf, json
import os
MD=os.environ.get("CINE_MODELS") or next(p for p in ("models","../models","../../models") if os.path.isdir(p))   # model dir: $CINE_MODELS or the repo-level models/ folder
M=MD+"/sherpa-onnx-zipformer-korean-2024-06-24/"
rec=s.OfflineRecognizer.from_transducer(encoder=M+"encoder-epoch-99-avg-1.onnx",decoder=M+"decoder-epoch-99-avg-1.onnx",joiner=M+"joiner-epoch-99-avg-1.onnx",tokens=M+"tokens.txt",num_threads=4,decoding_method="modified_beam_search",max_active_paths=8)
v,sr=sf.read("vocals16k.wav",dtype="float32")
ph=json.load(open("phrases.json",encoding="utf-8")); out=[]
for p in ph:
    a,b=max(0,p["s"]-.15),p["e"]+.15
    st=rec.create_stream(); st.accept_waveform(sr,v[int(a*sr):int(b*sr)]); rec.decode_stream(st)
    toks=[(t,round(a+ts,2)) for t,ts in zip(st.result.tokens,st.result.timestamps)]
    out.append({"s":p["s"],"e":p["e"],"toks":toks}); print(f'{p["s"]:6.2f} {st.result.text}')
json.dump(out,open("ztoks.json","w",encoding="utf-8"),ensure_ascii=False)
