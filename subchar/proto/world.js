/* Sub character v4.1 prototype: the world.
   Every element lives at a WORLD coordinate on a depth layer. The camera transform projects it:
     screen = centre + p * k * (world - camera),  k = camera.scale ^ p
   so a layer with parallax p moves p times as fast as the subject plane and zooms a little faster (FG) or slower (BG).
   An element sits exactly where it is placed when the camera looks straight at it. LENS objects (p 1.9) pass right
   in front of the lens, out of focus. Objects can override p (the audience rows each sit at their own depth).
   Zones (world px, stage deck top at y 6100):
     BACKSTAGE  x 4800-7250   cast board (6500,5450), braces, curtain slit at x 7290      cool, muted purple
     STAGE      x 7250-9700   YOU (8350, feet 6170), backdrop, proscenium of type             warm ivory / amber
     HOUSE      x 9700-11600  audience rows of 좋아해, booth (10760,4290), lamp (10470,4330)  warm but darker; booth neutral-cool */
const W = 1080, H = 1920, CX = 540, CY = 960;
const LAYERS = [['BG', .25], ['MID_BG', .6], ['SUBJECT', 1], ['MID_FG', 1.12], ['FG', 1.35], ['LENS', 1.9]];
const PF = Object.fromEntries(LAYERS);
const ZONES = [['BACKSTAGE', -1e9, 7250], ['STAGE', 7250, 9700], ['HOUSE / BOOTH', 9700, 1e9]];
const zoneAt = x => ZONES.find(z => x >= z[1] && x < z[2])[0];
const PAL = {
  void: '#07060D', bs: '#0E0B18', wall: '#18142A', wood: '#2E2436', paper: '#E4DAC6', ink: '#1A1420', title: '#F3EAD8',
  credit: '#8E8AA6', me: '#8FD3FF', spot: '#FFE7B0', warm: '#FFB86B', wine: '#4A2140', velvet: '#34163E', seat: '#3B3158', night: '#0B0912'
};
// type system: TITLE = the main character's world, CREDIT = the extras
const TK = s => `${s}px "Black Han Sans"`, TE = s => `${s}px "Dela Gothic One"`;
const CK = (s, w = 300) => `${w} ${s}px "Noto Sans KR"`, CE = (s, w = 400) => `${w} ${s}px "IBM Plex Mono"`, MK = (s, w = 700) => `${w} ${s}px "Noto Sans KR"`;

let g = null;                                   // the 2d context
const IMG = {};
const OBJ = [];
function obj(layer, x, y, draw, o = {}) { OBJ.push({ layer, p: o.p ?? PF[layer], x, y, draw, rad: o.rad ?? 2600, name: o.name || '', blur: o.blur || 0 }) }

