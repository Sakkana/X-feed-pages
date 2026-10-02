"""Recompute descriptive statistics from the frozen, source-linked corpus.
Usage: python recompute_stats.py [path/to/corpus.json]
No network requests or external state changes.
"""
import json
import statistics
import sys
from collections import Counter
from pathlib import Path
source = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(__file__).with_name('corpus.json')
rows = json.loads(source.read_text())
assert len(rows) == len({r['url'] for r in rows}), 'Duplicate post URL'
by_id = {r['post_id']: r for r in rows}
metrics = ('views', 'likes', 'reposts', 'replies')

def compare(target_id, controls):
    target = by_id[target_id]
    medians = {metric: statistics.median(r[metric] for r in controls) for metric in metrics}
    return {
        'target_url': target['url'],
        'target_values': {metric: target[metric] for metric in metrics},
        'control_n': len(controls),
        'control_ids': [r['post_id'] for r in controls],
        'control_medians': medians,
        'lift': {metric: target[metric] / value if value != 0 else None for metric, value in medians.items()},
        'zero_denominator_policy': 'null means undefined, never infinite',
        'window': 'Cumulative snapshots at different post ages; not 24h performance',
    }

lioba_base = [r for r in rows if r['account'] == 'liobaheimbach' and r['analysis_role'] == 'baseline_10']
lioba_topic_ids = ['2090788904362201214', '2089375766773403874', '2084606612367437998', '2082935693094043773', '2082594220863549945']
valk_base = [r for r in rows if r['account'] == '0xValkyrie_ai' and r['analysis_role'] == 'baseline_10']
valk_quotes = [r for r in rows if r['account'] == '0xValkyrie_ai' and r['analysis_role'] == 'same_format_control']
assert len(lioba_base) == len(valk_base) == 10
assert all(r['root_verified'] for r in lioba_base + valk_base)
results = {
    'row_count': len(rows),
    'account_counts': dict(Counter(r['account'] for r in rows)),
    'qualified_account_count': 2,
    'Lioba_primary': compare('2103147621166497914', lioba_base),
    'Lioba_topic_controls': compare('2103147621166497914', [by_id[x] for x in lioba_topic_ids]),
    'Valkyrie_primary': compare('2105185832160100517', valk_base),
    'Valkyrie_format_controls': compare('2105185832160100517', valk_quotes),
}
assert results['Lioba_primary']['control_medians']['views'] == 1235.5
assert results['Valkyrie_primary']['control_medians']['views'] == 195
assert results['Valkyrie_primary']['lift']['likes'] is None
print(json.dumps(results, ensure_ascii=False, indent=2))
