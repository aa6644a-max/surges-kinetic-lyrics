/* ============================================================================
   shared/figures.js — original silhouette characters for cinematic lyric films
   figure(x, y, s, pose, o)  draws a person standing on (x,y) (feet), height ~ 360*s
     who: 'boy' (short hair, hoodie) | 'girl' (long hair, scarf)
     pose: {lean, head, lArm:[shoulder,elbow], rArm:[...], lLeg:[hip,knee], rLeg:[...], sit}
   Angles in radians, 0 = pointing straight down.
   ========================================================================== */
const POSES={
  stand:{lean:0,head:0,lArm:[.12,.05],rArm:[-.12,-.05],lLeg:[.06,0],rLeg:[-.06,0]},
  sit:{lean:.05,head:.1,lArm:[.5,.3],rArm:[-.2,.4],lLeg:[-1.45,1.3],rLeg:[-1.35,1.1],sit:1},       // sitting on an edge, legs over it
  shout:{lean:-.12,head:-.35,lArm:[2.5,.2],rArm:[-2.5,-.2],lLeg:[.25,0],rLeg:[-.25,0]},
  reach:{lean:.08,head:.05,lArm:[1.45,.1],rArm:[-.15,-.1],lLeg:[.15,.05],rLeg:[-.1,0]},
  lookup:{lean:-.05,head:-.5,lArm:[.15,.1],rArm:[-.15,-.1],lLeg:[.08,0],rLeg:[-.08,0]},
  fall:{lean:.6,head:.3,lArm:[2.2,.6],rArm:[-1.9,-.8],lLeg:[.6,.8],rLeg:[-.3,.9]},
  hold:{lean:0,head:.12,lArm:[.35,.4],rArm:[-.12,-.05],lLeg:[.06,0],rLeg:[-.06,0]}
};
function lerpPose(a,b,p){const o={};for(const k in a){o[k]=Array.isArray(a[k])?a[k].map((v,i)=>v+(b[k][i]-v)*p):a[k]+((b[k]??a[k])-a[k])*p}return o}
function limb(x,y,a1,a2,l1,l2,w){g.lineWidth=w;g.lineCap='round';g.lineJoin='round';const ex=x+Math.sin(a1)*l1,ey=y+Math.cos(a1)*l1,hx=ex+Math.sin(a1+a2)*l2,hy=ey+Math.cos(a1+a2)*l2;
  g.beginPath();g.moveTo(x,y);g.lineTo(ex,ey);g.lineTo(hx,hy);g.stroke();return [hx,hy]}
function figure(x,y,s,pose,o={}){const P0=typeof pose==='string'?POSES[pose]:pose,col=o.col||'#05060F',who=o.who||'boy',t=o.t||0,wind=o.wind??.3,flip=o.flip?-1:1;
  g.save();g.translate(x,y);g.scale(s*flip,s);g.strokeStyle=col;g.fillStyle=col;
  const hipY=P0.sit?-40:-170,hip=[0,hipY];
  const lf=limb(-8,hipY,P0.lLeg[0],P0.lLeg[1],88,90,26),rf=limb(8,hipY,P0.rLeg[0],P0.rLeg[1],88,90,26);
  g.save();g.translate(0,hipY);g.rotate(P0.lean);
  // torso
  g.beginPath();g.moveTo(-30,0);g.quadraticCurveTo(-38,-70,-30,-128);g.lineTo(30,-128);g.quadraticCurveTo(38,-70,30,0);g.closePath();g.fill();
  if(who==='boy'){g.beginPath();g.moveTo(-26,-128);g.quadraticCurveTo(0,-150,26,-128);g.fill()}                  // hood
  const la=limb(-26,-116,P0.lArm[0],P0.lArm[1],62,60,20),ra=limb(26,-116,P0.rArm[0],P0.rArm[1],62,60,20);
  // head
  g.save();g.translate(0,-150);g.rotate(P0.head);g.beginPath();g.arc(0,-26,30,0,7);g.fill();
  if(who==='boy'){g.beginPath();g.moveTo(-32,-30);g.lineTo(-38,-44);g.lineTo(-22,-52);g.lineTo(-10,-62);g.lineTo(8,-60);g.lineTo(26,-52);g.lineTo(36,-38);g.lineTo(32,-24);g.closePath();g.fill()}
  else{const sw=Math.sin(t*2.2)*10*wind;g.beginPath();g.moveTo(-30,-40);g.quadraticCurveTo(-44,10,-30+sw,70);g.lineTo(-10+sw,40);g.lineTo(0,-50);g.lineTo(30,-40);g.quadraticCurveTo(40,0,26+sw*.5,40);g.lineTo(34,-20);g.closePath();g.fill()}
  g.restore();
  if(who==='girl'){ // scarf in the accent colour, fluttering in the wind
    g.fillStyle=o.scarf||'#FFB547';g.beginPath();g.moveTo(-18,-132);const w1=Math.sin(t*3)*14*wind,w2=Math.sin(t*3+1)*18*wind;g.bezierCurveTo(-60,-140+w1,-110,-120+w2,-150,-128+w2);g.lineTo(-140,-110+w2);g.bezierCurveTo(-100,-104+w2,-60,-118+w1,-14,-116);g.closePath();g.fill();g.fillStyle=col}
  g.restore();g.restore();return {hands:[la,ra]}}
