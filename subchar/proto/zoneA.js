/* Sub character v4: ZONE A, the class photo on the board and the 1st-floor hallway (0.00 - 25.3).
   World (y down, hallway floor at the far-wall base y 6300 / near edge y 6750):
     board (-9000, 5450) with the class photo 1300x867 centred at (-9000, 5400)
     hallway x -7850 .. -2950: far wall (MID_BG), windows WIN_X, the wall lettered 너처럼 (-3820, 5400), pillars (MID_FG)
   Characters: YOU walks right through the hallway (you_walk_side); ME follows in the foreground, cropped at the left edge,
   and is found only as a reflection in a window. Act 1: YOU owns the framing. */

// ---------- room planes shared by A and B: floor and ceiling in perspective (their edges sit at two depths) ----------
const WALL_P = .6, NEAR_P = 1.35, FLOOR_Y = [6300, 6750], CEIL_Y = [4650, 4150];
const depthPt = (x, f, ys = FLOOR_Y) => proj(lerp(WALL_P, NEAR_P, f), x, lerp(ys[0], ys[1], f));
function screenSpace() { g.setTransform(1, 0, 0, 1, CX, CY); g.rotate(CAM.r * Math.PI / 180); g.translate(-CX, -CY) }
function band(x0, x1, ys, fill, seams, seamCol, rows) {       // a horizontal plane from the far wall to the near edge
  screenSpace();
  const a = depthPt(x0, 0, ys), b = depthPt(x1, 0, ys), c = depthPt(x1, 1, ys), d = depthPt(x0, 1, ys);
  g.fillStyle = fill; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y); g.fill();
  g.strokeStyle = seamCol; g.lineWidth = 2;
  for (let x = Math.ceil(x0 / seams) * seams; x <= x1; x += seams) { const p = depthPt(x, 0, ys), q = depthPt(x, 1, ys); g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke() }   // seams converge in depth
  for (const f of rows) { const p = depthPt(x0, f, ys), q = depthPt(x1, f, ys); g.beginPath(); g.moveTo(p.x, p.y); g.lineTo(q.x, q.y); g.stroke() }
}
// text lying on the floor at depth f, one character at a time (each is projected and squashed like the floor)
function floorRun(t, i, a, b, x0, f, font, col, o = {}) {
  const C = lineChars(i), E = Ln[i].e, keep = o.keep ?? .45, fade = 1 - (1 - keep) * clamp((t - E - 1.4) / 1.2);
  setFont(font); const sz = fsize(font); let x = x0;
  screenSpace(); g.textAlign = 'left'; g.textBaseline = 'alphabetic';
  for (let k = a; k < b; k++) {
    if (k > a && C[k].sp) x += sz * .35;
    const al = clamp((t - C[k].t + .06) / .25), q = depthPt(x, f), w = g.measureText(C[k].c).width;
    if (al > 0) {
      const drop = o.sink && k >= o.sink ? eIn(clamp((t - C[k].t - .25) / .7)) : 0;   // letters that sink below the floor
      g.save(); g.translate(q.x, q.y + drop * 60 * q.k); g.scale(q.k, q.k * .42); g.globalAlpha = al * fade * (1 - drop) * (o.alpha ?? 1);
      g.fillStyle = typeof col === 'function' ? col(t) : col; g.fillText(C[k].c, 0, 0); g.restore();
    }
    x += w;
  }
}

// ---------- the characters' paths ----------
const YOU_STOP = 28.4;                                                 // YOU walks right at 400 px/s from 12.0 s and stops at the classroom window
const youX = t => -8100 + 400 * (Math.min(t, YOU_STOP) - 12);
const meAx = t => youX(t) - 560 - 760 * (1 - eSm(clamp((t - 16.2) / 1.3)));   // ME catches up behind him in the foreground
const ME_STOP = 20.6;                                                  // ME stops at the window; the camera stops with her gaze
const meX = t => meAx(Math.min(t, ME_STOP));
const WIN_X = [-7350, -6300, -5150], WIN_ME = -5150;                   // the window where ME is found

