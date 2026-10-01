"""Generate the manga panels in ../manga/panels.json with Codex CLI image generation, several at a time.

  python orange/tools/gen_panels.py                    # every panel without raw/<id>.png
  python orange/tools/gen_panels.py --only m03_team    # some panels (comma-separated)
  python orange/tools/gen_panels.py --force --workers 3
Each panel is one `codex exec` call that saves orange/manga/raw/<id>.png. A panel with "ref" attaches that panel's raw
image so the whole book keeps one drawing style (generate and approve the anchor first)."""
import argparse, json, os, shutil, subprocess, sys, time
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
MG = os.path.normpath(os.path.join(HERE, "..", "manga"))
RAW = os.path.join(MG, "raw")

def instruction(M, p, out, with_ref):
    ref = ("The attached image is the style reference: match its drawing style, line weight, screentone and the single orange spot "
           "colour exactly, but draw the new panel described below.\n") if with_ref else ""
    return (f"Use your image generation tool to create exactly ONE image, size {p['size']}.\n{ref}"
            f"Save it as a PNG file at this exact path: {out}\n"
            "Do not create or modify any other file and do not run anything else. Reply DONE when the file exists.\n\n"
            f"IMAGE PROMPT:\n{M['style']}\n{p['prompt']}").strip()

def run(codex, M, p):
    out = os.path.join(RAW, p["id"] + ".png")
    cmd = [codex, "exec"]
    ref = os.path.join(RAW, p["ref"] + ".png") if p.get("ref") else None
    if ref and os.path.exists(ref): cmd += ["-i", ref]
    cmd += ["-s", "workspace-write", "--skip-git-repo-check", "-C", RAW]
    t0 = time.time()
    if os.path.exists(out): os.remove(out)
    r = subprocess.run(cmd + ["-"], input=instruction(M, p, out, "-i" in cmd), text=True, encoding="utf-8", capture_output=True)
    ok = os.path.exists(out)
    print(f"{'ok  ' if ok else 'FAIL'} {p['id']} ({time.time() - t0:.0f}s){'' if ok else ' codex exit ' + str(r.returncode)}", flush=True)
    return p["id"], ok

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--only"); ap.add_argument("--force", action="store_true"); ap.add_argument("--workers", type=int, default=3)
    a = ap.parse_args()
    M = json.load(open(os.path.join(MG, "panels.json"), encoding="utf-8"))
    os.makedirs(RAW, exist_ok=True)
    only = set(a.only.split(",")) if a.only else None
    todo = [p for p in M["panels"] if (only is None or p["id"] in only) and (a.force or not os.path.exists(os.path.join(RAW, p["id"] + ".png")))]
    codex = shutil.which(os.environ.get("CODEX_BIN", "codex"))
    if not codex: sys.exit("codex CLI not found")
    print(f"{len(todo)} panels, {a.workers} at a time", flush=True)
    with ThreadPoolExecutor(a.workers) as ex: res = list(ex.map(lambda p: run(codex, M, p), todo))
    failed = [i for i, ok in res if not ok]
    if failed: sys.exit("failed: " + ",".join(failed))
    print("done")

if __name__ == "__main__":
    main()
