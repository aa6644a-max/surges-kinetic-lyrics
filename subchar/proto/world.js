/* Sub character v4 prototype: the world.
   Every element lives at a WORLD coordinate on one of five depth layers. The camera transform projects it:
     screen = centre + p * k * (world - camera),  k = camera.scale ^ p
   so a layer with parallax p moves p times as fast as the subject plane and zooms a little faster (FG) or slower (BG).
   An element sits exactly where it is placed when the camera looks straight at it.
   Zones (world px, stage deck top at y 6100):
     BACKSTAGE  x 4800-7250   cast board (6500,5450), braces, curtain gap at x 7290
     STAGE      x 7250-9700   YOU (8350, feet 6170), backdrop, proscenium of type, spot circle ends at (8980,6195)
     HOUSE      x 9700-11600  raked seats of type, follow-spot booth (10760,4290), lamp (10470,4330) */
const W = 1080, H = 1920, CX = 540, CY = 960;
const LAYERS = [['BG', .25], ['MID_BG', .6], ['SUBJECT', 1], ['MID_FG', 1.12], ['FG', 1.35]];
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
function obj(layer, x, y, draw, o = {}) { OBJ.push({ layer, p: PF[layer], x, y, draw, rad: o.rad ?? 2600, name: o.name || '' }) }

function proj(p, x, y) { const k = Math.pow(CAM.s, p); return { x: CX + p * k * (x - CAM.x), y: CY + p * k * (y - CAM.y), k } }
function place(o) {
  const q = proj(o.p, o.x, o.y);
  if (Math.abs(q.x - CX) - o.rad * q.k > 1500 || Math.abs(q.y - CY) - o.rad * q.k > 2100) return false;   // off screen
  g.setTransform(1, 0, 0, 1, CX, CY); g.rotate(CAM.r * Math.PI / 180 * Math.min(1, o.p)); g.translate(q.x - CX, q.y - CY); g.scale(q.k, q.k);
  return true;
}
function drawWorld(t) { for (const [L] of LAYERS) for (const o of OBJ) if (o.layer === L && place(o)) { g.save(); o.draw(t); g.restore() } g.setTransform(1, 0, 0, 1, 0, 0) }

// ---------- shared state of the stage (all functions of t) ----------
const CURTAIN_T = 48.55;                                             // "I'm a sub character": the curtain opens, the spot goes on (downbeat)
const stageOn = t => .32 + .68 * eIO(clamp((t - CURTAIN_T) / .45));
const spotOn = t => eOut(clamp((t - CURTAIN_T + .05) / .3));
const LAMP = { x: 10470, y: 4330 }, YOU = { x: 8350, y: 6170 }, CIRCLE = { x: 8980, y: 6195 };
function spotX(t) {                                                  // the follow spot: steady on YOU, wavers on "Tell me", slides to the empty floor on "내가"
  if (t < 64.18) return YOU.x;
  const wob = Math.sin((t - 64.18) * 11) * 26 * clamp((t - 64.18) / .3) * (1 - clamp((t - 65.42) / .4));
  return YOU.x + wob + (CIRCLE.x - YOU.x) * eBk(clamp((t - 65.42) / 1.35), .9);
}
const offYou = t => clamp((spotX(t) - YOU.x) / 380);                 // 0 = on YOU, 1 = on the empty floor
const circleAspect = () => lerp(.28, 1, eSm(clamp((CAM.s - 1.3) / 3.4)));   // the camera tips toward the floor as it dives
const meGrow = t => 1 + .3 * eIO(clamp((t - 57.4) / 1.6));          // the camera notices ME: her credit type grows for the first time

