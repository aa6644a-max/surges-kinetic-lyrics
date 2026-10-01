/* ORANGE Y2K act 1 (0 - 88.2). One format per line, like the "RUDE!" reference: a desktop loading the match, a stamped
   title, a ticket, the team group chat, a serve power meter; then a chat input (typed and deleted), a pinky promise
   crossed out, a round-trip ticket with seals, an orange bitten on the horizon, a camera blown out by the light,
   sweat sliding and a voice memo, a high five and an emoji flood, a weather card, words flying off, a timer with +1s,
   a shutter that keeps 今, and きっと stretched to fill the screen before the spike. */

const b = n => onBeat(n);
const lstr = (i, a, bb) => chars(i).slice(a, bb).map(c => c.c).join('');

// ================= I0 0 - 13.777: the desktop. ORANGE.exe loads the match; files pop on the guitar accents; the cursor clicks START
const ACC = [.4, 2.75, 4.75, 7.5, 9.75, 12.25];
const FILES = [['🏐', 'ball.png', 165, 330], ['👟', 'shoes.png', 915, 330], ['🍊', 'orange.jpg', 165, 1470], ['📣', 'cheer.mp3', 915, 1470], ['🏆', 'final.txt', 165, 1130], ['🔥', 'fire.gif', 915, 1130]];
function I0(t) {
  paper(t, { word: 'ORANGE' });
  const ph = MO.springStep(t - .25, { damping: 12, stiffness: 140 });
  torn(540, 900, 860, 1160, -.03, (w, h) => { const im = halftone('gym_lit', { w: 860, cell: 9, ink: '#5A4636', gain: .95 }); if (im) g.drawImage(im, -w / 2, -h / 2 - 60) }, { s: ph, seed: 3 });
  FILES.forEach(([e, name, x, y], k) => { const t0 = ACC[k], s = MO.springStep(t - t0, { damping: 8, stiffness: 300 }); if (s <= .01) return;
    g.save(); g.translate(x, y); g.scale(s, s); g.rotate((R(k, 4) - .5) * .12); card(-80, -80, 160, 160, 34, '#FFFFFF', { sh: 8 }); emo(e, 0, 0, 104); rr(-95, 96, 190, 46, 23, '#FFFFFF', { line: INK, lw: 3 }); txt(name, 0, 128, { size: 24, w: 800, fam: RD, col: INK, al: 'center', upper: false }); g.restore();
    starSticker(t, t0 + .08, x + (k % 2 ? -110 : 110), y - 100, 26, k % 2 ? SKY : LIME, k) });
  // the loader window
  const ws = MO.springStep(t - .9, { damping: 11, stiffness: 200 });
  const pr = clamp(ACC.reduce((a, t0) => a + eOut(seg(t, t0, .9)) / ACC.length, 0) * .94 + .06 * seg(t, 12.5, .8));
  win(CX, 800, 760, 470, 'ORANGE.exe', { s: ws, rot: .015, draw: (w, h) => {
    const bb = [...Array(40).keys()].map(n => onBeat(-n - 1)).filter(x => x > 0), last = bb.filter(x => x <= t)[0] ?? 0, hop = Math.sin(clamp((t - last) / BEAT) * Math.PI);
    emo('🏐', w / 2, 140 - hop * 60, 150, t * 2); disc(w / 2, 222, 50 * (1 - hop * .4), 'rgba(0,0,0,.12)');
    txt('LOADING THE MATCH', w / 2, 290, { size: 30, w: 800, fam: UB, col: INK, al: 'center', tr: .06 });
    progress(60, 320, w - 120, 58, pr, { t }); txt(Math.round(pr * 100) + '%', w - 60, 440, { size: 60, fam: EN, col: ORG, al: 'right', upper: false }) } });
  // START button and the cursor that clicks it on the downbeat
  const bs = MO.springStep(t - 11.4, { damping: 9, stiffness: 260 }), click = B0 - .03;
  if (bs > .01) { g.save(); g.translate(CX, 1210); const pz = t >= click ? .9 : 1; g.scale(bs * pz, bs * pz); card(-190, -58, 380, 116, 58, LIME); txt('START ▶', 0, 20, { size: 52, w: 900, fam: UB, col: INK, al: 'center' }); g.restore() }
  if (t > 11.9) { const p = eIO(seg(t, 11.9, click - 11.9 - .12)); cursor(t, lerp(960, CX + 40, p), lerp(1720, 1225, p), { click }) }
}

// ================= T1 13.777 - 18.608: ORANGE stamped, one letter per beat, on a starburst; the O is the bitten orange
function T1(t) {
  paper(t, { word: false, bg: ORG, gridCol: 'rgba(255,255,255,.35)' });
  rays(t, CX, 930, { col: 'rgba(255,255,255,.16)', n: 22 });
  burst(t, CX, 940, 640, YEL, { n: 16, line: INK, lw: 7, rot: t * .05 });
  torn(250, 1560, 440, 330, .12, (w, h) => cover('gym_lit', -w / 2, -h / 2, w, h, { zoom: 1.2 }), { s: MO.springStep(t - b(3), { damping: 10, stiffness: 220 }), seed: 7 });
  torn(840, 330, 400, 300, -.1, (w, h) => cover('net_close', -w / 2, -h / 2, w, h, { zoom: 1.1 }), { s: MO.springStep(t - b(5), { damping: 10, stiffness: 220 }), seed: 9 });
  const L = [['O', 330, 650], ['R', 750, 650], ['A', 330, 950], ['N', 750, 950], ['G', 330, 1250], ['E', 750, 1250]];
  L.forEach(([c, x, y], k) => stampIn(t, b(k), x, y, (R(k, 8) - .5) * .22, () => {
    if (c === 'O' && PL.p_orange) prop('p_orange', 0, 0, 560, .1); else sticker(c, 0, 18, 330, { fam: UB, w: 900, col: k % 2 ? INK : '#FFFFFF', line: INK, lwk: .1, shadowCol: INK }) }, { from: 2.6, dur: .1 }));
  stampIn(t, b(6), 560, 1480, -.08, () => sticker('SPYAIR', 0, 0, 96, { fam: PM, col: '#FFFFFF', line: INK, lwk: .14 }), { from: 1.8 });
  emoPop(t, b(6) + .3, '🏐', 900, 1500, 150, .2); emoPop(t, b(7), '🔥', 160, 360, 150, -.2);
  starSticker(t, b(1), 110, 820, 40, SKY, 1); starSticker(t, b(3), 980, 800, 34, LIME, 2); starSticker(t, b(5), 540, 1080, 30, '#FFFFFF', 3);
  flash(t, B0, '#FFFFFF', .18);
}