function proj(p, x, y) { const k = Math.pow(CAM.s, p); return { x: CX + p * k * (x - CAM.x), y: CY + p * k * (y - CAM.y), k } }
function place(o, m = 1) {                      // m: extra magnification about the screen centre (an object the camera is passing through)
  const q = proj(o.p, o.x, o.y), k = q.k * m, x = CX + (q.x - CX) * m, y = CY + (q.y - CY) * m;
  if (Math.abs(x - CX) - o.rad * k > 1500 || Math.abs(y - CY) - o.rad * k > 2100) return false;   // off screen
  g.setTransform(1, 0, 0, 1, CX, CY); g.rotate(CAM.r * Math.PI / 180 * Math.min(1, o.p)); g.translate(x - CX, y - CY); g.scale(k, k);
  return true;
}
function drawWorld(t) {
  for (const [L] of LAYERS) for (const o of OBJ) if (o.layer === L && place(o, o.mag ? o.mag(t) : 1)) {
    g.save(); if (o.blur) g.filter = `blur(${o.blur}px)`; o.draw(t); g.restore();
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
}

// ---------- shared state of the stage (all functions of t) ----------
const CURTAIN_T = 48.55;                                             // "I'm a sub character": the camera passes the curtains, the spot goes on (downbeat)
const stageOn = t => .3 + .42 * eIO(clamp((t - CURTAIN_T) / .45)); // the stage wash stays low: the spot is the brightest thing on stage
const spotOn = t => eOut(clamp((t - CURTAIN_T + .05) / .3));
const LAMP = { x: 10470, y: 4330 }, YOU = { x: 8350, y: 6170 }, CIRCLE = { x: 8980, y: 6195 };
function spotX(t) {                                                  // the follow spot: steady on YOU, wavers on "Tell me", slides to the empty floor on "내가"
  if (t < 64.18) return YOU.x;
  const wob = Math.sin((t - 64.18) * 11) * 26 * clamp((t - 64.18) / .3) * (1 - clamp((t - 65.42) / .4));
  return YOU.x + wob + (CIRCLE.x - YOU.x) * eBk(clamp((t - 65.42) / 1.35), .9);
}
const offYou = t => clamp((spotX(t) - YOU.x) / 380);                 // 0 = on YOU, 1 = on the empty floor
const circleAspect = () => lerp(.28, 1, eSm(clamp((CAM.s - 1.3) / 3.4)));   // the camera tips toward the floor as it dives
const meGrow = t => 1 + .3 * eIO(clamp((t - 58.5) / 1.6));          // the camera notices ME: her credit type grows for the first time
const meLit = t => eSm(clamp((t - 58.2) / .8));                      // ME: a silhouette against the lamp first, then her face
// one hero word at a time on stage: each lights up when the camera reaches it, then sinks back into the dark
const bump = (t, a, b) => eSm(clamp((t - a) / .5)) * (1 - eSm(clamp((t - b) / .8)));
const heroPillar = t => bump(t, 48.6, 50.4), heroPerfect = t => bump(t, 50.2, 52.4), heroArch = t => bump(t, 51.9, 54.3);

// ---------- small drawing helpers (local coordinates = world px) ----------
function txt(s, x, y, font, col, al = 'center', base = 'alphabetic') { g.font = font; g.fillStyle = col; g.textAlign = al; g.textBaseline = base; g.fillText(s, x, y) }
function rgba(h, a) { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})` }
function drawImg(id, cx, bottom, h, flip = false, filter = '') {
  const im = IMG[id]; if (!im) return; const w = im.width * h / im.height;
  g.save(); if (filter) g.filter = filter; g.translate(cx, bottom); if (flip) g.scale(-1, 1); g.drawImage(im, -w / 2, -h, w, h); g.restore();
}
function extruded(c, font, face, side, dx, dy, n) {  // a glyph with depth: n copies stepped toward the vanishing direction, then the face
  g.font = font; g.textAlign = 'center'; g.textBaseline = 'middle';
  for (let i = n; i > 0; i--) { g.fillStyle = side; g.fillText(c, dx * i, dy * i) }
  g.fillStyle = face; g.fillText(c, 0, 0);
}

// ================= BG (.25): fly loft, battens, light leaking from the stage =================
obj('BG', 8300, 3600, t => {
  for (let k = 0; k < 4; k++) { g.fillStyle = '#17152A'; g.fillRect(-9000, -700 + k * 190, 18000, 10) }
  for (let k = 0; k < 22; k++) { const x = -5200 + k * 480; g.fillStyle = '#211C31'; g.fillRect(x - 26, -700 + (k % 4) * 190 + 10, 52, 60) }
}, { rad: 9000 });
obj('BG', 7350, 5200, t => {                                         // a warm leak from the stage: seen from the cast board it is the first clue
  const a = .16 + .12 * stageOn(t), gr = g.createRadialGradient(0, 0, 20, 0, 0, 1400);
  gr.addColorStop(0, rgba(PAL.warm, a)); gr.addColorStop(1, rgba(PAL.warm, 0)); g.fillStyle = gr; g.fillRect(-1400, -1400, 2800, 2800);
}, { rad: 1400 });
obj('BG', 8600, 5300, t => {                                         // haze where the stage light hits the air
  const a = .08 + .12 * stageOn(t), gr = g.createRadialGradient(0, 0, 50, 0, 0, 2600);
  gr.addColorStop(0, rgba(PAL.warm, a)); gr.addColorStop(1, rgba(PAL.warm, 0)); g.fillStyle = gr; g.fillRect(-2600, -2600, 5200, 5200);
}, { rad: 2600 });

// ================= MID_BG (.6): backstage wall, the backdrop =================
obj('MID_BG', 6350, 4750, t => {                                     // backstage: the wall behind the board is lettered 주인공, almost lost in the dark
  g.globalAlpha = 1 - clamp((CAM.x - 6900) / 450); if (g.globalAlpha <= 0) return;   // it belongs to backstage: gone once the camera is past the curtains
  g.font = TK(1050); g.textAlign = 'center'; g.textBaseline = 'middle';
  const gr = g.createLinearGradient(0, -600, 0, 600); gr.addColorStop(0, '#1A1830'); gr.addColorStop(1, '#0C0B18');
  g.fillStyle = gr; g.fillText('주인공', 0, 0); g.strokeStyle = 'rgba(170,180,255,.06)'; g.lineWidth = 6; g.strokeText('주인공', 0, 0);
}, { rad: 1800 });
obj('MID_BG', 8350, 5150, t => {                                     // upstage: the set is the word 완벽해, readable only inside the light around YOU
  g.font = TK(560); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = 'rgba(60,40,48,.14)'; g.fillText('완벽해', 0, 0);
  const h = heroPerfect(t), base = .1 * stageOn(t); if (h + base <= 0) return;
  const m = g.createRadialGradient(0, 380, 60, 0, 380, 1000), A = base + .75 * h;    // the text is filled with the light itself: bright near YOU, gone at the edges
  m.addColorStop(0, `rgba(234,217,182,${A})`); m.addColorStop(.6, `rgba(234,217,182,${A * .45})`); m.addColorStop(1, 'rgba(234,217,182,0)');
  g.fillStyle = m; g.fillText('완벽해', 0, 0);
}, { rad: 1400 });

// ================= SUBJECT (1.0) =================
obj('SUBJECT', 7000, 6100, t => {                                    // floors
  g.fillStyle = '#100F1C'; g.fillRect(-2600, 0, 2650, 700);
  g.fillStyle = '#191828'; for (let x = -2600; x < 50; x += 170) g.fillRect(x, 0, 3, 700);
  const L = stageOn(t);
  g.fillStyle = `rgb(${Math.round(44 + 36 * L)},${Math.round(30 + 22 * L)},${Math.round(32 + 12 * L)})`; g.fillRect(50, 0, 2650, 190);
  g.fillStyle = 'rgba(0,0,0,.25)'; for (let k = 1; k < 6; k++) g.fillRect(50, k * 32, 2650, 2);
  g.fillStyle = '#0D0A0E'; g.fillRect(50, 190, 2650, 700);
  g.fillStyle = `rgba(255,220,170,${.12 + .2 * L})`; g.fillRect(50, 188, 2650, 3);
}, { rad: 3000 });
obj('SUBJECT', 10700, 6300, t => { g.fillStyle = '#0B0708'; g.fillRect(-1000, 0, 3000, 900) }, { rad: 2000 });

// the cast board: the hierarchy is the type size (cool work light)
const CAST = [['주인공', 'T', 200], ['친구 A', 'c', 84], ['친구 B', 'c', 70], ['선생님', 'c', 58], ['반장', 'c', 48], ['행인 1', 'c', 38], ['행인 2', 'c', 34],
  ['행인 3', 'c', 30], ['행인 4', 'c', 27], ['행인 5', 'c', 25], ['행인 6', 'c', 23], ['행인 7', 'm', 21]];
obj('SUBJECT', 6500, 5450, t => {
  const lg = g.createRadialGradient(0, -700, 40, 0, -200, 1300); lg.addColorStop(0, 'rgba(200,205,255,.22)'); lg.addColorStop(1, 'rgba(200,205,255,0)');
  g.fillStyle = lg; g.fillRect(-900, -1100, 1800, 1800);
  g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(-318, -600, 676, 1266);                                    // its shadow on the wall
  g.fillStyle = '#0A0810'; g.fillRect(-338, -633, 676, 1266);
  const pg = g.createLinearGradient(0, -625, 0, 625); pg.addColorStop(0, '#E2E0E6'); pg.addColorStop(1, '#8C8B99'); g.fillStyle = pg; g.fillRect(-330, -625, 660, 1250);
  g.fillStyle = '#B4453F'; for (const x of [-300, 300]) { g.beginPath(); g.arc(x, -600, 9, 0, 7); g.fill() }
  txt('CAST  ·  배역', -300, -560, CE(24, 500), '#4A4458', 'left');
  let y = -520;
  for (const [role, k, s] of CAST) {
    y += s * 1.28;
    if (k === 'T') { txt(role, -300, y, TK(s), PAL.ink, 'left'); txt('너', 300, y, TK(s * .62), PAL.ink, 'right') }
    else {
      txt(role, -300, y, CK(s, k === 'm' ? 400 : 500), k === 'm' ? '#58799A' : '#4E4A5E', 'left');
      g.font = CE(Math.max(14, s * .6)); g.fillStyle = 'rgba(78,74,94,.55)'; g.textAlign = 'right'; g.fillText(k === 'm' ? '·········  extra' : '—', 300, y);
    }
  }
  g.strokeStyle = 'rgba(40,30,40,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-300, -249); g.lineTo(300, -249); g.stroke();
}, { rad: 1300, name: 'cast board' });

// the back of the masking flat, its cue sheet, and the light that leaks through the curtain slit
obj('SUBJECT', 7210, 5150, t => { g.fillStyle = '#1B1826'; g.fillRect(-30, -1050, 60, 1000); g.fillStyle = '#2A2638'; g.fillRect(-30, -1050, 8, 1000) }, { rad: 1200 });
obj('SUBJECT', 7120, 5150, t => {
  g.rotate(.03); g.fillStyle = '#C9C8D2'; g.fillRect(-150, -120, 300, 240);
  ['CUE 16  HOUSE ↓', 'CUE 17  FOLLOW → MAIN', 'CUE 18  (행인 7 대기)'].forEach((s, i) => txt(s, -130, -60 + i * 50, CE(19, 500), i === 1 ? '#8A2E3A' : '#3A3346', 'left'));
}, { rad: 400 });
obj('SUBJECT', 7290, 6100, t => {                                     // light wedge on the backstage floor
  const a = .5 * (1 - clamp((t - CURTAIN_T - .5) / 1.2)) + .15;
  const gr = g.createLinearGradient(0, 0, -900, 0); gr.addColorStop(0, rgba(PAL.spot, a)); gr.addColorStop(1, rgba(PAL.spot, 0));
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, 30); g.lineTo(-900, 10); g.lineTo(-900, 190); g.lineTo(0, 110); g.fill();
}, { rad: 1000 });
obj('SUBJECT', 6720, 6150, t => { g.save(); g.scale(1, .45); txt('× 행인 7', 0, 0, CE(22, 500), 'rgba(143,211,255,.5)'); g.restore() }, { rad: 400 });

// proscenium: the stage-left pillar is the word 주인공 (the first thing past the curtains); the arch reads MAIN CHARACTER
obj('SUBJECT', 8250, 4050, t => {
  const hp = heroPillar(t), ha = heroArch(t), L = stageOn(t);
  g.fillStyle = '#1E0D1B'; g.fillRect(-1250, -150, 2500, 260);
  g.font = TE(128); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(${Math.round(70 + 170 * ha)},${Math.round(34 + 150 * ha)},${Math.round(60 + 110 * ha)},${.45 + .55 * ha})`;
  g.fillText('MAIN CHARACTER', 0, -20);
  g.font = TK(360);
  ['주', '인', '공'].forEach((c, i) => { const y = 400 + i * 390;
    g.fillStyle = `rgb(${Math.round(52 + 180 * hp)},${Math.round(24 + 170 * hp)},${Math.round(46 + 130 * hp)})`; g.fillText(c, -1000, y);
    g.strokeStyle = `rgba(255,214,170,${.08 + .5 * hp})`; g.lineWidth = 4; g.strokeText(c, -1000, y) });
  g.fillStyle = '#2B1027'; g.fillRect(-1170, 1520, 340, 530);
  g.fillStyle = '#1A0B17'; g.fillRect(900, 250, 200, 1800); g.fillStyle = `rgba(255,214,170,${.05 + .08 * L})`; g.fillRect(900, 250, 8, 1800);   // stage-right pillar: plain, dark
}, { rad: 2200, name: 'proscenium' });