// ================= the board and the class photo =================
obj('SUBJECT', -9000, 5450, t => {
  g.fillStyle = '#6B4E36'; g.fillRect(-1180, -780, 2360, 1560);                                           // cork board
  g.fillStyle = '#7E5E42'; for (let i = 0; i < 260; i++) g.fillRect((R(i, 1) - .5) * 2340, (R(i, 2) - .5) * 1540, 4, 3);
  g.strokeStyle = '#3C2A1C'; g.lineWidth = 26; g.strokeRect(-1180, -780, 2360, 1560);
  txt('2-3  ·  CLASS PHOTO', -1110, -700, LABEL(30), 'rgba(40,28,20,.55)', 'left');
  g.save(); g.translate(-930, 60); g.rotate(-.04); g.fillStyle = '#E8E2D6'; g.fillRect(-140, -220, 280, 420);   // a timetable sheet (ambient)
  g.fillStyle = 'rgba(60,50,40,.25)'; for (let k = 0; k < 9; k++) g.fillRect(-110, -170 + k * 40, 220, 3); txt('TIMETABLE', -110, -190, LABEL(18), 'rgba(60,50,40,.5)', 'left'); g.restore();
  // the photo: a print with a white border and a printed caption strip
  g.fillStyle = 'rgba(0,0,0,.35)'; g.fillRect(-660, -500, 1336, 1030);
  g.fillStyle = '#F4F1EA'; g.fillRect(-680, -520, 1360, 1030);
  const im = IMG.mem_photo; if (im) g.drawImage(im, -650, -483, 1300, 867);
  txt('주인공', 2, 468, YOU_T(66), '#221A16');                             // printed under YOU: large and steady
  txt('* extra', 640, 470, ME_T(1, 15), 'rgba(80,80,90,.8)', 'right');    // ME's footnote, at the very edge
  g.fillStyle = '#C23B32'; for (const [x, y] of [[-650, -500], [650, -500]]) { g.beginPath(); g.arc(x, y, 12, 0, 7); g.fill() }
  // the title card pinned beyond the photo's edge: found as the camera leaves the frame
  g.save(); g.translate(890, -260); g.rotate(.035); g.fillStyle = '#EFEBE3'; g.fillRect(-190, -120, 380, 250);
  txt('SUB CHARACTER', -160, -40, LABEL(40, 660), '#1C1A22', 'left'); txt('윤하  ·  YOUNHA', -160, 20, F(500, 26), '#3A3642', 'left');
  txt('ROLE — EXTRA', -160, 80, LABEL(18), 'rgba(58,54,66,.7)', 'left'); g.fillStyle = '#C23B32'; g.beginPath(); g.arc(0, -110, 10, 0, 7); g.fill(); g.restore();
}, { rad: 1300, name: 'board + class photo' });

