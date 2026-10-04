"""Generate the scene plates in ../plates/plates.json with Codex CLI image generation.

  python ashita/tools/gen_plates.py                 # every plate that has no raw/<id>.png yet
  python ashita/tools/gen_plates.py --only s01_sky  # one plate (comma-separated list works too)
  python ashita/tools/gen_plates.py --force ...     # regenerate even if the file exists
  python ashita/tools/gen_plates.py --dry           # print the instructions only (paste them anywhere)

Each plate becomes one `codex exec` call that asks Codex to create the image and save it to
plates/raw/<id>.png. A plate with "ref" attaches that plate's raw image (-i) so the whole set keeps
one painting style; generate and approve the "anchor" plate first.
Extra codex arguments: CODEX_ARGS="--model gpt-5 ..."   Other binary: CODEX_BIN=/path/to/codex
If Codex saves the image somewhere else, the newest PNG under ~/.codex written during the call is
copied into place."""
import argparse, glob, json, os, shlex, shutil, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
PL = os.path.normpath(os.path.join(HERE, "..", "plates"))
RAW = os.path.join(PL, "raw")

def instruction(M, p, out, with_ref):
    key = M["keys"].get(p.get("key", ""), "")
    ref = ("The attached image is the style reference: match its painting style, brushwork, palette and lighting exactly, "
           "but paint the new scene described below.\n") if with_ref else ""
    return (f"Use your image generation tool to create exactly ONE image, size {p['size']} "
            f"({'portrait' if p['size'].startswith('1024x') else 'landscape'}).\n{ref}"
            f"Save it as a PNG file at this exact path: {out}\n"
            "Do not create or modify any other file and do not run anything else. Reply DONE when the file exists.\n\n"
            f"IMAGE PROMPT:\n{M['style']}\n{p['prompt']}\n{key}").strip()

def newest_codex_png(since):
    c = [f for f in glob.glob(os.path.expanduser("~/.codex/**/*.png"), recursive=True) if os.path.getmtime(f) >= since]
    return max(c, key=os.path.getmtime) if c else None

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--only"); ap.add_argument("--force", action="store_true"); ap.add_argument("--dry", action="store_true")
    a = ap.parse_args()
    M = json.load(open(os.path.join(PL, "plates.json"), encoding="utf-8"))
    os.makedirs(RAW, exist_ok=True)
    only = set(a.only.split(",")) if a.only else None
    todo = [p for p in M["plates"] if (only is None or p["id"] in only) and (a.force or not os.path.exists(os.path.join(RAW, p["id"] + ".png")))]
    codex = os.environ.get("CODEX_BIN", "codex")
    if not a.dry:
        found = shutil.which(codex)   # resolves codex.cmd on Windows, which subprocess cannot find by bare name
        if not found: sys.exit(f"codex CLI not found ({codex}); install it or set CODEX_BIN")
        codex = found
    failed = []
    for p in todo:
        out = os.path.join(RAW, p["id"] + ".png")
        cmd = [codex, "exec"]
        ref = os.path.join(RAW, p["ref"] + ".png") if p.get("ref") else None
        if ref and os.path.exists(ref): cmd += ["-i", ref]          # before the other flags: --image takes several values
        elif ref: print(f"  ! {p['id']}: reference {p['ref']} not generated yet, going without it")
        text = instruction(M, p, out, "-i" in cmd)
        cmd += ["-s", "workspace-write", "--skip-git-repo-check", "-C", RAW]   # --full-auto was removed from newer codex + shlex.split(os.environ.get("CODEX_ARGS", ""))
        if a.dry:
            print(f"==== {p['id']}  ({' '.join(shlex.quote(c) for c in cmd)} -)\n{text}\n"); continue
        print(f"-> {p['id']} ...", flush=True); t0 = time.time()
        if os.path.exists(out): os.remove(out)
        r = subprocess.run(cmd + ["-"], input=text, text=True, encoding="utf-8")
        if not os.path.exists(out):
            alt = newest_codex_png(t0)
            if alt: shutil.copy(alt, out); print(f"   copied from {alt}")
        if os.path.exists(out): print(f"   ok ({time.time() - t0:.0f}s)")
        else: failed.append(p["id"]); print(f"   FAILED (codex exit {r.returncode})")
    if failed: sys.exit("failed: " + ",".join(failed))
    if not a.dry: print("done — next: python ashita/tools/prep_plates.py")

if __name__ == "__main__":
    main()