// YOU on stage
obj('SUBJECT', YOU.x, YOU.y, t => {
  const L = stageOn(t), on = spotOn(t) * (1 - offYou(t));
  drawImg(IMG.you_sing_side ? 'you_sing_side' : 'you_back', 0, 0, 1100, false, `brightness(${.35 + .4 * L + .45 * on}) saturate(${.7 + .3 * L})`);
  const hz = g.createLinearGradient(0, -160, 0, 20); hz.addColorStop(0, 'rgba(20,14,16,0)'); hz.addColorStop(1, 'rgba(20,14,16,.55)'); g.fillStyle = hz; g.fillRect(-400, -160, 800, 180);
}, { rad: 1200, name: 'YOU' });

// the audience: rows built of the word 좋아해. Front rows big and near (fast parallax), back rows small and far,
// each row's words shrinking toward the stage (its vanishing side). Drawn back to front.
const ROW_Y = [6700, 6520, 6365, 6232, 6118, 6020, 5936, 5864, 5802, 5750];
for (let k = ROW_Y.length - 1; k >= 0; k--) {
  const p = 1.28 - .064 * k, size = 150 * Math.pow(.83, k), xs = -760 + 45 * k;
  obj('SUBJECT', 10560, ROW_Y[k], t => {
    const up = eOut(clamp((t - 55.71 - (9 - k) * BEAT / 3) / .3)) * (1 - clamp((t - 58.5) / 1.5));   // "모두의 인정받고": the rows stand, back to front
    g.fillStyle = '#0E0909'; g.fillRect(xs - 30, 10, 2600, size * 1.6);                                  // the riser
    g.textAlign = 'right'; g.textBaseline = 'alphabetic';
    let x = 1500, n = 0;
    while (x > xs) {
      const d = (x - xs) / (1500 - xs), sc = .5 + .5 * d, f = size * sc; g.font = MK(f, 800);
      const w = g.measureText('좋아해').width, j = up * f * (.2 + .12 * R(k, n));
      const warm = .35 + .5 * up; g.fillStyle = `rgba(${Math.round(150 + 90 * up)},${Math.round(92 + 110 * up)},${Math.round(80 + 90 * up)},${warm})`;
      g.fillText('좋아해', x, -j); x -= w + f * .35; n++;
    }
  }, { p, rad: 1800, name: `audience row ${k}` });
}