// ================= T2 18.608 - 23.439: the tournament ticket; FINAL circled, a seal, the stub torn off
function T2(t) {
  paper(t, { bg: SKY, gridCol: 'rgba(255,255,255,.55)', dot: 'rgba(255,255,255,.6)', word: 'FINAL', rows: ['FI', 'NA', 'L!'], size: 820 });
  torn(300, 1480, 520, 380, .09, (w, h) => cover('arena_teal', -w / 2, -h / 2, w, h, { zoom: 1.15 }), { s: MO.springStep(t - b(9), { damping: 10, stiffness: 220 }), seed: 12 });
  const sx = MO.springPath(t, [[0, 1500], [b(8), 0, { damping: 13, stiffness: 170 }]]), tear = eOut(seg(t, b(14), .4));
  g.save(); g.translate(CX + sx, 880); g.rotate(-.06 + .02 * Math.sin(t * 1.3));
  const L = -450, T = -220, BW = 680, SW = 220, H2 = 440;
  // body
  card(L, T, BW, H2, 26, '#FFF8EC', { sh: 14 }); g.save(); g.beginPath(); g.roundRect(L, T, BW, H2, 26); g.clip(); rect(L, T, 96, H2, ORG); g.fillStyle = dots('rgba(255,106,19,.18)', 10, 2); g.fillRect(L + 96, T, BW, H2); g.restore();
  g.save(); g.translate(L + 50, 0); g.rotate(-Math.PI / 2); txt('ADMIT ONE', 0, 12, { size: 34, w: 900, fam: UB, col: '#FFFFFF', al: 'center', tr: .1 }); g.restore();
  txt('SPRING TOURNAMENT', L + 130, T + 80, { size: 34, w: 700, fam: UB, col: INK, tr: .04 });
  txt('FINAL', L + 124, T + 240, { size: 128, w: 900, fam: UB, col: INK });
  txt('COURT A · SET 1–3 · 16:30', L + 132, T + 320, { size: 32, w: 800, fam: RD, col: INK, upper: false });
  for (let k = 0; k < 46; k++) rect(L + 132 + k * 11, T + 350, R(k, 3) > .5 ? 6 : 3, 60, INK);
  // stub, torn away on the last beat
  g.save(); g.translate(tear * 260, tear * 120); g.rotate(tear * .35);
  card(L + BW, T, SW, H2, 26, '#FFF8EC', { sh: 14 }); for (let y = T + 16; y < T + H2 - 10; y += 26) rect(L + BW - 3, y, 6, 14, INK, .8);
  g.save(); g.translate(L + BW + SW / 2, 0); g.rotate(-Math.PI / 2); txt('No. 010', 0, -30, { size: 40, w: 900, fam: UB, col: INK, al: 'center' }); g.restore(); emo('🏐', L + BW + SW / 2 + 40, 120, 80);
  g.restore();
  g.restore();
  // hand-drawn circle around FINAL, then the seal
  sketch(ellPts(CX + sx - 200, 850, 250, 100, 1.1, -2.6), t, { col: RED, lw: 9, p: eOut(seg(t, b(10), .4)), jit: 2.5 });
  hanko(t, b(12), 790 + sx, 1080, 92, '勝');
  starSticker(t, b(11), 150, 520, 42, YEL, 1); starSticker(t, b(13), 950, 1340, 36, LIME, 2);
}

// ================= T3 23.439 - 28.27: the team group chat — only stickers and emoji, no words yet
const CHAT = [[16, 'a', '🔥', 1], [17, 'b', '🏐🏐🏐', 0], [18, 'me', '💪💪', 0], [19, 'c', 'VOICE', 0], [20, 'a', '‼️', 1], [21, 'me', '🍊', 1]];
const AV = { a: ['😤', ORG], b: ['😎', SKY], c: ['🤓', LIME] };
function chatFrame(t, title = 'バレー部', n = 6) {
  rect(0, 0, W, H, '#BFE0F3'); g.save(); g.fillStyle = dots('rgba(255,255,255,.45)', 14, 2); g.fillRect(0, 0, W, H); g.restore();
  rect(0, 0, W, 200, '#FFFFFF'); line(0, 200, W, 200, 4, INK);
  txt('‹', 50, 140, { size: 90, w: 500, fam: RD, col: INK, upper: false }); disc(170, 116, 52, ORG); ring(170, 116, 52, 4, INK); emo('🏐', 170, 118, 62);
  txt(title, 240, 136, { size: 50, w: 800, fam: RD, col: INK, upper: false }); font(800, 50, RD); const tw = g.measureText(title).width; txt(`(${n})`, 250 + tw, 136, { size: 38, w: 500, fam: RD, col: GREY, upper: false });
  txt('☰', W - 70, 140, { size: 54, w: 800, fam: RD, col: INK, al: 'center', upper: false });
}
function chatMsgs(t, list, y0, o = {}) { let y = y0;
  for (const [tt, who, content, big] of list) { const s = MO.springStep(t - tt, { damping: 10, stiffness: 320 }); if (s <= .01) continue; const me = who === 'me', h = big ? 190 : content === 'VOICE' ? 110 : 104;
    g.save(); const ax = me ? W - 60 : 60; g.translate(ax, y + h); g.scale(s, s); g.translate(-ax, -(y + h));
    if (!me) { disc(95, y + 50, 44, AV[who][1]); ring(95, y + 50, 44, 4, INK); emo(AV[who][0], 95, y + 52, 56) }
    if (big) emo(content, me ? W - 150 : 260, y + 95, 170, me ? .1 : -.1);
    else if (content === 'VOICE') { const x0 = 160; bubble(x0, y, '', { w: 460, h: 104 }); txt('▶', x0 + 50, y + 70, { size: 46, w: 800, fam: RD, col: ORG, upper: false }); for (let k = 0; k < 22; k++) { const hh = 14 + 50 * R(k, 5) * (.6 + .4 * Math.sin(t * 8 + k)); rect(x0 + 110 + k * 13, y + 52 - hh / 2, 7, hh, INK) } txt('0:03', x0 + 440, y + 68, { size: 30, w: 800, fam: RD, col: GREY, al: 'right', upper: false }) }
    else bubble(me ? W - 60 : 160, y, content, { me, size: 56 });
    g.restore(); y += (h + 34) * Math.min(1, s) }
  return y }
