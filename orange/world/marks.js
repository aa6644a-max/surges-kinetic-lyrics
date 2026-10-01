/* ORANGE world: manga typography and marks instead of emoji (hands, drops, sparkles, focus lines, a paper plane, birds),
   plus the objects of the later scenes (padlock, thermometer, jersey, scoreboard cards, battery, confetti, a thought bubble,
   polaroids, floor arrows) and the team chat without emoji. */

// antique balloon lettering for the lyrics, a brush face for sound effects and key words, comic caps for Latin
const MJ = '"Shippori Antique B1"', SFX = '"Potta One"', BG = '"Bangers"', BGJ = BG + ', ' + MJ;   // BGJ: comic caps with kanji

// a flat hand silhouette (open / fist / cup) with an outline and a wristband
function handVec(x, y, s, rot = 0, pose = 'open', o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); const col = o.col ?? INK, ln = o.line ?? '#FFFFFF';
  g.beginPath(); g.roundRect(-38, 150, 76, 380, 30); g.roundRect(-58, -30, 116, 190, 46);
  if (pose === 'fist') { for (let k = 0; k < 4; k++) g.roundRect(-58 + k * 29, -70, 30, 70, 14); g.roundRect(-92, 10, 70, 32, 16) }
  else { const sp = pose === 'cup' ? .05 : .16; [[-42, 118], [-14, 140], [14, 132], [40, 108]].forEach(([fx, len], k) => { g.save(); g.translate(fx, -10); g.rotate((k - 1.5) * sp); g.roundRect(-13, -len, 26, len + 20, 13); g.restore() });
    g.save(); g.translate(-52, 70); g.rotate(-.9 + (pose === 'cup' ? .4 : 0)); g.roundRect(-14, -100, 28, 110, 14); g.restore() }
  g.lineWidth = 18; g.strokeStyle = ln; g.lineJoin = 'round'; g.stroke(); g.fillStyle = col; g.fill();
  rect(-46, 360, 92, 26, o.band ?? ORG); g.restore() }
// a manga drop (sweat or a tear): white with a blue rim and a highlight
function dropMark(x, y, s, rot = 0, o = {}) { if (s <= .01) return; g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha = (o.alpha ?? 1) * GA;
  g.beginPath(); g.moveTo(0, -46); g.bezierCurveTo(22, -14, 34, 6, 34, 22); g.arc(0, 22, 34, 0, Math.PI); g.bezierCurveTo(-34, 6, -22, -14, 0, -46); g.closePath();
  g.fillStyle = o.col ?? '#FFFFFF'; g.fill(); g.lineWidth = 6; g.strokeStyle = o.line ?? '#2C6FB0'; g.stroke(); disc(-11, 18, 8, '#BFE3FF'); g.restore() }
function dropPop(t, t0, x, y, s, rot = 0, o = {}) { const k = MO.springStep(t - t0, { damping: 8, stiffness: 320 }); if (k <= .01) return; dropMark(x, y + (t - t0) * (o.fall ?? 0), s * k, rot, o) }
// a four-point sparkle (manga shine)
function sparkle(x, y, r, rot = 0, col = '#FFFFFF', a = 1) { if (r <= .5 || a <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = a * GA; g.fillStyle = col; g.beginPath();
  for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4, r2 = k % 2 ? r * .2 : r; g.lineTo(Math.cos(an) * r2, Math.sin(an) * r2) } g.closePath(); g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke(); g.restore() }
function sparkPop(t, t0, x, y, r, rot = 0, col = '#FFFFFF') { const s = MO.springStep(t - t0, { damping: 8, stiffness: 320 }); if (s <= .01) return; sparkle(x, y, r * s, rot + (t - t0) * .8, col, 1 - seg(t, t0 + 1.2, .5)) }
// focus lines toward a point
function focusLines(t, cx, cy, o = {}) { const n = o.n ?? 70, r0 = o.r0 ?? 300, a = o.a ?? .8; g.save(); g.fillStyle = o.col ?? '#FFFFFF';
  for (let k = 0; k < n; k++) { const an = R(k, 1) * 6.2832, ph = (t * (o.speed ?? 5) + R(k, 4)) % 1, r = r0 + (1 - ph) * 500, len = 700 + R(k, 2) * 900, wd = 3 + R(k, 3) * 14;
    g.globalAlpha = a * Math.sin(ph * Math.PI); g.save(); g.translate(cx + Math.cos(an) * r, cy + Math.sin(an) * r); g.rotate(an); g.beginPath(); g.moveTo(0, -wd / 2); g.lineTo(len, 0); g.lineTo(0, wd / 2); g.fill(); g.restore() }
  g.restore() }