// the follow-spot booth at the top of the house: a glass box, the lamp, ME (neutral-cool light)
obj('SUBJECT', 10760, 4290, t => {
  g.fillStyle = '#0C0A10'; g.fillRect(-60, 330, 120, 900);                                              // the booth's post
  g.fillStyle = '#12131B'; g.fillRect(-410, -340, 820, 680);
  const sp = g.createRadialGradient(-240, 40, 20, -100, 0, 700); sp.addColorStop(0, 'rgba(220,230,245,.34)'); sp.addColorStop(1, 'rgba(220,230,245,.03)');
  g.fillStyle = sp; g.fillRect(-400, -330, 800, 660);                                                   // the lamp's spill inside
  boothWall(t);                                                                                         // the credits on the wall behind ME (lyrics.js)
  const lit = meLit(t);                                                                                 // silhouette with a rim from the lamp, then the face
  drawImg('me_profile', 110, 420, 840, true, `brightness(${.08 + .9 * lit}) drop-shadow(-5px 0 0 rgba(255,236,200,${.8 * (1 - lit)}))`);
  g.save(); g.translate(-290, 40); const ang = Math.atan2(lerp(5520, CIRCLE.y, offYou(t)) - LAMP.y, spotX(t) - LAMP.x); g.rotate(ang);   // the lamp aims at the spot
  g.fillStyle = '#2B2A36'; g.fillRect(-20, -48, 190, 96); g.fillStyle = '#3B3A48'; g.fillRect(-20, -48, 190, 14);
  g.fillStyle = '#0A090E'; g.fillRect(-60, -14, 44, 28);                                                // handle
  lampLabel(t);                                                                                         // the equipment label (lyrics.js)
  g.restore();
  g.fillStyle = '#12131B'; g.fillRect(-410, 250, 820, 90);                                               // the booth's lower wall
  g.fillStyle = 'rgba(160,170,190,.12)'; for (let x = -380; x < 400; x += 95) g.fillRect(x, 262, 2, 66);
  g.fillStyle = 'rgba(150,180,230,.07)'; g.fillRect(-400, -330, 800, 580);                              // glass
  g.strokeStyle = 'rgba(200,220,255,.12)'; g.lineWidth = 3; for (const x of [-250, 60]) { g.beginPath(); g.moveTo(x, -330); g.lineTo(x + 180, 250); g.stroke() }
  g.strokeStyle = '#26283A'; g.lineWidth = 12; g.strokeRect(-410, -340, 820, 680);
  txt('FOLLOW SPOT 2', 380, -300, CE(20, 500), 'rgba(143,150,170,.7)', 'right');
}, { rad: 1200, name: 'booth' });