function T3(t) {
  chatFrame(t);
  const list = CHAT.map(([n, who, c, big]) => [b(n), who, c, big]);
  const y = chatMsgs(t, list, 250); if (t > b(22)) typingDots(t, 160, y + 10);
  rect(0, 1560, W, 360, '#FFFFFF'); line(0, 1560, W, 1560, 4, INK); rr(60, 1600, 820, 100, 50, '#F1F1F1', { line: 'rgba(0,0,0,.15)', lw: 3 }); disc(960, 1650, 50, GREY); txt('➤', 960, 1668, { size: 50, w: 800, fam: RD, col: '#FFFFFF', al: 'center', upper: false });
}

// ================= T4 28.27 - 31.9: the serve. READY? 3 2 1, a power meter swinging, the ball tossed; the cursor hits SERVE on the downbeat
function T4(t) {
  cover('gym_lit', 0, 0, W, H, { zoom: 1.12 + .05 * seg(t, b(24), 3.6) }); rect(0, 0, W, H, INK, .5); g.save(); g.fillStyle = dots('rgba(255,255,255,.1)', 12, 2.2); g.fillRect(0, 0, W, H); g.restore();
  stampIn(t, b(24), CX, 330, -.06, () => sticker('READY?', 0, 0, 130, { fam: UB, w: 900, col: YEL, line: INK, lwk: .12 }), { from: 1.8 });
  [3, 2, 1].forEach((n, k) => { const t0 = b(27 + k); if (t < t0 || t > t0 + BEAT) return; const a = 1 - seg(t, t0 + BEAT * .7, BEAT * .3); stampIn(t, t0, CX, 820, 0, () => sticker(String(n), 0, 40, 460, { fam: UB, w: 900, col: '#FFFFFF', line: INK, lwk: .08, alpha: a }), { from: 1.6, dur: .08 }) });
  // the toss
  const tp = seg(t, b(28), b(30) - b(28)); if (PL.p_ball) prop('p_ball', CX + 30, lerp(1220, 560, eOut(tp)) - (t < b(28) ? 30 * Math.abs(Math.sin((t - b(24)) * 5)) : 0), lerp(260, 200, tp), t * 3);
  // the power meter: swings on the beat, full on the downbeat of the voice
  const u = (t - b(30)) / BEAT + 1, tri = 1 - Math.abs(((u % 2) + 2) % 2 - 1), mx = 110, mw = 860, my = 1400;
  card(mx - 10, my - 10, mw + 20, 96, 48, '#FFFFFF', { sh: 8 }); g.save(); g.beginPath(); g.roundRect(mx, my, mw, 76, 38); g.clip();
  const gr = g.createLinearGradient(mx, 0, mx + mw, 0); gr.addColorStop(0, LIME); gr.addColorStop(.6, YEL); gr.addColorStop(.9, ORG); gr.addColorStop(1, RED); g.fillStyle = gr; g.fillRect(mx, my, mw, 76); g.restore();
  const kx = mx + mw * tri; g.fillStyle = INK; g.beginPath(); g.moveTo(kx, my - 6); g.lineTo(kx - 26, my - 50); g.lineTo(kx + 26, my - 50); g.fill(); rect(kx - 4, my, 8, 76, INK);
  txt('POWER', mx, my - 30, { size: 34, w: 900, fam: UB, col: '#FFFFFF' });
  const click = b(30) - .03; g.save(); g.translate(CX, 1620); const pz = t >= click ? .9 : 1; g.scale(pz, pz); card(-220, -64, 440, 128, 64, ORG); emo('🏐', -130, 0, 80); txt('SERVE', 40, 24, { size: 60, w: 900, fam: UB, col: '#FFFFFF', al: 'center' }); g.restore();
  const cp = eIO(seg(t, b(28), click - b(28) - .1)); cursor(t, lerp(940, CX + 60, cp), lerp(1800, 1640, cp), { click });
}

// ================= V0 31.9 - 37.12: さよならは (typed in the chat) … 言わない (deleted, stamped) / 約束もない (a pinky promise, crossed out)
function V0(t) {
  if (t >= S(0) + 2.85) return V0b(t);
  chatFrame(t); const list = CHAT.map(([n, who, c, big]) => [b(n), who, c, big]); chatMsgs(t, list, 250 - 330);
  rect(0, 1520, W, 400, '#FFFFFF'); line(0, 1520, W, 1520, 4, INK); rr(60, 1570, 820, 110, 55, '#F4F4F4', { line: INK, lw: 4 });
  const del = cT(0, 5), sel = t >= del && t < del + .25, gone = t >= del + .25;
  const tw = gone ? { w: 0 } : (() => { if (sel) { font(800, 60, RD); const s = lstr(0, 0, 5), w = g.measureText(s).width; rect(100, 1592, w + 10, 70, SKY, .8) } return typed(t, 0, 0, 5, 105, 1648, 60, { fam: RD }) })();
  if (Math.floor((t - B0) / (BEAT / 2)) % 2 === 0) rect(110 + tw.w, 1592, 5, 70, ORG);
  disc(960, 1625, 55, gone ? GREY : ORG); if (gone) emo('🚫', 960, 1625, 70); else txt('➤', 960, 1645, { size: 50, w: 800, fam: RD, col: '#FFFFFF', al: 'center', upper: false });
  // 言わない stamped diagonally over the chat
  stampChars(t, 0, 5, 9, k => [250 + k * 190, 640 + k * 150, -.18 + (R(k, 3) - .5) * .2], 250, { fam: JP, col: INK, line: '#FFFFFF', lwk: .12 });
  if (t > cT(0, 8) + .2) sketch([[160, 1460], [930, 520]], t, { col: RED, lw: 14, p: eOut(seg(t, cT(0, 8) + .2, .25)), jit: 4 });
}
function V0b(t) {
  paper(t, { bg: '#FFE6D6', word: 'NO', rows: ['NO'], size: 980, gridCol: 'rgba(255,106,19,.25)' });
  const s = MO.springStep(t - cT(0, 9), { damping: 9, stiffness: 240 });
  emo('🤙', CX, 700, 380 * s, -.1 + .05 * Math.sin(t * 3));
  // 約束 in a boiling outline, もない solid
  const C = chars(0); [9, 10].forEach((k, j) => { if (t < C[k].t - .03) return; const b0 = boil(t); font(400, 290, JP); g.textAlign = 'center'; g.textBaseline = 'middle';
    g.save(); g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = 7; for (let p = 0; p < 2; p++) { g.save(); g.translate((R(p + j * 7, b0) - .5) * 6, (R(p + 3 + j * 7, b0) - .5) * 6); g.strokeText(C[k].c, 350 + j * 380, 1170); g.restore() } g.restore() });
  stampChars(t, 0, 11, 14, k => [300 + k * 240, 1450, (R(k, 9) - .5) * .2], 190, { fam: JP, col: ORG, line: INK, lwk: .1 });
  const x0 = cT(0, 12); sketch([[340, 460], [760, 900]], t, { col: RED, lw: 26, p: eOut(seg(t, x0, .2)), jit: 5 }); sketch([[760, 460], [340, 900]], t, { col: RED, lw: 26, p: eOut(seg(t, x0 + .18, .2)), jit: 5 });
}

