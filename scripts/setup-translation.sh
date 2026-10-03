#!/usr/bin/env bash
set -euo pipefail
# Only official, checksum-pinned downloads. Never upload/cache model weights.
RUNTIME="${RUNNER_TEMP:-/tmp}/x-feed-translation"
mkdir -p "$RUNTIME"
python3 - "$RUNTIME" <<'PY'
import hashlib,json,pathlib,sys,urllib.request
root=pathlib.Path(sys.argv[1]); c=json.load(open('scripts/translation-config.json'))
for name,url,expected in [('engine.tar.gz',c['engineUrl'],c['engineSha256']),('model.gguf',f"https://huggingface.co/{c['model']}/resolve/{c['revision']}/{c['file']}",c['sha256'])]:
 p=root/name
 if not p.exists():
  with urllib.request.urlopen(url,timeout=120) as src,p.open('wb') as dst:
   while chunk:=src.read(1024*1024):dst.write(chunk)
 h=hashlib.file_digest(p.open('rb'),'sha256').hexdigest()
 if h!=expected:raise RuntimeError(f'Checksum mismatch: {name}')
 print(f'Verified {name}: {p.stat().st_size} bytes',flush=True)
PY
tar -xzf "$RUNTIME/engine.tar.gz" -C "$RUNTIME"
SERVER="$(find "$RUNTIME" -name llama-server -type f | head -1)"
export LD_LIBRARY_PATH="$(dirname "$SERVER"):${LD_LIBRARY_PATH:-}"
"$SERVER" -m "$RUNTIME/model.gguf" --host 127.0.0.1 --port 8088 --ctx-size 4096 --threads 4 --parallel 1 --n-gpu-layers 0 --jinja --reasoning-format none > "$RUNTIME/server.log" 2>&1 &
echo $! > "$RUNTIME/server.pid"
python3 - <<'PY'
import time,urllib.request
for i in range(180):
 try:
  if urllib.request.urlopen('http://127.0.0.1:8088/health',timeout=2).status==200:break
 except Exception:time.sleep(1)
else:raise RuntimeError('Local CPU translation server did not start')
PY
