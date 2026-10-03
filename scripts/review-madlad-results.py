"""Mechanical diagnostics only. An exit code of zero never means financial semantics passed."""
import importlib.util,json,pathlib,re
root=pathlib.Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('checks',root/'scripts/test-html-translation.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
raw=root/'translation-evidence/madlad-raw.jsonl';results=[]
for line in raw.read_text().splitlines():
 r=json.loads(line);source=r['input']['source_text'];out=r.get('output','');errors=[]
 if r.get('error'):errors.append(r['error'])
 if r.get('truncated'):errors.append('decoder did not reach EOS within 512 output tokens')
 if not out:errors.append('empty output')
 if re.search('[\u3400-\u9fff]',out):errors.append('untranslated Chinese')
 if m.canonical_numbers(source)!=m.canonical_numbers(out):errors.append('number/sign/percentage multiset changed (human check needed for equivalent written dates)')
 for token in set(re.findall(r'[A-Za-z][A-Za-z0-9_-]*',source)):
  if token not in re.findall(r'[A-Za-z][A-Za-z0-9_-]*',out):errors.append('source token absent: '+token)
 results.append({'raw':r,'mechanical_errors':errors,'human_semantic_review':'required; not inferred from mechanical checks'})
(root/'translation-evidence/madlad-review.json').write_text(json.dumps(results,ensure_ascii=False,indent=2))
print(json.dumps(results,ensure_ascii=False,indent=2))
if len(results)!=5 or any(r['mechanical_errors'] for r in results):raise SystemExit(1)