// ================= V1 37.17 - 41.42: また会えるから — a round-trip ticket printed; 僕らは — three red seals
function V1(t) {
  paper(t, { bg: MINT, word: 'SEE YOU', rows: ['SEE', 'YOU'], size: 700, dot: 'rgba(40,150,90,.25)', gridCol: 'rgba(40,150,90,.2)' });
  const s = MO.springStep(t - S(1) + .15, { damping: 12, stiffness: 190 }); emoPop(t, S(1) - .1, '👋', 870, 330, 200, .2, { wig: true });
  g.save(); g.translate(CX, 880); g.rotate(.04); g.scale(s, s);
  card(-470, -300, 940, 600, 30, '#E3F4EA', { sh: 16 }); g.save(); g.beginPath(); g.roundRect(-470, -300, 940, 600, 30); g.clip(); g.fillStyle = dots('rgba(40,150,90,.25)', 9, 1.8); g.fillRect(-470, -300, 940, 600); rect(-470, -300, 940, 90, '#2E9A62'); g.restore();
  txt('ROUND TRIP  ⇄', -430, -238, { size: 40, w: 800, fam: UB, col: '#FFFFFF', upper: false });
  txt('TODAY', -420, -110, { size: 54, w: 900, fam: UB, col: INK }); txt('→', -40, -108, { size: 70, w: 800, fam: RD, col: '#2E9A62', al: 'center', upper: false }); txt('SOMEDAY', 420, -110, { size: 54, w: 900, fam: UB, col: INK, al: 'right' });
  line(-420, -70, 420, -70, 3, INK, .5);
  typed(t, 1, 0, 7, -420, 60, 118, { fam: RD, w: 800 });
  txt('有効期限 : ずっと', -420, 200, { size: 40, w: 800, fam: RD, col: '#2E9A62', upper: false });
  g.restore();
  const C = chars(1); [[7, 700, 1130, -.2], [8, 830, 1210, .15], [9, 700, 1310, -.05]].forEach(([k, x, y, r]) => hanko(t, C[k].t - .02, x, y, 86, C[k].c, { rot: r }));
  starSticker(t, cT(1, 9) + .2, 250, 1400, 40, ORG, 1);
}

// ================= V2 41.47 - 46.43: オレンジを少し — the orange sits on the horizon; かじる — bitten; 地平線 written on the line
function V2(t) {
  paper(t, { bg: '#FFF1E4', word: 'SUN', rows: ['SUN'], size: 900 });
  torn(CX, 960, 960, 1260, -.025, (w, h) => cover('sky_horizon', -w / 2, -h / 2, w, h, { fy: .7, zoom: 1.08 - .04 * seg(t, S(2), 5) }), { seed: 21 });
  const hy = 1150, bite = t >= cT(2, 7) - .02;
  sketch([[70, hy], [1010, hy - 12]], t, { col: '#FFFFFF', lw: 10, p: eOut(seg(t, S(2) - .2, .8)), jit: 3 });
  // the sun: a whole orange rising behind the line; then the painted bitten orange with a chomp
  g.save(); g.beginPath(); g.rect(0, 0, W, hy); g.clip();
  const rise = eOut(seg(t, S(2) - .3, 2.4)), sy = lerp(hy + 260, hy - 150, rise);
  if (!bite) emo('🍊', CX, sy, 380); else { const ch = MO.springStep(t - cT(2, 7), { damping: 7, stiffness: 320 }); prop('p_orange', CX, sy - 10, 640 * (1.1 - .1 * ch), -.08) }
  g.restore();
  if (bite) { const d = t - cT(2, 7); for (let k = 0; k < 9; k++) { const a = -1.2 + R(k, 2) * 1.6, v = 500 + R(k, 3) * 500; disc(CX + 170 + Math.cos(a) * v * d, sy - 120 + Math.sin(a) * v * d + 900 * d * d, 12 * (1 - seg(d, 0, 1)), ORG) }
    stampIn(t, cT(2, 7), 840, 560, .18, () => sticker('ガブッ', 0, 0, 120, { fam: JP, col: ORG, line: INK, lwk: .12 }), { from: 2 }) }
  // lyric
  stampChars(t, 2, 0, 5, k => [150 + k * 125, 330 + Math.sin(k * .8) * 20, (R(k, 4) - .5) * .25], 120, { fam: RD, w: 800, col: ORG, line: INK, lwk: .14 });
  if (t > cT(2, 5) - .05) { txt(lstr(2, 5, 7), 800, 350, { size: 90, fam: HW, w: 600, col: INK, upper: false, alpha: seg(t, cT(2, 5) - .05, .15) }); sketch([[790, 380], [980, 372]], t, { col: RED, lw: 7, p: seg(t, cT(2, 6), .25) }) }
  stampChars(t, 2, 7, 10, k => [220 + k * 170, 820 - k * 20, -.12], 170, { fam: JP, col: '#FFFFFF', line: INK, lwk: .12 });
  if (t > cT(2, 10) - .05) { const C = chars(2); for (let k = 10; k < 13; k++) { if (t < C[k].t - .03) continue; txt(C[k].c, 240 + (k - 10) * 250, hy + 190, { size: 190, fam: HW, w: 600, col: INK, al: 'center', upper: false, alpha: seg(t, C[k].t - .03, .12) }) } }
}

