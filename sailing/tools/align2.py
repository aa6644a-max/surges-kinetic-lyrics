"""Place lyric units (Korean syllables / English words) on vocal onsets inside each sung phrase group."""
import numpy as np, soundfile as sf, json, re, math
v,sr=sf.read("vocals16k.wav",dtype="float32")
hop=160;n=1024
fr=np.lib.stride_tricks.sliding_window_view(v,n)[::hop]*np.hanning(n)
S=np.log1p(np.abs(np.fft.rfft(fr,axis=1))[:, 5:200])   # ~80Hz-3kHz
flux=np.maximum(0,np.diff(S,axis=0)).sum(1); flux=np.convolve(flux,[.25,.5,.25],'same')
rms=np.sqrt((fr**2).mean(1))
def onsets(a,b):
    i0,i1=int(a*100),int(b*100); f=flux[i0:i1]
    pk=[i for i in range(1,len(f)-1) if f[i]>=f[i-1] and f[i]>f[i+1] and f[i]>0.15*f.max()]
    c=[(i0+i)/100 for i in pk]; w=[f[i]/f.max() for i in pk]
    return c,w
def units(line):
    out=[]
    for word in line.split():
        if re.search(r"[A-Za-z]",word): out.append([word,1])
        else: out+=[[ch,0] for ch in word]
        out[-1].append(1)   # space after
    return [u if len(u)==3 else u+[0] for u in out]
res=[]
for row in open("groups.txt",encoding="utf-8").read().strip().splitlines():
    rng,txt=row.split("|"); a,b=map(float,rng.split("-"))
    lines=[l.strip() for l in txt.split("//")]
    U=[];LI=[]
    for li,l in enumerate(lines): us=units(l); U+=us; LI+=[li]*len(us)
    N=len(U); c,w=onsets(a,b)
    if not c or c[0]>a+.05: c=[a]+c; w=[1.0]+w
    K=len(c); wt=[1.6 if u[1] else 1.0 for u in U]; mu=(b-a)/sum(wt)
    if K<N:
        t=[a+(b-a)*sum(wt[:i])/sum(wt) for i in range(N)]
    else:
        # DP: pick N ordered onsets; reward strength, penalise uneven spacing
        INF=-1e18; D=np.full((N,K),INF); B=np.zeros((N,K),int)
        D[0,:]=[w[j]-2.0*abs(c[j]-a)/mu for j in range(K)]
        for i in range(1,N):
            exp=mu*wt[i-1]
            for j in range(i,K):
                best,bj=INF,0
                for q in range(i-1,j):
                    if D[i-1,q]==INF: continue
                    dt=c[j]-c[q]; s=D[i-1,q]+w[j]-0.8*abs(math.log(dt/exp))
                    if s>best: best,bj=s,q
                D[i,j]=best;B[i,j]=bj
        j=int(np.argmax(D[N-1])); idx=[j]
        for i in range(N-1,0,-1): j=B[i,j]; idx.append(j)
        t=[c[j] for j in idx[::-1]]
    for li,l in enumerate(lines):
        ks=[k for k in range(N) if LI[k]==li]
        ws=[]
        for k in ks:
            e=t[k+1] if k+1<N else b
            ws.append([U[k][0],round(t[k],2),round(min(e,t[k]+.9),2),U[k][2],U[k][1]])
        res.append({"t":l,"s":ws[0][1],"e":ws[-1][2],"w":ws})
for r in res: print(f'{r["s"]:6.2f}-{r["e"]:6.2f} {r["t"]}   ', " ".join(f"{u[0]}@{u[1]:.2f}" for u in r["w"][:6]))
json.dump(res,open("lines.json","w",encoding="utf-8"),ensure_ascii=False,indent=1)