// parallel speed streaks along an angle (screen space)
function streaks2(t, ang, o = {}) { const n = o.n ?? 40, sp = o.speed ?? 2400; g.save(); g.translate(CX, CY); g.rotate(ang); g.fillStyle = o.col ?? '#FFFFFF';
  for (let k = 0; k < n; k++) { const y = (R(k, 5) - .5) * 2600, len = 300 + R(k, 6) * 900, x = ((R(k, 7) * 4000 + t * sp * (.6 + R(k, 8) * .8)) % 4000) - 2000, th = 2 + R(k, 9) * 7;
    g.globalAlpha = (o.a ?? .5) * (.4 + .6 * R(k, 10)); g.fillRect(x - len, y - th / 2, len, th) } g.restore() }
function paperPlane(x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.strokeStyle = INK; g.lineWidth = 5; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(60, 0); g.lineTo(-50, -34); g.lineTo(-24, 0); g.closePath(); g.fillStyle = '#FFFFFF'; g.fill(); g.stroke();
  g.beginPath(); g.moveTo(60, 0); g.lineTo(-50, 30); g.lineTo(-24, 0); g.closePath(); g.fillStyle = '#E8E8EE'; g.fill(); g.stroke(); g.restore() }
function birdV(x, y, s, flap) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = '#FFFFFF'; g.lineWidth = 9; g.lineCap = 'round'; const f = 26 * flap;
  g.beginPath(); g.moveTo(-60, -f); g.quadraticCurveTo(-28, -10 - f * .4, 0, 6); g.quadraticCurveTo(28, -10 - f * .4, 60, -f); g.stroke(); g.restore() }
function padlock(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 16; g.strokeStyle = INK; g.beginPath(); g.arc(0, -30, 46, Math.PI, 0); g.stroke(); rr(-70, -30, 140, 110, 18, YEL, { line: INK, lw: 8 }); disc(0, 18, 14, INK); rect(-5, 18, 10, 32, INK); g.restore() }
function thermo(x, y, s, p) { g.save(); g.translate(x, y); g.scale(s, s); rr(-40, -420, 80, 470, 40, '#FFFFFF', { line: INK, lw: 8 }); disc(0, 80, 70, '#FFFFFF'); ring(0, 80, 70, 8, INK);
  const h = 380 * clamp(p); rr(-22, 30 - h, 44, h + 30, 22, RED); disc(0, 80, 52, RED); for (let k = 0; k < 6; k++) line(40, -360 + k * 64, 70, -360 + k * 64, 6, INK); g.restore() }
function jerseyObj(x, y, s, rot, num) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.beginPath(); g.moveTo(-170, -260); g.lineTo(-60, -300); g.quadraticCurveTo(0, -260, 60, -300); g.lineTo(170, -260); g.lineTo(280, -150); g.lineTo(200, -60); g.lineTo(160, -110); g.lineTo(160, 300); g.lineTo(-160, 300); g.lineTo(-160, -110); g.lineTo(-200, -60); g.lineTo(-280, -150); g.closePath();
  g.fillStyle = ORG; g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke(); rect(-160, 210, 320, 26, INK); rect(-160, 250, 320, 10, '#FFFFFF');
  txt(String(num), 0, 120, { size: 300, fam: BG, col: '#FFFFFF', al: 'center', upper: false }); g.restore() }
// a scoreboard flip card (the top half shows the new digit, the bottom flips down)
function flipCard(x, y, w, h, from, to, t0, t, o = {}) { const p = clamp((t - t0) / (o.dur ?? .28)), size = h * .78;
  const face = (d, top, sy) => { g.save(); g.beginPath(); g.rect(x - w / 2, top ? y - h / 2 : y, w, h / 2); g.clip(); g.translate(x, y); g.scale(1, sy); g.fillStyle = '#1B1C24'; g.beginPath(); g.roundRect(-w / 2, -h / 2, w, h, 12); g.fill();
    txt(String(d), 0, size * .36, { size, fam: BG, col: o.col ?? '#FFFFFF', al: 'center', upper: false }); g.restore() };
  face(to, true, 1); face(from, false, 1); if (p < .5) face(from, true, Math.max(.001, 1 - p * 2)); else face(to, false, Math.max(.001, (p - .5) * 2)); rect(x - w / 2, y - 2, w, 4, '#000', .8) }