// ================= V3 46.48 - 51.17: 甘酸っぱい光 — a camera viewfinder; the exposure slides up on 光; 眩しくて — blown out to white
function V3(t) {
  fill(INK); const vx = 40, vy = 230, vw = 1000, vh = 1300, blow = eIn(seg(t, cT(3, 6) - .15, .35)), ex = eOut(seg(t, cT(3, 5) - .05, .5));
  if (blow < 1) {
    g.save(); g.beginPath(); g.roundRect(vx, vy, vw, vh, 30); g.clip(); cover('gym_sunset', vx, vy, vw, vh, { zoom: 1.12 + .06 * seg(t, S(3), 3), filter: `brightness(${1 + ex * .55}) saturate(${1 + ex * .3})` }); g.restore();
    // brackets and the AF box
    for (const [x, y, sx, sy] of [[vx + 40, vy + 40, 1, 1], [vx + vw - 40, vy + 40, -1, 1], [vx + 40, vy + vh - 40, 1, -1], [vx + vw - 40, vy + vh - 40, -1, -1]]) { line(x, y, x + 60 * sx, y, 6, '#FFFFFF'); line(x, y, x, y + 60 * sy, 6, '#FFFFFF') }
    const af = 1 + .1 * Math.exp(-(t - S(3)) * 6) * Math.sin((t - S(3)) * 30); g.save(); g.translate(CX, 760); g.scale(af, af); g.strokeStyle = YEL; g.lineWidth = 5; g.strokeRect(-130, -130, 260, 260); g.restore();
    // exposure slider with the sun knob
    line(720, 620, 720, 900, 4, YEL); const ky = lerp(800, 640, ex); emo('☀️', 720, ky, 70);
    stampChars(t, 3, 0, 5, k => [180 + k * 180, 1150, (R(k, 5) - .5) * .12], 150, { fam: RD, w: 800, col: '#FFFFFF', line: INK, lwk: .12 });
    if (t > cT(3, 5) - .05) { g.save(); g.shadowColor = '#FFFFFF'; g.shadowBlur = 50 * ex; stampIn(t, cT(3, 5), CX, 1380, .05, () => sticker('光', 0, 0, 230, { fam: JP, col: YEL, line: INK, lwk: .1 }), { from: 2 }); g.restore() }
    // camera chrome
    emo('⚡', 110, 135, 60); txt('HDR', CX, 150, { size: 40, w: 900, fam: UB, col: '#FFFFFF', al: 'center' });
    ring(CX, 1640, 82, 8, '#FFFFFF'); disc(CX, 1640, 68, '#FFFFFF'); rr(110, 1590, 110, 110, 20, '#333');
  }
  if (blow > 0) { rect(0, 0, W, H, '#FFFFFF', blow); if (blow >= 1) { paper(t, { bg: '#FFFFFF', word: false, gridCol: 'rgba(255,200,0,.25)' }); rays(t, CX, 900, { col: 'rgba(255,216,58,.35)', n: 30 }) }
    stampChars(t, 3, 6, 10, k => [200 + k * 225, 900 + (k % 2) * 60, (R(k, 7) - .5) * .25], 230, { fam: JP, col: INK, line: '#FFFFFF', lwk: .1 });
    emoPop(t, cT(3, 9) + .15, '😎', 820, 1380, 260, .15) }
}

// ================= V4 51.22 - 56.11: すべり出す汗と — chars slide down like drops; 響いた声 — a voice memo
function V4(t) {
  if (t >= S(4) + 2.7) return V4b(t);
  paper(t, { bg: '#E9F6FC', word: 'SWEAT', rows: ['SW', 'EA', 'T'], size: 800, dot: 'rgba(116,203,242,.55)', gridCol: 'rgba(116,203,242,.3)' });
  torn(560, 1400, 820, 560, .05, (w, h) => { const im = halftone('floor_close', { w: 820, cell: 8, ink: '#2B5E7A', bg: '#FFFFFF' }); if (im) g.drawImage(im, -w / 2, -h / 2 - 300) }, { seed: 31, s: MO.springStep(t - S(4) + .2, { damping: 12, stiffness: 180 }) });
  const C = chars(4);
  for (let k = 0; k < 5; k++) { const G = C[k]; if (t < G.t - .03) continue; const x = 150 + k * 190, y0 = 300 + k * 30, d = t - G.t, y = y0 + 380 * eOut(clamp(d / 1.4)) + 40 * d;
    g.save(); g.globalAlpha = .35; g.strokeStyle = '#FFFFFF'; g.lineWidth = 24; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y0 - 60); g.lineTo(x, y - 90); g.stroke(); g.restore();
    stampIn(t, G.t - .03, x, y, (R(k, 6) - .5) * .15, () => sticker(G.c, 0, 0, 150, { fam: RD, w: 800, col: SKY, line: INK, lwk: .14 }), { from: 1.6 });
    emoPop(t, G.t + .1, '💧', x + 60, y + 90 + d * 120, 60) }
  stampIn(t, cT(4, 5) - .02, 560, 1020, -.08, () => sticker('汗', 0, 0, 300, { fam: JP, col: ORG, line: INK, lwk: .1 }), { from: 2.2 });
  stampIn(t, cT(4, 6) - .02, 820, 1080, .1, () => sticker('と', 0, 0, 150, { fam: JP, col: INK, line: '#FFFFFF', lwk: .12 }), { from: 1.8 });
  for (let k = 0; k < 4; k++) emoPop(t, cT(4, 5) + k * .12, '💦', 330 + k * 150, 820 - (k % 2) * 60, 110, (k - 1.5) * .3);
}
function V4b(t) {
  paper(t, { bg: CHAR, word: 'VOICE', rows: ['VO', 'IC', 'E'], size: 800, dot: 'rgba(255,255,255,.07)', gridCol: 'rgba(255,255,255,.06)' });
  const s = MO.springStep(t - (S(4) + 2.7), { damping: 12, stiffness: 220 }), C = chars(4);
  win(CX, 700, 900, 640, 'VOICE MEMO', { s, bar: '#FF8A8A', draw: (w, h) => {
    const blink = Math.floor(t * 3) % 2 ? 1 : .3; disc(80, 70, 20, RED, blink); txt('REC', 115, 84, { size: 40, w: 900, fam: UB, col: RED }); txt('00:0' + Math.floor(clamp((t - S(4) - 2.7) / 8) * 9 + 1), w - 60, 84, { size: 44, fam: EN, col: INK, al: 'right', upper: false });
    for (let k = 0; k < 44; k++) { const x = 60 + k * 18, ph = k / 44, tt = t - ph * .8, amp = [7, 8, 9, 10].reduce((a, j) => a + Math.exp(-Math.max(0, tt - C[j].t) * 5) * (tt > C[j].t ? 1 : 0), 0);
      const hh = 12 + 250 * Math.min(1, amp) * (.4 + .6 * R(k, Math.floor(t * 12))); rect(x, 260 - hh / 2, 9, hh, k % 5 ? INK : ORG) }
    typed(t, 4, 7, 10, 60, 480, 96, { fam: RD }) } });
  const vt = cT(4, 10);
  if (t > vt - .03) { for (let k = 0; k < 4; k++) { const d = (t - vt - k * .22); if (d > 0 && d < 1.3) sketch(ellPts(CX, 1380, 160 + d * 330, 150 + d * 300, 1.02, -1, 40), t, { col: '#FFFFFF', lw: 8 * (1 - d / 1.3), alpha: 1 - d / 1.3 }) }
    stampIn(t, vt - .03, CX, 1380, -.05, () => sticker('声', 0, 0, 330, { fam: JP, col: ORG, line: '#FFFFFF', lwk: .1 }), { from: 2.4 }) }
  emoPop(t, cT(4, 7), '🎙️', 900, 1150, 170, .25);
}