// ---------- small drawing helpers (local coordinates = world px) ----------
function txt(s, x, y, font, col, al = 'center', base = 'alphabetic') { g.font = font; g.fillStyle = col; g.textAlign = al; g.textBaseline = base; g.fillText(s, x, y) }
function rgba(h, a) { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})` }
function drawImg(id, cx, bottom, h, flip = false, filter = '') {
  const im = IMG[id]; if (!im) return; const w = im.width * h / im.height;
  g.save(); if (filter) g.filter = filter; g.translate(cx, bottom); if (flip) g.scale(-1, 1); g.drawImage(im, -w / 2, -h, w, h); g.restore();
}
function glyphStack(chars, x, y0, size, step, fill, edge) {   // big title glyphs stacked vertically: a pillar made of letters
  g.font = TK(size); g.textAlign = 'center'; g.textBaseline = 'middle';
  chars.forEach((c, i) => { const y = y0 + i * step; g.fillStyle = fill; g.fillText(c, x, y); if (edge) { g.strokeStyle = edge; g.lineWidth = 4; g.strokeText(c, x, y) } });
}

// ================= BG (.25): fly loft, battens, the distant house glow =================
obj('BG', 8300, 3600, t => {
  g.globalAlpha = .045; txt('MAIN CHARACTER', 0, 0, TE(760), '#FFFFFF'); g.globalAlpha = 1;          // the loft wall is lettered with the play's title
  for (let k = 0; k < 4; k++) { g.fillStyle = '#1A1628'; g.fillRect(-9000, -700 + k * 190, 18000, 10) }
  for (let k = 0; k < 22; k++) { const x = -5200 + k * 480; g.fillStyle = '#231D33'; g.fillRect(x - 26, -700 + (k % 4) * 190 + 10, 52, 60) }
}, { rad: 9000 });
obj('BG', 8300, 5300, t => {                                         // haze where the stage light hits the air
  const a = .1 + .16 * stageOn(t), gr = g.createRadialGradient(0, 0, 50, 0, 0, 2600);
  gr.addColorStop(0, rgba(PAL.warm, a)); gr.addColorStop(1, rgba(PAL.warm, 0)); g.fillStyle = gr; g.fillRect(-2600, -2600, 5200, 5200);
}, { rad: 2600 });

// ================= MID_BG (.6): backstage wall of giant title letters, the lit backdrop =================
obj('MID_BG', 6350, 4750, t => {                                     // backstage: the wall behind the cast board IS the word 주인공
  g.font = TK(1050); g.textAlign = 'center'; g.textBaseline = 'middle';
  const gr = g.createLinearGradient(0, -600, 0, 600); gr.addColorStop(0, '#221D38'); gr.addColorStop(1, '#100D1C');
  g.fillStyle = gr; g.fillText('주인공', 0, 0); g.strokeStyle = 'rgba(255,220,170,.07)'; g.lineWidth = 6; g.strokeText('주인공', 0, 0);
}, { rad: 1800 });
obj('MID_BG', 8350, 4950, t => {                                     // upstage: the set is the word 완벽해, lit when the curtain opens
  const L = stageOn(t); g.font = TK(760); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = `rgba(233,217,184,${.1 + .32 * L})`; g.fillText('완벽해', 0, 0);
  g.strokeStyle = `rgba(255,236,200,${.08 + .2 * L})`; g.lineWidth = 5; g.strokeText('완벽해', 0, 0);
}, { rad: 1400 });

// ================= SUBJECT (1.0) =================
// floors
obj('SUBJECT', 7000, 6100, t => {
  g.fillStyle = '#120F19'; g.fillRect(-2600, 0, 2650, 700);                                            // backstage floor
  g.fillStyle = '#1C1621'; for (let x = -2600; x < 50; x += 170) g.fillRect(x, 0, 3, 700);
  const L = stageOn(t);
  g.fillStyle = `rgb(${Math.round(40 + 30 * L)},${Math.round(28 + 18 * L)},${Math.round(36 + 16 * L)})`; g.fillRect(50, 0, 2650, 190);   // stage deck (seen slightly from above)
  g.fillStyle = 'rgba(0,0,0,.25)'; for (let k = 1; k < 6; k++) g.fillRect(50, k * 32, 2650, 2);
  g.fillStyle = '#0D0A12'; g.fillRect(50, 190, 2650, 700);                                             // apron fascia + pit
  g.fillStyle = `rgba(255,220,170,${.12 + .2 * L})`; g.fillRect(50, 188, 2650, 3);
}, { rad: 3000 });
obj('SUBJECT', 10700, 6300, t => { g.fillStyle = '#0A0811'; g.fillRect(-1000, 0, 3000, 900) }, { rad: 2000 });   // house floor

// the cast board: the hierarchy is the type size
const CAST = [['주인공', 'T', 200], ['친구 A', 'c', 84], ['친구 B', 'c', 70], ['선생님', 'c', 58], ['반장', 'c', 48], ['행인 1', 'c', 38], ['행인 2', 'c', 34],
  ['행인 3', 'c', 30], ['행인 4', 'c', 27], ['행인 5', 'c', 25], ['행인 6', 'c', 23], ['행인 7', 'm', 21]];
obj('SUBJECT', 6500, 5450, t => {
  const lg = g.createRadialGradient(0, -700, 40, 0, -200, 1300); lg.addColorStop(0, 'rgba(255,214,160,.28)'); lg.addColorStop(1, 'rgba(255,214,160,0)');   // a clip lamp above the board
  g.fillStyle = lg; g.fillRect(-900, -1100, 1800, 1800);
  g.fillStyle = '#0A0810'; g.fillRect(-338, -633, 676, 1266);
  const pg = g.createLinearGradient(0, -625, 0, 625); pg.addColorStop(0, '#E9E0CD'); pg.addColorStop(1, '#9C9486'); g.fillStyle = pg; g.fillRect(-330, -625, 660, 1250);
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
  g.strokeStyle = 'rgba(40,30,40,.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-300, -505 + 256); g.lineTo(300, -505 + 256); g.stroke();
}, { rad: 1300, name: 'cast board' });

// the back of the masking flat, and the light that leaks through the curtain gap
obj('SUBJECT', 7210, 5150, t => { g.fillStyle = '#1B1524'; g.fillRect(-30, -1050, 60, 1000); g.fillStyle = '#2A2233'; g.fillRect(-30, -1050, 8, 1000) }, { rad: 1200 });
obj('SUBJECT', 7290, 6100, t => {                                     // light wedge on the backstage floor (the clue to the stage)
  const a = .55 * (1 - clamp((t - CURTAIN_T - .5) / 1.2)) + .15;
  const gr = g.createLinearGradient(0, 0, -900, 0); gr.addColorStop(0, rgba(PAL.spot, a)); gr.addColorStop(1, rgba(PAL.spot, 0));
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, 30); g.lineTo(-900, 10); g.lineTo(-900, 190); g.lineTo(0, 110); g.fill();
}, { rad: 1000 });
obj('SUBJECT', 6720, 6150, t => { g.save(); g.scale(1, .45); txt('× 행인 7', 0, 0, CE(22, 500), 'rgba(143,211,255,.5)'); g.restore() }, { rad: 400 });   // spike tape

// proscenium: two pillars made of the word 주인공 and an arch lettered MAIN CHARACTER
obj('SUBJECT', 8250, 4050, t => {
  const L = stageOn(t), edge = `rgba(255,200,170,${.12 + .25 * L})`;
  g.fillStyle = '#240F22'; g.fillRect(-1250, -150, 2500, 260);
  g.font = TE(128); g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = `rgba(120,52,92,${.6 + .4 * L})`; g.fillText('MAIN CHARACTER', 0, -20);
  for (const x of [-1000, 1000]) { glyphStack(['주', '인', '공'], x, 400, 360, 390, '#3E1A36', edge); g.fillStyle = '#2B1027'; g.fillRect(x - 170, 1520, 340, 530) }
}, { rad: 2200, name: 'proscenium' });

// YOU on stage
obj('SUBJECT', YOU.x, YOU.y, t => {
  const L = stageOn(t), on = spotOn(t) * (1 - offYou(t));
  drawImg(IMG.you_sing_side ? 'you_sing_side' : 'you_back', 0, 0, 1100, false, `brightness(${.35 + .45 * L + .35 * on}) saturate(${.7 + .3 * L})`);
  const hz = g.createLinearGradient(0, -160, 0, 20); hz.addColorStop(0, 'rgba(20,14,26,0)'); hz.addColorStop(1, 'rgba(20,14,26,.55)'); g.fillStyle = hz; g.fillRect(-400, -160, 800, 180);   // stage haze at the feet
}, { rad: 1200, name: 'YOU' });

// raked seats: rows of the word 좋아해 rising to the booth
obj('SUBJECT', 10600, 5700, t => {
  g.fillStyle = '#0D0A14'; for (let k = 0; k < 14; k++) g.fillRect(-870 + 90 * k, 748 - 110 * k, 2400, 110);   // the steps first, the words on top
  for (let k = 0; k < 14; k++) {
    const x0 = -850 + 90 * k, y = 740 - 110 * k, up = eOut(clamp((t - 55.71 - k * BEAT / 2) / .3)) * (1 - clamp((t - 58.5) / 1.5));   // "모두의 인정받고": the rows stand up
    g.font = MK(62, 700); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
    for (let x = x0, n = 0; x < 1300; x += 250, n++) {
      const j = up * (18 + 10 * R(k, n)); g.fillStyle = up > .01 ? `rgba(${200 + 40 * up},${170 + 40 * up},${210},${.35 + .5 * up})` : rgba(PAL.seat, .9);
      g.fillText('좋아해', x, y - j);
    }
  }
}, { rad: 1800, name: 'seats' });

// the follow-spot booth at the top of the house: a glass box, the lamp, ME
obj('SUBJECT', 10760, 4290, t => {
  g.fillStyle = '#0C0A12'; g.fillRect(-60, 330, 120, 900);                                             // the booth's post
  g.fillStyle = '#15111F'; g.fillRect(-410, -340, 820, 680);
  const sp = g.createRadialGradient(-240, 40, 20, -100, 0, 700); sp.addColorStop(0, 'rgba(255,214,160,.55)'); sp.addColorStop(1, 'rgba(255,214,160,.04)');
  g.fillStyle = sp; g.fillRect(-400, -330, 800, 660);                                                   // the lamp's spill inside
  const see = clamp((t - 56.6) / 1.2);                                                                  // ME is lit as the camera arrives
  drawImg('me_profile', 110, 420, 840, true, `brightness(${.45 + .55 * see})`);
  g.save(); g.translate(-290, 40); g.rotate(Math.atan2(YOU.y - 620 - LAMP.y, spotX(t) - LAMP.x));   // the lamp aims at the spot
  g.fillStyle = '#2B2433'; g.fillRect(-20, -48, 190, 96); g.fillStyle = '#3A3244'; g.fillRect(-20, -48, 190, 14);
  g.restore();
  g.fillStyle = '#0F0C16'; g.fillRect(-410, 250, 820, 90);                                              // console
  for (let k = 0; k < 9; k++) { g.fillStyle = k === 4 ? 'rgba(255,228,92,.9)' : 'rgba(143,211,255,.35)'; g.fillRect(-360 + k * 34, 272, 16, 6) }
  g.fillStyle = 'rgba(150,180,230,.07)'; g.fillRect(-400, -330, 800, 580);                              // glass
  g.strokeStyle = 'rgba(200,220,255,.12)'; g.lineWidth = 3; for (const x of [-250, 60]) { g.beginPath(); g.moveTo(x, -330); g.lineTo(x + 180, 250); g.stroke() }
  g.strokeStyle = '#2A2438'; g.lineWidth = 12; g.strokeRect(-410, -340, 820, 680);
  txt('FOLLOW SPOT', 380, -300, CE(20, 500), 'rgba(143,138,166,.7)', 'right');
}, { rad: 1200, name: 'booth' });

// ================= MID_FG (1.12): braces, cue sheets, credit tags =================
obj('MID_FG', 7050, 6050, t => {                                     // the flat is held up by braces cut in the shape of 버티고
  const lit = k => clamp((t - chT(16, 2 + k) + .05) / .25);
  [['버', -170, -140], ['티', 0, -300], ['고', 150, -470]].forEach(([c, x, y], i) => {
    g.save(); g.translate(x, y); g.rotate(-.62); g.font = TK(430); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillStyle = '#2E2436'; g.fillText(c, 0, 0); const L = lit(i);
    g.strokeStyle = `rgba(255,214,160,${.1 + .55 * L})`; g.lineWidth = 5 + 3 * L; g.strokeText(c, 0, 0); g.restore();
  });
  g.fillStyle = '#E8DFC8'; g.fillRect(-420, -40, 230, 70); txt('SL BRACE 2', -305, 0, CE(20, 500), '#3A3346');   // tape label
}, { rad: 900, name: 'braces 버티고' });
obj('MID_FG', 7160, 5150, t => {                                     // cue sheet taped on the flat
  g.rotate(.03); g.fillStyle = '#D8D0BD'; g.fillRect(-150, -120, 300, 240);
  ['CUE 16  HOUSE ↓', 'CUE 17  FOLLOW → MAIN', 'CUE 18  (행인 7 대기)'].forEach((s, i) => txt(s, -130, -60 + i * 50, CE(19, 500), i === 1 ? '#8A2E3A' : '#3A3346', 'left'));
}, { rad: 400 });

// ================= FG (1.35): curtain, ropes, heads of the audience =================
obj('FG', 7300, 4950, t => {                                          // the traveller curtain: the gap glows, then it flies out on the downbeat
  const o = eIO(clamp((t - CURTAIN_T) / 1.1));
  const panel = (x0, x1) => { const gr = g.createLinearGradient(x0, 0, x1, 0);
    for (let k = 0; k <= 10; k++) { const v = .5 + .5 * Math.sin(k * 2.2); gr.addColorStop(k / 10, `rgb(${Math.round(30 + 26 * v)},${Math.round(12 + 8 * v)},${Math.round(40 + 22 * v)})`) }
    g.fillStyle = gr; g.fillRect(x0, -1500, x1 - x0, 2900) };
  g.translate(0, -3400 * o);                                       // the traveller flies out upward
  panel(-420 - 140 * o, -8 - 140 * o); panel(8 + 160 * o, 520 + 160 * o);
  if (o < 1) { const gw = g.createLinearGradient(-60, 0, 60, 0); gw.addColorStop(0, rgba(PAL.spot, 0)); gw.addColorStop(.5, rgba(PAL.spot, .75 * (1 - o))); gw.addColorStop(1, rgba(PAL.spot, 0));
    g.fillStyle = gw; g.fillRect(-60, -1500, 120, 2900) }
}, { rad: 2600, name: 'curtain' });
for (const [x, w] of [[5820, 16], [6080, 10], [6960, 20]]) obj('FG', x, 4700, t => { g.fillStyle = '#05040A'; g.fillRect(-w / 2, -1900, w, 3200); g.fillRect(-60, 1180, 120, 140) }, { rad: 1600 });
obj('FG', 6400, 5000, t => { g.strokeStyle = '#05040A'; g.lineWidth = 16; g.beginPath(); g.moveTo(-500, -300); g.quadraticCurveTo(0, 250, 520, -120); g.stroke() }, { rad: 800 });
obj('FG', 10150, 6690, t => { g.font = TK(300); g.textAlign = 'center'; g.fillStyle = '#07050C'; g.fillText('좋아해  좋아해  좋아해', 0, 0) }, { rad: 1800, name: 'audience heads' });