function battery(x, y, s, p, t) { g.save(); g.translate(x, y); g.scale(s, s); rr(-230, -110, 440, 220, 36, '#FFFFFF', { line: INK, lw: 12 }); rr(214, -40, 36, 80, 12, INK);
  const c = p < .1 ? RED : p < .3 ? YEL : LIME, bl = p < .1 ? (Math.floor(t * 3) % 2 ? 1 : .3) : 1; rr(-205, -85, 390 * clamp(p) + 2, 170, 20, c, { alpha: bl }); txt(Math.round(p * 100) + '%', 0, 210, { size: 110, fam: BG, col: '#FFFFFF', al: 'center', upper: false }); g.restore() }
function confetti(t, t0, cx, cy, o = {}) { const d = t - t0; if (d < 0) return; const n = o.n ?? 90, sp = o.spread ?? 1;
  for (let k = 0; k < n; k++) { const a = R(k, 61) * 6.28, v = (600 + R(k, 62) * 1400) * sp, q = Math.min(d, 1.2), x = cx + Math.cos(a) * v * q * (1 - .3 * q), y = cy + Math.sin(a) * v * q * .7 + 260 * d * d;
    g.save(); g.translate(x, y); g.rotate(d * 6 * (R(k, 63) - .5) + a); g.scale(1, Math.cos(d * 9 + k)); g.fillStyle = [ORG, YEL, SKY, '#FFFFFF', RED, LIME][k % 6]; g.fillRect(-16, -8, 32, 16); g.restore() } }
// a manga thought bubble (a cloud with trailing circles)
function thoughtBubble(x, y, w, h, s) { if (s <= .01) return; g.save(); g.translate(x, y); g.scale(s, s); const P = [];
  for (let k = 0; k < 14; k++) { const a = k / 14 * 6.2832; P.push([Math.cos(a) * w / 2, Math.sin(a) * h / 2, 90 + 40 * R(k, 71)]) }
  g.strokeStyle = INK; g.lineWidth = 10; for (const [bx, by, r] of P) { g.beginPath(); g.arc(bx, by, r, 0, 7); g.stroke() } for (const [bx, by, r] of P) disc(bx, by, r - 5, '#FFFFFF');
  g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(0, 0, w / 2, h / 2, 0, 0, 7); g.fill(); for (const [dx, dy, r] of [[-w * .45, h * .66, 46], [-w * .6, h * .86, 28]]) { disc(dx, dy, r, '#FFFFFF'); ring(dx, dy, r, 8, INK) } g.restore() }
function polaroid(x, y, w, rot, id, o = {}) { const h = w * 1.18; g.save(); g.translate(x, y); g.rotate(rot); g.scale(o.s ?? 1, o.s ?? 1); g.globalAlpha = (o.alpha ?? 1) * GA;
  rr(-w / 2 + 14, -h / 2 + 18, w, h, 8, 'rgba(0,0,0,.28)'); rr(-w / 2, -h / 2, w, h, 8, '#FFFFFF', { line: 'rgba(0,0,0,.15)', lw: 3 });
  g.save(); g.beginPath(); g.rect(-w / 2 + 26, -h / 2 + 26, w - 52, w - 52); g.clip(); cover(id, -w / 2 + 26, -h / 2 + 26, w - 52, w - 52, { zoom: 1.2 }); g.restore();
  if (o.cap) txt(o.cap, 0, h / 2 - 40, { size: w * .12, fam: HW, w: 600, col: INK, al: 'center', upper: false }); g.restore() }
function arrowFloor(x, y, len, rot, col = '#FFFFFF', a = 1) { g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = a * GA; g.fillStyle = col; g.beginPath();
  g.moveTo(-len / 2, -70); g.lineTo(len / 2 - 160, -70); g.lineTo(len / 2 - 160, -170); g.lineTo(len / 2, 0); g.lineTo(len / 2 - 160, 170); g.lineTo(len / 2 - 160, 70); g.lineTo(-len / 2, 70); g.closePath(); g.fill(); g.lineWidth = 10; g.strokeStyle = INK; g.stroke(); g.restore() }

