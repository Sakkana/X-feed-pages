#!/usr/bin/env bash
set -euo pipefail
RUNTIME="$RUNNER_TEMP/x-feed-madlad"
mkdir -p "$RUNTIME" translation-evidence
# Model stays in temporary runtime storage, outside the explicitly enumerated evidence artifact.
python3 - "$RUNTIME" <<'PY'
import hashlib,json,pathlib,sys,urllib.request
root=pathlib.Path(sys.argv[1]);config=json.load(open('scripts/madlad-config.json'));verified=[]
for f in config['files']:
 p=root/f['name'];url=f"https://huggingface.co/{config['model']}/resolve/{config['revision']}/{f['name']}"
 with urllib.request.urlopen(url,timeout=120) as src,p.open('wb') as dst:
  while chunk:=src.read(1024*1024):dst.write(chunk)
 actual=hashlib.file_digest(p.open('rb'),'sha256').hexdigest()
 if p.stat().st_size!=f['bytes'] or actual!=f['sha256']:raise RuntimeError('Verified download mismatch: '+f['name'])
 verified.append({'name':f['name'],'bytes':p.stat().st_size,'sha256':actual,'url':url});print('Verified '+f['name'],flush=True)
pathlib.Path('translation-evidence/downloads.json').write_text(json.dumps(verified,indent=2))
PY
cp "$RUNTIME/config.json" translation-evidence/model-config.json
cp "$RUNTIME/README.md" translation-evidence/model-card.md
cp scripts/madlad-config.json translation-evidence/experiment-config.json
cp scripts/madlad-probe/Cargo.lock translation-evidence/Cargo.lock
cp scripts/madlad-probe/src/main.rs translation-evidence/inference-main.rs
