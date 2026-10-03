"""Apply one documented T5 attention correction to checksum-verified official Candle 0.9.1.
No model weights are changed. Reference: Hugging Face transformers v4.23.1 modeling_t5.py.
"""
import difflib,hashlib,math,pathlib,sys
root=pathlib.Path(__file__).resolve().parent.parent
crate=root/'scripts/madlad-probe/vendor/candle-transformers'
p=crate/'src/models/quantized_t5.rs';original=p.read_text()
assert hashlib.sha256(original.encode()).hexdigest()=='283f82a73accd79a60cdf9b932fb0c1f301d204a568e387ce6565d59f829ec8f','unexpected upstream module'
text=original
start=text.index('                    // This only handles the bidirectional case.')
end=text.index('                    let relative_buckets =',start)
text=text[:start]+'''                    let kv_len = k.dim(2)?;
                    let relative_position = t5_relative_buckets(q_len as u32, kv_len as u32,
                        self.is_decoder, self.use_cache,
                        self.relative_attention_num_buckets as u32,
                        self.relative_attention_max_distance as u32);
'''+text[end:]
old='    inner_dim: usize,\n    use_cache: bool,'
assert text.count(old)==1;text=text.replace(old,'    inner_dim: usize,\n    is_decoder: bool,\n    use_cache: bool,')
old='            inner_dim,\n            use_cache: cfg.use_cache && decoder,'
assert text.count(old)==1;text=text.replace(old,'            inner_dim,\n            is_decoder: decoder,\n            use_cache: cfg.use_cache && decoder,')
text+='\n'+(root/'scripts/t5-relative-bucket.rs').read_text()
p.write_text(text)
# Independent scalar transcription of official T5 reference (relative_position = memory - context).
def reference(relative_position,bidirectional,num_buckets=32,max_distance=128):
 relative_buckets=0
 if bidirectional:
  num_buckets//=2
  relative_buckets+=(relative_position>0)*num_buckets
  relative_position=abs(relative_position)
 else:relative_position=-min(relative_position,0)
 max_exact=num_buckets//2
 is_small=relative_position<max_exact
 if is_small:return relative_buckets+relative_position
 val_if_large=max_exact+int(math.log(relative_position/max_exact)/math.log(max_distance/max_exact)*(num_buckets-max_exact))
 return relative_buckets+min(val_if_large,num_buckets-1)
# Cover every position pair at the actual maximum input/output context plus far-distance boundaries.
points=list(range(512))+[512,1023,1024,2048,65535]
vec=p.with_name('t5-relative-bucket-vectors.csv')
with vec.open('w') as f:
 for decoder in [0,1]:
  for query in points:
   for key in points:f.write(f'{decoder},{query},{key},{reference(key-query,not decoder)}\n')
evidence=root/'translation-evidence';evidence.mkdir(exist_ok=True)
(evidence/'candle-t5-upstream.rs').write_text(original)
(evidence/'Candle-MIT.txt').write_text((root/'docs/third-party/Candle-MIT.txt').read_text())
(evidence/'candle-t5-patch.diff').write_text(''.join(difflib.unified_diff(original.splitlines(True),text.splitlines(True),fromfile='official-candle-0.9.1/quantized_t5.rs',tofile='patched-candle-0.9.1/quantized_t5.rs')))
print(f'Patched only attention bucket logic; {2*len(points)**2} reference vectors; patched source sha256 {hashlib.sha256(text.encode()).hexdigest()}')
