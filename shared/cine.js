/* ============================================================================
   shared/cine.js — cinematic kinetic-typography core (extracted from STAR TRAIL)
   A page sets up:  CINE.init(canvas, data)  then defines SHOTS / a world path,
   and calls CINE.frame(t, drawFn) from window.renderAt(t).
   Everything is deterministic in t (headless frame rendering).
   ========================================================================== */
const W=1080,H=1920,CX=540,CY=960;
let g=null,cv=null,Ln=[];
const clamp=(x,a=0,b=1)=>x<a?a:x>b?b:x,lerp=(a,b,x)=>a+(b-a)*x;
const eOutC=x=>1-(1-x)**3,eInC=x=>x*x*x,eIO=x=>x<.5?4*x*x*x:1-(-2*x+2)**3/2,eOutX=x=>x>=1?1:1-2**(-10*x),eInX=x=>x<=0?0:2**(10*x-10),eIOs=x=>x*x*(3-2*x);
const eBk=(x,c=1.7)=>{x=clamp(x)-1;return 1+(c+1)*x*x*x+c*x*x};
const oB=x=>{const n=7.5625,d=2.75;if(x<1/d)return n*x*x;if(x<2/d)return n*(x-=1.5/d)*x+.75;if(x<2.5/d)return n*(x-=2.25/d)*x+.9375;return n*(x-=2.625/d)*x+.984375};
const R=(i,s=0)=>{const x=Math.sin(i*127.1+s*311.7+.5)*43758.5453;return x-Math.floor(x)};
const P=(t,a,d)=>clamp((t-a)/d);
const EN=(w,f)=>`${w} ${f}px "Josefin Sans"`,KR=(w,f)=>`${w} ${f}px "Noto Sans KR"`,JP=(w,f)=>`${w} ${f}px "Noto Sans JP"`;
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),mix=(a,b,x)=>{const p=hex(a),q=hex(b);return '#'+p.map((v,i)=>Math.round(lerp(v,q[i],x)).toString(16).padStart(2,'0')).join('')};
const rgba=(h,a)=>{const c=hex(h);return `rgba(${c[0]},${c[1]},${c[2]},${a})`};
let ACC='#8FE3FF',BEAT=60/94,B0=0;
const pulse=t=>{const b=(t-B0)/BEAT;return b<0?0:Math.exp(-(b-Math.floor(b))*BEAT*7)};
const U=(i,k)=>Ln[i].u[k],T=(i,k)=>Ln[i].u[k][1],sung=(i,k,t)=>t>=U(i,k)[1]-.02&&t<U(i,k)[2];

/* ---------- camera ---------- */
// CAM: x,y = world point at the screen centre, z = zoom, r = roll (rad)
let CAM={x:0,y:0,z:1,r:0};
// keys: [t,x,y,z,r,(ease)] — piecewise, eased per segment
function camAt(keys,t){if(t<=keys[0][0])return keys[0];for(let k=1;k<keys.length;k++)if(t<keys[k][0]){const a=keys[k-1],b=keys[k],p=(b[5]||eIO)(clamp((t-a[0])/(b[0]-a[0])));return [t,lerp(a[1],b[1],p),lerp(a[2],b[2],p),lerp(a[3],b[3],p),lerp(a[4],b[4],p)]}return keys[keys.length-1]}
// draw in world space with a parallax factor pf (0 = at infinity, 1 = subject plane, >1 = foreground)
function layer(pf,fn){g.save();g.translate(CX,CY);g.rotate(CAM.r*Math.min(1,pf));const z=1+(CAM.z-1)*pf;g.scale(z,z);g.translate(-CAM.x*pf,-CAM.y*pf);fn();g.restore()}
function shake(t,amp,rate=30){if(amp<=0)return;CAM.x+=(R(1,Math.floor(t*rate))-.5)*amp;CAM.y+=(R(2,Math.floor(t*rate))-.5)*amp}

