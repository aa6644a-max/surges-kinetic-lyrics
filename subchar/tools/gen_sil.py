"""Generate flat black silhouettes with Codex CLI image generation -> subchar/sil/raw/<id>.png.
They are tinted in code (black = shape), so every prompt asks for pure black on pure white.
  python subchar/tools/gen_sil.py [--only id,id] [--force]"""
import argparse, os, shutil, subprocess, sys, time
HERE = os.path.dirname(os.path.abspath(__file__)); RAW = os.path.normpath(os.path.join(HERE, "..", "sil", "raw"))
STYLE = ("A single flat silhouette: solid pure black (#000000) shape on a pure white (#FFFFFF) background, no gray, no gradients, "
         "no outlines, no texture, no text, no ground shadow. Crisp clean vector-like edges, elegant proportions like a modern "
         "motion-graphics illustration. Original character, anatomically correct. The shape is centered with generous white margins.")
SIL = {
 "boy_back": ("1024x1536", "Full body of a teenage boy seen from behind, walking away from the viewer, short messy hair, hoodie, hands in pockets, mid-stride."),
 "girl_profile": ("1024x1536", "Head and shoulders of a teenage girl in side profile facing right, long straight hair flowing slightly behind her, calm expression readable only from the outline of nose and lips."),
 "legs_walk": ("1536x1024", "On a completely white background: a pair of legs from the knees down wearing sneakers, walking to the right, mid-stride, seen from the side, filled solid black. The background must stay pure white; only the legs are black."),
 "hand_reach": ("1024x1536", "A slender hand and forearm reaching upward from the bottom edge of the image, fingers gently open as if about to catch something small above it."),
}
def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--only"); ap.add_argument("--force", action="store_true"); a = ap.parse_args()
    os.makedirs(RAW, exist_ok=True); codex = shutil.which(os.environ.get("CODEX_BIN", "codex")) or sys.exit("codex CLI not found")
    only = set(a.only.split(",")) if a.only else None; failed = []
    for sid, (size, prompt) in SIL.items():
        out = os.path.join(RAW, sid + ".png")
        if (only and sid not in only) or (os.path.exists(out) and not a.force): continue
        text = (f"Use your image generation tool to create exactly ONE image, size {size}.\nSave it as a PNG file at this exact path: {out}\n"
                "Do not create or modify any other file and do not run anything else. Reply DONE when the file exists.\n\n"
                f"IMAGE PROMPT:\n{STYLE}\n{prompt}")
        print("->", sid, flush=True); t0 = time.time()
        subprocess.run([codex, "exec", "-s", "workspace-write", "--skip-git-repo-check", "-C", RAW, "-"], input=text, text=True, encoding="utf-8")
        print("   ok" if os.path.exists(out) else "   FAILED", f"({time.time()-t0:.0f}s)", flush=True)
        if not os.path.exists(out): failed.append(sid)
    if failed: sys.exit("failed: " + ",".join(failed))
if __name__ == "__main__": main()