// ================= V5 56.16 - 60.53: 叩き合えた肩 — two hands slap (パチン!); 笑いあって泣いて — an emoji flood
function V5(t) {
  paper(t, { bg: YEL, word: false, gridCol: 'rgba(255,106,19,.3)' }); rays(t, CX, 760, { col: 'rgba(255,255,255,.35)', n: 24 });
  const hit = S(5), a = eIn(seg(t, hit - .3, .3)), back = t > hit ? .05 * Math.exp(-(t - hit) * 6) * Math.sin((t - hit) * 30) : 0;
  if (t < cT(5, 6)) {
    if (t > hit) { burst(t, CX, 760, 300 * eOut(seg(t, hit, .12)), '#FFFFFF', { n: 12, line: INK, lw: 6 }); for (let k = 0; k < 10; k++) { const an = k / 10 * 6.28, d = t - hit; if (d < .5) sketch([[CX + Math.cos(an) * (330 + d * 300), 760 + Math.sin(an) * (330 + d * 300)], [CX + Math.cos(an) * (430 + d * 300), 760 + Math.sin(an) * (430 + d * 300)]], t, { lw: 10, alpha: 1 - d * 2 }) } }
    emo('🤚', lerp(-200, 400, a) - back * 400, 760, 360, .35); emo('✋', lerp(1280, 680, a) + back * 400, 760, 360, -.35);
    if (t > hit) stampIn(t, hit, CX, 400, -.1, () => sticker('パチン!!', 0, 0, 140, { fam: JP, col: ORG, line: INK, lwk: .12 }), { from: 2 });
    stampChars(t, 5, 0, 5, k => [180 + k * 180, 1180, (R(k, 2) - .5) * .15], 170, { fam: JP, col: INK, line: '#FFFFFF', lwk: .12 });
    stampIn(t, cT(5, 5) - .02, CX, 1440, .06, () => sticker('肩', 0, 0, 300, { fam: JP, col: ORG, line: INK, lwk: .1 }), { from: 2 });
  } else {
    const laugh = cT(5, 6), cry = cT(5, 11);
    for (let k = 0; k < 12; k++) emoPop(t, laugh + k * .07, '😂', 120 + R(k, 11) * 840, 180 + R(k, 12) * 1400, 150 + R(k, 13) * 130, (R(k, 14) - .5) * .8);
    for (let k = 0; k < 10; k++) emoPop(t, cry + k * .06, '😭', 120 + R(k, 21) * 840, 240 + R(k, 22) * 1300, 150 + R(k, 23) * 120, (R(k, 24) - .5) * .8);
    stampChars(t, 5, 6, 11, k => [200 + k * 170, 760, (R(k, 3) - .5) * .2], 170, { fam: RD, w: 800, col: '#FFFFFF', line: INK, lwk: .14 });
    stampChars(t, 5, 11, 14, k => [320 + k * 220, 1150, (R(k, 4) - .5) * .2], 220, { fam: JP, col: SKY, line: INK, lwk: .1 });
    if (t > cry) for (let k = 0; k < 6; k++) { const d = (t - cry - k * .15); if (d > 0) emo('💧', 330 + k * 90, 1300 + d * d * 700, 60) }
  }
}

// ================= P0 60.58 - 67.18: 明日へ向かう — a weather card for tomorrow; オレンジ色の空へ — the card opens into the sky
function P0(t) {
  paper(t, { bg: SKY, word: 'SKY', rows: ['SKY'], size: 1000, dot: 'rgba(255,255,255,.45)', gridCol: 'rgba(255,255,255,.4)' });
  const open = eIO(seg(t, cT(6, 6) - .3, .6)), s = MO.springStep(t - S(6) + .2, { damping: 12, stiffness: 180 });
  const x = lerp(70, 0, open), y = lerp(250, 0, open), w = lerp(940, W, open), h = lerp(1320, H, open), r = lerp(60, 0, open);
  g.save(); g.translate(CX, CY); g.scale(s, s); g.translate(-CX, -CY);
  if (open < 1) rr(x + 14, y + 16, w, h, r, INK);
  g.save(); g.beginPath(); g.roundRect(x, y, w, h, r); g.clip();
  const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#5CB8EA'); gr.addColorStop(1, ORG); g.fillStyle = gr; g.fillRect(x, y, w, h);
  if (open > 0) { cover('sky_up', x, y, w, h, { alpha: open, fy: lerp(.9, .3, seg(t, cT(6, 6), 4)) }); for (let k = 0; k < 5; k++) prop(k % 2 ? 'p_cloud_b' : 'p_cloud_a', ((R(k, 3) * 1400 + (t - 63) * (90 + 60 * R(k, 4))) % 1500) - 200, 300 + k * 300, 520, 0, { alpha: open * .9 }) }
  if (open < 1) { rays(t, x + w - 200, y + 300, { col: 'rgba(255,255,255,.2)', n: 16 }); emo('☀️', x + w - 200, y + 300, 260, t * .2);
    [['15', '☀️'], ['16', '☀️'], ['17', '⛅'], ['18', '🌇']].forEach(([hh, e], k) => { rr(x + 60 + k * 210, y + h - 260, 180, 200, 30, 'rgba(255,255,255,.3)'); emo(e, x + 150 + k * 210, y + h - 180, 80); txt(hh + ':00', x + 150 + k * 210, y + h - 90, { size: 32, w: 800, fam: UB, col: '#FFFFFF', al: 'center' }) }) }
  g.restore(); g.restore();
  if (open < 1) { stampChars(t, 6, 0, 2, k => [230 + k * 250, 560, 0], 230, { fam: JP, col: '#FFFFFF', line: INK, lwk: .08 }); typed(t, 6, 2, 6, 120, 830, 110, { fam: RD, col: '#FFFFFF' }) }
  else { stampChars(t, 6, 6, 12, k => [170 + (k % 3) * 370, 620 + Math.floor(k / 3) * 230, (R(k, 5) - .5) * .12], 190, { fam: RD, w: 800, col: '#FFFFFF', line: INK, lwk: .12 });
    stampChars(t, 6, 12, 14, k => [360 + k * 360, 1200, (R(k, 6) - .5) * .2], 330, { fam: JP, col: ORG, line: '#FFFFFF', lwk: .08 }) }
}
// ================= P1 67.18 - 70.5: 羽ばたいていく — the words flap like wings and fly off with the birds
function P1(t) {
  cover('sky_up', 0, 0, W, H, { fy: .2, zoom: 1.1 }); for (let k = 0; k < 5; k++) prop(k % 2 ? 'p_cloud_b' : 'p_cloud_a', ((R(k, 3) * 1400 + (t - 63) * (90 + 60 * R(k, 4))) % 1500) - 200, 300 + k * 300, 520, 0, { alpha: .9 });
  const C = chars(7);
  for (let k = 0; k < 7; k++) { const G = C[k]; if (t < G.t - .03) continue; const d = Math.max(0, t - G.t - .35), vx = (k - 3) * 40, x = 150 + k * 130 + vx * d, y = 1000 - d * d * 260 - d * 120 - Math.abs(k - 3) * 30 * Math.min(1, d);
    const flap = .55 + .45 * Math.abs(Math.cos((t - G.t) * 11)); stampIn(t, G.t - .03, x, y, (R(k, 2) - .5) * .2, () => { g.scale(1, flap); sticker(G.c, 0, 0, 150, { fam: RD, w: 800, col: '#FFFFFF', line: INK, lwk: .14 }) }, { from: 1.5 }) }
  for (let k = 0; k < 4; k++) { const t0 = S(7) + k * .5, d = t - t0; if (d < 0) continue; emo('🕊️', -100 + d * (300 + k * 60), 1500 - d * (260 + k * 40), 120 + k * 10, -.2) }
  const pl = seg(t, 69.2, 1.2); if (pl > 0) emo('✈️', lerp(-100, 1200, pl), lerp(1300, 200, pl), 150, -.6);
}