/* ---------- sky & light ---------- */
function stars(t,pf,n,seed,a,size=1){if(a<=0)return;const TW=W*1.5,TH=H*1.5;g.save();g.translate(CX,CY);g.rotate(CAM.r*pf);const z=1+(CAM.z-1)*pf;g.scale(z,z);
  for(let i=0;i<n;i++){const x=((R(i,seed)*TW-CAM.x*pf)%TW+TW)%TW-TW/2,y=((R(i,seed+1)*TH-CAM.y*pf)%TH+TH)%TH-TH/2,r=(.5+2.2*R(i,seed+2)**3)*size;
    g.globalAlpha=a*(.25+.75*R(i,seed+3))*(.6+.4*Math.sin(t*(1+2*R(i,seed+4))+i));g.fillStyle='#fff';g.beginPath();g.arc(x,y,r,0,7);g.fill()}g.restore();g.globalAlpha=1}
function flare(x,y,r,col,a=1,rays=1){if(a<=0)return;g.save();g.globalCompositeOperation='lighter';g.globalAlpha=clamp(a);
  const gl=g.createRadialGradient(x,y,0,x,y,r*4);gl.addColorStop(0,'rgba(255,255,255,.95)');gl.addColorStop(.12,col);gl.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gl;g.fillRect(x-r*4,y-r*4,r*8,r*8);
  if(rays)for(const [w,l,an] of [[3,r*14,0],[3,r*14,Math.PI/2],[1.5,r*7,Math.PI/4],[1.5,r*7,-Math.PI/4]]){const lg=g.createLinearGradient(-l,0,l,0);lg.addColorStop(0,'rgba(0,0,0,0)');lg.addColorStop(.5,'rgba(255,255,255,.9)');lg.addColorStop(1,'rgba(0,0,0,0)');g.save();g.translate(x,y);g.rotate(an);g.fillStyle=lg;g.fillRect(-l,-w*rays/2,l*2,w*rays);g.restore()}
  g.restore()}
function ring(x,y,p,rmax,w=10,col='#FFFFFF'){if(p<=0||p>=1)return;g.strokeStyle=rgba(col,.8*(1-p));g.lineWidth=w*(1-p)+1;g.beginPath();g.arc(x,y,20+rmax*eOutC(p),0,7);g.stroke()}
function beam(x,y0,y1,w,a){if(a<=0)return;const lg=g.createLinearGradient(0,y0,0,y1);lg.addColorStop(0,rgba(ACC,0));lg.addColorStop(1,rgba(ACC,.4*a));g.fillStyle=lg;g.fillRect(x-w/2,Math.min(y0,y1),w,Math.abs(y1-y0))}
function dust(t,a){g.save();g.globalCompositeOperation='lighter';for(let i=0;i<22;i++){const x=((R(i,70)*1600+t*(20+40*R(i,71))-CAM.x*1.6)%1600+1600)%1600-800,y=((R(i,72)*2600-t*(30+50*R(i,73))-CAM.y*1.6)%2600+2600)%2600-1300,r=6+26*R(i,74);
  const gl=g.createRadialGradient(x,y,0,x,y,r);gl.addColorStop(0,rgba(ACC,.16*a));gl.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gl;g.fillRect(x-r,y-r,r*2,r*2)}g.restore()}

