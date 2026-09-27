/* Sub character v4: ZONE B, the classroom (enters at 24.9; this pass covers up to 31.1).
   World: x -2950 .. 1200, same floor planes as the hallway (zoneA.js).
     blackboard (-2300, 5250) · windows CLASS_WIN · a column (-2150) stands in front of ME's desk
     ME at her desk (-2250): occluded by the column and cropped by the frame's left edge · YOU walks in and stops at the window (-1540)
   Act 1: YOU is in the light and owns the framing; ME stays at the edge. At "빠르게 식어 가" the room's light cools. */
const CLASS_WIN = [-1450, -650, 150];
const coolB = t => eSm(clamp((t - 29.7) / 1.3));                        // 식어 가: the classroom goes from afternoon warm to cold

obj('MID_BG', -900, 5475, t => { const c = coolB(t); farWall(-2950, 1400, `rgb(${Math.round(196 - 40 * c)},${Math.round(180 - 22 * c)},${Math.round(158 + 6 * c)})`, [[6235, 6300, '#8A7A64']]) }, { world: true, rad: 3000, name: 'classroom wall' });
obj('MID_BG', -2300, 5250, t => {                                        // blackboard, with ambient chalk at low contrast
  g.fillStyle = '#2F3B34'; g.fillRect(-500, -320, 1000, 640); g.strokeStyle = '#7A6A52'; g.lineWidth = 14; g.strokeRect(-500, -320, 1000, 640);
  txt('당번 · 행인 7', -470, 290, ME_T(1, 36), 'rgba(220,225,215,.22)', 'left');
}, { world: true, rad: 700, name: 'blackboard' });
for (const wx of CLASS_WIN) obj('MID_BG', wx, 5400, t => {               // windows: warm afternoon, cooling at 식어 가
  const c = coolB(t), sky = g.createLinearGradient(0, -470, 0, 430);
  sky.addColorStop(0, c < .5 ? '#FFF1D8' : '#E4ECF4'); sky.addColorStop(1, `rgb(${Math.round(255 - 60 * c)},${Math.round(214 - 10 * c)},${Math.round(160 + 70 * c)})`);
  g.fillStyle = '#7C6C58'; g.fillRect(-330, -490, 660, 940); g.fillStyle = sky; g.fillRect(-310, -470, 620, 900);
  g.fillStyle = '#7C6C58'; g.fillRect(-8, -470, 16, 900); g.fillRect(-310, -40, 620, 14);
}, { world: true, rad: 600 });
obj('MID_BG', -900, 6300, t => {                                         // classroom floor (wood) and ceiling, and the sunlight on the floor
  const c = coolB(t);
  band(-2950, 1200, FLOOR_Y, `rgb(${Math.round(150 - 30 * c)},${Math.round(116 - 10 * c)},${Math.round(84 + 20 * c)})`, 260, 'rgba(60,40,24,.3)', [.5]);
  band(-2950, 1200, CEIL_Y, '#D6CEC0', 1200, 'rgba(120,110,96,.25)', []);
  screenSpace(); for (const wx of CLASS_WIN) {                          // window light lying on the floor, pointing into the room
    const a = depthPt(wx - 240, .12), b = depthPt(wx + 240, .12), cc = depthPt(wx + 420, .85), d = depthPt(wx - 60, .85);
    g.fillStyle = `rgba(${Math.round(255 - 70 * c)},${Math.round(226 - 10 * c)},${Math.round(170 + 70 * c)},${.35 - .12 * c})`;
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.lineTo(cc.x, cc.y); g.lineTo(d.x, d.y); g.fill();
  }
}, { world: true, rad: 3000 });

// desks: a far row on the subject plane, the nearer row larger and darker (MID_FG)
function desk(w, h, top, leg) { g.fillStyle = leg; g.fillRect(-w / 2 + 20, -h, 16, h); g.fillRect(w / 2 - 36, -h, 16, h); g.fillStyle = top; g.fillRect(-w / 2, -h - 26, w, 30) }
for (const x of [-1000, -350, 300, 900]) obj('SUBJECT', x, 6500, t => desk(420, 300, '#8A6A4A', '#3A3434'), { rad: 400 });
for (const x of [-2050, -700, 600]) obj('MID_FG', x, 6720, t => desk(520, 360, '#5E4834', '#1E1C1E'), { world: true, rad: 500 });
obj('MID_FG', -2150, 5500, t => {                                        // the column in front of ME's desk: she is seen around it, never framed
  const gr = g.createLinearGradient(-100, 0, 100, 0); gr.addColorStop(0, '#9A8C78'); gr.addColorStop(1, '#6E6252'); g.fillStyle = gr; g.fillRect(-100, -1300, 200, 2350);
}, { world: true, rad: 1300 });

// ME at her desk by the back wall: the frame's left edge cuts her in half (act 1)
obj('SUBJECT', -2250, 6560, t => { if (t < 24.5) return; drawImg('me_write', 0, 0, 920, false, `brightness(${.95 - .25 * coolB(t)}) saturate(${1 - .35 * coolB(t)})`) }, { rad: 800, name: 'ME (desk)' });
// the classroom door: its lintel and jamb pass right in front of the lens as the camera goes through
obj('LENS', -2960, 5000, t => { g.fillStyle = '#3E3830'; g.fillRect(-2000, -1500, 4000, 1040); g.fillRect(-120, -1500, 240, 3400); g.fillStyle = 'rgba(255,245,230,.1)'; g.fillRect(-2000, -470, 4000, 8) }, { rad: 2100, blur: 10, name: 'door (near lens)' });

// ================= lyrics, zone B =================
// L06 along the floor from the door toward her desk; 빠져 sinks through the floor
lyric('SUBJECT', -2600, 6600, 6, t => floorRun(t, 6, 0, all(6), -2930, .15, ME_T(1, 70), 'rgba(50,34,24,.85)', { sink: all(6) - 2, keep: .4 }), { rad: 2000 });
// L07 on her desk top, small, at the edge of the frame
lyric('SUBJECT', -2250, 6560, 7, t => { g.save(); g.scale(1, .6); runs(t, 7, [{ a: 0, b: all(7), font: ME_T(1, 34), col: 'rgba(40,34,30,.85)' }], 60, -710, { al: 'left', keep: .5 }); g.restore() });
// L08 in chalk on the blackboard, smudging as it is written
lyric('MID_BG', -2300, 5250, 8, t => {                                 // (drawn over the blackboard object)
  const sm = clamp((t - Ln[8].s) / 1.4);
  for (let k = 3; k >= 1; k--) runs(t, 8, [{ a: 0, b: all(8), font: ME_T(1, 80), col: `rgba(225,228,218,${.12 * sm})` }], -120 + k * 5 * sm, -40 + k * 16 * sm, { al: 'left', keep: .5, rise: 0 });
  runs(t, 8, [{ a: 0, b: all(8), font: ME_T(1, 80), col: 'rgba(235,238,228,.8)' }], -120, -40, { al: 'left', keep: .5 });
}, { world: true, rad: 900 });
// L09 in the window light on the floor, turning cold as it is said
lyric('SUBJECT', -1700, 6600, 9, t => floorRun(t, 9, 0, all(9), -1880, .42, ME_T(1, 66), t2 => { const c = coolB(t2); return `rgba(${Math.round(120 - 60 * c)},${Math.round(84 + 20 * c)},${Math.round(50 + 90 * c)},.9)` }, { keep: .6 }), { rad: 1500 });
