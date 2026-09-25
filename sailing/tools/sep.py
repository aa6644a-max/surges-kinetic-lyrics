import sherpa_onnx as s, numpy as np, subprocess, imageio_ffmpeg, soundfile as sf, time
import os
MD=os.environ.get("CINE_MODELS") or next(p for p in ("models","../models","../../models") if os.path.isdir(p))   # model dir: $CINE_MODELS or the repo-level models/ folder
sr=44100
raw=subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),"-v","error","-i","song.mp3","-ac","2","-ar",str(sr),"-f","f32le","-"],capture_output=True).stdout
x=np.frombuffer(raw,dtype=np.float32).reshape(-1,2).T.copy()
cfg=s.OfflineSourceSeparationConfig(model=s.OfflineSourceSeparationModelConfig(uvr=s.OfflineSourceSeparationUvrModelConfig(model=MD+"/UVR-MDX-NET-Voc_FT.onnx"),num_threads=4))
sep=s.OfflineSourceSeparation(cfg); t=time.time()
out=sep.process(sr,x)
print("took",time.time()-t, [n for n in dir(out) if not n.startswith('_')], out.sample_rate)
for i,st in enumerate(out.stems):
    d=np.array(st.data); print(i,d.shape); sf.write(f"stem{i}.wav",d.T,out.sample_rate)