/* ---------- kinetic words ---------- */
const STY={
  rise:(a,it,o)=>{const p=eOutC(clamp((a+.12)/.45));return {al:clamp((a+.12)/.15),dy:(1-p)*(o.dist??70),blur:(1-p)*6}},
  focus:(a)=>({al:clamp((a+.25)/.3)*.9,blur:14*(1-eOutC(clamp((a+.1)/.5))),dy:(1-eOutC(clamp((a+.2)/.6)))*20}),
  drop:(a,it,o)=>{const p=clamp((a+.12)/.5);return {al:clamp((a+.12)/.08),dy:-(1-oB(p))*(o.dist??240)}},
  pop:(a)=>({al:clamp((a+.08)/.08),s:Math.max(0,eBk(clamp((a+.08)/.3),2.2))}),
  stamp:(a)=>{const p=eOutC(clamp((a+.06)/.18));return {al:clamp((a+.06)/.06),s:1+1.5*(1-p)}},
  fly:(a,it,o)=>{const p=eOutX(clamp((a+.15)/.45));return {dx:(1-p)*(o.dir??-1)*900,sx:1+(1-p)*1.4,al:clamp((a+.15)/.1),glow:22*(1-p)}},
  wind:(a,it,o,t)=>{const p=eOutX(clamp((a+.15)/.5));return {dx:(1-p)*(o.dir??1)*700,dy:Math.sin(t*3+it.n*.7)*6,rot:(1-p)*(o.dir??1)*-.3,al:clamp((a+.15)/.12),blur:(1-p)*5}},
  twinkle:(a)=>({al:clamp((a+.08)/.1),s:Math.max(0,eBk(clamp((a+.08)/.3),2.4)),flare:a>0&&a<.6?1-a/.6:0}),
  wander:(a,it,o,t)=>{const q=clamp(a/.4),n=it.n;return {al:clamp((a+.1)/.15),dx:q*(Math.sin(t*1.3+n*2.1)*10+Math.sin(t*.7+n)*6),dy:q*(Math.cos(t*1.1+n*1.7)*18),rot:q*Math.sin(t*.9+n)*.1}},
  jitter:(a,it,o,t)=>({al:clamp((a+.08)/.1),dx:a>0?(R(it.n,Math.floor(t*20))-.5)*10:0,dy:a>0?(R(it.n+7,Math.floor(t*20))-.5)*10:0,s:Math.max(0,eBk(clamp((a+.08)/.25),2))}),
  still:(a)=>({al:clamp((a+.1)/.2)}),
};
// words(t,i,ks,x,y,font,style,o): units ks of line i as one row (spaces come from the unit data)
function words(t,i,ks,x,y,font,style='rise',o={}){
  g.save();g.font=font;g.textBaseline='middle';g.textAlign='center';const sp=g.measureText(' ').width*(o.gapK??1.05),tr=o.track||0;
  const items=[];ks.forEach((k,j)=>{const u=U(i,k),en=!!u[3],cs=en&&o.split!==false?[...u[0]]:[...u[0]];cs.forEach((c,q)=>{items.push({c,k,ts:u[1]+(cs.length>1?q*(o.stagger??Math.min(.06,(u[2]-u[1])/cs.length)):0),w:g.measureText(c).width,sp:(q===0&&j>0&&u[4])?sp:0,n:items.length})})});
  let tot=0;items.forEach((it,n)=>{tot+=it.sp+it.w+(n?tr:0)});const sc=o.maxW&&tot>o.maxW?o.maxW/tot:1;
  g.translate(x,y);g.scale(sc,sc);let xx=o.align==='left'?0:o.align==='right'?-tot:-tot/2;const out=o.out??1e9,st=STY[style];
  items.forEach((it,n)=>{xx+=it.sp+(n?tr:0);const a=t-it.ts;if(a<-.3){xx+=it.w;return}
    const r=st(a,it,o,t);let al=r.al??1,dy=r.dy||0,blur=r.blur||0;const q=eInC(clamp((t-out-n*.02)/.4));if(q>0){al*=1-q;if(o.exit==='down')dy+=q*80;else if(o.exit==='scatter'){r.dx=(r.dx||0)+(R(n,31)-.5)*500*q;dy+=(R(n,32)-.5)*400*q-200*q}else if(o.exit==='wind'){r.dx=(r.dx||0)+q*q*900;dy-=q*60}else dy-=q*70;blur+=q*8}
    if(al<=0){xx+=it.w;return}const now=sung(i,it.k,t),col=now?(o.hot||'#FFFFFF'):(o.col||'#DCE5FF');
    g.save();g.translate(xx+it.w/2+(r.dx||0),dy);g.rotate(r.rot||0);g.scale(r.sx??r.s??1,r.sy??r.s??1);g.globalAlpha=clamp(al*(o.a??1));if(blur>.5)g.filter=`blur(${blur.toFixed(1)}px)`;
    g.shadowColor=o.gcol||ACC;g.shadowBlur=(r.glow||0)+(now?(o.hotGlow??30):(o.glow??8));g.fillStyle=col;g.fillText(it.c,0,0);g.restore();
    if(r.flare)flare(xx+it.w*.8+(r.dx||0),dy-it.w*.45,2.5,rgba(ACC,.8),r.flare);xx+=it.w});
  g.restore();return tot*sc}
