"""First-person (ME's point of view) illustrations for the FEED video, with the Codex CLI image tool.
ME is the viewer: her face is never shown (only her hands, her things, her reflection at most); YOU is always what she
looks at. Existing art is attached as the style / character reference so the drawing and the two characters stay the same.
  python subchar/tools/gen_pov.py [--only id,id] [--force]      -> subchar/art/<id>.png"""
import argparse, os, shutil, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__)); ART = os.path.normpath(os.path.join(HERE, "..", "art"))
REFS = [os.path.join(ART, f) for f in ("you_front.png", "me_profile.png", "mem_sunset.png")]
STYLE = ("Japanese anime illustration for a music video, clean cel shading with crisp thin lineart, soft cinematic light, detailed "
         "background, gentle film grain. Original characters (not from any existing work): 'YOU' = a teenage boy with messy dark-brown "
         "hair, a plain white hoodie over a school uniform with a striped tie, warm smile (as in the first reference image); 'ME' = a "
         "teenage girl with long straight black hair with a light-blue inner color, navy sailor uniform with a pink ribbon (as in the "
         "second reference). FIRST-PERSON POINT OF VIEW: the camera is ME's eyes. ME's face is never visible. YOU is the subject she "
         "is looking at. Tasteful, no text, no logo, no watermark.")
