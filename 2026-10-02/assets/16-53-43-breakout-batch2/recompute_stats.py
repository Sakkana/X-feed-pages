"""Recompute snapshot statistics offline: python recompute_stats.py [corpus.json]."""
import json, sys
from collections import Counter
from datetime import datetime
from pathlib import Path
from statistics import median

path=Path(sys.argv[1]) if len(sys.argv)>1 else Path(__file__).with_name('corpus.json')
rows=json.loads(path.read_text())
assert len({r['url'] for r in rows})==len(rows)
metrics=('views','likes','reposts','replies')
assert all(isinstance(r[m],int) and r[m]>=0 for r in rows for m in metrics)
targets=[r for r in rows if r['analysis_role']=='qualified_outlier']
results={}
for target in targets:
    base=[r for r in rows if r['account']==target['account'] and r['analysis_role']=='baseline_10']
    assert len(base)==10 and all(r['root_verified'] and not r['pinned_observed'] and not r['ad_label_observed'] for r in base)
    assert all(r['original_publication_utc']<target['original_publication_utc'] for r in base)
    groups={'all_10':base,'same_format_text_9':[r for r in base if r['same_format_text_control']],
            'ai_topic_4':[r for r in base if r['ai_topic_control']],
            'ai_topic_same_format_text_3':[r for r in base if r['ai_topic_control'] and r['same_format_text_control']]}
    comparison={}
    for name,group in groups.items():
        med={m:median(r[m] for r in group) for m in metrics}
        comparison[name]={'n':len(group),'post_ids':[r['post_id'] for r in group],
            'medians':med,'lift':{m:target[m]/med[m] if med[m] else None for m in metrics},
            'views_range':[min(r['views'] for r in group),max(r['views'] for r in group)],
            'snapshot_age_days_range':[min(r['age_days_at_snapshot'] for r in group),max(r['age_days_at_snapshot'] for r in group)]}
    results[target['account']]={'target_url':target['url'],'target_metrics':{m:target[m] for m in metrics},
        'target_age_days':target['age_days_at_snapshot'],'comparisons':comparison}
out={'records':len(rows),'accounts':dict(Counter(r['account'] for r in rows)),
     'qualified_accounts':len(results),'zero_denominator_policy':'null / undefined; never infinity',
     'metric_window':'cumulative snapshots, not fixed 24h or 72h performance','results':results}
print(json.dumps(out,ensure_ascii=False,indent=2))
