"""Anime-style character art with Codex CLI image generation -> subchar/art/raw/<id>.png (flat green background for keying).
The first image is the style/character anchor; the others attach it as a reference so the two characters stay the same.
  python subchar/tools/gen_art.py [--only id,id] [--force]"""
import argparse, os, shutil, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.normpath(os.path.join(HERE, "..", "art", "raw"))
STYLE = ("Japanese anime illustration for a music video, clean cel shading with two tones of shadow, crisp thin lineart, vibrant "
         "pastel colors with deep navy shadows, soft rim light. Original characters (not from any existing work), anatomically "
         "correct. CHARACTERS: 'ME' = a teenage girl with long straight black hair with a light-blue inner color, a navy sailor "
         "school uniform with a pink ribbon; 'YOU' = a teenage boy with messy dark-brown hair in a plain white hoodie. "
         "The character is isolated on a perfectly flat pure chroma-green (#00FF00) background filling the rest of the canvas: "
         "no green inside the character, no shadow on the background, no text, no logo.")
MEMSTYLE = ("Japanese anime illustration for a music video, a nostalgic school memory, full scene with a detailed background, warm soft light, "
            "gentle film grain, cel shading with crisp lineart. Original characters (not from any existing work): 'ME' = a teenage girl with long "
            "straight black hair with a light-blue inner color, a navy sailor school uniform with a pink ribbon; 'YOU' = a teenage boy with messy "
            "dark-brown hair in a white hoodie over a school uniform. YOU is always the center of attention; ME is always small, at the edge or in "
            "the background, quietly watching him. No text, no logo.")