// ================= MID_FG (1.12): board hardware, braces =================
obj('MID_FG', 6120, 5400, t => {                                     // the pipe stand the board hangs from, and a work lamp on a boom
  g.fillStyle = '#0A0912'; g.fillRect(-14, -700, 28, 1400); g.fillRect(-14, -660, 460, 22); g.fillRect(-14, 520, 120, 18);
  g.fillStyle = '#1A1826'; g.fillRect(420, -690, 60, 50);
  g.save(); g.translate(460, -640); g.rotate(.5); g.fillStyle = '#12111A'; g.fillRect(-30, -20, 90, 44); g.restore();
  g.strokeStyle = '#0A0912'; g.lineWidth = 8; g.beginPath(); g.moveTo(0, -640); g.quadraticCurveTo(-120, -200, -40, 690); g.stroke();
}, { rad: 900 });
obj('MID_FG', 7050, 6050, t => {                                     // braces built from the letters 버티고, with depth toward the stage
  const lit = k => clamp((t - chT(16, 2 + k) + .05) / .25);
  [['버', -170, -140], ['티', 0, -300], ['고', 150, -470]].forEach(([c, x, y], i) => {
    const L = lit(i); g.save(); g.translate(x, y); g.rotate(-.62);
    extruded(c, TK(430), '#3A3040', '#16121C', 5, -3, 12);
    g.strokeStyle = `rgba(255,214,160,${.08 + .5 * L})`; g.lineWidth = 4 + 3 * L; g.strokeText(c, 0, 0);
    g.fillStyle = '#6B6272'; for (const [bx, by] of [[-150, 150], [150, -150]]) { g.beginPath(); g.arc(bx, by, 10, 0, 7); g.fill() }   // bolts
    g.restore();
  });
  g.fillStyle = '#1E1A26'; g.fillRect(-420, 40, 820, 30);                                               // the base plate on the floor
  g.fillStyle = '#D4D0DA'; g.fillRect(-420, -40, 230, 70); txt('SL BRACE 2', -305, 0, CE(20, 500), '#3A3346');
}, { rad: 900, name: 'braces 버티고' });

