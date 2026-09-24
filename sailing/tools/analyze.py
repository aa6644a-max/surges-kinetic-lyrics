import subprocess, numpy as np, json, imageio_ffmpeg
sr=22050
raw=subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),"-v","error","-i","song.mp3","-ac","1","-ar",str(sr),"-f","f32le","-"],capture_output=True).stdout
x=np.frombuffer(raw,dtype=np.float32); dur=len(x)/sr
hop=512;n=4096
fr=np.lib.stride_tricks.sliding_window_view(x,n)[::hop]*np.hanning(n)
X=np.abs(np.fft.rfft(fr,axis=1)); fps=sr/hop
freqs=np.fft.rfftfreq(n,1/sr)
S=np.log1p(X)
flux=np.maximum(0,np.diff(S,axis=0)).sum(1);flux=(flux-flux.mean())/flux.std()
ac=np.correlate(flux,flux,'full')[len(flux)-1:]
lags=np.arange(len(ac));bpms=60*fps/np.maximum(lags,1)
m=(bpms>70)&(bpms<200);order=np.argsort(ac[m])[::-1]
cands=[];
for i in order:
    b=round(bpms[m][i],1)
    if all(abs(b-c)>3 for c in cands): cands.append(b)
    if len(cands)==3: break
lag=lags[m][order[0]];bpm=60*fps/lag
period=lag;best=max(range(int(period)),key=lambda p:flux[p::int(round(period))].sum())
beats=[];t=best
while t<len(flux):
    lo,hi=int(max(0,t-3)),int(min(len(flux),t+4));t2=lo+np.argmax(flux[lo:hi]);beats.append(round(t2/fps,3));t=t2+period
# key (Krumhansl) from chroma
pc=np.zeros(12);sel=(freqs>55)&(freqs<2000)
midi=69+12*np.log2(freqs[sel]/440);pcs=np.round(midi).astype(int)%12
spec=(X[:,sel]**2).sum(0)
for p,v in zip(pcs,spec): pc[p]+=v
pc/=pc.sum()
maj=np.array([6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88]);mnr=np.array([6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17])
names=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
sc=[(np.corrcoef(np.roll(maj,k),pc)[0,1],names[k]+' major') for k in range(12)]+[(np.corrcoef(np.roll(mnr,k),pc)[0,1],names[k]+' minor') for k in range(12)]
sc.sort(reverse=True)
rms=np.sqrt((fr**2).mean(1));rms/=rms.max()
energy=[round(float(rms[int(i*fps):int((i+0.5)*fps)].mean()),3) for i in np.arange(0,dur,0.5)]
# brightness & low end
cent=(X*freqs).sum(1)/(X.sum(1)+1e-9)
low=(X[:,freqs<150]**2).sum(1)/((X**2).sum(1)+1e-9)
# vocal-band presence (300-3400Hz) ratio
voc=(X[:,(freqs>300)&(freqs<3400)]**2).sum(1)/((X**2).sum(1)+1e-9)
def seg(a,s): return float(a[int(s*fps):int((s+2)*fps)].mean())
print(f"duration {dur:.1f}s  BPM {bpm:.1f} (candidates {cands})  beats {len(beats)}")
print("key guesses:",[f"{k} {c:.2f}" for c,k in sc[:3]])
print(" t    energy  bright  low  vocal")
for s in np.arange(0,dur,4):
    e=float(rms[int(s*fps):int((s+4)*fps)].mean())
    print(f"{s:5.0f}  {'#'*int(e*40):40s} {e:.2f} {seg(cent,s):6.0f} {seg(low,s):.2f} {seg(voc,s):.2f}")
json.dump({"bpm":round(bpm,1),"beats":beats,"energy_0p5s":energy},open("beats.json","w"))