ART = [
 ("me_profile", "1024x1536", "ME, head and shoulders in side profile facing right, a quiet longing expression, hair slightly moving in the wind."),
 ("you_back", "1024x1536", "YOU, full body seen from behind walking away from the viewer, hands in hoodie pocket, mid-stride."),
 ("me_legs", "1536x1024", "ME, only the legs from the knees down in navy socks and white sneakers, walking to the right, mid-stride, side view."),
 ("me_back", "1024x1536", "ME, seen from behind from the waist up, walking away from the viewer, long black hair with the light-blue inner color swaying, navy sailor collar visible, head slightly raised as if watching someone far ahead. The figure is cut off by the bottom edge of the image at the waist."),
 ("me_hand", "1024x1536", "ME, a slender hand and forearm with the navy uniform sleeve reaching upward from the bottom edge, fingers open as if trying to catch something."),
 ("you_front", "1024x1536", "YOU, upper body facing the viewer, a warm confident smile, lit by a bright golden stage spotlight from above, hands relaxed, the star of the show."),
 ("me_cry", "1024x1536", "ME, close-up of the face and shoulders facing the viewer, eyes glistening with tears about to fall, biting her lip, a hurt and envious expression."),
 ("you_sit", "1024x1536", "YOU, full body sitting alone on the floor hugging his knees, head resting on his arms, looking tired and hurt, seen from a slight side angle."),
 ("me_reach", "1024x1536", "ME, upper body leaning forward toward the viewer, one hand stretched out toward the camera with fingers open, a desperate hopeful expression, hair flying forward."),
 ("hands_hold", "1536x1024", "Close-up of two hands meeting in the middle and clasping: from the left ME's slender hand with the navy sailor uniform sleeve, from the right YOU's hand with the white hoodie sleeve. Only hands and forearms."),
 ("you_turn", "1024x1536", "YOU, full body seen from behind but turning his head and shoulders back over his shoulder toward the viewer with a gentle kind smile, one hand slightly reaching back."),
("you_stage", "1024x1536", "YOU, upper body on a concert stage singing into a handheld microphone with eyes closed, one hand raised, colorful stage lights and confetti around him, energetic and shining."),
 ("you_crowd", "1024x1536", "YOU, upper body laughing happily in the center, surrounded by several cheerful classmates whose faces are cropped or out of focus at the edges, everyone clearly loves him."),
 ("me_angry", "1024x1536", "ME, upper body facing the viewer, fists clenched at her chest, glaring with tears in her eyes, frustrated and bitter, strands of hair across her face."),
 ("me_envy", "1024x1536", "ME, half hidden behind the edge of a wall, peeking out sideways with one hand on the wall, quietly envious sad eyes looking at something off to the side."),
 ("me_mirror", "1024x1536", "ME, upper body in profile facing right, one palm pressed flat against an invisible mirror surface in front of her, forehead almost touching it, lonely expression."),
 ("me_sit_dark", "1024x1536", "ME, full body sitting on the floor hugging her knees, face buried in her arms, long hair falling around her, small and alone."),
 ("me_write", "1024x1536", "ME, upper body seen from the side sitting at a desk, erasing words in a notebook with a pink eraser, a pencil in the other hand, eyes wet, crumpled paper nearby."),
 ("me_script", "1024x1536", "ME, upper body facing the viewer holding a stack of script pages against her chest, crumpling the edge with her fingers, looking down with a bitter smile."),
 ("both_apart", "1536x1024", "ME on the left and YOU on the right, both full body seen from behind, walking away from each other in opposite directions, a wide empty gap between them."),
 ("me_run", "1024x1536", "ME, full body running toward the viewer with determination, hair and skirt flying, one arm swinging forward, dynamic foreshortening."),
 ("you_hand", "1024x1536", "YOU, upper body facing the viewer, a gentle warm smile, holding his open hand out toward the camera as if offering to take the viewer's hand."),
 ("me_smile", "1024x1536", "ME, close-up of the face and shoulders facing the viewer, smiling brightly with tears still in her eyes, relieved and hopeful, soft golden light."),
 ("you_sing_side", "1024x1536", "YOU, full body in exact side view facing RIGHT, standing on a stage and singing into a handheld microphone held at his mouth with his right hand, the other arm relaxed, eyes closed, calm and confident posture, feet visible, lit from the upper right by a warm spotlight."),
 ("mem_entrance", "1536x1024", "MEM: school entrance ceremony under falling cherry blossoms, YOU laughing with new friends in the middle, ME standing alone at the side holding her bag, seeing him for the first time."),
 ("mem_class", "1536x1024", "MEM: a sunny classroom at break time, YOU sitting on a desk surrounded by laughing classmates, ME at the back seat by the window watching over her book."),
 ("mem_race", "1536x1024", "MEM: sports day relay race, YOU breaking the finish tape with arms raised while the crowd cheers, ME small among the spectators behind the rope."),
 ("mem_festival", "1536x1024", "MEM: school festival concert in the gym, YOU singing on stage with a band under colorful lights, ME in the dark audience at the very back."),
 ("mem_rain", "1536x1024", "MEM: a rainy afternoon at the school gate, YOU sharing an umbrella with friends and laughing, ME alone under the building eaves without an umbrella."),
 ("mem_library", "1536x1024", "MEM: a quiet library in afternoon light, YOU studying at a table by the window, ME hiding behind a bookshelf peeking at him over an open book."),
 ("mem_lunch", "1536x1024", "MEM: a busy school cafeteria, YOU at the center table with many friends, ME eating alone at a small corner table."),
 ("mem_sunset", "1536x1024", "MEM: walking home along a riverside road at sunset, YOU and his friends ahead laughing, ME far behind following at a distance, long shadows."),
 ("mem_rooftop", "1536x1024", "MEM: school rooftop at lunch under a blue sky, YOU laughing with friends sitting in a circle, ME alone by the fence holding a bread roll."),
 ("mem_photo", "1536x1024", "MEM: a class group photo in front of the school, YOU in the middle of the front row making a peace sign, ME at the far edge of the frame half cut off."),
 ("mem_award", "1536x1024", "MEM: an award ceremony in the school hall, YOU on the stage receiving a trophy, ME clapping quietly in the back rows."),
]
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--only"); ap.add_argument("--force", action="store_true"); a = ap.parse_args()
    os.makedirs(RAW, exist_ok=True); codex = shutil.which(os.environ.get("CODEX_BIN", "codex")) or sys.exit("codex CLI not found")
    only = set(a.only.split(",")) if a.only else None; anchor = os.path.join(RAW, ART[0][0] + ".png"); failed = []
    for aid, size, prompt in ART:
        out = os.path.join(RAW, aid + ".png")
        if (only and aid not in only) or (os.path.exists(out) and not a.force): continue
        ref = aid != ART[0][0] and os.path.exists(anchor)
        text = (f"Use your image generation tool to create exactly ONE image, size {size}.\n"
                + ("The attached image is the style and character reference: keep the same drawing style and the same character designs.\n" if ref else "")
                + f"Save it as a PNG file at this exact path: {out}\nDo not create or modify any other file and do not run anything else. Reply DONE when the file exists.\n\n"
                + (f"IMAGE PROMPT:\n{MEMSTYLE}\n{prompt[5:]}" if prompt.startswith("MEM: ") else f"IMAGE PROMPT:\n{STYLE}\n{prompt}"))
        cmd = [codex, "exec"] + (["-i", anchor] if ref else []) + ["-s", "workspace-write", "--skip-git-repo-check", "-C", RAW, "-"]
        print("->", aid, flush=True); t0 = time.time(); subprocess.run(cmd, input=text, text=True, encoding="utf-8")
        print("   ok" if os.path.exists(out) else "   FAILED", f"({time.time()-t0:.0f}s)", flush=True)
        if not os.path.exists(out): failed.append(aid)
    if failed: sys.exit("failed: " + ",".join(failed))
if __name__ == "__main__": main()
