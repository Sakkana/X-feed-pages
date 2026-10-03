"""Skip model download entirely when this shard's source-bound text cache is warm."""
import argparse,hashlib,importlib.util,json,pathlib
ROOT=pathlib.Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('translate',ROOT/'scripts/translate-english.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
p=argparse.ArgumentParser();p.add_argument('--shard',type=int,default=0);p.add_argument('--shards',type=int,default=1);a=p.parse_args()
s=json.loads((ROOT/'.translation/source.json').read_text());missing=0;selected=0
for k,v in s['inputs'].items():
 if int(k[:8],16)%a.shards!=a.shard:continue
 selected+=1;key=hashlib.sha256((m.VERSION+v['html']).encode()).hexdigest();f=ROOT/'.translation/cache'/(key+'.json')
 try:
  cached=json.loads(f.read_text())
  if cached['version']!=m.VERSION or cached['source']!=v['html'] or cached['id']!=k:missing+=1
 except (OSError,ValueError,KeyError):missing+=1
print(f'missing={missing}');print(f'selected={selected}')
