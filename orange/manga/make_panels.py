"""Writes panels.json: the drawing style and one prompt per panel of the ORANGE manga (python orange/manga/make_panels.py)."""
import json, os

STYLE = ("Japanese sports manga panel art for an original high-school volleyball story: black ink on white paper, confident brush and "
         "G-pen lines, screentone dot shading and tone gradients, dramatic speed lines, impact bursts and glare drawn in ink, high "
         "contrast, cinematic composition; original artwork, not from any existing manga. Colour: strictly black, white and grey "
         "screentone, plus ONE spot colour, vivid orange (#FF6A13), used sparingly only where the prompt asks (the volleyball, the "
         "sunset sky, small accents). The volleyball is drawn with curved panels in orange and white. People are an original team "
         "shown WITHOUT faces: only hands, arms, legs, shoes, backs, silhouettes, the jaw or chin, or hair from behind; heads turned "
         "away or cropped out of the frame; never draw eyes, a nose or a full face. No text, no letters, no sound-effect lettering, "
         "no speech balloons, no panel borders, no numbers unless asked, no watermark. Fill the whole canvas edge to edge.")
L, P, S = "1536x1024", "1024x1536", "1024x1024"
PANELS = [
 ("m03_team_backs", P, "Splash panel: six volleyball players of one team seen from behind, standing shoulder to shoulder at the edge of a bright court, orange jerseys (the only colour) with plain backs, one holding a volleyball against the hip, strong backlight with radiating speed lines, heroic low angle."),
 ("m01_gym_night", L, "A dark empty school gymnasium at night, moonlight through tall windows making pale stripes on the wooden floor, one volleyball resting alone on the floor in a pool of moonlight, deep black shadows, quiet mood."),
 ("m01_phone", P, "A smartphone lying on a wooden locker-room bench in the dark, its blank screen glowing and lighting the bench and a folded orange jersey next to it, everything else in deep black ink shadow."),
 ("m01_laces", P, "Close-up of two hands tying the laces of a volleyball shoe in a dim locker room, dramatic side light, fine ink hatching."),
 ("m02_lights", L, "Looking straight up at a gym ceiling: rows of big round lamps switching on one after another with star-shaped glare bursts and radiating light lines, steel trusses in black ink."),
 ("m02_court_lit", L, "A high-angle wide view of the whole gymnasium suddenly lit: the volleyball court with crisp lines and the net in the centre, polished floor reflections, empty bleachers, bright and open."),
 ("m04_ticket", L, "A hand holding up a tournament ticket in front of the gym entrance doors, the ticket plain blank paper with a perforated stub, light behind it, ink tones."),
 ("m04_phone_hands", P, "Two hands holding a smartphone with thumbs typing, the screen a plain glowing rectangle, seen over the shoulder, a sports bag strap and an orange jersey in the background."),
 ("m04_shoes_line", P, "Low angle close-up of volleyball shoes stepping onto the white boundary line of the court, the floor gleaming, tension in the ankles, speed lines."),
 ("m04_server", L, "Over-the-shoulder view from behind a server standing at the service line holding a volleyball at the hip, the whole court and the net ahead, the opponents as distant dark silhouettes, the head cropped by the top edge."),
 ("m05_toss", P, "Looking up from below: a volleyball tossed high in the air against the bright ceiling lamps, the server's raised arm reaching up into the frame from the bottom, radiating focus lines."),
 ("m05_hit", L, "Impact: the server's open palm smashing the volleyball, the ball squashed on contact, explosive impact lines and ink splashes, extreme dynamic angle, only the forearm and shoulder."),
 ("m05_flight", L, "From behind the server's back with the head cropped: the volleyball streaking over the net like a comet with an orange trail toward the opponents' court, speed lines."),
 ("m06_receive", L, "Close-up of two forearms joined in a bump pass meeting the volleyball, knees bent, the floor below, motion lines, tense arms."),
 ("m06_set", L, "Close-up of a setter's fingertips pushing the volleyball upward with a soft touch, seen from below against the lights, delicate lines."),
 ("m06_three_jump", L, "Three players jumping at the net together, seen from behind as black silhouettes against the bright lights, arms raised, the net in the foreground."),
 ("m07_sunset", P, "Through the gym's tall windows: a huge setting sun in orange sinking into the town horizon, the skyline biting into the bottom of the sun, long light beams across the dark gym floor, a volleyball silhouette on the windowsill in the foreground."),
 ("m07_glare", L, "A raised hand shielding the eyes from blinding sunlight, only the hand and the back of the hair visible, big lens-flare circles and glare lines drawn in ink, a white-hot centre."),
 ("m08_sweat", P, "Extreme close-up of a jaw and chin from the side with sweat drops sliding down and falling, the jersey collar, the face cropped above the mouth."),
 ("m08_squeak", P, "Close-up of a shoe sole pivoting hard on the polished floor leaving a skid mark, a sweat drop splashing on the floor, sharp motion lines."),
 ("m08_shout", L, "A player seen from behind shouting toward the court, shout lines radiating from the head, teammates as silhouettes ahead, concentric echo lines in the gym."),
 ("m09_highfive", L, "Two hands meeting in a high five, palms smacking, a burst of impact lines and small sparkles, wristbands, gym lights behind."),
 ("m09_shoulders", P, "Three teammates from behind with arms around each other's shoulders, laughing with shoulders shaking and heads tilted back, faces not visible, warm light."),
 ("m09_tear", P, "A towel draped over a bowed head hiding the face completely, a wrist wiping under it, one tear drop falling onto the floor, quiet emotion."),
 ("m10_leap_sky", P, "Tall panel: a spiker leaping high, seen from far below as a black silhouette against a vast orange sunset sky full of clouds, arm cocked back, the gym roof opening into the sky, birds flying."),
 ("m10_feathers", L, "White feathers and a flock of small birds rising into a bright sky, light and airy, soft screentone clouds."),
 ("m11_hang", L, "At the very top of a jump: the spiker's silhouette frozen in mid-air with the arm drawn back and the volleyball hanging right above the hand, time stopped, radial lines, the net far below."),
 ("m11_photo", L, "The same frozen jump seen through a camera viewfinder: thin focus brackets in the corners, a shutter flash, the spiker's silhouette and the ball at the centre."),
 ("m12_spike_impact", P, "Splash: the volleyball slamming into the opponents' floor after a spike, the floor cracking with exaggerated manga impact, shock-wave rings and flying splinters of light, a defender's outstretched arm too late at the edge."),
 ("m12_scoreboard", L, "A gym scoreboard on the wall: a plain dark panel with four large empty digit windows, blank with no numbers, the bleachers below it, dramatic angle."),
 ("m13_back_1", P, "A small volleyball player seen from behind wearing an orange jersey with a big number 1 on the back (the only text allowed), standing in front of a huge bright gym, narrow shoulders but a strong stance, a giant winged shadow on the wall behind."),
 ("m13_tape", L, "Taped fingers and worn-out volleyball shoes on a bench, scuffed and frayed, quiet light."),
 ("m14_rain", L, "Rain streaming down a gym window at dusk, the empty court reflected in the wet glass, a lone volleyball on the floor inside, melancholy."),
 ("m14_omikuji", P, "A paper fortune slip tied to a branch at a shrine, fluttering in the wind, plain blank paper, soft light, a few cherry blossoms."),
 ("m15_run", L, "Close-up of running feet in volleyball shoes, one foot pushing off the floor, heavy motion lines, sweat drops."),
 ("m15_run_back", L, "A player sprinting away down the court seen from behind, leaning forward, speed lines converging to the far end."),
 ("m15_chest", L, "A hand clutching the front of an orange jersey over the heart, tense knuckles, heat lines rising, close-up."),
 ("m16_dive", L, "A player diving full length to the floor to save the ball, arms stretched, the volleyball just above the fingertips, seen from floor level, decisive moment, focus lines."),
 ("m16_pass_chain", P, "A vertical chain of hands passing the volleyball upward from player to player: forearms at the bottom, fingertips in the middle, a spiking hand at the top, connected by a curving dotted trail."),
 ("m17_notebook", L, "A notebook open on a bench with hand-drawn volleyball formations made only of circles and arrows (no words), a hand holding a pencil, an eraser and a ball beside it."),
 ("m17_lying", P, "A player lying on the gym floor seen from above the head (only the hair and the top of the head, the face out of frame), arms spread, a volleyball resting on the chest, looking up at the ceiling lights, dreamy light."),
 ("m17_dream_arena", L, "A huge packed national arena seen from the court: thousands of tiny abstract crowd dots in the stands, banners without writing, a bright court below, dreamlike glow."),
 ("m18_spike_low", P, "Splash: an extreme low angle of a spiker exploding upward at the net, the arm swinging down, the volleyball streaking like an orange comet, ceiling lights flaring, maximum speed lines."),
 ("m18_crowd", L, "The crowd in the stands cheering with arms raised, drawn only as black silhouettes and screentone, waving towels, energy lines."),
 ("m19_dig_dive", L, "The libero diving low with one arm under the falling volleyball, the floor at eye level, a desperate save, dust and motion lines."),
 ("m19_ball_up", P, "The volleyball rising again above the net after a save, small against a big bright ceiling, hope."),
 ("m19_hands_stack", S, "Seen from directly above: a team's hands stacked together in the centre of a huddle, orange wristbands, the heads around cropped by the frame."),
 ("m20_board", L, "A tactics whiteboard beside the bench with a court diagram and magnets, a hand holding a marker pen about to write, the board otherwise blank."),
 ("m20_hand_up", P, "Point of view of a player who has fallen on the floor looking up: a teammate's hand reaching down to help, the teammate backlit as a black silhouette against the gym lights."),
 ("m20_stand", P, "A player standing up again seen from behind, back straight, light pouring from the court ahead, a long shadow behind."),
 ("m21_lonely_ball", P, "A vast dark empty gym, a single spotlight on the floor and one orange volleyball resting in the light (the only colour), lots of black space, silence."),
 ("m21_bench", L, "An empty team bench at dusk with a towel and a water bottle left behind, long shadows, quiet melancholy."),
 ("m22_serve_bounce", L, "A server's hand bouncing the volleyball on the floor at the service line, the shoes and the line, tension."),
 ("m22_toss_ready", P, "From behind: the server raising the volleyball overhead before the toss, the court and a packed arena ahead, breathing out, light."),
 ("m22_jump_serve", L, "A powerful jump serve at full extension, the volleyball launched with a shock wave, the server's arm and back as a silhouette, speed lines."),
 ("m23_tunnel", P, "The team's feet walking down a long dark arena tunnel toward a bright opening, light spilling in, shoes and shadows."),
 ("m23_photos", L, "Photos pinned on a locker door: snapshots of practices showing only backs, hands and the ball (no faces), a curling corner, warm memory."),
 ("m23_run_light", L, "The team running forward into blinding light seen from behind, nobody looking back, speed lines toward the light."),
 ("m24_arena_enter", P, "Splash: the team's backs at the exit of the tunnel stepping into a huge bright arena, a teal court ahead (teal allowed here), the crowd as a sea of tiny dots, banners without writing, overwhelming light."),
 ("m24_final_spike", P, "Splash, the climax: the final spike from above the net, the spiker's silhouette in a huge arc, the volleyball blazing downward in orange with fire-like speed lines, everything else black and white."),
 ("m25_ball_floor", L, "Extreme close-up of the volleyball touching the floor, the floor shaking, a small dust burst, everything still."),
 ("m25_celebrate", P, "The team jumping in celebration seen from behind, arms raised high, confetti falling, joy."),
 ("m26_dawn", P, "A calm sunrise over a quiet school with the gym roof at the bottom, a soft orange dawn sky, a few birds, fresh morning."),
]
ANCHOR = "m03_team_backs"
M = {"style": STYLE, "panels": [{"id": i, "size": s, "prompt": p, **({} if i == ANCHOR else {"ref": ANCHOR})} for i, s, p in PANELS]}
json.dump(M, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "panels.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(PANELS), "panels")