PORTRAIT_STYLE = STYLE.split(" FIRST-PERSON")[0] + " Tasteful, no text, no logo, no watermark."   # for ME's own photos (her profile picture)
POV = [
 ("pov_backrow", "1024x1536", "From the last seat at the back of a sunny classroom at break time: in the lower foreground ME's hands rest on an open notebook and a pencil on her desk; far ahead at the front of the room YOU sits on a desk laughing, surrounded by classmates who all look at him. Long depth, YOU small but clearly the centre of attention."),
 ("pov_hallway", "1024x1536", "Down a long school hallway in morning light: YOU walks away from the viewer with two friends, seen from behind, hands in his hoodie pocket. The viewer stands still far behind; the hallway feels long and the distance large."),
 ("pov_window", "1024x1536", "Looking out through a classroom window on an upper floor: ME's hand rests flat on the glass in the foreground; far below on the sunny sports field YOU crosses the finish line of a relay race with his arms raised while classmates cheer. The window frame crops the view."),
 ("pov_stage", "1024x1536", "From the very back of a dark school auditorium during a festival concert: the silhouettes of many audience heads and raised phones fill the lower foreground; far away on a bright stage under colourful lights YOU sings into a microphone. ME is lost in the dark crowd."),
 ("pov_rain", "1024x1536", "From under the eaves of the school entrance on a rainy afternoon: rain falls in sheets in front of the viewer; across the wet schoolyard YOU walks away laughing under an umbrella shared with friends. The foreground is dark and dry, the world beyond is grey and wet. ME has no umbrella."),
 ("pov_selfie", "1024x1536", "A phone front-camera view in a dim bedroom: the girl ME's face is mostly hidden behind her long black hair and her own hand, only one tired eye partly visible, cool screen light, a lonely mood. (This is the only image where part of ME is seen, and it is hidden.)"),
 ("pov_night", "1024x1536", "Late at night in a dark bedroom: ME sits on her bed, her knees under a blanket in the lower foreground, holding a glowing smartphone whose screen is not readable; a window beside shows city lights and rain drops. Quiet, lonely, blue and dark. She is completely ALONE: no other person anywhere in the picture, no boy, only her knees, the blanket and her two hands holding the phone."),
 ("me_pin", "1024x1024", "A simple top-down photo of a small coral-pink hair pin lying on an open school notebook with faint pencil lines, soft window light, lots of calm empty space. No person."),
 ("pov_turn", "1024x1536", "On the school rooftop at sunset: YOU stands by the fence, turns back toward the viewer with a gentle kind smile and holds his open hand out toward the viewer, as if saying come here. Warm golden light, wind in his hair."),
 ("pov_hands", "1536x1024", "First-person close view at sunset: ME's hand (navy sailor sleeve) holds YOU's hand (white hoodie sleeve), fingers interlaced, reaching forward from the bottom of the frame into warm golden light over the city. Only hands and forearms."),
 ("pov_zoom", "1024x1536", "First person in a busy school cafeteria at lunch: ME's two hands (navy sailor sleeves) hold up a smartphone in the foreground; the phone screen shows the camera zoomed in on YOU far across the room, laughing with friends at a table; beyond the phone the real room is soft and far. She is secretly looking at him."),
 ("pov_you_alone", "1024x1536", "First person from the bottom of an empty school stairwell at dusk: YOU sits alone halfway up the stairs, head down, arms on his knees, his phone dark in his hand; cold blue shadows with one last orange light from a high window; no one else around. For the first time he looks lonely and hurt."),
 ("pov_empty_stage", "1024x1536", "First person standing alone on the empty school festival stage after the show: looking down and out, one spotlight circle on the floor around her feet (navy pleated skirt hem and black school shoes visible at the bottom), rows of empty seats in the dark hall, confetti scattered on the stage floor. Quiet, bittersweet. NO PEOPLE at all: the hall and every seat are completely empty, nobody in the audience, nobody looking back."),
 ("me_portrait", "1024x1024", "PORTRAIT: The profile picture of the girl ME: front-facing, head and shoulders, centred, looking at the camera with a small shy smile, soft window light, plain pale background. Simple and clean, suitable for a round avatar."),
 # the outro: ME trying things for herself (her own photos now, candid, taken by a friend or on a timer)
 ("me_guitar", "1024x1536", "PORTRAIT: ME practicing an acoustic guitar alone in an after-school music room, warm sunlight through the window, concentrating on the chords, a small proud smile. Candid photo."),
 ("me_paint", "1024x1536", "PORTRAIT: ME painting a big canvas in the school art room, a smear of coral paint on her cheek, laughing, brushes in hand, warm afternoon light. She is ALONE in the room: no other person, no boy anywhere. Candid photo."),
 ("me_speech", "1024x1536", "PORTRAIT: ME standing at the front of a classroom giving a presentation, holding note cards, a little nervous but brave, the backs of a few listening classmates' heads in the lower foreground. Candid photo."),
 ("me_dance", "1024x1536", "PORTRAIT: ME dancing alone in an empty dance practice room with a wall mirror, mid-spin, her long hair flying, golden evening light, joyful. Candid photo."),
 ("me_friend", "1024x1536", "PORTRAIT: ME laughing with a new girl friend (short brown bob hair, same uniform) while sharing snacks on a bench in the schoolyard, candid and warm, both happy. Candid photo."),
 ("pov_sky", "1024x1536", "A photo ME took herself: looking up at a wide clear evening sky from the rooftop, a few pink clouds, the top edge of the fence and a paper plane gliding across. Hopeful and open. No person."),
]
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--only"); ap.add_argument("--force", action="store_true"); a = ap.parse_args()
    codex = shutil.which(os.environ.get("CODEX_BIN", "codex")) or sys.exit("codex CLI not found")
    only = set(a.only.split(",")) if a.only else None; failed = []
    refs = [r for r in REFS if os.path.exists(r)]
    for aid, size, prompt in POV:
        out = os.path.join(ART, aid + ".png")
        if (only and aid not in only) or (os.path.exists(out) and not a.force): continue
        text = (f"Use your image generation tool to create exactly ONE image, size {size}.\n"
                "The attached images are the style and character references: keep the same drawing style and the same character designs "
                "(the boy in the first image is YOU, the girl in the second is ME, the third shows the painted scene style).\n"
                f"Save it as a PNG file at this exact path: {out}\nDo not create or modify any other file and do not run anything else. Reply DONE when the file exists.\n\n"
                f"IMAGE PROMPT:\n{PORTRAIT_STYLE if prompt.startswith('PORTRAIT: ') else STYLE}\n{prompt.removeprefix('PORTRAIT: ')}")
        cmd = [codex, "exec"] + sum((["-i", r] for r in refs), []) + ["-s", "workspace-write", "--skip-git-repo-check", "-C", ART, "-"]
        print("->", aid, flush=True); t0 = time.time(); subprocess.run(cmd, input=text, text=True, encoding="utf-8", stdout=subprocess.DEVNULL)
        print("   ok" if os.path.exists(out) else "   FAILED", f"({time.time() - t0:.0f}s)", flush=True)
        if not os.path.exists(out): failed.append(aid)
    if failed: sys.exit("failed: " + ",".join(failed))
if __name__ == "__main__": main()