// ================= C0 70.54 - 75.28: あと1秒だけ — a timer running out; もう1秒だけ — the cursor presses +1秒, twice
function C0(t) {
  paper(t, { bg: CHAR, word: '1', rows: ['1'], size: 1300, dot: 'rgba(255,255,255,.07)', gridCol: 'rgba(255,255,255,.05)', speed: 60 });
  const tt = MO.posterize(t, 12), clicks = [cT(8, 6) - .02, cT(8, 8) - .02], lastC = clicks.filter(c => c <= t).pop() ?? S(8) - .2;
  const pr = clamp(1 - (tt - lastC) / 2.1) * (t < S(8) - .2 ? 1 : 1), refill = MO.springStep(t - lastC, { damping: 9, stiffness: 260 });
  const cy = 700; g.save(); g.lineCap = 'round'; ring(CX, cy, 310, 36, '#444'); g.strokeStyle = ORG; g.lineWidth = 36; g.beginPath(); g.arc(CX, cy, 310, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pr * Math.min(1, refill)); g.stroke(); g.restore();
  g.save(); g.translate(CX, cy); const bump = 1 + .12 * Math.exp(-(t - lastC) * 8); g.scale(bump, bump); txt('0:01', 0, 90, { size: 250, fam: EN, col: '#FFFFFF', al: 'center', upper: false }); g.restore();
  typed(t, 8, 0, 6, CX, 1210, 110, { fam: RD, col: '#FFFFFF', al: 'center' });
  // buttons
  disc(260, 1590, 100, '#555'); txt('✕', 260, 1620, { size: 90, w: 800, fam: RD, col: '#FFFFFF', al: 'center', upper: false });
  const pz = clicks.some(c => t >= c && t < c + .15) ? .88 : 1; g.save(); g.translate(820, 1590); g.scale(pz, pz); disc(0, 0, 110, ORG); ring(0, 0, 110, 6, '#FFFFFF'); txt('+1秒', 0, 20, { size: 60, w: 800, fam: RD, col: '#FFFFFF', al: 'center', upper: false }); g.restore();
  const cp = eIO(seg(t, S(8) + .6, clicks[0] - S(8) - .75)); cursor(t, lerp(1040, 850, cp), lerp(1900, 1615, cp), { click: t < clicks[1] - .2 ? clicks[0] : clicks[1] });
  if (t > cT(8, 6) - .05) { const s = MO.springStep(t - cT(8, 6), { damping: 10, stiffness: 260 }); g.save(); g.translate(620, 1260 + 0); g.scale(s, s); g.translate(-620, -1260);
    g.restore(); stampChars(t, 8, 6, 12, k => [190 + k * 140, 1380 + (k % 2) * 16, (R(k, 7) - .5) * .15], 120, { fam: RD, w: 800, col: YEL, line: INK, lwk: .14 }) }
  emoPop(t, cT(8, 10), '🥺', 150, 360, 200, -.2, { wig: true });
}