// the team chat on the bench phone, without emoji: photos, a ball sticker, a voice note, two cheers
function chatScreen2(t) {
  rect(0, 0, W, H, '#BFE0F3'); g.save(); g.fillStyle = dots('rgba(255,255,255,.45)', 14, 2); g.fillRect(0, 0, W, H); g.restore();
  rect(0, 0, W, 200, '#FFFFFF'); line(0, 200, W, 200, 4, INK); txt('‹', 50, 140, { size: 90, w: 500, fam: RD, col: INK, upper: false }); disc(170, 116, 52, ORG); ring(170, 116, 52, 4, INK); vball(170, 116, 74, 0);
  txt('バレー部', 240, 136, { size: 50, w: 800, fam: RD, col: INK, upper: false }); txt('(6)', 455, 136, { size: 38, w: 500, fam: RD, col: GREY, upper: false });
  const AVC = [ORG, SKY, LIME], av = (k, y) => { disc(95, y + 50, 44, AVC[k]); ring(95, y + 50, 44, 4, INK); txt('ABC'[k], 95, y + 66, { size: 46, fam: BG, col: INK, al: 'center', upper: false }) };
  const M = [[16, 0, 'photo', 'gym_lit'], [17, 1, 'text', 'あした!!'], [18, -1, 'ball'], [19, 2, 'voice'], [20, 0, 'photo', 'court_top'], [21, -1, 'text', '勝つぞ!!']];
  let y = 250;
  for (const [n, who, kind, v] of M) { const tt = onBeat(n), s = MO.springStep(t - tt, { damping: 10, stiffness: 320 }); if (s <= .01) continue; const me = who < 0, hh = kind === 'photo' ? 300 : kind === 'ball' ? 190 : 104;
    g.save(); const ax = me ? W - 60 : 60; g.translate(ax, y + hh); g.scale(s, s); g.translate(-ax, -(y + hh)); if (!me) av(who, y);
    if (kind === 'photo') { g.save(); g.beginPath(); g.roundRect(170, y, 420, 300, 30); g.clip(); cover(v, 170, y, 420, 300); g.restore(); rr(170, y, 420, 300, 30, null, { line: '#FFFFFF', lw: 8 }) }
    else if (kind === 'ball') vball(W - 160, y + 95, 170, .3);
    else if (kind === 'voice') { bubble(160, y, '', { w: 460, h: 104 }); txt('▶', 210, y + 70, { size: 46, w: 800, fam: RD, col: ORG, upper: false }); for (let k = 0; k < 22; k++) { const h2 = 14 + 50 * R(k, 5) * (.6 + .4 * Math.sin(t * 8 + k)); rect(270 + k * 13, y + 52 - h2 / 2, 7, h2, INK) } }
    else bubble(me ? W - 60 : 160, y, v, { me, size: 56 });
    g.restore(); y += (hh + 34) * Math.min(1, s) }
  if (t > onBeat(22)) typingDots(t, 160, y + 10);
  rect(0, 1560, W, 360, '#FFFFFF'); line(0, 1560, W, 1560, 4, INK); rr(60, 1600, 820, 100, 50, '#F1F1F1', { line: 'rgba(0,0,0,.15)', lw: 3 }); disc(960, 1650, 50, GREY); txt('➤', 960, 1668, { size: 50, w: 800, fam: RD, col: '#FFFFFF', al: 'center', upper: false });
}
// the loader's file icons, without emoji: the ball, a shoe, a photo, a sound file
function fileIcon(k, t) { if (k === 0) vball(0, 0, 110, t); else if (k === 1) prop('p_shoe', 0, 0, 150, -.2);
  else if (k === 2) { g.save(); g.beginPath(); g.roundRect(-62, -62, 124, 124, 18); g.clip(); cover('gym_lit', -62, -62, 124, 124); g.restore() }
  else { for (let j = 0; j < 9; j++) { const h = 20 + 70 * R(j, 81) * (.6 + .4 * Math.sin(t * 6 + j)); rect(-58 + j * 13, -h / 2, 8, h, ORG) } } }