// ================= hallway =================
function farWall(x0, x1, col, trims) {                                // a far-wall segment bounded exactly by world x (screen space)
  screenSpace(); const a = proj(WALL_P, x0, CEIL_Y[0]), b = proj(WALL_P, x1, FLOOR_Y[0]);
  g.fillStyle = col; g.fillRect(a.x, a.y, b.x - a.x, b.y - a.y);
  for (const [y0, y1, c] of trims) { const p = proj(WALL_P, x0, y0), q = proj(WALL_P, x1, y1); g.fillStyle = c; g.fillRect(p.x, p.y, q.x - p.x, q.y - p.y) }
}
obj('MID_BG', -6400, 5475, t => farWall(-10400, -2950, '#C9C1B3', [[6235, 6300, '#A99F90'], [5095, 5109, '#B5AC9E']]), { world: true, rad: 5000, name: 'hallway wall' });
for (const x of WIN_X) obj('MID_BG', x, 5400, t => {                     // windows: bright glass, frame; the one where ME is found carries her reflection
  g.fillStyle = '#8E8676'; g.fillRect(-330, -470, 660, 940);
  const sky = g.createLinearGradient(0, -450, 0, 450); sky.addColorStop(0, '#F4F2EC'); sky.addColorStop(1, '#D9E2E6'); g.fillStyle = sky; g.fillRect(-310, -450, 620, 900);
  g.fillStyle = 'rgba(120,150,120,.35)'; for (let k = 0; k < 7; k++) { g.beginPath(); g.arc(-260 + k * 90, 380 - 60 * R(k, x), 90, 0, 7); g.fill() }   // trees outside
  if (x === WIN_ME) {
    g.save(); g.beginPath(); g.rect(-310, -450, 620, 900); g.clip();
    const sil = clamp((t - 21.0) / .5), face = eSm(clamp((t - 21.55) / .7));
    if (sil > 0) { g.globalAlpha = .55 * sil; drawImg('me_profile', -120, 470, 820, false, `brightness(${.12 + .75 * face}) saturate(${.5 + .4 * face}) hue-rotate(-8deg)`); g.globalAlpha = 1 }
    const gx = lerp(-520, 520, clamp((t - 20.75) / .7)), gl = g.createLinearGradient(gx - 160, 0, gx + 160, 0);   // the sun's glint sweeps the glass first
    gl.addColorStop(0, 'rgba(255,255,255,0)'); gl.addColorStop(.5, 'rgba(255,255,250,.75)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    g.globalCompositeOperation = 'lighter'; g.fillStyle = gl; g.fillRect(gx - 160, -450, 320, 900); g.globalCompositeOperation = 'source-over';
    g.restore();
  }
  g.fillStyle = '#8E8676'; g.fillRect(-8, -450, 16, 900); g.fillRect(-310, -30, 620, 14); g.fillStyle = '#B9B0A2'; g.fillRect(-340, 460, 680, 26);   // mullions, sill
}, { world: true, rad: 600 });
obj('MID_BG', -3820, 5420, t => {                                        // the end of the hallway: a wall that IS the word 너처럼
  const on = eSm(clamp((t - 23.0) / .8)); setFont(YOU_T(560)); g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillStyle = `rgb(${Math.round(150 + 90 * on)},${Math.round(142 + 88 * on)},${Math.round(130 + 84 * on)})`; g.fillText('너처럼', 0, 0);
  g.strokeStyle = 'rgba(90,80,70,.25)'; g.lineWidth = 3; g.strokeText('너처럼', 0, 0);
}, { world: true, rad: 1000, name: 'wall 너처럼' });
obj('MID_BG', -5400, 6300, t => {                                        // floor and ceiling of the hallway, in perspective
  band(-7850, -2950, FLOOR_Y, '#9FA39A', 400, 'rgba(70,74,66,.35)', [.3, .55, .8]);
  band(-7850, -2950, CEIL_Y, '#D9D5CC', 900, 'rgba(120,112,100,.25)', []);
  screenSpace(); for (let x = -7500; x < -3000; x += 900) {             // ceiling lights
    const a = depthPt(x - 160, .5, CEIL_Y), b = depthPt(x + 160, .5, CEIL_Y), c = depthPt(x + 160, .62, CEIL_Y), d = depthPt(x - 160, .62, CEIL_Y);
    g.fillStyle = 'rgba(255,255,248,.9)'; g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(c.x, c.y); g.lineTo(d.x, d.y); g.fill();
  }
}, { world: true, rad: 4000 });
for (const x of [-6825, -5725, -4550]) obj('MID_FG', x, 5500, t => {    // pillars standing out from the wall
  const gr = g.createLinearGradient(-90, 0, 90, 0); gr.addColorStop(0, '#B8AF9F'); gr.addColorStop(1, '#8F8676'); g.fillStyle = gr; g.fillRect(-90, -1300, 180, 2350);
}, { world: true, rad: 1300 });

// YOU in the hallway
obj('SUBJECT', t => youX(t), 6540, t => {
  if (t < 12) return;
  const bob = Math.abs(Math.sin((Math.min(t, YOU_STOP) - 12) * Math.PI * 1.6)) * 10;
  drawImg('you_walk_side', 0, -bob, 1150, false, 'brightness(1.02)');
}, { rad: 1200, name: 'YOU (walking)' });

// ME in the foreground: only her head and shoulders at the left edge, never framed
obj('FG', t => meX(t), 6950, t => {
  if (t < 16 || t > 24.5) return;
  drawImg('me_profile', 0, 0, 1500, false, 'brightness(.8)');
}, { rad: 1200, name: 'ME (foreground)' });

// a column right at the hallway's entrance passes the lens as the camera leaves the board
obj('LENS', -7780, 5400, t => { g.fillStyle = '#4A443C'; g.fillRect(-110, -1600, 220, 3200); g.fillStyle = 'rgba(255,250,240,.12)'; g.fillRect(90, -1600, 8, 3200) }, { rad: 1700, blur: 10, name: 'column (near lens)' });

// ================= lyrics, zone A =================
// L00 along the floor like a lane marking (ME, act 1)
lyric('SUBJECT', -6700, 6600, 0, t => floorRun(t, 0, 0, all(0), -7020, .44, ME_T(1, 96), 'rgba(60,64,60,.8)', { keep: .55 }), { rad: 3000 });
// L01 "네 뒷모습" written down YOU's back as he walks (YOU's type), 만 small (ME)
lyric('SUBJECT', t => youX(Math.min(t, 19.6)) - 170, 5470, 1, t => {
  runs(t, 1, [{ a: 0, b: 1, font: YOU_T(150), col: '#2A2A30' }], 0, -150, { al: 'right', keep: .35 });
  g.save(); g.translate(0, 0); const C = lineChars(1); setFont(YOU_T(116)); g.textAlign = 'right'; g.textBaseline = 'alphabetic';
  for (let k = 1; k < 4; k++) { const a = clamp((t - C[k].t + .06) / .22), fade = 1 - .65 * clamp((t - Ln[1].e - 1.4) / 1.2); if (a <= 0) continue; g.globalAlpha = a * fade; g.fillStyle = '#2A2A30'; g.fillText(C[k].c, 0, (k - 1) * 112 + 10) }
  g.restore(); runs(t, 1, [{ a: 4, b: 5, font: ME_T(1, 34), col: 'rgba(60,60,70,.8)' }], 10, 330, { al: 'left', keep: .4 });
}, { rad: 1200, until: 20.0 });   // it rides YOU's back, then stays behind in the hallway
// L02 the gaze: the words run from ME's eye in the foreground to YOU's head, receding in depth
lyric('SUBJECT', 0, 0, 2, t => {
  const C = lineChars(2), n = C.length, E = Ln[2].e, fade = 1 - .7 * clamp((t - E - 1.2) / 1.2);
  screenSpace(); g.textAlign = 'center'; g.textBaseline = 'middle';
  const x0 = meX(t) + 150, y0 = 5700, x1 = youX(Math.min(t, 20.0)) + 60, y1 = 5430;   // from ME's eye (foreground) to YOU's head
  for (let k = 0; k < n; k++) {
    const u = k / (n - 1), p = lerp(1.3, 1.0, u), q = proj(p, lerp(x0, x1, u), lerp(y0, y1, u)), a = clamp((t - C[k].t + .06) / .22); if (a <= 0) continue;
    setFont(ME_T(1, lerp(64, 40, u))); g.save(); g.translate(q.x, q.y); g.scale(q.k, q.k); g.globalAlpha = a * fade; g.fillStyle = 'rgba(40,44,52,.85)'; g.fillText(C[k].c, 0, 0); g.restore();
  }
}, { rad: 1e5, until: 22.2 });
// L03 on the window sill, small; L04 inside the reflection next to ME's face
lyric('MID_BG', WIN_ME, 5400, 3, t => runs(t, 3, [{ a: 0, b: all(3), font: ME_T(1, 48), col: 'rgba(70,66,60,.9)' }], -300, 530, { al: 'left', keep: .5 }), { world: true, rad: 700 });
lyric('MID_BG', WIN_ME, 5400, 4, t => { g.save(); g.beginPath(); g.rect(-310, -450, 620, 900); g.clip(); runs(t, 4, [{ a: 0, b: all(4), font: ME_T(1, 44), col: 'rgba(40,60,90,.8)' }], 30, -150, { al: 'left', keep: .6 }); g.restore() }, { world: true, rad: 700 });
// L05 "너처럼" is the wall (above); "될 순 있을까" small at its foot
lyric('MID_BG', -3820, 5420, 5, t => runs(t, 5, [{ a: 3, b: all(5), font: ME_T(1, 52), col: 'rgba(60,56,52,.9)' }], -780, 430, { al: 'left', keep: .6 }), { world: true, rad: 1000 });