// a free-standing word that is not tied to units (titles, echoes)
function big(t,txt,t0,x,y,font,o={}){const a=t-t0;if(a<-.3)return;const p=eOutC(clamp((a+.1)/(o.dur??.6)));g.save();g.globalAlpha=clamp((a+.1)/.2)*(o.a??1)*(1-eInC(clamp((t-(o.out??1e9))/.4)));g.font=font;g.textAlign='center';g.textBaseline=o.base||'middle';g.fillStyle=o.col||'#fff';g.shadowColor=o.gcol||ACC;g.shadowBlur=o.glow??30;
  g.letterSpacing=`${Math.round((o.sp??10)+(o.track??40)*(1-p))}px`;g.translate(x,y+(1-p)*(o.dy??30));const s=o.s0!=null?lerp(o.s0,1,p):1;g.scale(s,s);g.fillText(txt,0,0);g.restore()}
// translation line (Korean) that travels with its lyric: fades in with the line, out with it
function sub(t,txt,t0,t1,x,y,o={}){const a=clamp((t-t0+.1)/.35)*(1-clamp((t-t1)/.35));if(a<=0)return;g.save();g.globalAlpha=a*(o.a??.8);g.font=KR(300,o.f??40);g.textAlign='center';g.textBaseline='middle';g.fillStyle=o.col||'#CFE0F5';g.shadowColor='rgba(0,0,0,.6)';g.shadowBlur=10;g.fillText(txt,x,y+(1-eOutC(clamp((t-t0+.1)/.5)))*16,o.maxW??940);g.restore()}

/* ---------- post: bloom, vignette, grain ---------- */
let BL,bg2,GR;
function initPost(){BL=document.createElement('canvas');BL.width=270;BL.height=480;bg2=BL.getContext('2d');
  GR=document.createElement('canvas');GR.width=256;GR.height=256;const c=GR.getContext('2d'),d=c.createImageData(256,256);for(let k=0;k<d.data.length;k+=4){const v=R(k,77)*255;d.data[k]=d.data[k+1]=d.data[k+2]=v;d.data[k+3]=18}c.putImageData(d,0,0)}
function post(t,o={}){bg2.clearRect(0,0,270,480);bg2.filter='blur(6px)';bg2.drawImage(cv,0,0,270,480);bg2.filter='none';g.save();g.globalCompositeOperation='lighter';g.globalAlpha=o.bloom??.55;g.drawImage(BL,0,0,W,H);g.restore();
  const vg=g.createRadialGradient(CX,CY,500,CX,CY,1250);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${o.vig??.55})`);g.fillStyle=vg;g.fillRect(0,0,W,H);
  if(o.bars){g.fillStyle='#000';g.fillRect(0,0,W,o.bars);g.fillRect(0,H-o.bars,W,o.bars)}
  const ox=Math.floor(R(Math.floor(t*24),1)*256),oy=Math.floor(R(Math.floor(t*24),2)*256);g.save();g.globalCompositeOperation='overlay';for(let y=-oy;y<H;y+=256)for(let x=-ox;x<W;x+=256)g.drawImage(GR,x,y);g.restore()}

const CINE={init(canvas,data){cv=canvas;g=cv.getContext('2d');Ln=(data&&data.lines)||[];initPost();
  const fit=()=>{const s=Math.min(innerWidth/W,innerHeight/H);cv.style.transform=`scale(${s}) translate(-50%,-50%)`};addEventListener('resize',fit);fit()},
  begin(){g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.filter='none';g.shadowBlur=0;g.globalCompositeOperation='source-over'}};