// ================= FG (1.35): batten, road case, ropes, cable, heads of the audience =================
obj('FG', 6300, 4620, t => { g.fillStyle = '#06050B'; g.fillRect(-1300, -22, 2600, 44); for (let x = -1200; x < 1300; x += 340) g.fillRect(x, -60, 36, 120) }, { rad: 1400 });
obj('FG', 6250, 6420, t => {
  g.fillStyle = '#07060C'; g.fillRect(-380, -150, 760, 400); g.fillStyle = '#16141E'; g.fillRect(-380, -150, 760, 12);
  txt('ROAD CASE · SL', -340, -80, CE(26, 500), 'rgba(140,140,170,.35)', 'left');
}, { rad: 700 });
for (const [x, w] of [[5820, 16], [6080, 10]]) obj('FG', x, 4700, t => { g.fillStyle = '#05040A'; g.fillRect(-w / 2, -1900, w, 3200) }, { rad: 1600 });
obj('FG', 10150, 6800, t => { g.font = TK(300); g.textAlign = 'center'; g.fillStyle = '#060304'; g.fillText('좋아해  좋아해  좋아해', 0, 0) }, { rad: 1800, name: 'audience heads' });

// the curtains: two panels at different depths with a slit that never closes. The camera passes between them:
// from 48.45 they swell past the lens (magnified about the screen centre) and are gone by 49.0.
const passCurtain = t => { const u = clamp((t - 48.45) / .55); return 1 / (1 - .94 * eIn(u)) };
function velvet(x0, x1, dark) {
  const gr = g.createLinearGradient(x0, 0, x1, 0);
  for (let k = 0; k <= 10; k++) { const v = .5 + .5 * Math.sin(k * 2.2 + x0); gr.addColorStop(k / 10, `rgb(${Math.round((22 + 24 * v) * dark)},${Math.round((12 + 8 * v) * dark)},${Math.round((38 + 22 * v) * dark)})`) }
  g.fillStyle = gr; g.fillRect(x0, -1600, x1 - x0, 3000);
}
for (const [side, p] of [[-1, 1.5], [1, 1.18]]) {
  const o = { layer: 'FG', p, x: 7290, y: 4950, rad: 2600, name: side < 0 ? 'curtain (near)' : 'curtain (far)', mag: passCurtain,
    draw: t => {
      if (t > 49.0) return;
      g.globalAlpha = 1 - clamp((t - 48.9) / .1);
      if (side < 0) velvet(-700, -35, 1); else velvet(35, 640, .75);
      const gw = g.createLinearGradient(side * 35 - 60, 0, side * 35 + 60, 0); gw.addColorStop(0, rgba(PAL.spot, 0)); gw.addColorStop(.5, rgba(PAL.spot, .5)); gw.addColorStop(1, rgba(PAL.spot, 0));
      g.fillStyle = gw; g.fillRect(side * 35 - 60, -1600, 120, 3000);                                   // the lit edge of each panel
    } };
  OBJ.push(o);
}

// ================= LENS (1.9): things that pass right in front of the lens, out of focus =================
obj('LENS', 6930, 5620, t => { g.rotate(-.62); g.fillStyle = '#050409'; g.fillRect(-1400, -45, 2800, 90); g.fillStyle = 'rgba(255,214,160,.18)'; g.fillRect(-1400, -45, 2800, 6) }, { rad: 1500, blur: 9, name: 'brace (near lens)' });
obj('LENS', 10540, 4350, t => {                                   // the booth's corner post, very close: it sweeps across as the camera finds ME
  g.fillStyle = '#07080C'; g.fillRect(-40, -1000, 80, 2000); g.fillStyle = 'rgba(210,225,245,.16)'; g.fillRect(34, -1000, 6, 2000);
}, { rad: 1100, blur: 10, p: 2.4, name: 'booth post (near lens)' });
