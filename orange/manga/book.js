/* ORANGE manga: the book. 27 pages; each page has its panels (image id, rect in page px, the time it inks in, how) and its
   lettering (k: cap = narration box, bal = speech balloon, think = thought cloud, sfx = stamped sound-effect / key-word
   lettering, big = horizontal stamped line, vert = bare vertical text, fn = a drawing of its own). Reading order inside a
   page is right to left, top to bottom; `turn` is how the page leaves (slide = page turn, cut = hard cut with a flash). */
Ln = window.D.lines;
const bb = n => onBeat(n), RC = 551, CWD = 489;                         // the right column's x and a column's width
const FULL = [0, 0, 1080, 1920];
const W_ = '#FFFFFF';
const BOOK = [
 // 1 — night. the phone loads the match, laces are tied
 { t0: 0, bg: '#0D0D10', turn: 'cut', panels: [
   { id: 'm01_gym_night', r: [40, 70, 1000, 700], t: .25, fx: 'ink', ox: .62, oy: .72, inkDur: 1.4 },
   { id: 'm01_phone', r: [RC, 792, CWD, 938], t: 3.0 },
   { id: 'm01_laces', r: [40, 792, CWD, 938], t: 5.6 }],
   text: [{ k: 'sfx', text: 'ピコン', t: 3.3, x: 800, y: 900, size: 84, col: ORG, line: INKC },
     { k: 'sfx', text: 'ギュッ', t: 6.4, x: 285, y: 1460, size: 110, col: W_, line: INKC, rot: -.12 },
     { k: 'fn', fn: t => { if (t < 3.3) return; const s = Math.min(1, MO.springStep(t - 3.3, { damping: 12, stiffness: 260 })), p = clamp((t - 3.5) / 5.6);
       g.save(); g.translate(795, 1610); g.scale(s, s); rr(-205, -72, 410, 150, 16, W_, { line: INKC, lw: 4 }); txt('LOADING THE MATCH', 0, -24, { size: 32, fam: BG, col: INKC, al: 'center', tr: .06 });
       progress(-175, 0, 280, 40, p, { t, col: ORG }); txt(Math.round(p * 100) + '%', 182, 32, { size: 40, fam: BG, col: ORG, al: 'right' }); g.restore();
       if (t > 9.35) stampIn(t, 9.35, 795, 1440, -.08, () => sticker('START!', 0, 0, 110, { fam: BG, col: ORG, line: INKC, lwk: .1, shadow: false }), { from: 2 }) } }] },
 // 2 — the lights come on, bank by bank
 { t0: 9.66, turn: 'cut', panels: [
   { id: 'm02_lights', r: [40, 70, 1000, 520], t: 9.72, fx: 'flash', fy0: .4 },
   { id: 'm02_lights', r: [40, 612, 1000, 420], t: 10.95, fx: 'flash', fy0: .78, zoom: 1.35 },
   { id: 'm02_court_lit', r: [40, 1054, 1000, 676], t: 12.2, fx: 'flash' }],
   text: [{ k: 'sfx', text: 'ガシャン', t: 9.72, x: 330, y: 340, size: 130, rot: -.12 }, { k: 'sfx', text: 'ガシャン', t: 10.95, x: 760, y: 830, size: 120, rot: .1 },
     { k: 'sfx', text: 'ガシャン!!', t: 12.2, x: 540, y: 1390, size: 170, col: ORG, line: INKC, rot: -.06 }] },
 // 3 — the band comes in: the team, ORANGE
 { t0: 13.74, turn: 'slide', panels: [{ id: 'm03_team_backs', r: FULL, bleed: true, t: 13.777, fx: 'cut', fy0: .55, kb: [0, -.04, .07] }],
   cam: [[13.78, 540, 940, 1.14, .01], [18.0, 540, 960, 1.0, 1.6]],
   text: [...[...'ORANGE'].map((c, k) => ({ k: 'sfx', text: c, t: bb(k) - .02, x: 165 + k * 150, y: 330 + (k % 2) * 30, size: 250, fam: BG, col: k % 2 ? W_ : ORG, line: INKC, lwk: .09, rot: (R(k, 8) - .5) * .22 })),
     { k: 'sfx', text: 'SPYAIR', t: bb(6), x: 540, y: 540, size: 100, fam: PM, col: W_, line: INKC, lwk: .12 }] },
 // 4 — the ticket, the team chat, shoes on the line, the server: READY? 3 2 1
 { t0: 18.45, turn: 'slide', panels: [
   { id: 'm04_ticket', r: [40, 70, 1000, 600], t: bb(8) },
   { id: 'm04_phone_hands', r: [RC, 692, CWD, 640], t: bb(12) },
   { id: 'm04_shoes_line', r: [40, 692, CWD, 640], t: bb(16) + .3 },
   { id: 'm04_server', r: [40, 1354, 1000, 376], t: bb(24) }],
   text: [{ k: 'sfx', text: 'FINAL', t: bb(10), x: 600, y: 380, size: 150, fam: BG, rot: -.08 },
     { k: 'fn', fn: t => { if (t > bb(10) + .15) sketch(ellPts(600, 380, 260, 110, 1.08, -2.6), t, { col: ORG, lw: 12, p: eOut(seg(t, bb(10) + .15, .4)), jit: 2 }) } },
     { k: 'bal', text: 'あした!!', t: bb(16), x: 800, y: 860, size: 44, tail: [-30, 60], fam: RD },
     { k: 'bal', text: '勝つぞ!!', t: bb(20), x: 760, y: 1180, size: 44, tail: [40, -50], fam: RD },
     { k: 'sfx', text: 'キュッ', t: bb(17), x: 285, y: 1150, size: 110, rot: .1 },
     { k: 'sfx', text: 'READY?', t: bb(24) + .1, x: 300, y: 1430, size: 100, fam: BG, col: ORG, line: INKC, lwk: .09, until: S(0) - .1 },
     ...[3, 2, 1].map((n, k) => ({ k: 'sfx', text: String(n), t: bb(27 + k), until: bb(28 + k) - .02, x: 900, y: 1560, size: 200, fam: BG }))] },
 // 5 — L0: the serve. さよならは言わない / 約束もない (約束 struck out)
 { t0: 31.62, turn: 'slide', panels: [
   { id: 'm05_toss', r: [RC, 70, CWD, 1000], t: 31.66, fy0: .4 },
   { id: 'm05_hit', r: [40, 70, CWD, 1000], t: cT(0, 5) - .06, fx: 'flash', fx0: .45 },
   { id: 'm05_flight', r: [40, 1092, 1000, 638], t: cT(0, 9) - .15 }],
   text: [{ k: 'cap', i: 0, a: 0, b: 9, x: 985, y: 400, size: 60 },
     { k: 'sfx', text: 'バシッ!!', t: cT(0, 5), x: 285, y: 300, size: 130, rot: -.15 },
     { k: 'big', i: 0, a: 9, b: 11, x: 420, y: 1300, size: 230, line: W_, lwk: .1 },
     { k: 'big', i: 0, a: 11, b: 14, x: 770, y: 1560, size: 120, line: W_ },
     { k: 'fn', fn: t => { const t0 = cT(0, 11); if (t < t0) return; sketch([[190, 1190], [650, 1410]], t, { col: ORG, lw: 22, p: eOut(seg(t, t0, .18)), jit: 4 }); sketch([[650, 1190], [190, 1410]], t, { col: ORG, lw: 22, p: eOut(seg(t, t0 + .14, .18)), jit: 4 }) } }] },
 // 6 — L1: receive, set, the three jump. また会えるから / 僕らは
 { t0: 37.0, turn: 'slide', panels: [
   { id: 'm06_receive', r: [40, 70, 1000, 540], t: 37.1 },
   { id: 'm06_set', r: [40, 632, 1000, 520], t: cT(1, 4) },
   { id: 'm06_three_jump', r: [40, 1174, 1000, 556], t: cT(1, 7) - .15, fx: 'flash' }],
   text: [{ k: 'bal', i: 1, a: 0, b: 7, x: 190, y: 340, size: 56, tail: [70, 120] },
     { k: 'sfx', i: 1, a: 7, b: 10, dir: 'h', x: 540, y: 1300, size: 170, gap: 1.35, col: ORG, line: INKC }] },
 // 7 — L2, L3: the sunset bitten by the horizon; blinding light
 { t0: 41.32, turn: 'slide', panels: [
   { id: 'm07_sunset', r: [40, 70, 1000, 1060], t: 41.4, fx: 'ink', ox: .5, oy: .55, inkDur: 1.1, kb: [0, 0, .06] },
   { id: 'm07_glare', r: [40, 1152, 1000, 578], t: cT(3, 0) - .15 }],
   text: [{ k: 'cap', i: 2, a: 0, b: 10, colLen: 5, x: 935, y: 300, size: 64, hl: [0, 4] },
     { k: 'sfx', text: 'ガブッ', t: cT(2, 7), x: 700, y: 640, size: 140, rot: .15 },
     { k: 'big', i: 2, a: 10, b: 13, x: 540, y: 1010, size: 150, line: W_ },
     { k: 'cap', i: 3, a: 0, b: 6, x: 985, y: 1430, size: 60 },
     { k: 'fn', fn: t => { const tw = cT(3, 6); if (t < tw - .2) return; rect(-60, -60, 1200, 2040, W_, .9 * eIn(seg(t, tw - .2, .35)) * (1 - seg(t, E(3) + .1, .5)));
       for (let k = 0; k < 7; k++) sparkPop(t, tw + k * .1, 160 + R(k, 51) * 760, 1200 + R(k, 52) * 480, 50 + R(k, 53) * 40, R(k, 54), ORG) } },
     { k: 'sfx', i: 3, a: 6, b: 10, dir: 'h', x: 540, y: 1450, size: 160, gap: 1.05 }] },
 // 8 — L4: sweat, the squeak, the voice
 { t0: 51.12, turn: 'slide', panels: [
   { id: 'm08_sweat', r: [RC, 70, CWD, 880], t: 51.2 },
   { id: 'm08_squeak', r: [40, 70, CWD, 880], t: cT(4, 5) - .1 },
   { id: 'm08_shout', r: [40, 972, 1000, 758], t: cT(4, 7) - .15 }],
   text: [{ k: 'cap', i: 4, a: 0, b: 5, x: 985, y: 330, size: 62 },
     { k: 'sfx', i: 4, a: 5, b: 7, x: 300, y: 330, size: 150 },
     { k: 'fn', fn: t => { for (let k = 0; k < 4; k++) dropPop(t, cT(4, 5) + k * .12, 170 + k * 70, 560 + (k % 2) * 60, .8, .1, { fall: 160 }) } },
     { k: 'sfx', text: 'キュッ', t: cT(4, 6) + .2, x: 250, y: 760, size: 120, rot: -.1 },
     { k: 'cap', i: 4, a: 7, b: 10, x: 985, y: 1110, size: 62 },
     { k: 'fn', fn: t => { const t0 = cT(4, 10); for (let k = 0; k < 4; k++) { const d = t - t0 - k * .2; if (d > 0 && d < 1.4) sketch(ellPts(540, 1350, 200 + d * 380, 150 + d * 260, 1.02, -1, 40), t, { col: INKC, lw: 9 * (1 - d / 1.4), alpha: 1 - d / 1.4 }) } } },
     { k: 'sfx', i: 4, a: 10, b: 11, x: 540, y: 1350, size: 340, col: ORG, line: INKC, lwk: .08 }] },
 // 9 — L5: the high five, laughing, crying
 { t0: 56.02, turn: 'cut', panels: [
   { id: 'm09_highfive', r: [40, 70, 1000, 620], t: S(5) - .05, fx: 'flash' },
   { id: 'm09_shoulders', r: [RC, 712, CWD, 1018], t: cT(5, 6) - .12 },
   { id: 'm09_tear', r: [40, 712, CWD, 1018], t: cT(5, 11) - .12 }],
   text: [{ k: 'sfx', text: 'パチン!!', t: S(5), x: 540, y: 200, size: 150, col: ORG, line: INKC, rot: -.08 },
     { k: 'cap', i: 5, a: 0, b: 6, x: 985, y: 330, size: 58 },
     { k: 'bal', i: 5, a: 6, b: 11, x: 800, y: 1300, size: 56, tail: [-20, -110] },
     { k: 'sfx', text: 'ハハッ', t: cT(5, 7), x: 900, y: 880, size: 96 },
     { k: 'sfx', i: 5, a: 11, b: 14, x: 290, y: 1180, size: 130 },
     { k: 'fn', fn: t => { for (let k = 0; k < 6; k++) { const t0 = cT(5, 11) + k * .1; if (t > t0) dropMark(150 + k * 50, 1450 + (t - t0) * (220 + R(k, 41) * 200), .7, 0, { alpha: 1 - seg(t, t0 + 1, .3) }) } } }] },
 // 10 — L6, L7: the leap into the orange sky (one tall picture, read from the bottom up)
 { t0: 60.5, turn: 'cut', panels: [{ id: 'm10_leap_sky', r: FULL, bleed: true, t: 60.55, fx: 'flash', kb: [0, 0, .04], kbDur: 10 },
   { id: 'm10_feathers', r: [70, 1330, 560, 373], t: S(7) + .05, inset: true, rot: -.03 }],
   cam: [[60.55, 540, 1460, 1.7, .01], [61.3, 540, 1380, 1.55, .6], [63.4, 540, 980, 1.25, 1.3], [66.9, 540, 700, 1.12, 1.2], [69.6, 540, 960, 1.0, .5]],
   text: [{ k: 'cap', i: 6, a: 0, b: 6, x: 770, y: 1290, size: 58 },
     { k: 'sfx', i: 6, a: 6, b: 12, x: 300, y: 860, size: 104, col: ORG, line: INKC, gap: 1.0 },
     { k: 'sfx', i: 6, a: 12, b: 14, dir: 'h', x: 690, y: 430, size: 220, col: ORG, line: INKC, gap: 1.0 },
     { k: 'fn', fn: t => { const C = chars(7); for (let k = 0; k < 7; k++) { const G = C[k]; if (t < G.t - .03) continue; const d = Math.max(0, t - G.t - .3), x = 760 + (k - 3) * 40 + (k - 3) * 30 * d, y = 1180 - k * 84 - d * d * 90 - d * 120;
       const fl = .55 + .45 * Math.abs(Math.cos((t - G.t) * 11)); stampIn(t, G.t - .03, x, y, (R(k, 2) - .5) * .2, () => { g.scale(1, fl); sticker(G.c, 0, 0, 96, { fam: MJ, col: INKC, line: W_, lwk: .14, shadow: false }) }, { from: 1.5 }) }
       for (let k = 0; k < 6; k++) { const d = t - S(7) - k * .3; if (d > 0 && d < 3.5) birdV(560 + d * (90 + k * 12), 1100 - d * (150 + k * 16) - k * 50, .8, Math.sin((t + k) * 9)) } } }] },
 // 11 — L8, L9: the hang at the top of the jump; 今, kept by a shutter
 { t0: 70.42, turn: 'cut', panels: [
   { id: 'm11_hang', r: [40, 70, 1000, 560], t: 70.5, fx: 'cut' },
   { id: 'm11_hang', r: [40, 652, 1000, 560], t: cT(8, 6) - .05, fx: 'cut', zoom: 1.45, fy0: .35 },
   { id: 'm11_photo', r: [40, 1234, 1000, 496], t: S(9) - .05 }],
   text: [{ k: 'big', i: 8, a: 0, b: 6, x: 520, y: 170, size: 104, line: W_ },
     { k: 'sfx', text: '+1秒', t: cT(8, 4), x: 900, y: 520, size: 84, fam: BGJ, col: ORG, line: INKC, lwk: .1, rot: .1 },
     { k: 'big', i: 8, a: 6, b: 12, x: 520, y: 750, size: 104, line: W_ },
     { k: 'sfx', text: '+1秒', t: cT(8, 10), x: 900, y: 1110, size: 84, fam: BGJ, col: ORG, line: INKC, lwk: .1, rot: -.08 },
     { k: 'cap', i: 9, a: 0, b: 9, colLen: 9, x: 990, y: 1482, size: 48 },
     { k: 'fn', fn: t => { const sh = cT(9, 9); if (t < sh - .5) return; const af = 1 + .12 * Math.exp(-(t - sh + .5) * 5); g.save(); g.translate(540, 1480); g.scale(af, af); g.strokeStyle = ORG; g.lineWidth = 10;
       for (const [sx, sy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.beginPath(); g.moveTo(sx * 230, sy * 140); g.lineTo(sx * 230, sy * 210); g.lineTo(sx * 160, sy * 210); g.stroke() } g.restore();
       if (t > sh) rect(40, 1234, 1000, 496, W_, .9 * (1 - seg(t, sh, .35))) } },
     { k: 'sfx', i: 9, a: 9, b: 10, x: 540, y: 1480, size: 290, col: ORG, line: INKC, lwk: .08, from: 1.5 },
     { k: 'sfx', i: 9, a: 10, b: 11, x: 730, y: 1610, size: 100 },
     { k: 'sfx', text: 'カシャッ', t: cT(9, 9), x: 270, y: 1310, size: 96, rot: -.1 }] },
 // 12 — L10: きっと, the spike splash; 01 - 00
 { t0: 79.96, turn: 'slide', panels: [{ id: 'm12_spike_impact', r: FULL, bleed: true, t: 80.0, fx: 'flash', kb: [0, 0, .05] },
   { id: 'm12_scoreboard', r: [70, 1250, 620, 413], t: 84.2, inset: true, rot: -.03 }],
   cam: [[80.0, 540, 960, 1.16, .01], [82.4, 540, 960, 1.0, 1.0], [84.0, 380, 1440, 1.42, .35], [87.3, 540, 960, 1.0, .4]],
   text: [{ k: 'sfx', i: 10, a: 0, b: 3, dir: 'h', x: 540, y: 520, size: 290, col: ORG, line: INKC, lwk: .08, gap: 1.0 },
     { k: 'fn', fn: t => { const t0 = cT(10, 2) + .2; if (t < t0) return; const n = Math.min(12, Math.floor((t - t0) / .1) + 1); for (let k = 0; k < n; k++) { const a = -Math.PI / 2 + (k - 5.5) * .27, r = 470 + (k % 2) * 90, s = MO.springStep(t - t0 - k * .1, { damping: 9, stiffness: 400 });
       g.save(); g.translate(540 + Math.cos(a) * r, 760 + Math.sin(a) * r * .6); g.rotate(a + Math.PI / 2); g.scale(s, s); sticker('ー', 0, 0, 150, { fam: SFX, col: INKC, line: W_, lwk: .12, shadow: false }); g.restore() } } },
     { k: 'sfx', text: 'ドンッ', t: 80.12, x: 820, y: 940, size: 150, rot: .12 },
     { k: 'fn', fn: t => { if (t < 84.35) return; const s = Math.min(1, MO.springStep(t - 84.35, { damping: 12, stiffness: 260 })); g.save(); g.translate(380, 1456); g.rotate(-.03); g.scale(s, s); scorePanel(t, '01', '00', 84.4); g.restore() } },
     { k: 'sfx', text: 'NICE KILL!', t: 84.7, x: 420, y: 1185, size: 96, fam: BG, col: ORG, line: INKC, lwk: .09, rot: -.1 }] },
 // 13 — L11, L12: a small back with a big dream; ここまで来たんだよ at set point
 { t0: 88.0, turn: 'slide', panels: [
   { id: 'm13_back_1', r: [RC, 70, CWD, 1100], t: 88.15 },
   { id: 'm13_tape', r: [40, 70, CWD, 1100], t: cT(11, 6) - .15 },
   { id: 'm12_scoreboard', r: [40, 1192, 1000, 538], t: S(12) - .2, fx: 'flash', fy0: .4 }],
   text: [{ k: 'cap', i: 11, a: 0, b: 6, x: 985, y: 330, size: 58 },
     { k: 'sfx', i: 11, a: 6, b: 11, x: 300, y: 470, size: 118, col: ORG, line: INKC, gap: 1.0 },
     { k: 'cap', i: 11, a: 11, b: 14, x: 110, y: 960, size: 56 },
     { k: 'fn', fn: t => { if (t < S(12) - .1) return; g.save(); g.translate(400, 1460); scorePanel(t, '24', '23', S(12)); g.restore(); if (t > S(12) + .25) stampIn(t, S(12) + .25, 400, 1640, -.05, () => sticker('SET POINT', 0, 0, 80, { fam: BG, col: ORG, line: INKC, lwk: .1, shadow: false }), { from: 1.8 }) } },
     { k: 'bal', i: 12, a: 0, b: 9, colLen: 5, x: 870, y: 1460, size: 54, tail: [-60, 40] }] },
 // 14 — L13: rain on the window, a fortune slip: 未来, 小吉
 { t0: 97.92, turn: 'slide', panels: [
   { id: 'm14_rain', r: [40, 70, 1000, 760], t: 98.0, fx: 'ink', inkDur: .9 },
   { id: 'm14_omikuji', r: [40, 852, 1000, 878], t: cT(13, 5) - .2 }],
   text: [{ k: 'cap', i: 13, a: 0, b: 5, x: 985, y: 320, size: 62 },
     { k: 'sfx', i: 13, a: 5, b: 7, dir: 'h', x: 560, y: 1190, size: 210, gap: 1.0 },
     { k: 'cap', i: 13, a: 7, b: 15, colLen: 8, x: 110, y: 1260, size: 52 },
     { k: 'fn', fn: t => hanko(t, cT(13, 9), 760, 1560, 110, '吉', { fam: MJ }) }] },
 // 15 — L14: 楽しかったよね 全てが — every page so far, ticked
 { t0: 103.22, turn: 'cut', panels: [],
   under: t => { RECAP.forEach((id, k) => { const col = k % 3, row = Math.floor(k / 3), x = 40 + (2 - col) * 340, y = 70 + row * 420, t0 = 103.3 + k * .17;
     drawPanel({ id, r: [x, y, 320, 400], t: t0, fx: 'pop' }, t, {}); if (t > cT(14, 7) + k * .05) sketch([[x + 110, y + 220], [x + 150, y + 270], [x + 230, y + 150]], t, { col: ORG, lw: 22, p: eOut(seg(t, cT(14, 7) + k * .05, .18)), jit: 3 }) }) },
   text: [{ k: 'fn', fn: t => { if (t > S(14) - .1) rect(0, 830, 1080, 260, W_, .88 * seg(t, S(14) - .1, .2)) } },
     { k: 'big', i: 14, a: 0, b: 7, x: 540, y: 960, size: 120, line: W_ },
     { k: 'sfx', i: 14, a: 7, b: 10, dir: 'h', x: 540, y: 1300, size: 280, col: ORG, line: INKC, lwk: .08, gap: 1.0 }] },
 // 16 — L15, L16: running, breathless; the heat in the chest
 { t0: 107.84, turn: 'slide', panels: [
   { id: 'm15_run', r: [40, 70, 1000, 520], t: 107.95 },
   { id: 'm15_run_back', r: [40, 612, 1000, 540], t: cT(15, 5) - .15 },
   { id: 'm15_chest', r: [40, 1174, 1000, 556], t: S(16) - .15 }],
   text: [{ k: 'cap', i: 15, a: 0, b: 5, x: 985, y: 330, size: 60 },
     { k: 'sfx', text: 'ハァ', t: 108.6, x: 300, y: 230, size: 110, rot: -.1 }, { k: 'sfx', text: 'ハァ', t: 109.3, x: 470, y: 430, size: 90, rot: .12 },
     { k: 'fn', fn: t => { if (t < cT(15, 5)) return; g.save(); g.beginPath(); g.rect(40, 612, 1000, 540); g.clip(); g.fillStyle = W_; for (let k = 0; k < 26; k++) { const y = 640 + R(k, 1) * 480, len = 200 + R(k, 2) * 500, x = ((R(k, 3) * 1400 + (t - 110) * 2400 * (.7 + R(k, 4) * .6)) % 1400) - 200;
       g.globalAlpha = .55 * GA; g.fillRect(x, y, len, 3 + R(k, 5) * 6) } g.restore() } },
     { k: 'big', i: 15, a: 5, b: 11, x: 540, y: 900, size: 118, line: W_ },
     { k: 'cap', i: 16, a: 0, b: 8, colLen: 8, x: 988, y: 1452, size: 54 },
     { k: 'sfx', i: 16, a: 8, b: 12, dir: 'h', x: 470, y: 1430, size: 150, gap: 1.0, hl: [10, 11] },
     { k: 'cap', i: 16, a: 12, b: 15, x: 110, y: 1520, size: 54 },
     { k: 'sfx', text: 'ドクン', t: cT(16, 10), x: 780, y: 1650, size: 110, col: ORG, line: INKC }] },
 // 17 — L17, L18: the dive for the one chance; the passes connect
 { t0: 117.02, turn: 'slide', panels: [
   { id: 'm16_dive', r: [40, 70, 1000, 700], t: S(17) - .1, fx: 'flash' },
   { id: 'm16_pass_chain', r: [40, 792, 1000, 938], t: S(18) - .15 }],
   text: [{ k: 'cap', i: 17, a: 0, b: 10, colLen: 7, x: 955, y: 330, size: 56 },
     { k: 'sfx', text: 'ズザッ', t: S(17) + .2, x: 250, y: 230, size: 110, rot: -.1 },
     { k: 'sfx', i: 17, a: 10, b: 13, dir: 'h', x: 430, y: 620, size: 165, col: ORG, line: INKC, gap: 1.0 },
     { k: 'bal', i: 18, a: 0, b: 3, x: 300, y: 1590, size: 58, tail: [60, 40] },
     { k: 'bal', i: 18, a: 3, b: 7, x: 790, y: 1240, size: 58, tail: [-60, 30] },
     { k: 'bal', i: 18, a: 7, b: 11, x: 300, y: 960, size: 58, tail: [70, -20] }] },
 // 18 — L19, L20: what shall we draw — a pencil, a dream in a thought cloud
 { t0: 126.52, turn: 'cut', panels: [
   { id: 'm17_notebook', r: [40, 70, 1000, 620], t: 126.6 },
   { id: 'm17_lying', r: [RC, 712, CWD, 1018], t: S(20) - .15 },
   { id: 'm17_dream_arena', r: [40, 760, 500, 760], t: cT(20, 3) - .1, cloud: true, fx: 'pop' }],
   text: [{ k: 'big', i: 19, a: 0, b: 7, x: 120, y: 250, size: 76, fam: HW, w: 600, al: 'left', ent: 'type', line: null },
     { k: 'big', i: 19, a: 7, b: 14, x: 230, y: 420, size: 76, fam: HW, w: 600, al: 'left', ent: 'type', line: null },
     { k: 'cap', i: 20, a: 0, b: 3, x: 985, y: 860, size: 58 },
     { k: 'fn', fn: t => { if (t < cT(20, 3) - .1) return; for (const [x, y, r] of [[600, 1500, 34], [570, 1600, 22]]) { disc(x, y, r, W_); ring(x, y, r, 6, INKC) } } },
     { k: 'sfx', i: 20, a: 3, b: 5, dir: 'h', x: 290, y: 1140, size: 160, gap: 1.0 },
     { k: 'cap', i: 20, a: 5, b: 11, x: 985, y: 1420, size: 54 }] },
 // 19 — L21: きっと, the spike from below; the crowd chants
 { t0: 136.34, turn: 'cut', panels: [{ id: 'm18_spike_low', r: FULL, bleed: true, t: 136.4, fx: 'flash', kb: [0, -.04, .08], kbDur: 9 },
   { id: 'm18_crowd', r: [70, 1280, 620, 413], t: 141.0, inset: true, rot: .03 }],
   cam: [[136.4, 540, 960, 1.2, .01], [139.4, 540, 820, 1.08, 1.5], [140.9, 380, 1480, 1.4, .5], [145.3, 540, 960, 1.0, .4]],
   text: [{ k: 'sfx', i: 21, a: 0, b: 3, dir: 'h', x: 540, y: 420, size: 290, col: ORG, line: INKC, lwk: .08, gap: 1.0 },
     { k: 'fn', fn: t => { for (let k = 0; k < 5; k++) { const tb = onBeat(Math.floor(beatN(t)) - k); if (tb < 141.4 || t - tb > .5) continue; const n = Math.round(beatN(tb));
       stampIn(t, tb, 150 + R(n, 3) * 780, 1180 + R(n, 4) * 120, (R(n, 5) - .5) * .3, () => sticker('KITTO!!', 0, 0, 90, { fam: BG, col: k % 2 ? ORG : W_, line: INKC, lwk: .1, shadow: false, alpha: 1 - (t - tb) / .5 }), { from: 1.6 }) } } }] },
 // 20 — L22: きっと again, the dig, the ball rises, the team's hands
 { t0: 146.0, turn: 'slide', panels: [
   { id: 'm19_dig_dive', r: [40, 70, 1000, 620], t: 146.05, fx: 'flash' },
   { id: 'm19_ball_up', r: [RC, 712, CWD, 1018], t: 149.0 },
   { id: 'm19_hands_stack', r: [40, 712, CWD, 1018], t: 152.4 }],
   text: [{ k: 'sfx', i: 22, a: 0, b: 3, dir: 'h', x: 540, y: 560, size: 210, col: ORG, line: INKC, gap: 1.0 },
     { k: 'sfx', text: 'フワッ', t: 149.4, x: 800, y: 1100, size: 100 },
     { k: 'sfx', text: 'オーッ!!', t: 153.0, x: 285, y: 1500, size: 110, col: ORG, line: INKC }] },
 // 21 — L23–L25: the whiteboard in marker; a hand to get up; 君は君でいい oh
 { t0: 156.42, turn: 'slide', panels: [
   { id: 'm20_board', r: [40, 70, 1000, 620], t: S(23) - .15 },
   { id: 'm20_hand_up', r: [RC, 712, CWD, 1018], t: S(24) - .15 },
   { id: 'm20_stand', r: [40, 712, CWD, 1018], t: S(25) - .15 }],
   text: [{ k: 'big', i: 23, a: 0, b: 7, x: 150, y: 270, size: 66, fam: MK, al: 'left', ent: 'type', line: null },
     { k: 'big', i: 23, a: 7, b: 15, x: 150, y: 370, size: 66, fam: MK, al: 'left', ent: 'type', line: null },
     { k: 'bal', i: 24, a: 0, b: 8, colLen: 8, x: 720, y: 1060, size: 52, tail: [60, -80] },
     { k: 'bal', i: 24, a: 8, b: 14, colLen: 6, x: 920, y: 1400, size: 52, tail: [-40, 70] },
     { k: 'sfx', i: 25, a: 0, b: 6, x: 290, y: 1120, size: 110, gap: 1.0 },
     { k: 'sfx', i: 25, a: 6, b: 8, dir: 'h', x: 290, y: 1610, size: 120, fam: BG, col: ORG, line: INKC, gap: .7 }] },
 // 22 — L26, L27: the drop — a black page, one ball in the light, 切なさ fading
 { t0: 171.5, bg: '#0D0D10', turn: 'cut', panels: [
   { id: 'm21_lonely_ball', r: [40, 70, 1000, 1000], t: S(26) - .1, fx: 'ink', ox: .5, oy: .62, inkDur: 1.6 },
   { id: 'm21_bench', r: [40, 1092, 1000, 638], t: S(27) - .1, fx: 'ink', inkDur: 1.2 }],
   text: [{ k: 'cap', i: 26, a: 0, b: 4, x: 985, y: 300, size: 56 },
     { k: 'sfx', i: 26, a: 4, b: 11, x: 160, y: 520, size: 78, col: ORG, line: INKC, gap: 1.0, wob: .08 },
     { k: 'cap', i: 27, a: 0, b: 5, x: 985, y: 1300, size: 54 },
     { k: 'sfx', i: 27, a: 5, b: 8, dir: 'h', x: 540, y: 1600, size: 150, col: W_, line: INKC, gap: 1.05, fadeTo: .35, fadeAfter: 1.2, wob: .06 }] },
 // 23 — L28, L29: the serve clock runs out; 行くよ
 { t0: 181.58, turn: 'slide', panels: [
   { id: 'm22_serve_bounce', r: [40, 70, 1000, 560], t: 181.65, fx: 'flash' },
   { id: 'm22_toss_ready', r: [RC, 652, CWD, 1078], t: cT(28, 6) - .15 },
   { id: 'm22_jump_serve', r: [40, 652, CWD, 1078], t: cT(29, 9) - .25, fx: 'flash' }],
   text: [{ k: 'big', i: 28, a: 0, b: 6, x: 520, y: 170, size: 100, line: W_ },
     { k: 'fn', fn: t => { if (t < 182.2) return; const sec = clamp((cT(29, 9) - t) / 8) * 8; g.save(); g.translate(880, 520); rr(-130, -62, 260, 124, 20, '#15161E', { line: '#000', lw: 6 });
       txt('SERVE', 0, -26, { size: 30, fam: BG, col: W_, al: 'center', tr: .12 }); txt(sec.toFixed(2), 0, 44, { size: 66, fam: BG, col: sec < 3 ? ORG : '#FFD83A', al: 'center' }); g.restore();
       if (t > cT(28, 8)) { stampIn(t, cT(28, 8), 700, 1500, -.1, () => { sticker('+1秒', 0, 0, 80, { fam: BGJ, col: '#9A98A8', line: INKC, lwk: .1, shadow: false }); padlock(70, -40, .45) }, { from: 1.6 }) } } },
     { k: 'bal', i: 28, a: 6, b: 12, colLen: 6, x: 690, y: 960, size: 54, tail: [60, 80] },
     { k: 'cap', i: 29, a: 0, b: 9, colLen: 9, x: 990, y: 1430, size: 50 },
     { k: 'sfx', i: 29, a: 9, b: 12, x: 285, y: 1160, size: 175, col: ORG, line: INKC, gap: 1.0 },
     { k: 'sfx', text: 'GO!!', t: cT(29, 9) + .1, x: 330, y: 1620, size: 120, fam: BG, col: INKC, line: W_ }] },
 // 24 — L30–L32: the tunnel (a battery at 1%), the photos (恋しく), running into the light
 { t0: 191.72, turn: 'cut', panels: [
   { id: 'm23_tunnel', r: [RC, 70, CWD, 1020], t: S(30) - .1 },
   { id: 'm23_photos', r: [40, 70, CWD, 1020], t: S(31) - .1 },
   { id: 'm23_run_light', r: [40, 1112, 1000, 618], t: S(32) - .1, fx: 'flash' }],
   text: [{ k: 'cap', i: 30, a: 0, b: 4, x: 985, y: 300, size: 56 },
     { k: 'sfx', i: 30, a: 4, b: 7, x: 720, y: 620, size: 115, gap: 1.0 },
     { k: 'cap', i: 30, a: 7, b: 10, x: 985, y: 830, size: 56 },
     { k: 'fn', fn: t => { const bt = cT(30, 6) - .1; if (t < bt) return; battery(800, 980, .32 * Math.min(1, MO.springStep(t - bt, { damping: 11, stiffness: 240 })), lerp(1, .01, eIn(seg(t, bt + .1, cT(30, 9) - bt))), t) } },
     { k: 'cap', i: 31, a: 0, b: 3, x: 470, y: 260, size: 56 },
     { k: 'sfx', i: 31, a: 3, b: 6, x: 250, y: 560, size: 125, col: ORG, line: INKC, gap: 1.0 },
     { k: 'cap', i: 31, a: 6, b: 10, x: 470, y: 860, size: 56 },
     { k: 'big', i: 32, a: 0, b: 8, x: 540, y: 1290, size: 98, line: W_ },
     { k: 'big', i: 32, a: 8, b: 15, x: 540, y: 1450, size: 108, col: ORG, line: INKC }] },
 // 25 — L33, L34: into the arena; the final spike — きっと
 { t0: 205.96, turn: 'cut', panels: [
   { id: 'm24_arena_enter', r: [40, 70, 1000, 780], t: S(33) - .05, fx: 'flash' },
   { id: 'm24_final_spike', r: [40, 872, 1000, 858], t: S(34) - .1, fx: 'flash' }],
   text: [{ k: 'cap', i: 33, a: 0, b: 2, x: 985, y: 250, size: 62 },
     { k: 'sfx', i: 33, a: 2, b: 5, dir: 'h', x: 540, y: 560, size: 165, gap: 1.0 },
     { k: 'cap', i: 33, a: 5, b: 13, colLen: 8, x: 110, y: 420, size: 54 },
     { k: 'sfx', text: 'MATCH POINT', t: 210.3, x: 540, y: 800, size: 84, fam: BG, col: ORG, line: INKC, lwk: .1 },
     { k: 'sfx', i: 34, a: 0, b: 3, dir: 'h', x: 540, y: 1250, size: 290, col: ORG, line: INKC, lwk: .08, gap: 1.0 }] },
 // 26 — GAME SET: the ball touches the floor; the team jumps
 { t0: 213.42, turn: 'slide', panels: [
   { id: 'm25_ball_floor', r: [40, 70, 1000, 620], t: 213.47, fx: 'flash' },
   { id: 'm25_celebrate', r: [40, 712, 1000, 1018], t: 214.6 }],
   text: [{ k: 'sfx', text: 'ドンッ', t: 213.5, x: 820, y: 560, size: 130, rot: .1 },
     { k: 'sfx', text: 'GAME SET', t: 213.62, x: 540, y: 390, size: 170, fam: BG, col: ORG, line: INKC, lwk: .09, rot: -.05 },
     { k: 'fn', fn: t => { if (t < 214.7) return; g.save(); g.beginPath(); g.rect(40, 712, 1000, 1018); g.clip(); confetti(t, 214.7, 540, 900, { n: 120, spread: 1.1 }); g.restore() } },
     { k: 'sfx', text: 'ワーッ!!', t: 215.0, x: 540, y: 900, size: 140 }] },
 // 27 — L35 and the end: dawn, きっと, credits, おわり
 { t0: 220.3, turn: 'end', panels: [{ id: 'm26_dawn', r: FULL, bleed: true, t: 220.3, fx: 'ink', ox: .5, oy: .75, inkDur: 1.4, kb: [0, -.03, .05], kbDur: 12 }],
   cam: [[220.3, 540, 1100, 1.2, .01], [226, 540, 960, 1.0, 3.0]],
   text: [{ k: 'sfx', i: 35, a: 0, b: 3, x: 880, y: 520, size: 150, col: ORG, line: INKC, gap: 1.0 },
     { k: 'fn', fn: t => { if (t > 225.4) stampIn(t, 225.4, 540, 1170, -.03, () => sticker('オレンジ', 0, 0, 130, { fam: MJ, col: INKC, line: W_, lwk: .14, shadow: false }), { from: 1.8 });
       if (t > 226.2) stampIn(t, 226.2, 540, 1330, 0, () => sticker('SPYAIR', 0, 0, 96, { fam: BG, col: ORG, line: INKC, lwk: .1, shadow: false, tr: .08 }), { from: 1.8 });
       if (t > 228.4) { const s = Math.min(1, MO.springStep(t - 228.4, { damping: 12, stiffness: 240 })); g.save(); g.translate(540, 1560); g.scale(s, s); rr(-130, -56, 260, 112, 10, W_, { line: INKC, lw: 4 }); txt('おわり', 0, 22, { size: 62, fam: MJ, col: INKC, al: 'center', upper: false }); g.restore() } } }] },
];
BOOK.forEach((P, k) => { P.n = k + 1; P.t1 = k + 1 < BOOK.length ? BOOK[k + 1].t0 : 232.4 });
// the recap page reuses earlier panels
const RECAP = ['m02_court_lit', 'm03_team_backs', 'm01_gym_night', 'm06_three_jump', 'm05_hit', 'm05_toss', 'm09_highfive', 'm08_shout', 'm07_sunset', 'm12_spike_impact', 'm11_hang', 'm10_leap_sky'];
// the scoreboard numbers laid over the painted board
function scorePanel(t, h, a, t0) { rr(-250, -95, 500, 190, 22, '#15161E', { line: '#000', lw: 8 }); txt('HOME', -125, -48, { size: 30, fam: BG, col: ORG, al: 'center', tr: .1 }); txt('AWAY', 125, -48, { size: 30, fam: BG, col: '#FFFFFF', al: 'center', tr: .1 });
  for (let k = 0; k < 2; k++) { flipCard(-170 + k * 90, 30, 80, 110, '0', h[k], t0 + k * .08, t); flipCard(80 + k * 90, 30, 80, 110, '0', a[k], t0 + .16 + k * .08, t) }
  txt(':', 0, 60, { size: 90, fam: BG, col: '#FFFFFF', al: 'center' }) }
const IMPACTS = [13.777, 80.08, 136.48, 146.1, cT(29, 9), 210.88, 213.5];
HITS.push([13.777, 30], [cT(0, 5), 14], [S(5), 20], [80.08, 34], [136.48, 30], [146.1, 24], [cT(29, 9), 26], [210.88, 30], [213.5, 44], [220.5, 12]);
