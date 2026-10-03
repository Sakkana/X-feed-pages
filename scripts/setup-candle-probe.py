"""Materialize the exact official crate, then apply the audited local source patch."""
import hashlib,pathlib,tarfile,urllib.request
root=pathlib.Path(__file__).resolve().parent.parent
url='https://static.crates.io/crates/candle-transformers/candle-transformers-0.9.1.crate'
expected='186cb80045dbe47e0b387ea6d3e906f02fb3056297080d9922984c90e90a72b0'
import tempfile
with tempfile.TemporaryDirectory() as tmp:
 p=pathlib.Path(tmp)/'upstream.crate';p.write_bytes(urllib.request.urlopen(url,timeout=60).read())
 assert hashlib.sha256(p.read_bytes()).hexdigest()==expected,'official crate checksum mismatch'
 destination=root/'scripts/madlad-probe/vendor/candle-transformers'
 assert not destination.exists(),'do not overwrite a prior patched runtime'
 with tarfile.open(p) as archive:
  for member in archive.getmembers():
   parts=member.name.split('/',1)
   if len(parts)>1:
    member.name=parts[1];archive.extract(member,destination,filter='data')
 print('Verified official Candle 0.9.1 crate SHA256 '+expected,flush=True)
