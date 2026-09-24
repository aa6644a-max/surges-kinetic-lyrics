"""Re-time lyric units with transducer forced alignment (Korean); English words keep onset times clamped between Korean anchors."""
import json, re
from falign import align
old=json.load(open("lines_onset.json",encoding="utf-8"))
groups=[]
for row in open("groups.txt",encoding="utf-8").read().strip().splitlines():
    rng,txt=row.split("|");a,b=map(float,rng.split("-"));groups.append((a,b,[l.strip() for l in txt.split("//")]))
res=[];li=0
for a,b,lines in groups:
    L=old[li:li+len(lines)];li+=len(lines)
    U=[u for l in L for u in l["w"]]            # [text,s,e,sp,en]
    kr=[i for i,u in enumerate(U) if not u[4]]
    if kr:
        text=" ".join(" ".join(w for w in l["t"].split() if not re.search(r"[A-Za-z]",w)) for l in L)
        pieces,times=align(max(0,a-.25),b+.3,text)
        syl=[]  # time per korean syllable
        for p,t in zip(pieces,times):
            s=p.replace("▁","")
            if p=="<unk>": s="?"
            for j,_ in enumerate(s): syl.append(t+.09*j)
        assert len(syl)==len(kr),(len(syl),len(kr),text,pieces)
        new=[None]*len(U)
        for i,t in zip(kr,syl): new[i]=t
        # fix stray korean syllables at line edges (pulled into english / held notes)
        k=0
        for l in L:
            idx=[i for i in range(k,k+len(l["w"])) if new[i] is not None]; k+=len(l["w"])
            for _ in range(2):
                eng_before=idx and idx[0]>0 and U[idx[0]-1][4]     # korean pulled into preceding english audio
                for j in range(min(2,len(idx)-1)-1,-1,-1):          # first syllables too early
                    if eng_before and new[idx[j+1]]-new[idx[j]]>.5: new[idx[j]]=new[idx[j+1]]-.22
                for j in range(max(1,len(idx)-2),len(idx)):         # last syllables too late
                    if new[idx[j]]-new[idx[j-1]]>.8: new[idx[j]]=new[idx[j-1]]+.25
        # english runs: spread evenly between korean anchors
        i=0
        while i<len(U):
            if new[i] is not None: i+=1;continue
            j=i
            while j<len(U) and new[j] is None: j+=1
            p=new[i-1]+.25 if i>0 else a
            q=new[j]-.1 if j<len(U) else b-.3
            if q<=p: q=p+.2*(j-i)
            for k2 in range(i,j): new[k2]=p+(q-p)*(k2-i)/max(1,j-i)
            i=j
        for i in range(len(U)):
            U[i][1]=round(new[i],2)
    for i in range(len(U)):
        nx=U[i+1][1] if i+1<len(U) else b
        U[i][2]=round(min(max(nx,U[i][1]+.08),U[i][1]+.9),2)
    k=0
    for l in L:
        n=len(l["w"]);ws=U[k:k+n];k+=n
        res.append({"t":l["t"],"s":ws[0][1],"e":ws[-1][2],"w":ws})
for r,o in zip(res,old): print(f'{r["s"]:6.2f} (was {o["s"]:6.2f}) {r["t"]}')
json.dump(res,open("lines.json","w"),ensure_ascii=False,indent=1)