// ================= C1 75.33 - 80.03: なんて 惜しむような — the camera again; 今 in the focus box; the shutter keeps it as a photo; が written on it
function C1(t) {
  const shot = cT(9, 9), d = t - shot;
  if (d < .35) {
    fill(INK); g.save(); g.beginPath(); g.roundRect(40, 230, 1000, 1300, 30); g.clip(); cover('gym_ceiling', 40, 230, 1000, 1300, { zoom: 1.1 + .06 * seg(t, S(9), 4) }); rect(0, 0, W, H, INK, .15); g.restore();
    txt(lstr(9, 0, 3), 90, 330, { size: 80, fam: HW, w: 600, col: '#FFFFFF', upper: false, alpha: seg(t, S(9) - .05, .15) });
    stampChars(t, 9, 3, 9, k => [170 + k * 150, 560, (R(k, 8) - .5) * .12], 130, { fam: RD, w: 800, col: '#FFFFFF', line: INK, lwk: .14 });
    const af = t > shot - .6 ? 1 + .15 * Math.exp(-(t - shot + .6) * 5) : 1; g.save(); g.translate(CX, 1050); g.scale(af, af); g.strokeStyle = YEL; g.lineWidth = 7; for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(sx * 250, sy * 170); g.lineTo(sx * 250, sy * 250); g.lineTo(sx * 170, sy * 250); g.stroke() } g.restore();
    if (t > shot - .03) sticker('今', CX, 1060, 420, { fam: JP, col: '#FFFFFF', line: INK, lwk: .06 });
    ring(CX, 1640, 82, 8, '#FFFFFF'); disc(CX, 1640, t > shot && t < shot + .12 ? 56 : 68, '#FFFFFF');
    if (d > 0) { flash(t, shot, '#FFFFFF', .3, 1); stampIn(t, shot, 800, 420, .15, () => sticker('カシャッ', 0, 0, 110, { fam: JP, col: YEL, line: INK, lwk: .14 }), { from: 1.8 }) }
  } else {
    // the photo: shrinks into a polaroid, tilted, with が in marker
    paper(t, { bg: '#FFF6E8', word: 'NOW', rows: ['NOW'], size: 980 });
    const p = eOut(clamp((d - .35) / .45)), sc = lerp(1, .62, p), rot = lerp(0, -.08, p), cx = lerp(CX, 560, p), cy = lerp(880, 820, p);
    g.save(); g.translate(cx, cy); g.rotate(rot); g.scale(sc, sc);
    rr(-560 + 18, -700 + 22, 1120, 1400, 12, 'rgba(0,0,0,.25)'); rr(-560, -700, 1120, 1400, 12, '#FFFFFF', { line: 'rgba(0,0,0,.2)', lw: 3 });
    g.save(); g.beginPath(); g.rect(-500, -640, 1000, 1000); g.clip(); cover('gym_ceiling', -500, -640, 1000, 1000, { zoom: 1.16 }); sticker('今', 0, -120, 420, { fam: JP, col: '#FFFFFF', line: INK, lwk: .06 }); g.restore();
    if (t > cT(9, 10) - .03) txt('が', 0, 560, { size: 230, fam: HW, w: 600, col: INK, al: 'center', upper: false, alpha: seg(t, cT(9, 10) - .03, .12) });
    g.restore(); tape(cx - 10, cy - 460 * sc - 10, 300, -.12);
    starSticker(t, shot + .5, 910, 1450, 44, ORG, 1); starSticker(t, shot + .7, 160, 380, 34, SKY, 2);
  }
}

// ================= C2 80.08 - 88.2: きっと stamped; the long vowel multiplies ーーー to fill the screen; the spike; NICE SPIKE!; NEXT
function C2(t) {
  const hit = S(10), spike = 82.75, land = spike + .25;
  if (t < land + .05) {
    paper(t, { bg: YEL, word: false, gridCol: 'rgba(255,106,19,.35)' }); burst(t, CX, 900, 900, ORG, { n: 20, inner: .7, rot: t * .1 }); burst(t, CX, 900, 620, YEL, { n: 16, line: INK, lw: 7, rot: -t * .08 });
    const C = chars(10), pos = [[240, 560, -.12], [540, 600, .1], [840, 560, -.06]];
    C.forEach((G, k) => stampIn(t, G.t - .03, pos[k][0], pos[k][1], pos[k][2], () => sticker(G.c, 0, 0, k === 1 ? 240 : 330, { fam: JP, col: k === 1 ? ORG : INK, line: '#FFFFFF', lwk: .1 }), { from: 2.6, dur: .09 }));
    // the held vowel: ー multiplies, row by row, like the o's in toooo
    const t0 = cT(10, 2) + .25; if (t > t0) { const n = Math.min(24, Math.floor((t - t0) / .075) + 1); for (let k = 0; k < n; k++) { const row = Math.floor(k / 4), col = k % 4, s = MO.springStep(t - t0 - k * .075, { damping: 9, stiffness: 400 });
      g.save(); g.translate(170 + col * 250, 880 + row * 150); g.scale(s, s); sticker('ー', 0, 0, 200, { fam: JP, col: INK, line: '#FFFFFF', lwk: .1 }); g.restore() } }
    emoPop(t, hit + .3, '🏐', 900, 360, 170, .3); emoPop(t, hit + .5, '🔥', 170, 330, 170, -.2);
    // the spike comes down the diagonal
    if (t > spike - .1) { const p = eIn(seg(t, spike - .1, land - spike + .1)); for (let k = 0; k < 14; k++) { const q = p - k * .02; if (q <= 0) continue; disc(lerp(1150, 380, q), lerp(-150, 1250, q), 90 - k * 5, ORG, .12) } prop('p_ball', lerp(1150, 380, p), lerp(-150, 1250, p), 300, t * 12) }
    flash(t, hit, '#FFFFFF', .14);
  } else {
    const d = t - land; paper(t, { bg: ORG, word: 'SPIKE', rows: ['SP', 'IK', 'E!'], size: 820, dot: 'rgba(255,255,255,.35)' }); rays(t, 380, 1250, { col: 'rgba(255,255,255,.2)', n: 20 });
    burst(t, 380, 1250, 360 * eOut(clamp(d / .15)), '#FFFFFF', { n: 14, line: INK, lw: 7 }); prop('p_ball', 380, 1250, 300 * (1 + .25 * Math.exp(-d * 8)), t * 2, { sy: 1 - .3 * Math.exp(-d * 10) });
    stampIn(t, land, 700, 1450, -.1, () => sticker('バシッ!!', 0, 0, 170, { fam: JP, col: YEL, line: INK, lwk: .12 }), { from: 2.2 });
    win(CX, 560, 820, 520, 'MATCH.exe', { s: MO.springStep(t - (land + .5), { damping: 10, stiffness: 220 }), bar: YEL, rot: -.03, draw: (w, h) => {
      txt('NICE', w / 2, 170, { size: 120, w: 900, fam: UB, col: INK, al: 'center' }); txt('SPIKE!', w / 2, 300, { size: 120, w: 900, fam: UB, col: ORG, al: 'center' });
      const sc = t > land + 1.4 ? '01' : '00'; txt('HOME ' + sc + ' - 00 AWAY', w / 2, 400, { size: 40, w: 800, fam: UB, col: INK, al: 'center' }) } });
    for (let k = 0; k < 4; k++) starSticker(t, land + .6 + k * .12, [150, 930, 170, 920][k], [260, 300, 900, 880][k], 40, [YEL, SKY, LIME, '#FFFFFF'][k], k);
    emoPop(t, land + 1.4, '💯', 900, 1000, 170, .2);
    const nb = MO.springStep(t - 86.4, { damping: 9, stiffness: 260 }), click = 88.05; if (nb > .01) { g.save(); g.translate(CX, 1620); const pz = t >= click ? .9 : 1; g.scale(nb * pz, nb * pz); card(-200, -60, 400, 120, 60, LIME); txt('NEXT ▶', 0, 22, { size: 56, w: 900, fam: UB, col: INK, al: 'center' }); g.restore() }
    if (t > 86.8) { const cp = eIO(seg(t, 86.8, click - 86.8 - .1)); cursor(t, lerp(1000, CX + 50, cp), lerp(1900, 1640, cp), { click }) }
  }
}
