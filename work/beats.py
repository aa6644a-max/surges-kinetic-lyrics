import subprocess, numpy as np, json
sr=22050
raw=subprocess.run(["ffmpeg","-v","error","-i","work/song.m4a","-ac","1","-ar",str(sr),"-f","f32le","-"],capture_output=True).stdout
x=np.frombuffer(raw,dtype=np.float32)
hop=512; n=2048
frames=np.lib.stride_tricks.sliding_window_view(x,n)[::hop]*np.hanning(n)
S=np.log1p(np.abs(np.fft.rfft(frames,axis=1)))
flux=np.maximum(0,np.diff(S,axis=0)).sum(1); flux=(flux-flux.mean())/flux.std()
fps=sr/hop
ac=np.correlate(flux,flux,'full')[len(flux)-1:]
lags=np.arange(len(ac)); bpms=60*fps/np.maximum(lags,1)
m=(bpms>70)&(bpms<200); lag=lags[m][np.argmax(ac[m])]; bpm=60*fps/lag
# phase
period=lag; best=max(range(int(period)),key=lambda p:flux[p::int(round(period))].sum() if True else 0)
beats=[]; t=best
while t<len(flux):
    lo,hi=int(max(0,t-3)),int(min(len(flux),t+4)); t2=lo+np.argmax(flux[lo:hi]); beats.append(round(t2/fps,3)); t=t2+period
rms=np.sqrt((frames**2).mean(1)); rms=rms/rms.max()
energy=[round(float(rms[int(i*fps):int((i+0.5)*fps)].mean()),3) for i in np.arange(0,len(x)/sr,0.5)]
json.dump({"bpm":round(bpm,1),"beats":beats,"energy_0p5s":energy},open("work/beats.json","w"))
print("BPM",round(bpm,1),"beats",len(beats),"first",beats[:4])
